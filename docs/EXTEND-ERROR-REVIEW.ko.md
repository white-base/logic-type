# ExtendError 설계 검토 — 과도한가?

> 작성일: 2026-09-14
> 대상: `logic-core` v1.1.4 — `src/extend-error.js`(121줄), `src/type.js`(1,449줄) 내 사용 98회
> 범위: (1) `type.js` 검사 경로에서 try/catch + `ExtendError` 를 쓰는 구조가 **과도한지**, (2) 메시지 통합 관리 확장성이 **실현된 값인지 미래 투자인지**, (3) 실측 비용과 발견된 결함
> 관련 문서:
> - [NAMING-REVIEW.ko.md](NAMING-REVIEW.ko.md) §2.2 N1 — `ExtendError` 명명 문제 (하위 3개 패키지 361회 참조)
> - [LOGIC-CORE-FEATURES.ko.md](LOGIC-CORE-FEATURES.ko.md) §2.1 — 메시지/오류 계층 카탈로그
> - [AI-COLLABORATION-DRAFT.ko.md](AI-COLLABORATION-DRAFT.ko.md) 4장 — `ExtendError → Message → loadJSON` 결합
>
> 본 문서는 이름이 아닌 **구조의 적정성**과 **실측 비용**에 집중한다. 수치는 모두 본 문서 부록 A 의 스크립트로 재현 가능하다.

---

## 1. 결론

**과도하지 않다. 다만 설계 의도의 절반이 작동하지 않고, 실패 경로 비용이 예상보다 크다.**

| 축 | 판정 | 요약 |
| --- | :-: | --- |
| 존재 자체 | **적합** | 체이닝 메시지는 plain `Error` 로 대체 불가. 251개 코드 + ko/en 로케일 + 공개 export 로 확장성은 이미 **실현된 값** |
| 성공 경로 비용 | **문제 없음** | 47~78 ns/op. `ExtendError` 비용 0 |
| 실패 경로 비용 | **주의** | 성공 대비 80배. 단, 실패는 예외 상황이므로 허용 범위 |
| 투기적 검사 루프 | **문제 있음** | choice/union 후보 탐색이 **성공하는데도** 31배 비용. 버려질 메시지를 완성품으로 만든다 |
| 구현 결함 | **버그 3개** | queue 참조 공유(심각), `prop` 미할당(죽은 필드), `name === 'Error'` |

핵심 결론 3가지:

1. **"ExtendError 를 없애자"는 잘못된 처방이다.** 비용의 56%는 `new Error()` 의 스택 캡처이고, ExtendError 고유분은 40%다. plain `Error` 로 바꿔도 절반밖에 못 줄이며 진단 품질은 전부 잃는다.
2. **과잉은 존재가 아니라 적용 범위다.** `catch { continue; }` 4곳은 예외 메시지를 **절대 읽지 않고** 버린다. 이 4곳에서만 생성을 빼면 성공 경로를 그대로 두고 choice 검사를 ~30배 개선할 수 있다.
3. **설계 의도 중 `prop`(error path) 전파는 지금 동작하지 않는다.** 코드는 있지만 `this.prop` 이 한 번도 대입되지 않아 체이닝 순간 소실된다. "있는 척하는 죽은 필드"다.

---

## 2. 실측 — "과도한가?"에 대한 데이터

### 2.1 검사 API 비용 (Node, 100,000회 반복 평균)

```
성공 경로
  Type.matchType(String,"abc")                       78 ns/op
  Type.isMatchType(String,"abc")                     47 ns/op   ← ExtendError 비용 0

실패 경로
  Type.isMatchType(String, 123)                   3,737 ns/op   ← 성공 대비 80배

choice 타입 (핵심)
  isMatchType([[S,N,B,R]], "abc")   0회 미스        457 ns/op
  isMatchType([[S,N,B,R]], /a/)     3회 미스     14,200 ns/op   ← 31배
```

마지막 줄이 핵심이다. `isMatchType([[String,Number,Boolean,RegExp]], /a/)` 는 **`true` 를 반환하는 성공 케이스**인데 14μs 가 든다. 앞의 3개 후보가 각각 완성된 `ExtendError` 를 생성·throw 하고, `$choiceMatch` 의 `catch { continue; }` 에서 그대로 버려지기 때문이다.

### 2.2 비용 분해 (200,000회 반복 평균)

```
throw/catch 자체 (재사용 객체 throw)                 81 ns   ←  4%
new Error() 스택 캡처                            ~1,141 ns   ← 56%
ExtendError 추가분 (Message.get + queue/prop)     ~817 ns   ← 40%
  └ Message.get() 단독                              317 ns
return false (예외 없음)                               5 ns
```

