# type.js 명세서 (현재 구현 기준)

> 작성일: 2026-09-05
> 대상: `logic-core` v1.1.4 / `src/type.js` (1,449줄, 전체 소스의 25%)
> 관점: **설계 구조** 중심. 개별 버그·오탈자는 다루지 않으며, 구조적 원인이 있는 경우에만 증상으로 인용한다.
> 관련 문서: [LOGIC-CORE-FEATURES.ko.md](LOGIC-CORE-FEATURES.ko.md), [AI-COLLABORATION-DRAFT.ko.md](AI-COLLABORATION-DRAFT.ko.md)

---

## 1. 개요

### 1.1 모듈의 목적 (설계 의도)

`type.js`는 두 가지 목적이 한 모듈에 겹쳐 있다.

| # | 목적 | 대표 API | 성격 |
| --- | --- | --- | --- |
| A | **JS에 인터페이스(계약) 기능 추가** | `allowType()`, `getTypes()`, `isProtoChain()`, `hasType()` | 타입 ↔ 타입 비교 (구조적 부분타입) |
| B | **런타임 동적 타입 검사** | `matchType()`, `isMatchType()`, `extendType()` | 타입 ↔ 값 비교 |

초기 목적은 A(인터페이스)였고, 그 구현 수단으로 B(동적 검사기)가 만들어졌다. 현재는 B가 코드량·활용도 모두에서 주가 되었으며, **B를 독립 유틸리티로 분리하고 원 코드에서는 제거하는 것이 향후 계획**이다. 이 문서의 11장이 그 분리 설계를 다룬다.

### 1.2 규모와 위치

| 항목 | 값 |
| --- | --- |
| 파일 | `src/type.js` |
| 줄 수 | 1,449줄 (`src/` 전체 5,742줄 중 25.2%) |
| 외부 의존 | `ExtendError` 1개뿐 (`extend-error.js`) |
| 공개 API | 12개 (`Type` 객체의 정적 메서드) |
| 내부 함수 | 약 21개 (`_` 접두 비공개 + 중첩 inner function 10개) |
| 오류 코드 | `EL011xx`(match) / `EL012xx`(allow) / `EL013xx`(파싱·공개API) |
| 계층 위치 | `[1] 기반 유틸` — 상위 계층 전부가 직·간접 의존 |

의존 방향이 **단방향**(`ExtendError` → `Type` → 그 외 전부)이라는 점은 분리 관점에서 가장 유리한 조건이다.

### 1.3 소비자 (logic-core 내부)

| 파일 | 호출 | 용도 |
| --- | --- | --- |
| `util.js:177-178` | `allowType(..., 1)` / `matchType(..., 1)` | **인터페이스 구현 검증** (`Util.implements`) |
| `base-collection.js:429` | `matchType([this._elemTypes], nVal)` | 컬렉션 요소 타입 제약 |
| `collection-array.js:201` | `matchType` | 동일 |
| `collection-property.js:205` | `matchType` | 동일 |
| `namespace-manager.js:305` | `matchType` | 네임스페이스 요소 타입 제약 |
| `base-collection.js:472` | `deepEqual` | 이벤트 저장소 비교 |
| `meta-object.js:106-108` | `deepEqual` | 메타 객체 동등 비교 |

**내부에서 실제로 쓰이는 표면은 `matchType` / `allowType` / `deepEqual` 3개뿐이다.** 나머지 9개 공개 API는 외부 소비자(`meta-entity`, `bind-model`, `logic-sql-entity`)용이거나 내부 전용이다.

---

## 2. 핵심 개념 모델

### 2.1 확장타입(extType) — "타입을 값으로 쓴다"

이 모듈의 근본 아이디어는 **JS 값 자체를 타입 표현식으로 사용**하는 것이다. 별도 스키마 언어나 문자열 DSL 없이, 생성자 함수·리터럴·배열·객체를 조합해 타입을 기술한다.

```js
String                        // string 타입
'abc'                         // string 타입 + 기본값 'abc'
[String, Number]              // 배열: 요소가 string 또는 number
[['_REQ_', String, Number]]   // 선택(union): string 또는 number, 필수
{ a: String, b: [Number] }    // 구조체(union): 속성별 타입
```

이 표현식이 `extendType()`을 거치면 **정규화된 타입 서술 객체**가 된다.

```js
{
  $type: 'array',      // 11종 중 하나
  kind:  '_REQ_',      // array/choice 전용 세부 종류
  list:  [String],     // 하위 타입 목록
  ref:   [...],        // 원본 참조
  default: undefined,  // 리터럴 기본값
  toString() {...}     // 'array(_REQ_)[string]' 형태 표기
}
```

### 2.2 `$type` — 11종

`_hasType()` (`type.js:281`)가 정의하는 타입 집합.

| 분류 | `$type` | 판정 근거 |
| --- | --- | --- |
| **leaf (9종)**<br>`_isLeafType()` | `null` | `target === null` |
| | `undefined` | `typeof === 'undefined'` |
| | `number` | `Number` 생성자 또는 숫자 리터럴 |
| | `string` | `String` 생성자 또는 문자열 리터럴 |
| | `boolean` | `Boolean` 생성자 또는 불리언 리터럴 |
| | `symbol` | `Symbol` 생성자 또는 심볼 값 |
| | `bigint` | `BigInt` 생성자 또는 bigint 리터럴 |
| | `regexp` | `RegExp` 생성자 또는 정규식 인스턴스 |
| | `object` | `Object` 생성자, 또는 **분류 실패한 모든 값**(Date 등) |
| **복합 (5종)** | `array` | 배열 리터럴 `[...]`, `Array` |
| | `choice` | 이중 배열 `[[...]]` |
| | `class` | 대문자로 시작하는 함수, 또는 `_KIND`가 function이 아닌 함수 |
| | `function` | 소문자 함수, `Function`, `_KIND === 'function'` |
| | `union` | 일반 객체 `{}` (프로퍼티 유무 무관) |

