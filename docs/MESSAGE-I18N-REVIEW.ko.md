# logic-core 메시지·다국어(i18n) 설계 검토

> 작성일: 2026-09-14
> 대상: `logic-core` v1.1.4 — `message.js`, `message-wrap.js`, `message-wrap.bundle.js`, `load-json.js`, `extend-error.js`, `locales/`
> 범위: (1) 코드 기반 메시지 카탈로그 + 런타임 다국어 설계가 **과한지**, (2) 현재 라이브러리 생태계 추세와의 정합성, (3) 유지/변경/삭제 판단
> 관련 문서:
> - [LOGIC-CORE-FEATURES.ko.md](LOGIC-CORE-FEATURES.ko.md) — §2 `Message` 기능 목록, A3/B6/C7/D3 항목 (미사용 API, prototype pollution)
> - [AI-COLLABORATION-DRAFT.ko.md](AI-COLLABORATION-DRAFT.ko.md) — §4-4 `type.js → ExtendError → Message` 결합
> - [NAMING-REVIEW.ko.md](NAMING-REVIEW.ko.md) — `ExtendError` 명명
> - [EXTEND-ERROR-REVIEW.ko.md](EXTEND-ERROR-REVIEW.ko.md) — `ExtendError` 구조 적정성·비용 실측
> - [BUILD-PUBLISH-REVIEW.ko.md](BUILD-PUBLISH-REVIEW.ko.md) — R2 ESM 번들 top-level await 잔존, P8 `sideEffects`, P9 `engines`
>
> 위 문서와 중복되는 항목은 참조만 하고, 본 문서는 **설계 방향의 타당성**에 집중한다.

---

## 1. 총평

| 축 | 판정 | 요약 |
| --- | :-: | --- |
| 에러 코드 체계 (`EL01118`) | **유지** | Rust·Node·TypeScript·Next.js가 모두 쓰는 표준 패턴. 이 라이브러리의 차별점 |
| 중앙 메시지 카탈로그 | **유지** | 코드 체계의 전제 조건. 다국어 여부와 무관하게 필요 |
| 에러 체인 (`#` 큐) | **유지** | 중첩 원인 추적. 잘 작동함 |
| 한국어 메시지 제공 | **유지 (방식 변경)** | TypeScript·Zod 4도 제공. 단, **opt-in 정적 import**로 |
| 런타임 로케일 자동 감지 | **제거** | 라이브러리가 할 일이 아님. 비결정성·테스트 종속·로그 그룹핑 파손 |
| 비동기 JSON 로딩 (`load-json.js`) | **제거** | top-level await 오염, 번들 분기 파일, 레이스, 번들러 취약 |
| 카탈로그 데이터 위생 | **정리 필요** | 277개 중 81개 orphan, 45개는 구분선, 3개 키 오타로 영어 메시지 누락 |

핵심 결론 3가지:

1. **"다국어 = 구식"은 사실이 아니다.** TypeScript는 13개 언어 진단 메시지를, Zod 4는 40여 개 로케일을 제공한다. 추세가 바뀐 건 *제공 여부*가 아니라 *전달 방식*이다 — 자동 감지·런타임 fetch에서 **명시적 opt-in·정적 import**로.
2. **과한 것은 설계가 아니라 배관이다.** `message-wrap.js`의 top-level await 한 줄이 라이브러리 전체 모듈 그래프를 async로 만들고, 그 때문에 `.bundle.js` 분기 파일·rollup alias 3곳·`load-json.js`·`copy` 플러그인이 연쇄적으로 필요해졌다. 이 배관을 걷어내면 설계의 장점만 남는다.
3. **"영어가 직관적이지 않다"의 진짜 원인은 다국어 부재가 아니라 영어 원본 품질이다.** `default.js`의 영어는 한국어를 기계 번역한 흔적이 뚜렷하다 (`Parcing` 오타 3회, 같은 개념에 `Array permit`/`Allow array`/`Array Allowance`). npm·GitHub에서 세계가 처음 보는 문자열이 이것이다.

---

## 2. 현재 구조 사실

### 2.1 파일과 흐름