**함의:** try/catch 를 제어흐름으로 쓰는 것 자체는 문제가 아니다(81ns). 후보마다 `Error` 객체를 **할당**하는 것이 문제다. 따라서 해법은 "예외 대신 boolean 반환"이 아니라 "투기적 루프에서는 객체를 새로 만들지 않는 것"이다 — 미리 만든 sentinel 을 throw 하면 81ns 로 끝난다.

### 2.3 이 구조가 실제로 값을 하는 지점

중첩 타입 실패 시 경로가 그대로 읽힌다:

```js
Type.matchType({ a: { b: [String] } }, { a: { b: [1] } })

// Error [EL01118] Array match: array element check failed. extType: array(_OPT_)[string], tarType: array(_OPT_)[number(1)]
// # Error [EL01143] Union match: 'b' type check failed
// ## Error [EL01143] Union match: 'a' type check failed
// ### Error [EL0130B] Type match: matchtype (extType, target) check failed
```

`a → b → 배열 요소` 순서로 실패 지점이 드러난다. 이것은 plain `Error` 로는 만들 수 없다.

확장성 측면:

| 항목 | 상태 |
| --- | --- |
| 메시지 코드 | `locales/default.js` 251개 (`EL0xxxx`) |
| 로케일 | `ko.json`, `core.json` — `Message.autoDetect()` 로 런타임 전환 |
| 공개 API | `index.js` 에서 `ExtendError`, `Message` export |
| 하위 패키지 사용 | meta-entity 168 / bind-model 163 / logic-sql-entity 30 = **361회** |

"통합 관리 확장성"은 미래 투자가 아니라 **이미 실현되어 하위 패키지가 의존하는 값**이다.

---

## 3. 발견한 결함 3개

### 3.1 [심각] queue 배열 참조 공유 — 원본 오염 + 무한 증식

`src/extend-error.js:86`:

```js
if (p_prop instanceof ExtendError) {
    _queue = p_prop.queue;     // ← 복사가 아니라 참조
    _prop = p_prop.prop;
}
...
_queue.push(_msg);             // ← 부모 error 의 queue 를 직접 변경
this.queue = _queue;
```

재현:

```js
const shared = new ExtendError('base');
const a = new ExtendError('A', shared);
const b = new ExtendError('B', shared);   // shared 만 감쌌는데

a.message  // "base\n# A"
b.message  // "base\n# A\n## B"   ← B 가 A 를 상속. 무관한 체인끼리 오염
a.queue === b.queue === shared.queue   // true
```

같은 cause 를 5번 감싸면 `shared.queue` 가 6개로 늘어난다. 리트라이 루프에서 동일 error 를 반복 wrap 하면 queue 가 무한히 자라고, `_buildMsgQueue` 의 이중 루프(`#` 마크 생성) 때문에 **O(n²)** 로 발산한다.

> 본 검토용 벤치마크가 이 케이스(`new ExtendError('x', chain)` 200,000회)에서 120초 타임아웃으로 죽었다. 이론적 우려가 아니다.

**수정:** `_queue = p_prop.queue.slice();` — 1줄.

**하위 호환:** 참조 공유는 문서화되지 않은 동작이며, 이에 의존하는 코드가 있다면 그 자체가 버그다. 361회 참조 중 `.queue` 를 직접 읽는 곳이 있는지 grep 후 적용.

### 3.2 `this.prop` 미할당 — `error path` 정보 소실

`src/extend-error.js:46` 의 클래스 필드 `prop = {};` 는 `super()` 직후 초기화되는데, 생성자 본문이 이를 덮어쓰지 않는다. `_prop` 은 `_build` 문자열 조립에만 쓰이고 버려진다.

```js
new ExtendError('msg', { style: 'required' }).prop   // → {}  (항상)
```

결과:

- `src/extend-error.js:87` `_prop = p_prop.prop` 는 항상 `{}` 를 읽는 **죽은 코드**
- `src/type.js:1067` `prop['error path'] = pathName` 으로 채운 경로 정보가 **체이닝 순간 사라짐**
- 배열 요소 실패 시 **몇 번째 인덱스인지 나오지 않음**:

```js
Type.matchType([[String]], ['ok', 123])
// → "tarType: array(_OPT_)[string('ok'), number(123)]"   인덱스 1 이라는 정보 없음
```