> **구조 관찰:** 내장 객체의 분류가 `_isPrimitiveObj()`에 **`RegExp`와 `Date`만 하드코딩**된 결과로 갈린다.
>
> | 값 | `typeOf` | 경로 |
> | --- | --- | --- |
> | `new Date()` | `object` | `_isPrimitiveObj` → 최종 폴백 |
> | `new Map()` / `new Set()` / `Promise` | `union` | `_isFillObj`(프로토타입 메서드 보유) |
> | 사용자 클래스 **인스턴스** | `union` | 동일 |
> | `Object.create(null)` | `union` | `_isEmptyObj` |
>
> 즉 `object`는 "Object 생성자 타입"이자 "Date 등의 폴백"을 겸하고, 나머지 내장 객체는 **구조체(`union`)로 취급**되어 프로토타입 메서드까지 계약의 일부가 된다. 어느 쪽도 의도된 분류로 보기 어렵다. 코드에도 `REVIEW: 기타 모든 함수는 object 로 처리한다` 주석이 남아 있다(`type.js:739`). 타입 체계에 **내장 타입 확장점이 없다**는 뜻이다.

### 2.3 `kind` — 배열/선택의 세부 의미

`array`와 `choice`만 `kind`를 갖는다. kind는 **배열 리터럴의 첫 요소에 문자열 코드로 인코딩**된다 (`_getKeyCode()`, 정규식 `/^_[a-zA-Z]+_/`).

#### array kind (5종, `_hasKindArray()`)

| kind | 표기 | 의미 |
| --- | --- | --- |
| `_ALL_` | `Array` | 모든 배열 허용 (빈 배열 포함, 요소 검사 없음) |
| `_ANY_` | `[]` | 요소가 1개 이상이면 통과, 타입은 무관 |
| `_OPT_` | `[String, Number]` (기본값) | 모든 요소가 나열된 타입 중 하나. 빈 배열 허용 |
| `_REQ_` | `['_REQ_', String]` | `_OPT_` + 요소 1개 이상 필수 |
| `_SEQ_` | `['_SEQ_', String, Number]` | **위치 기반 튜플**. target 길이 ≥ 타입 길이, 인덱스별 대응 검사 |

#### choice kind (8종, `_hasKindChoice()`)

| kind | 표기 | 의미 |
| --- | --- | --- |
| `_ALL_` | `[['_ALL_']]` | 무조건 통과 (`undefined` 포함) |
| `_ANY_` | `[[]]` | `undefined`만 아니면 통과 |
| `_NON_` | `[['_NON_']]` | `undefined`만 통과 |
| `_ERR_` | `[['_ERR_']]` | `Error` 인스턴스만 통과 |
| `_OPT_` | `[[String, Number]]` (기본값) | 나열 타입 중 하나 또는 `undefined` |
| `_REQ_` | `[['_REQ_', String, Number]]` | 나열 타입 중 하나 (`undefined` 불가) |
| `_EUM_` | `[['_EUM_', 1, 2, 3]]` | 열거형. 구성 요소가 **모두 리터럴**이어야 함 |
| `_DEF_` | `[['_DEF_', 'a', String]]` | 기본값. `list[0]`이 리터럴 기본값 |

> **구조 관찰:** kind 코드가 사용자 문자열 리터럴과 **같은 네임스페이스**를 쓴다. `['_ABC_', ...]`처럼 `_x_` 패턴의 문자열을 값으로 넣으면 kind 코드로 오인되어 `EL01307`로 실패한다. 제어 정보와 데이터가 같은 채널을 공유하는 전형적인 in-band signaling 구조다.

### 2.4 두 개의 검사 축

이 모듈에서 가장 중요한 개념 구분이다.

|  | `matchType(extType, target)` | `allowType(extType, tarType)` |
| --- | --- | --- |
| 비교 대상 | 타입 ↔ **값** | 타입 ↔ **타입** |
| 질문 | "이 값이 이 타입인가?" | "이 타입 자리에 저 타입을 넣어도 되는가?" |
| 이론적 성격 | 값 검증 (validation) | 부분타입 / 치환 가능성 (substitutability) |
| 엔진 | `_execMatch()` (`type.js:1060`) | `_execAllow()` (`type.js:758`) |
| 주 용도 | 런타임 인자·컬렉션 검사 | **인터페이스 구현 검증** |
| boolean 판 | `isMatchType()` | `isAllowType()` |

```js
Type.matchType(String, 'abc');        // OK  - 값 'abc'는 string
Type.allowType(String, String);       // OK  - string 자리에 string
Type.allowType([['_OPT_', String]], String);  // OK - 좁은 타입은 넓은 자리에
Type.allowType(String, [['_OPT_', String]]);  // FAIL - 넓은 타입은 좁은 자리에 불가
```

`Util.implements()`가 인터페이스에는 `allowType`, 클래스에는 `matchType`을 쓰는 이유가 여기 있다 (`util.js:176-178`). 인터페이스는 "이 계약을 만족하는 타입인가"(타입↔타입), 클래스 상속 검증은 "이 인스턴스가 형태를 갖췄는가"(타입↔값)로 본 것이다.

---

## 3. 공개 API 명세 (12개)

### 3.1 타입 정규화 계열

#### `Type.extendType(target) → object`
임의의 값을 정규화된 타입 서술 객체로 변환한다. 모든 검사의 진입점.