```
extend-error.js ──import──▶ message-wrap.js ──▶ message.js ──▶ load-json.js ──▶ fs / fetch
      ▲                          │ (TLA)                              │
      │                          └─ importMessage(default.js)          └─ locales/ko.json
      │
  type.js, meta-*.js, collection-*.js, namespace-manager.js, event-emitter.js … (18개 모듈, `new ExtendError(` 219회)
```

| 파일 | 줄 | 역할 |
| --- | --: | --- |
| `message.js` | 215 | 저장소, `get(code, values)`, `changeLanguage()`, `autoDetect()`, `_getLocale()` |
| `message-wrap.js` | 13 | `default.js` 등록 + **`await Message.autoDetect()`** (top-level await) |
| `message-wrap.bundle.js` | 14 | 동일 로직, TLA 대신 **fire-and-forget async IIFE**. rollup alias로 교체됨 |
| `load-json.js` | 47 | Node `readFile` / 브라우저 `fetch`, `import.meta.url` 기준 상대 경로 |
| `locales/default.js` | 279 | 영어 277개 키 (ESM 객체) |
| `locales/ko.json` | 278 | 한국어 277개 키 (런타임 로딩) |
| `locales/core.json` | 2 | `{"CORE":"SUCCESS"}` — 참조 0회 (FEATURES A3) |

### 2.2 실제 출력 (실행 확인)

```js
Type.matchType([String], [1, 'a']);
```

```
--- default (en) ---
Error [EL01118] Array match: array element check failed. extType: array(_OPT_)[string], tarType: array(_OPT_)[number(1), string('a')]
# Error [EL0130B] Type match: matchtype (extType, target) check failed

--- ko ---
Error [EL01118] 배열 매치 : array 요소 검사가 실패하였습니다. extType: array(_OPT_)[string], tarType: array(_OPT_)[number(1), string('a')]
# Error [EL0130B] 타입 매치 : matchType(extType, target) 검사가 실패하였습니다.
```

설계 의도 — "타입 보정을 돕는 상세 콘솔 메시지" — 는 **정확히 달성되어 있다.** 코드, 기대 타입, 실제 타입 덤프, 중첩 원인 체인이 모두 한 메시지에 담긴다.

### 2.3 테스트 결합도

- `toThrow('EL04112')` 처럼 **코드로 단언**하는 테스트가 대부분 — 건강한 상태
- 문자열 단언 24건 중 로케일 종속은 1건, 그것도 이미 주석 처리됨:
  `test/collection-property.test.js:1489` — `// expect(...).toThrow(/맞는 타입이 없습니다./);`
  → 자동 감지가 테스트를 깨뜨린 흔적이다.

---

## 3. 유지해야 할 것

### 3.1 에러 코드 체계

| 프로젝트 | 코드 | 문서 연결 |
| --- | --- | --- |
| Rust | `E0308` | `rustc --explain E0308` |
| Node.js | `ERR_INVALID_ARG_TYPE` | `nodejs.org/api/errors.html#ERR_INVALID_ARG_TYPE` |
| TypeScript | `TS2322` | `diagnosticMessages.json` → 문서 |
| Next.js | `next-*` | `nextjs.org/docs/messages/<code>` |
| logic-core | `EL01118` | (아직 없음 — §7 Tier 3) |

코드가 안정적이면 (a) 번역이 바뀌어도 grep·테스트·이슈 검색이 유지되고, (b) 로그 도구가 코드로 그룹핑할 수 있으며, (c) 문서 페이지를 코드로 생성할 수 있다. **이 세 가지가 카탈로그를 만든 실질적 이유이고, 전부 다국어와 무관하게 성립한다.**

### 3.2 한국어 메시지 자체

대상 사용자가 한국어 개발자이고, `type.js` 메시지는 end-user가 아닌 **개발자를 향한** 진단 메시지다. 이 문맥에서 한국어 진단은 실제 DX 이점이며, 한국 시장에서 차별점이 된다. 삭제할 이유가 없다.

### 3.3 `${name}` / `$1` 치환, 에러 체인

`_replacePlaceholders`와 `ExtendError.queue`는 단순하고 잘 작동한다. 손댈 필요 없음.

---

## 4. 문제 — 전달 방식 (제거 대상)

### 4.1 top-level await가 모듈 그래프 전체를 async로 만든다

`src/message-wrap.js:10`

```js
await Message.autoDetect();
```

`extend-error.js`가 이 모듈을 import하고, `src/` 18개 모듈이 `extend-error.js`를 import한다. 결과: **`logic-core`를 import하는 모든 소비자가 TLA를 지원하는 환경이어야 한다.**

그 대가가 `message-wrap.bundle.js`다. UMD/CJS 타깃이 TLA를 못 써서 만든 분기 파일이고, `rollup.config.js:86, 135, 171` 세 곳에서 alias로 갈아끼운다. 같은 로직이 두 벌이며, 하나를 고치면 다른 하나를 잊기 쉽다.

그런데 alias는 CJS/UMD 타깃에만 적용되어 **ESM 번들(`dist/logic-core.esm.js`)에는 TLA가 그대로 남아 있다** — BUILD-PUBLISH-REVIEW R2. 즉 분기 파일을 만들고도 문제가 절반만 가려진 상태다. TLA를 소스에서 제거하면 R2·분기 파일·alias 3곳이 한 번에 사라진다.

### 4.2 번들 버전은 레이스 컨디션이다

`src/message-wrap.bundle.js:10-12`

```js
(async () => {
    await Message.autoDetect();
})();
```

await 없이 시작만 한다. `ko.json` 로드가 끝나기 전에 발생한 에러는 **한국어 환경에서도 영어로 나온다.** 같은 코드가 실행 타이밍에 따라 다른 언어를 출력하는 비결정적 동작이다.

### 4.3 런타임 파일 로딩은 번들러 환경에서 조용히 실패한다

`src/load-json.js:17` — `catch (error) { return undefined; }`

- 경로를 `document.currentScript.src` 또는 `import.meta.url` 기준으로 해석한다. Vite/Webpack/esbuild가 모듈을 인라인하면 `./locales/ko.json`은 존재하지 않는 경로가 되고, **에러 없이 영어로 폴백**된다.
- `rollup.config.js:96`의 `copy({ src: 'src/locales/**/*', dest: 'dist/locales' })`는 이 취약성을 떠받치기 위한 장치다. 소비자가 다시 번들링하면 무력화된다.
- CDN, serverless, 모노레포 hoisting에서 같은 이유로 깨진다.

### 4.4 라이브러리의 로케일 자동 감지는 현재 추세에 반한다

`src/message.js:31-47` — `_getLocale()`이 `navigator.language` / `process.env.LANG`을 읽는다.

앱이라면 맞는 동작이지만 **라이브러리에서는 부작용**이다:

| 영향 | 결과 |
| --- | --- |
| CI vs 로컬 | 같은 에러가 CI 로그(`LANG=C` → en)와 개발자 로컬(ko)에서 다른 문자열 → 이슈 재현·검색 불가 |
| Sentry / Datadog | 메시지 텍스트로 fingerprint → 같은 버그가 언어별로 다른 이슈로 분리 |
| 다운스트림 테스트 | 소비자 테스트가 실행 환경 로케일에 종속 (§2.3의 주석 처리된 테스트가 그 사례) |
| 스냅샷 | `toMatchSnapshot()`이 개발자 OS 언어에 따라 달라짐 |

Zod가 `z.config(z.locales.ko())`처럼 **명시적 호출**로만 로케일을 바꾸는 이유가 이것이다. 라이브러리는 기본 영어를 유지하고, 언어 선택은 앱의 책임으로 둔다.

---

## 5. 문제 — 카탈로그 위생

### 5.1 수치

| 항목 | 값 |
| --- | --: |
| `default.js` 키 | 277 |
| `src/`에서 실제 참조하는 코드 | 199 |
| **orphan** (카탈로그에 있으나 참조 0회) | **81** |
| 그중 구분선 (`"----- … -----"`) | 45 |
| 그중 실제 미사용 메시지 (`ES0xx` 계열 등) | 36 |
| **`src/`가 참조하지만 `default.js`에 없는 코드** | **3** |

### 5.2 구분선이 메시지로 저장되어 있다

`src/locales/default.js:27, 31, …`

```js
"EL01100": "----- util-type.js match -----",
"EL01110": "----- match array -----",
```

주석이 카탈로그에 살고 있고, `ko.json`에도 그대로 번역 대상으로 들어가 있다. 45개 × 2 파일 = 90줄의 순수 잡음.

### 5.3 키 오타로 영어 메시지 3개가 누락되어 있다 (버그)

| 소스 참조 | `default.js` 키 | `ko.json` 키 |
| --- | --- | --- |
| `meta-registry.js:300` → `EL03242` | **`EL0324`** (오타) | `EL03242` ✓ |
| `namespace-manager.js:229` → `EL03321` | **`EL0321`** (오타) | `EL03321` ✓ |
| `namespace-manager.js:282` → `EL03323` | **`EL0323`** (오타) | `EL03323` ✓ |

실행 확인:

```js
MetaRegistry.setMetaObject({}, 'not-object');
// → "There is no message for code. 'EL03242'"   (영어 환경)
// → "setMetaObject(oGuid, meta); meta 는 'object' 타입만 가능합니다. …"   (한국어 환경)
```

**한국어에서는 정상, 영어에서는 깨진다.** 두 카탈로그가 독립적으로 편집되면 이런 drift가 생긴다는 직접 증거다. 카탈로그 간 키 집합 일치를 검사하는 테스트가 없다.

그 외 drift: `default.js`에는 `"EN": "OK"`, `ko.json`에는 `"KO": …` 로 언어 표식 키가 서로 다르다. 메시지 코드도 아니고 참조하는 코드도 없다 — 정리 대상.

### 5.4 영어 원본 품질

`default.js`는 한국어를 원문으로 두고 기계 번역한 흔적이 뚜렷하다.

| 문제 | 예 |
| --- | --- |
| 오타 | `"Parcing check"`, `"Parcing inspection"` (3회) |
| 같은 개념에 다른 표현 | `Array permit`(2) / `Allow array`(4) / `Array Allowance`(1); `Function permit`(2) / `Function allowed`(3) / `Function Permitted`(1) / `Allow function`(1) |
| 번역 중 공백 소실 | `"…detailed type of $1.$1: $2"` — 원문 `"$1 의 세부 타입을 지정해야 합니다. $1: $2"` |
| 어색한 직역 | `"Choice allowed: choice(_EUM_) type and choice(_EUM_) type only"` |

한국어(`ko.json`)가 더 정확하다. 즉 **실제 source of truth는 한국어**인데 패키지 기본값은 영어다. 이 역전이 "영어가 직관적이지 않다"는 체감의 근본 원인이다.

---

## 6. 현재 추세 비교

| 라이브러리 | 코드 체계 | 다국어 | 제공 방식 | 자동 감지 |
| --- | :-: | :-: | --- | :-: |
| Rust `rustc` | ✓ | ✗ (인프라만 존재) | — | ✗ |
| Node.js core | ✓ | ✗ | — | ✗ |
| ESLint / Vite / React | 일부 | ✗ | — | ✗ |
| TypeScript | ✓ | ✓ 13개 언어 | 빌드 시 생성된 정적 번들, `--locale` 플래그 | CLI만 |
| **Zod 4** | 에러맵 | ✓ 40여 개 | **정적 import + `z.config(z.locales.ko())`** | ✗ |
| Valibot / ArkType | — | Valibot ✓ | 정적 import + `setGlobalConfig` | ✗ |
| **logic-core (현재)** | ✓ | ✓ 2개 | **런타임 fetch + async** | **✓** |

`type.js`의 직접 경쟁 상대인 Zod·Valibot이 가장 참고할 만한 형태다. 공통점:

1. 기본은 영어, 로케일은 **소비자가 명시적으로 import해서 주입**
2. 로케일 파일은 **동기 ESM 모듈** — 네트워크·파일시스템 I/O 없음, tree-shakeable
3. 자동 감지 없음 — 언어 선택은 앱의 책임

logic-core는 1·2·3 모두 반대 방향이다. 설계 목표(코드 + 한국어)는 같은데 **구현 형태만 한 세대 전**이다.

---

## 7. 권장 조치 (비용 대비 효과 순)

### Tier 1 — 다국어 유지 여부와 무관하게 지금 고칠 것

| # | 조치 | 위험 | 효과 |
| :-: | --- | :-: | --- |
| 1 | `default.js` 키 오타 3건 수정 (`EL0324→EL03242`, `EL0321→EL03321`, `EL0323→EL03323`) | 없음 | 영어 메시지 누락 버그 해소 |
| 2 | 카탈로그 키 집합 일치 테스트 추가 (`Object.keys(default) ≡ Object.keys(ko)`, 소스 참조 코드 ⊆ 카탈로그) | 없음 | 5.3 재발 방지 |
| 3 | 구분선 45개 + orphan 36개 제거 (구분선은 소스 주석으로) | 없음 | 카탈로그 277 → 199, 번역 대상 30% 감소 |
| 4 | `core.json` 삭제 (FEATURES A3) | 없음 | — |
| 5 | 영어 카탈로그 전면 교정 — **한국어를 원본으로 두고** 영어를 파생 | 없음 | 국제 사용자 첫인상 |

### Tier 2 — 전달 방식 교체 (minor 버전, 하위 호환 가능)

**목표:** `load-json.js` 삭제, `message-wrap.bundle.js` 삭제, rollup alias 3곳 삭제, `copy` 플러그인 삭제, TLA 제거.

```js
// 소비자 코드 — Zod 4와 같은 형태
import { Message } from 'logic-core';
import ko from 'logic-core/locales/ko';

Message.use(ko);              // 동기. 번들러·Node·브라우저 동일 동작
```

```js
// src/message.js — 변경 후 골격
class Message {
    static $storage = { default: {}, current: null };

    static use(catalog) {            // 정적 로케일 주입 (동기)
        this.$storage.current = catalog;
    }
    static reset() { this.$storage.current = null; }

    static get(code, values) {
        const msg = this.$storage.current?.[code] ?? this.$storage.default[code];
        …
    }
}
```

```jsonc
// package.json exports 추가 — 기존 "./ko" 패턴을 확장
"./locales/ko": "./src/locales/ko.js",
"./locales/en": "./src/locales/en.js"
```

- `ko.json` → `ko.js` (ESM `export default {…}`)로 전환. JSON import assertion 의존을 피하고 `default.js`와 형식을 통일한다.
- `autoDetect()`는 **삭제하거나** 명시적 호출 전용으로 남긴다 (`Message.autoDetect()`를 앱이 부르면 됨). 모듈 로드 시 자동 실행은 제거.
- `changeLanguage(lang)`은 `use(catalog)`의 별칭으로 1개 minor 동안 유지 후 제거.
- FEATURES D3 (`_deepMerge` prototype pollution)는 정적 import로 바뀌면 외부 JSON을 받지 않으므로 자연 해소된다.

### Tier 3 — 원래 목적("문서 파일 제공")의 실제 회수

코드가 안정적이므로 **카탈로그에서 문서를 생성**한다. 코드 체계가 값을 하는 지점이다.

```
Error [EL01118] Array match: array element check failed. …
  → https://white-base.github.io/core/errors/EL01118
```

- `scripts/gen-error-docs.js`: `default.js` + `ko.js` → `docs/errors/<code>.md` (영/한 병기)
- `ExtendError.message` 끝에 문서 URL 1줄 추가 (옵션, `Message.docsBase` 설정 시에만)
- 한국어 개발자에게는 **한국어 문서 페이지**를 주고, **콘솔 문자열은 영어로 고정** — 로그 그룹핑·이슈 재현·테스트 안정성을 지키면서 "한국어로 이해하고 싶다"는 요구도 충족한다.

Rust `--explain`, Next.js `/docs/messages/<code>`와 같은 패턴이다.

### 적용 순서

```
Tier 1-1 (오타)  →  Tier 1-2 (일치 테스트)  →  Tier 1-3/4 (정리)  →  Tier 1-5 (영어 교정)
     └─ 아키텍처 무관, 당일 가능 ─┘
Tier 2 (정적 로케일)  →  Tier 3 (문서 생성)
     └─ AI-COLLABORATION-DRAFT §6 type.js 분리와 함께 결정 ─┘
```

---

## 8. 검증 방법

```bash
# orphan / missing 코드 집계
grep -oE '"[A-Z][A-Z0-9]+":' src/locales/default.js | tr -d '":' | sort -u > /tmp/keys.txt
grep -rhoE '/[A-Z][A-Z0-9]+/' src/*.js | tr -d '/' | sort -u > /tmp/used.txt
comm -23 /tmp/keys.txt /tmp/used.txt | wc -l     # orphan  → 81
comm -13 /tmp/keys.txt /tmp/used.txt             # missing → EL03242 EL03321 EL03323

# 구분선 개수
grep -cE '"-----' src/locales/default.js          # → 45

# 카탈로그 키 drift
diff <(grep -oE '"[A-Z][A-Z0-9]+":' src/locales/default.js | sort) \
     <(grep -oE '"[A-Z][A-Z0-9]+":' src/locales/ko.json | sort)

# 영어 누락 재현
node -e "import('./src/meta-registry.js').then(({MetaRegistry}) => {
  try { MetaRegistry.setMetaObject({}, 'x') } catch (e) { console.log(e.message.split('\n')[0]) }
})"
# → There is no message for code. 'EL03242'

# TLA 오염 확인
grep -n "^await" src/message-wrap.js               # → 10:await Message.autoDetect();
grep -rn "message-wrap.bundle" rollup.config.js    # → 3곳
```