**수정 (택 1):**
- (a) `this.prop = _prop || {};` 를 추가하고, `_buildMessageProp` 을 체인 전체에 적용해 `error path` 를 살린다
- (b) `prop` 개념을 통째로 제거하고 `type.js` 의 `prop` 인자 98곳을 `null` 로 정리한다

(a) 가 설계 의도에 부합한다. 단 `error path` 가 살아나면 메시지 포맷이 바뀌므로 하위 패키지 스냅샷 테스트 영향 확인 필요.

### 3.3 `name === 'Error'`, `cause` 미설정

`super()` 에 인자를 넘기지 않고 `this.message` 를 직접 대입하므로:

```js
const e = new ExtendError('msg');
e.name                       // 'Error'          ← 'ExtendError' 가 아님
String(e.stack).split('\n')[0]   // 'Error: msg'
e.cause                      // undefined
```

`toString()` 만 `'ExtendError : ' + message` 로 따로 처리하고 있어 `name`/`stack`/`toString` 이 서로 어긋난다.

**수정:** 생성자 끝에 2줄.

```js
this.name  = 'ExtendError';
this.cause = p_prop instanceof Error ? p_prop : undefined;   // ES2022 표준
```

`cause` 를 채우면 Node/브라우저 기본 스택 출력이 원인 체인을 인식한다.

---

## 4. 권장 조치

### 4.1 우선순위

| 순위 | 조치 | 위치 | 비용 | 효과 | 위험 |
| :-: | --- | --- | :-: | --- | :-: |
| 1 | `_queue = p_prop.queue.slice()` | `extend-error.js:86` | 1줄 | 오염·O(n²) 발산 제거 | 낮음 |
| 2 | `this.prop = _prop \|\| {}` + 체인 전체 prop 출력 | `extend-error.js` | ~5줄 | 죽은 코드 해소, `error path` 복구 | 중간 (메시지 포맷 변경) |
| 3 | `this.name`, `this.cause` | `extend-error.js` | 2줄 | 표준 정합성 | 낮음 |
| 4 | 투기적 루프 4곳에서 ExtendError 생성 제거 | `type.js` | 중간 | choice 성공 경로 **~30배** | 중간 |

1~3번은 합쳐서 10줄 이내이며 설계 변경이 아니다. 4번만 설계 변경이다.

### 4.2 4번 상세 — 투기적 루프

`type.js` 의 catch 22곳은 성격이 다르다:

| 유형 | 개수 | 위치 | 처리 |
| --- | :-: | --- | --- |
| **rethrow-catch** — `catch (e) { throw new ExtendError(/EL..../, e, [...]) }` | 14 | 각 `$xxxMatch` / `$xxxAllow` 내부 | **유지.** 메시지 체인을 만드는 진짜 값 |
| **discard-catch** — `catch (e) { continue; }` | 4 | `866`, `957`, `1180`, `1289` | **대상.** 예외 메시지가 절대 읽히지 않음 |
| 기타 (`extendType` 파싱 등) | 4 | `713`, `830`, ... | 유지 |

discard-catch 4곳은 choice/union 후보를 순회하며 "이 후보가 맞나?"를 시험하는 자리다. 실패해도 정상 흐름이고, 최종 실패 메시지는 어차피 루프 밖의 `EL01219`(`870`) / `EL01118`(`1185`) 가 따로 만든다.

가장 덜 침습적인 방법:

```js
// extend-error.js 또는 type.js 상단
const _SILENT = new ExtendError('silent');   // 재사용 sentinel

// _execMatch / _execAllow 에 silent 플래그 추가
function _execMatch(extType, target, opt, pathName, silent) {
    ...
    // 모든 throw new ExtendError(...) 를 헬퍼로
    function fail(code, prop, vals) {
        if (silent) throw _SILENT;
        throw new ExtendError(code, prop, vals);
    }
    ...
}

// discard-catch 4곳에서만 silent = true 로 호출
try {
    _execMatch(elem, tar, opt, pathName, /* silent */ true);
    success = true; break;
} catch (error) { continue; }
```

측정상 sentinel throw 는 81ns 이므로 3회 미스 케이스가 14,200 → ~700ns 수준으로 내려간다.

**주의:** silent 모드가 중첩 호출(`_execMatch` → `$unionMatch` → `_execMatch`)로 전파되어야 한다. 플래그를 인자로 끝까지 넘기거나 모듈 수준 카운터로 관리한다.

### 4.3 적용 순서