```js
Type.extendType(String);
// { $type: 'string', default: null, ref: String, toString: f }

Type.extendType(['_REQ_', String, Number]);
// { $type: 'array', kind: '_REQ_', list: [String, Number], ref: [...], toString: f }

Type.extendType({ a: String }).toString();  // 'union'
Type.extendType([[String]]).toString();     // 'choice(_OPT_)[string]'
```

- 이미 `$type`을 가진 객체를 넘기면 **special type**으로 간주해 그대로 통과시킨다(검증만 수행). 타입 서술 객체를 직접 손으로 작성해 넘기는 경로다.
- 반환 객체는 매번 새로 생성되며 `toString` 클로저가 함께 만들어진다. 캐시 없음.

#### `Type.typeOf(target) → string`
`extendType(target).$type`의 축약. 11종 중 하나를 문자열로 반환.

#### `Type.typeObject(target) → object`
타입을 **JSON 직렬화 가능한 재귀 구조**로 펼친다. `extendType`이 1단계 정규화라면 이쪽은 전체 트리 전개.

```js
Type.typeObject({ a: String, b: [Number] });
// { $type: 'union', _prop: { a: {$type:'string'}, b: {$type:'array', kind:'_OPT_', list:[{$type:'number'}]} } }
```
- `class`인 경우 **실제로 인스턴스를 생성**해(`_creator`) 그 형태를 `_instance`에 담는다. 부작용 가능성이 있는 경로.
- 예약어 `_interface`, `isImplementOf`는 union 전개에서 제외한다 (인터페이스 기능과의 결합 지점).

### 3.2 검사 계열

| API | 시그니처 | 실패 시 |
| --- | --- | --- |
| `matchType` | `(extType, target, opt?)` | `ExtendError EL0130B` throw |
| `isMatchType` | `(extType, target, opt?) → boolean` | `false` |
| `allowType` | `(extType, tarType, opt?)` | `ExtendError EL0130A` throw |
| `isAllowType` | `(extType, target, opt?) → boolean` | `false` |

`opt` 파라미터:
- `0` (기본) — 기존 타입 그대로 비교
- `1` — **class 타입을 만나면 인스턴스를 생성해서** 구조를 비교. `Util.implements`가 이 모드를 쓴다.

### 3.3 리플렉션 계열

#### `Type.getTypes(ctor, hasUnion = true) → Function[]`
생성자의 **프로토타입 체인 + `_UNION` 배열**을 평탄화해 반환한다. 중복 제거됨.
- 프로토타입 조회 순서: `ctor.super` 자체 속성이 있으면 그것, 없으면 `Object.getPrototypeOf(ctor)`
- `_UNION`은 `Util.implements`가 심어 놓는 인터페이스 목록

#### `Type.isProtoChain(ctor, target) → boolean`
`getTypes(ctor, false)` — **상속만** 확인. `target`은 함수 또는 이름 문자열.

#### `Type.hasType(ctor, target) → boolean`
`getTypes(ctor, true)` — **상속 + 인터페이스** 확인.

> 이 3개가 "JS에 인터페이스를 추가한다"는 원래 목적 A에 해당하는 API다. `_UNION`, `super`라는 **외부 관례에 의존**한다.

### 3.4 범용 유틸

#### `Type.getAllProperties(obj, hasObj = false) → string[]`
프로토타입 체인 전체를 순회해 속성명을 수집한다. `hasObj`가 false면 `Object.prototype` 소유 속성을 제외.

#### `Type.deepEqual(obj1, obj2) → boolean`
프로토타입을 제외한 깊은 비교. 함수는 `toString()` 비교, 객체는 `getOwnPropertyNames` 기준.

> 이 둘은 타입 검사와 무관한 범용 유틸이다. **`util.js`에 있어야 할 함수가 `type.js`에 있는 상태**다.

---

## 4. 타입 표기법 전체 (DSL 레퍼런스)

### 4.1 leaf 타입

```js
Type.matchType(String,  'abc');    // string
Type.matchType(Number,  10);       // number
Type.matchType(Boolean, true);
Type.matchType(BigInt,  10n);
Type.matchType(Symbol,  Symbol());
Type.matchType(RegExp,  /a/);
Type.matchType(Object,  new Date()); // ⚠ Object 는 폴백 버킷과만 매칭 (§9.7)
// Type.matchType(Object, {});      // FAIL — {} 는 union 으로 분류됨
// 빈 구조체를 표현하려면 {} 를 타입으로 쓴다 : Type.matchType({}, {a:1}) // OK
Type.matchType(null,    null);
```

### 4.2 리터럴 = 타입 + 기본값

리터럴 값을 타입 위치에 쓰면 **해당 타입 + 기본값**이 된다.

```js
Type.matchType('abc', undefined);   // OK - 기본값 'abc'가 적용됨
Type.matchType('abc', 'xyz');       // OK - 둘 다 string
Type.matchType('abc', 10);          // FAIL
```
> `matchType`에서 리터럴 기본값은 **타입만 규정**하고 값은 강제하지 않는다. 값까지 강제하려면 `[['_EUM_', 'abc']]`를 쓴다.
> 반면 `allowType`에서는 기본값이 **일치해야** 한다 (`_equalLiternal`, `EL01202`).

### 4.3 배열

```js
Type.matchType(Array,                     [1,'a',{}]);   // _ALL_ : 무엇이든
Type.matchType([],                        [1]);          // _ANY_ : 1개 이상
Type.matchType([String, Number],          ['a', 1]);     // _OPT_ : 각 요소가 둘 중 하나
Type.matchType(['_REQ_', String],         ['a']);        // _REQ_ : 1개 이상 + 타입 일치
Type.matchType(['_SEQ_', String, Number], ['a', 1, 99]); // _SEQ_ : 위치 대응, 초과분 허용
```

### 4.4 선택(choice) — 이중 배열

```js
Type.matchType([[String, Number]],            'a');       // _OPT_ : undefined도 통과
Type.matchType([['_REQ_', String, Number]],   'a');       // _REQ_ : undefined 불가
Type.matchType([['_EUM_', 'A', 'B']],         'A');       // 열거
Type.matchType([['_DEF_', 'A', String]],      undefined); // 기본값 'A'
Type.matchType([['_ERR_']],  new Error());
Type.matchType([['_NON_']],  undefined);
Type.matchType([['_ALL_']],  anything);
```

### 4.5 구조체(union) — 객체 리터럴

```js
Type.matchType({ a: String, b: [Number] }, { a: 'x', b: [1] });
```
- **타입에 선언된 키만** 검사한다. target의 추가 속성은 무시(구조적 부분타입).
- 타입 쪽 속성이 **리터럴**(`role: 'user'`)이고 target 쪽이 `undefined`면 **target에 값을 써 넣는다**(`type.js:1328`). 검사 함수가 인자를 변경하는 부작용.
- 단, `[['_DEF_', 'user', String]]` 형태의 choice 기본값은 **union 경로에서 주입되지 않는다**. `$unionMatch`가 `extendType(...).default`만 보는데 choice 타입에는 그 속성이 없기 때문이다. 같은 "기본값"이 표기법에 따라 다르게 동작한다.

### 4.6 class

```js
class A {}
class B extends A {}

Type.matchType(A, new B());       // OK - instanceof
Type.matchType(A, B);             // OK - 프로토타입 체인
Type.matchType(A, { ... }, 1);    // opt=1 : A 인스턴스를 만들어 구조 비교
```

### 4.7 function

```js
Type.matchType(Function, function(){});          // 모든 함수 허용
Type.matchType(function(String){return Number;}, fn);  // 소스 파싱으로 시그니처 비교
```

함수 시그니처는 두 경로로 얻는다.
1. **`fn._TYPE` 정적 선언** (권장)
   ```js
   function fn(a, b) {}
   fn._TYPE = { params: [String, Number], return: Boolean };
   ```
2. **소스 문자열 파싱** — `fn.toString()`에 정규식을 적용하고 `new Function()`으로 평가 (`_parseFunc`, `type.js:228`)

> **구조 관찰:** 2번 경로는 `restoreArrowFunction()`(`type.js:157`)까지 동원해 **Babel이 구조분해 파라미터를 `_ref`로 변환한 코드를 역복원**한다. 트랜스파일 결과물의 형태에 의존하는 파싱이며, minify·CSP(`new Function` 금지)·네이티브 코드 앞에서 무력하다. 함수 타입 검사를 지원하려는 설계 목표와 JS 런타임의 한계가 정면으로 충돌하는 지점이다.

### 4.8 special type (타입 객체 직접 작성)

```js
Type.matchType({ $type: 'function', name: 'myFunc' }, fn);
Type.matchType({ $type: 'class', ref: MyClass }, obj);
Type.matchType({ $type: 'array', kind: '_SEQ_', list: [String] }, ['a']);
```
`$type` 속성을 가진 객체는 `extendType`이 그대로 통과시킨다. DSL로 표현 못 하는 케이스의 탈출구.

---

## 5. 내부 구조 — 7개 계층

```
┌─ [G] 공개 파사드 ────────────────────────────────────────────┐
│  matchType / isMatchType / allowType / isAllowType           │
│  (try-catch로 감싸 EL0130A/B 로 재포장)                       │
├─ [F] 검사 엔진 ─────────────────────────────────────────────┤
│  _execMatch(extType, target, opt, pathName)   ← 타입↔값       │
│    └ $arrayMatch $choiceMatch $classMatch $unionMatch        │
│      $functionMatch                                          │
│  _execAllow(extType, tarType, opt, pathName)  ← 타입↔타입     │
│    └ $arrayAllow $choiceAllow $classAllow $unionAllow        │
│      $functionAllow                                          │
├─ [E] 타입 정규화 ───────────────────────────────────────────┤
│  extendType  typeObject  typeOf                              │
├─ [D] 리플렉션 ──────────────────────────────────────────────┤
│  getTypes  isProtoChain  hasType  getAllProperties  deepEqual│
├─ [C] 함수 소스 파싱 ────────────────────────────────────────┤
│  _parseFunc  restoreArrowFunction  $skipComment              │
├─ [B] 타입 레지스트리 (하드코딩 배열) ───────────────────────┤
│  _hasType  _isLeafType  _hasKindArray  _hasKindChoice        │
├─ [A] 원시 술어 ────────────────────────────────────────────┤
│  _isObject _isPrimitiveObj _isEmptyObj _isFillObj            │
│  _isBuiltFunction _isUpper _isLiteral _equalLiternal         │
│  _creator _typeName _getKeyCode                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.1 검사 파이프라인

```
matchType(extType, target, opt)
  └─ try _execMatch(...)
       ├─ eType = extendType(extType)      // 타입 정규화
       ├─ tType = extendType(target)       // 값도 타입으로 정규화
       ├─ kind 필수조건 사전검사 (_SEQ_/_OPT_/_REQ_/_EUM_/_DEF_ 는 list 필수)
       ├─ leaf 9종 → 직접 typeof 비교
       └─ 복합 5종 → $xxxMatch() 디스패치
            └─ 하위 타입마다 _execMatch 재귀 (pathName 누적)
  └─ catch → new ExtendError(EL0130B, error)   // 원인 체이닝