1. 1·3번 적용 → `npm test` (extend-error.test.js, type/ 전체)
2. 2번 적용 → 하위 패키지(meta-entity, bind-model)의 스냅샷 테스트 실행. `error path` 줄이 추가되어 실패하면 스냅샷 갱신
3. 4번은 별도 커밋. `test/type/` 회귀 + 본 문서 부록 A 벤치마크로 전후 비교

---

## 5. 요약

말씀하신 "통합 관리 확장성"은 251개 코드 + ko/en 로케일 + 하위 361회 참조로 이미 실현되어 있어 불필요한 미래 투자가 아니다. 과잉은 `ExtendError` 의 **존재**가 아니라, 결과를 버릴 것이 확정된 자리에서까지 완성품 메시지를 만드는 **적용 범위**다. discard-catch 4곳만 걷어내고 결함 3개를 고치면 성공 경로 47ns 는 그대로 두면서 지금의 진단 품질을 유지할 수 있다.

---

## 부록 A. 재현 스크립트

프로젝트 루트에서 실행. `src/` 를 직접 import 하므로 빌드 불필요.

### A.1 비용 측정

```js
// bench.mjs
import Type from './src/type.js';
import ExtendError from './src/extend-error.js';
import Message from './src/message-wrap.js';

const N = 100000;
function bench(name, fn) {
  fn();
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < N; i++) fn();
  const t1 = process.hrtime.bigint();
  console.log(name.padEnd(52), (Number(t1 - t0) / N).toFixed(0) + ' ns/op');
}

// 생성 비용
bench('new Error("msg")', () => new Error('msg'));
bench('new ExtendError("msg")', () => new ExtendError('msg'));
bench('new ExtendError(/EL01102/, null, ["a","b"])', () => new ExtendError(/EL01102/, null, ['a','b']));

// 검사 API
bench('Type.matchType(String,"abc")     [성공]', () => Type.matchType(String, 'abc'));
bench('Type.isMatchType(String,"abc")   [성공]', () => Type.isMatchType(String, 'abc'));
bench('Type.isMatchType(String, 123)    [실패]', () => Type.isMatchType(String, 123));
const choice = [[String, Number, Boolean, RegExp]];
bench('isMatchType([[S,N,B,R]], "abc")  [0회 미스]', () => Type.isMatchType(choice, 'abc'));
bench('isMatchType([[S,N,B,R]], /a/)    [3회 미스]', () => Type.isMatchType(choice, /a/));

// 비용 분해
const SENTINEL = new ExtendError('sentinel');
bench('throw/catch sentinel (객체생성 없음)', () => { try { throw SENTINEL; } catch (e) {} });
bench('throw/catch new Error()', () => { try { throw new Error('x'); } catch (e) {} });
bench('throw/catch new ExtendError(/EL01102/)', () => { try { throw new ExtendError(/EL01102/, null, ['a','b']); } catch (e) {} });
bench('Message.get 만 호출', () => Message.get('EL01102', ['a','b']));
```

> **주의:** `new ExtendError('x', chain)` 을 반복하는 케이스는 넣지 말 것. §3.1 버그로 인해 queue 가 반복 횟수만큼 자라 O(n²) 로 발산한다. (수정 후에는 안전)

### A.2 결함 재현

```js
// probe.mjs
import ExtendError from './src/extend-error.js';
import Type from './src/type.js';

// 3.1 queue 참조 공유
const shared = new ExtendError('base');
const a = new ExtendError('A', shared);
const b = new ExtendError('B', shared);
console.log('b.message =', JSON.stringify(b.message));        // "base\n# A\n## B" ← 오염
console.log('shared.queue =', JSON.stringify(shared.queue));  // ["base","A","B"]
console.log('a.queue === b.queue', a.queue === b.queue);      // true

// 3.2 prop 미할당
console.log('prop =', new ExtendError('m', { style: 'required' }).prop);   // {}

// 3.2 error path 소실
try { Type.matchType([[String]], ['ok', 123]); }
catch (e) { console.log(e.message); }   // 인덱스 정보 없음

// 3.3 name / cause
const e = new ExtendError('msg');
console.log(e.name, '|', e.cause);      // 'Error' | undefined
```

### A.3 측정 환경

- Node.js (ESM, `src/` 직접 import), macOS Darwin 25.6.0
- `Message.autoDetect()` 가 top-level await 로 로케일을 로드하므로 첫 import 에 수십 ms 소요. 벤치 루프에는 영향 없음
- 절대값은 환경마다 다르지만 **비율**(성공:실패 = 1:80, 0회:3회 미스 = 1:31, throw:alloc = 1:14)은 안정적