```

### 5.2 오류 구조

`ExtendError`가 **원인 체인**을 유지하므로, 깊은 중첩 타입의 실패도 경로를 역추적할 수 있다.

```
EL0130B (matchType 실패)
 └ EL01143 (union 속성 'b' 실패)
    └ EL01115 (array _SEQ_ [0] 실패)
       └ EL01102 (target is not type 'string')
```
`pathName` 인자가 `extType['b'][0]<instance>` 같은 경로 문자열을 누적한다. **오류 지역화(localization) 설계는 이 모듈에서 가장 잘 짜인 부분이다.**

---

## 6. 인터페이스 기능과의 결합 지점

원래 목적 A(인터페이스)를 위해 `type.js`가 **외부 관례 5개**를 직접 알고 있다. 분리 시 핵심 쟁점.

| 관례 | 읽는 위치 | 심는 위치 | 의미 |
| --- | --- | --- | --- |
| `ctor._UNION` | `getTypes():440` | `util.js:155` | 구현한 인터페이스 목록 |
| `ctor.super` | `getTypes()` inner:455 | `Util.inherits` | 상속 부모 (`__proto__` 대체 경로) |
| `ctor._KIND` | `extendType():701` | `i-*.js`, `base-collection.js` | `'interface' \| 'class' \| 'abstract' \| 'function'` |
| `fn._TYPE` | `extendType():710` | 사용자 코드 | 함수 시그니처 정적 선언 |
| `_interface`, `isImplementOf` | `typeObject():569`, `$unionMatch():1325` | `util.js:146,185` | union 전개 시 **예약어로 건너뜀** |

```
        util.js                          type.js
   Util.implements()  ──심음──▶  _UNION / _interface / isImplementOf
          │                              │
          └──호출──▶ Type.allowType() ───┘ (읽음)
                     Type.matchType()
```

**순환 의존은 없지만 암묵적 양방향 결합**이다. `util.js`가 `type.js`를 import하고, `type.js`는 `util.js`가 만든 규약을 문자열 키로 알고 있다.

---

## 7. 사용법

### 7.1 함수 인자 검증

```js
import { Type } from 'logic-core';

function createUser(opt) {
    Type.matchType({
        name:  String,                       // 필수 string
        age:   [['_OPT_', Number]],          // 선택
        role:  'user',                       // string + 기본값 'user'
        tags:  [String],                     // string 배열 (빈 배열 허용)
    }, opt);
    // 통과 시 opt.role 에 'user' 가 채워져 있음 (부작용 — §9.5)
    // 주의: role 을 [['_DEF_','user',String]] 로 쓰면 주입되지 않는다
}
```

### 7.2 컬렉션 요소 타입 제약 (내부 실제 사용 패턴)

```js
// base-collection.js:429
if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
//                                              ^^^^^^^^^^^^^^^^
//  배열을 한 번 더 감싸 choice 로 변환 → "이 중 하나면 통과"
```

### 7.3 인터페이스 구현 검증

```js
class IReader {
    static _KIND = 'interface';
    read() { throw new ExtendError(/EL02111/, null, ['IReader']); }
}

class FileReader {
    constructor() { Util.implements(FileReader, this, IReader); }
    read() { return 'data'; }
}
// Util.implements 내부에서:
//   Type.allowType(IReader, fileReaderInstance, 1)
//   → opt=1 이므로 IReader 인스턴스를 생성해 구조 비교
```

### 7.4 boolean 분기

```js
if (Type.isMatchType([['_REQ_', String, Number]], value)) { ... }
if (Type.isAllowType(IReader, SomeClass, 1)) { ... }
```

### 7.5 타입 내성(introspection)

```js
Type.typeOf([['_REQ_', String]]);        // 'choice'
Type.extendType(['_SEQ_', String]).toString();  // 'array(_SEQ_)[string]'
JSON.stringify(Type.typeObject({ a: String }));  // 스키마 직렬화
```

---

## 8. 설계 구조 검토 — 강점

| # | 강점 | 근거 |
| --- | --- | --- |
| 1 | **의존성이 거의 없다** | `ExtendError` 하나. 분리 시 옮길 짐이 없다는 뜻 |
| 2 | **두 검사 축의 개념 분리가 정확하다** | `matchType`(값 검증)과 `allowType`(치환 가능성)은 타입 이론상 실제로 다른 관계이며, 이를 별도 엔진으로 나눈 판단은 옳다 |
| 3 | **오류 원인 체이닝 + 경로 누적** | 중첩 타입 실패 시 `extType['b'][0]` 경로와 원인 스택을 함께 제공. 동종 라이브러리 대비 강점 |
| 4 | **DSL이 JS 값 자체** | 별도 파서·빌드 단계 없이 타입을 값으로 저장·전달·직렬화 가능. `typeObject()`로 JSON 왕복 가능 |
| 5 | **오류 코드 체계** | `EL011xx`/`EL012xx`/`EL013xx` 대역 분리 + 다국어 메시지 |
| 6 | **`_TYPE` 탈출구** | 소스 파싱이 불가능한 환경을 위한 정적 선언 경로가 이미 존재 |

---

## 9. 설계 구조 검토 — 문제

### 9.1 단일 모듈에 7계층 (구조적 최우선 과제)

1,449줄 안에 원시 술어부터 공개 파사드까지 7계층이 들어 있다. 계층 간 호출은 대체로 단방향이지만 **파일 경계가 없어 강제되지 않는다**. 실제로 `[D] 리플렉션`의 `getTypes`가 `[A]`도 `[B]`도 아닌 외부 관례(`_UNION`)를 읽는 등, 계층을 가로지르는 호출이 이미 존재한다.

### 9.2 두 엔진의 구조적 중복

`_execAllow`(약 190줄)와 `_execMatch`(약 240줄)는 **동일한 골격**을 갖는다.

```
공통 골격: extendType 2회 → kind 사전검사 → leaf 분기 → 복합 5종 디스패치 → 재귀
```

특히 `$functionAllow`와 `$functionMatch`는 **거의 같은 코드**다 (`type.js:1015-1049` vs `1340-1387`). 차이는 `tarType.name` 대 `target.name` 수준. `$unionAllow`/`$unionMatch`도 골격이 같다.

> 개선 방향: 두 엔진을 `{ mode: 'match' | 'allow' }`를 받는 **하나의 규칙 테이블**로 통합하거나, 최소한 공통 골격을 상위 함수로 추출하고 kind별 규칙만 데이터로 분리한다. 현재는 kind 규칙이 if-else 체인에 하드코딩되어 **kind 하나 추가 시 4곳**(`_hasKindXxx`, `$xxxAllow`, `$xxxMatch`, 메시지)을 고쳐야 한다.

### 9.3 타입 목록이 3곳에 중복 정의

| 위치 | 목록 |
| --- | --- |
| `_hasType()` (281) | 전체 14종 |
| `_isLeafType()` (301) | leaf 9종 |
| `typeObject()` 지역변수 `leafType` (529) | leaf 9종 (별도 하드코딩) |

세 번째 사본에 오타(`'bigi¡nt'`)가 들어 있는 것이 **중복 정의 구조의 직접적 증상**이다. 타입 메타데이터가 코드에 흩어져 있고 단일 원천(single source of truth)이 없다.

> 개선 방향: `TYPE_TABLE = { number: { leaf: true, ... }, ... }` 형태의 선언적 레지스트리 하나로 통합.

### 9.4 예외를 제어 흐름으로 사용

```js
// $arrayMatch 요소 검사 (type.js:1164~)
for (var k = 0; k < target.length; k++) {
    var success = false;
    for (var j = 0; j < eType['list'].length; j++) {
        try { _execMatch(elem, tar, opt, pathName); success = true; break; }
        catch (error) { continue; }     // ← 실패를 정상 흐름으로 소비
    }
    if (!success) throw new ExtendError(/EL01118/, ...);
}
```
"여러 후보 타입 중 하나라도 맞으면 통과"를 **throw/catch 루프**로 구현한다. 결과:
- 대형 배열 × 다수 후보 타입에서 예외 객체가 대량 생성됨 (`ExtendError`는 메시지 조립까지 수행)
- 디버거의 "예외에서 중단"이 사실상 사용 불가
- 진짜 오류와 탐색 실패가 같은 채널

> 개선 방향: 내부 검사기는 `{ ok: boolean, error?: Error }`를 반환하고, 공개 파사드에서만 throw로 변환.

### 9.5 검사 함수의 부작용

```js
// $unionMatch (type.js:1328)
if (... && typeof target[key] === 'undefined') target[key] = listDefType['default'];
```
`matchType`이 **target 객체를 변경한다**. `isMatchType`(boolean 판)도 같은 코드를 거치므로 "물어보기만" 해도 인자가 바뀐다 (실측 확인). 검증(validation)과 정규화(coercion)가 한 함수에 섞인 구조.

기본값 주입이 **세 경로에서 서로 다르게 동작**한다는 점이 더 큰 문제다.

| 경로 | 코드 | 실제 동작 |
| --- | --- | --- |
| leaf 분기 | `target = eType['default']` (1086, 1090, 1094, 1098, 1105) | 지역 변수 대입 — **밖으로 안 샘** |
| choice `_DEF_` | `target = eType['list'][0]` (1227) | 지역 변수 대입 — **밖으로 안 샘** |
| union 속성 | `target[key] = ...` (1328) | **호출자 객체를 변경** |

즉 "기본값"이라는 하나의 개념이 표기법에 따라 적용되기도 하고 안 되기도 한다. 의도된 일관 기능이 아니라 **한 경로에만 남은 상태**이며, 기능으로 확정할지 제거할지 판단이 필요하다.

### 9.6 함수 소스 파싱 의존

`_parseFunc` + `restoreArrowFunction`은 약 100줄로, `new Function()` 평가와 5개의 정규식에 의존한다. Babel 변환 결과(`_ref` 파라미터)를 되돌리는 코드까지 포함되어 있다는 것은, 이 경로가 **빌드 도구 체인의 출력 형태에 결합**되었다는 뜻이다.

- minify 시 파라미터명 소실 → 파싱은 되나 의미 소실
- CSP `unsafe-eval` 금지 환경에서 동작 불가
- 실패 시 `catch { obj['params'] = [] }`로 **조용히 검사 무력화** (`type.js:714`)

> 개선 방향: `_TYPE` 정적 선언을 정규 경로로 승격하고, 소스 파싱은 옵트인 플러그인으로 분리.

### 9.7 `object`의 이중 역할

§2.2에서 본 대로, 내장 객체 분류가 `_isPrimitiveObj()`에 하드코딩된 `RegExp`/`Date` 2종에 좌우된다. `Date`는 `object` 폴백으로, `Map`/`Set`/`Promise`/사용자 클래스 인스턴스는 `union`으로 흩어진다. `union`으로 분류되면 **프로토타입 메서드 전체가 구조 계약에 포함**된다.

그 결과 **`Object` 타입이 일반 객체와 매칭되지 않는다** (실측 확인).

```js
Type.matchType(Object, new Date());  // OK   — Date 는 object 폴백
Type.matchType(Object, {});          // FAIL — {} 는 union
Type.matchType(Object, new Map());   // FAIL — Map 도 union
Type.matchType({},      {a:1});      // OK   — 빈 union 이 사실상 "아무 객체나"
```

`Object`라는 가장 기본적인 타입 표기가 실제로는 "Date 등 미분류 값"만 가리키는 셈이다. 이는 개별 오류가 아니라 **`object`가 (a) Object 생성자 타입 (b) 분류 폴백을 겸하는 구조에서 필연적으로 나오는 결과**다. 코드에도 `REVIEW:` 주석으로 미해결 표시가 남아 있다(`type.js:739`).

### 9.8 미완성 코드가 본문에 상주

`$choiceMatch` 안에 `_IDX_`, `_KEY_`, `_AND_` 설계 메모와 주석 처리된 구현이 약 45줄 남아 있다(`type.js:1230-1273`). `POINT:`, `REVIEW:`, `TODO:` 주석이 파일 전반에 흩어져 있다. 명세와 구현의 경계가 흐린 상태.

### 9.9 전역 상태 결합

```js
var _global = globalThis;
var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활
```
**테스트 커버리지 목적의 분기가 프로덕션 코드에 상주**하며, 모듈 로드 시점에 전역을 읽는다(런타임 변경 반영 안 됨). `util.js:211`에도 같은 패턴이 복제되어 있다.

### 9.10 공개 표면의 응집도

`Type` 객체에 12개가 붙어 있으나 성격이 4갈래다.

| 갈래 | API | 소속 적합성 |
| --- | --- | --- |
| 동적 타입 검사 | `matchType` `isMatchType` `extendType` `typeOf` `typeObject` | ✅ type 모듈 |
| 타입 치환/계약 | `allowType` `isAllowType` | ✅ type 모듈 |
| 상속·인터페이스 리플렉션 | `getTypes` `isProtoChain` `hasType` | ⚠️ 인터페이스 기능 소속 |
| 범용 객체 유틸 | `getAllProperties` `deepEqual` | ❌ `util.js` 소속 |

---

## 10. 결합도 실측 — 분리 가능성 판단

### 10.1 type.js → 외부

| 대상 | 강도 | 비고 |
| --- | --- | --- |
| `ExtendError` | 강 (전 구간) | 오류 코드 체계 전체가 여기 묶임 |
| `_UNION` / `super` 관례 | 중 (`getTypes` 1곳) | 인터페이스 기능 전용 |
| `_KIND` 관례 | 약 (`extendType` 1곳) | 4줄 |
| `_TYPE` 관례 | 약 (`extendType` 1곳) | 1줄 |
| `_interface`/`isImplementOf` 예약어 | 약 (2곳) | 각 1줄 |
| `globalThis.OLD_ENV` | 약 (1곳) | 제거 대상 |

### 10.2 외부 → type.js

| 소비자 | 사용 API | 대체 난이도 |
| --- | --- | --- |
| `util.js` | `allowType`, `matchType` | 인터페이스 기능의 본체. **잔류 대상** |
| 컬렉션 3종 + `namespace-manager` | `matchType` | 낮음 — 단일 진입점 |
| `meta-object`, `base-collection` | `deepEqual` | 낮음 — `util.js`로 이동하면 됨 |

**결론: 결합의 90%가 `ExtendError`이며, 인터페이스 기능과의 결합은 8줄 남짓이다. 분리 가능성이 높다.**

---

## 11. 분리 설계 (계획)

목표: **동적 타입 검사기를 독립 유틸리티로 분리**하고, `logic-core`에서는 제거한다.

### 11.1 경계 확정

```
┌─────────────────────────────────────────────────────────┐
│  [분리]  동적 타입 검사 유틸리티                          │
│  extendType / typeOf / typeObject                        │
│  matchType / isMatchType / allowType / isAllowType       │
│  + 타입 레지스트리 + 원시 술어 + kind 규칙                │
├─────────────────────────────────────────────────────────┤
│  [잔류]  logic-core 인터페이스 기능                       │
│  Util.implements / Util.inherits                         │
│  getTypes / isProtoChain / hasType   ← _UNION, super 의존 │
│  IObject … ISerialize (9개 인터페이스)                    │
├─────────────────────────────────────────────────────────┤
│  [이동]  범용 유틸 → util.js                              │
│  getAllProperties / deepEqual                            │
└─────────────────────────────────────────────────────────┘
```

`allowType`은 인터페이스 검증에 쓰이지만 **본질은 타입↔타입 비교**이므로 검사기 쪽에 둔다. 인터페이스 기능은 이를 *사용하는* 쪽이 된다.

### 11.2 관례 의존의 역전 (분리의 핵심)

검사기가 `_UNION`/`super`/`_KIND`/`_TYPE`을 직접 읽지 않도록, **해석기를 주입**받는 구조로 바꾼다.

```js
// 분리된 유틸리티
export function createTypeChecker(hooks = {}) {
    const {
        getSuper     = (ctor) => Object.getPrototypeOf(ctor),
        getUnions    = ()     => [],
        getKind      = (fn)   => undefined,
        getSignature = (fn)   => undefined,
        reservedKeys = [],
        ErrorClass   = Error,
    } = hooks;
    // ... extendType / matchType / allowType 구현
    return { extendType, typeOf, typeObject, matchType, allowType, ... };
}

export default createTypeChecker();   // 무설정 기본 인스턴스
```

`logic-core`는 자신의 관례를 주입해 **현재 동작을 100% 보존**한다.

```js
// logic-core/src/type.js (얇은 어댑터로 축소)
import { createTypeChecker } from 'logic-type';
import ExtendError from './extend-error.js';

const Type = createTypeChecker({
    getSuper:     (c) => Object.prototype.hasOwnProperty.call(c, 'super')
                         ? c.super : Object.getPrototypeOf(c),
    getUnions:    (c) => c['_UNION'] || [],
    getKind:      (f) => f['_KIND'],
    getSignature: (f) => f['_TYPE'],
    reservedKeys: ['_interface', 'isImplementOf'],
    ErrorClass:   ExtendError,
});
export default Type;
```

이 한 단계만으로 **양방향 암묵 결합이 명시적 단방향 주입으로 전환**된다.

### 11.3 파일 분해안 (분리된 패키지 내부)

| 파일 | 내용 | 예상 |
| --- | --- | --- |
| `type-table.js` | `$type` 11종 + kind 13종의 **선언적 레지스트리** (§9.3 해결) | ~80줄 |
| `predicate.js` | `_isObject` … `_getKeyCode` 원시 술어 | ~120줄 |
| `extend-type.js` | `extendType` + `toString` | ~180줄 |
| `type-object.js` | `typeObject` / `typeOf` | ~80줄 |
| `engine.js` | `_execMatch` / `_execAllow` **공통 골격** (§9.2 해결) | ~150줄 |
| `rules-array.js` `rules-choice.js` `rules-union.js` `rules-class.js` `rules-function.js` | kind별 규칙 (match/allow 양쪽 규칙을 한 파일에) | 각 ~80줄 |
| `parse-func.js` | 소스 파싱 (**옵트인**, §9.6) | ~110줄 |
| `index.js` | `createTypeChecker` 팩토리 + 공개 파사드 | ~60줄 |

### 11.4 단계별 실행 순서

| 단계 | 작업 | 검증 기준 |
| --- | --- | --- |
| **0** | 현 동작을 기준선으로 고정 | `test/type/*.test.js` 6개 파일 전수 통과 스냅샷 |
| **1** | `getAllProperties` / `deepEqual`을 `util.js`로 이동, `Type`에서는 재export로 하위호환 유지 | 기존 테스트 무수정 통과 |
| **2** | `OLD_ENV` 전역 분기 제거, 타입 레지스트리 단일화 (§9.3) | 동일 |
| **3** | 관례 의존 5개를 hooks 인자로 역전 (§11.2) — **파일은 아직 그대로** | 동일 |
| **4** | 예외 제어 흐름을 결과 객체로 전환 (§9.4), 부작용 제거 여부 결정 (§9.5) | ⚠️ **동작 변경**. union 기본값 주입 제거는 breaking — 별도 major |
| **5** | 두 엔진 공통 골격 추출 (§9.2) | 동일 |
| **6** | 파일 물리 분해 (§11.3) → 별도 패키지로 이동 | 새 패키지에서 기존 테스트 전수 통과 |
| **7** | `logic-core/src/type.js`를 어댑터(약 20줄)로 축소, `index.js`의 `Type` export 유지 | 외부 소비자(`meta-entity`, `bind-model`, `logic-sql-entity`) 무수정 동작 |
| **8** | `logic-core` 내부 호출부를 최소 표면으로 정리 | `matchType` 4곳 + `allowType` 1곳만 남김 |

**1~3단계는 무손실 리팩터링**이라 언제든 되돌릴 수 있다. 실제 위험은 4단계(부작용/예외 흐름 변경)에 집중되므로, 여기만 별도 major 버전으로 끊는 것이 안전하다.

### 11.5 하위 호환 유지 전략

- `logic-core`의 `index.js`는 `export { Type }`을 **끝까지 유지**한다. 외부 소비자 3개는 코드 변경 없이 동작.
- 분리된 패키지는 `logic-core`의 **의존성**이 되며, 독립 사용자는 직접 설치한다.
- `getTypes`/`isProtoChain`/`hasType`은 인터페이스 기능이므로 `logic-core` 잔류가 원칙이나, 하위 호환을 위해 `Type` 네임스페이스에서도 계속 노출한다.

### 11.6 분리 후 남는 판단 과제

| 과제 | 선택지 |
| --- | --- |
| union 기본값 주입 (§9.5) | (a) 제거 → 순수 검증기 / (b) `matchType`엔 유지, `isMatchType`엔 제거 / (c) `coerce: true` 옵션으로 명시화 |
| 소스 파싱 (§9.6) | (a) 옵트인 플러그인 / (b) 완전 제거 후 `_TYPE`만 지원 |
| `object` 폴백 (§9.7) | (a) 유지 / (b) `date`/`map`/`set` 등 내장 타입 추가 / (c) 커스텀 타입 등록 API |
| 오류 체계 | `ExtendError`를 주입받을지, 분리 패키지가 자체 오류 코드 대역을 가질지 |

---

## 12. 요약

| 항목 | 평가 |
| --- | --- |
| **개념 설계** | 양호. `matchType`/`allowType` 이원 구조, 값-as-타입 DSL, 오류 경로 추적은 설계적으로 옳은 판단 |
| **구조 설계** | 미흡. 단일 파일 7계층, 두 엔진 중복, 타입 목록 3중 정의, 예외 기반 제어 흐름 |
| **타입 체계** | 미흡. `object`의 이중 역할로 `Object` 타입이 일반 객체와 매칭되지 않음(§9.7), 내장 타입 확장점 없음, 기본값 주입이 경로마다 불일치(§9.5) |
| **결합도** | 양호. 외부 의존 1개, 인터페이스 기능과의 결합은 관례 5개 / 약 8줄 |
| **분리 난이도** | **낮음.** 관례 5개를 hooks로 역전하면 물리 분리가 가능. 1~3단계는 무손실 |
| **최대 위험** | union 기본값 주입 부작용(§9.5)과 예외 제어 흐름 전환(§9.4) — 동작 변경을 수반하므로 별도 major |
