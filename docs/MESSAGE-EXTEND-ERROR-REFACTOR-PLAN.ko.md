# ContextError와 모듈 내부 메시지 관리 리팩토링 계획

> 작성일: 2026-10-21 (Asia/Seoul)  
> 상태: `ContextError`·내부 메시지 관리 구현 완료(2026-10-21). 기존 진단·코딩 규칙의 개정, 타입 진단 경로 보완과 외부 패키지 이전은 후속 범위다.  
> 기준: 현재 `logic-type` 소스, [코딩 규칙](CODING-RULES.ko.md), [오류·진단 규약](error-diagnostics.md)

## 1. 권장 방향

**확장 오류 이름은 `ContextError`로 확정한다. 각 모듈의 `error-factory.js`는 내부 코드·메시지를 통합 관리하고, `ContextError`는 전달받은 템플릿의 치환과 원인 체인 구성을 담당하도록 한다.** 기존 `Message` 클래스와 다국어 기능을 제거하되 `error-factory.js` 파일은 내부 메시지 관리 용도로 재구성한다.

- 메시지 데이터: 모듈별 `error-messages.js` 안의 단일 언어 `코드 → 템플릿 문자열` 객체.
- 공개 범위: 메시지 표와 생성 도우미는 패키지의 공개 API에 노출하지 않음. 내부 파일 간 import/export는 허용.
- 오류 데이터: `code`, `reason`, `stage`, `path`, `hint`, `cause`.
- 중첩 관계: 문자열 큐 대신 원본 오류를 참조하는 `cause`가 기준.
- 표시: 현재 실패 문맥에서 시작해 원인 순서로 출력. 각 오류의 코드는 유지.
- 이전: 기존 `EL...` 코드를 유지하고, 생성자 호출의 이전·클래스명 변경·출력 전환을 각각 검증.

`ContextError`는 `DiagnosticError` 규약의 슈퍼셋을 목표로 한다. 메시지 카탈로그의 소유권은 각 모듈에 두고, 공통 오류 클래스가 모든 모듈의 메시지를 알도록 만들지 않는다. 아래의 `ExtendError`는 기존 소스와 호환성 검토 대상을 가리킨다.

이 문서에서 메시지 소유권의 기본 단위는 독립 배포하는 모듈·패키지다. 한 패키지 안의 기능별 메시지는 `error-factory.js`에서 통합한다. 필요한 규모가 되면 기능별 데이터 파일을 정적으로 모으되, 다른 패키지의 메시지까지 전역 저장소로 병합하지 않는다.

언어는 기존 기본 카탈로그와 맞춘 **영어 단일 언어를 초안 기준**으로 한다. 한국어 단일 언어를 선택해도 설계와 작업 순서는 같다. 런타임 언어 선택·자동 감지·번역 로딩은 두지 않는다.

## 2. 구현 전 기준선에서 확인한 문제

아래는 리팩토링 전 상태다. 현재 구현과 남은 작업은 §9에 구분해 기록한다.

| 위치 | 현재 상태 | 작업에 미치는 영향 |
| --- | --- | --- |
| `src/extend-error.js:3` | 존재하지 않는 `message-wrap.js`를 import | 현재 저장소만으로 정상 import할 수 없음 |
| `src/message.js:3` | 존재하지 않는 `load-json.js`를 import | 기존 다국어 로더를 정상 동작 기준선으로 사용할 수 없음 |
| `src/extend-error.js:85–107` | 원인의 `queue`를 공유한 뒤 `push` | 같은 원인을 감싼 다른 오류와 원본 큐가 변경됨 |
| `src/extend-error.js:87–107` | `prop`은 출력에만 사용하고 인스턴스에 저장하지 않음 | 다음 wrap에서 경로 등 문맥이 소실됨 |
| `src/extend-error.js:88–89` | 일반 `Error`의 메시지만 복사 | 원본 오류 객체와 그 stack에 접근할 수 없음 |
| `src/extend-error.js:14–27` | 최초 원인부터 출력하고 깊이만큼 `#` 추가 | 최상위 실패 문맥이 마지막에 나오며 깊이에 따라 표시가 커짐 |
| `src/type.js:1141,1176` 등 | 배열 재귀에서 같은 경로 전달 | 배열 인덱스가 진단 경로에 반영되지 않음 |
| `src/type.js:1180,1289` 등 | 후보 검사 실패의 예외를 버림 | 최종 실패에서 상세 원인을 복원할 수 없음 |
| `src/type.js:1371–1373` | catch한 `error` 대신 `prop`으로 감쌈 | 반환 타입 검사 실패의 하위 원인이 끊김 |
| `package.json` | 테스트 명령이 실패용 placeholder이고 ESM 실행 설정도 없음 | 실행 기준선과 테스트 환경 구성부터 필요 |

`Message` 제거는 의존성과 초기화를 단순화한다. **중첩 표현 개선은 `cause` 보존, 오류 포맷, `type.js`의 원인·경로 전달을 함께 고쳐야 달성된다.**

현재 `type.js`를 주석 행 제외 방식으로 검색하면 코드 생성 호출 93곳, 고유 코드 84개다. 이는 AST·실행 커버리지가 아닌 이전 작업용 목록이다. 현재 저장소의 `src/error-messages.js`에서 이 84개 키를 모두 찾았으므로 내부 `error-factory.js`로 이전할 데이터 원본으로 사용할 수 있다. 구분선·언어 표식·그 밖의 코드도 있어 단순 검색만으로 삭제하지 않고 범위를 확인한다. 인접 저장소의 `logic-core/src/locales/default.js`는 대조 자료로만 사용하며, 배포 코드에서 그 경로를 import하지 않는다. 키 검색과 별도로 placeholder 계약도 대조한다.

## 3. error-diagnostics.md 규칙 평가

### 3.1 어떤 규칙이 더 적합한가

| 항목 | 기존 ExtendError | error-diagnostics.md | 권장 |
| --- | --- | --- | --- |
| 오류 식별 | 메시지 안의 `EL...` | 독립된 `error.code` | 구조화 필드 채택, 기존 코드 값 유지 |
| 원인 관계 | 문자열 `queue` | `error.cause` | 원본 객체를 보존하는 `cause` 채택 |
| 경로 | `prop['error path']` 문자열 | `error.path` | `path` 채택, 기존 prop 입력을 변환 |
| 해결 안내 | 별도 필드 없음 | `error.hint` | 선택 필드로 채택, 메시지 파일의 필수 항목으로 늘리지 않음 |
| 원문 사유 | 출력 메시지와 섞임 | 실제 구현에 `error.reason` 존재 | 접두사·하위 원인을 제외한 `reason` 채택 |
| 단계 | 없음 | `stage: 3`은 halt | 외부에 던지는 검증 오류에 기본값 3 적용 |
| 출력 | 원인부터 `#`로 누적 | `[Stage 3][CODE] message (path) — hint` | 단일 오류 형식 채택, 원인 체인 규칙 보완 |
| 테스트 | 메시지·출력 순서 단언 | 코드·필드 우선 단언 | 구조 검증 우선, 출력 테스트도 별도 유지 |
| 비-throw 결과 | `isMatchType/isAllowType`의 boolean | 필요한 계층에서 `{ ok, ... }` | 이번에는 기존 boolean 반환 유지 |

**구조화 필드 규칙을 채택하는 편이 적합하다.** 자동 처리와 중첩 표현을 같은 오류 데이터에서 만들 수 있고, 메시지 문구나 언어를 바꾸어도 코드로 오류를 구분할 수 있다.

현재 `logic-assembly`는 `logic-core`에 의존한다. 저수준 타입·오류 모듈이 `logic-assembly`를 역으로 참조하면 계층이 뒤집히며, 향후 core가 type을 사용하면 순환 의존도 생길 수 있다. **기본 진단 규약을 수용하되 실제 상속을 적용하려면 공통 오류 모듈의 위치부터 정한다.** 기존 `ExtendError` 이름은 호환 경로로 유지하며, 오류 클래스 공용화는 독립 모듈 분리 작업에서 다룬다.

권장 목표는 공통 구현의 `DiagnosticError`를 `ContextError`가 상속하고, 모듈 전용 오류가 필요한 기능에 따라 둘 중 하나를 상속하는 계층이다. 이 공통 부모의 위치를 먼저 정리한다. 과도기에 데이터 규약만 맞춘 구현을 사용한다면 실제 상속과 같은 `instanceof` 호환을 보장한다고 표시하지 않는다.

### 3.2 규약에 보완할 부분

1. **단일 오류 표시와 원인 체인 표시를 구분한다.** 현재 규약과 `DiagnosticError` 구현은 원인을 저장하지만 `message`에 하위 원인을 자동 출력하지 않는다.
2. **`reason`을 문서의 공통 필드에 추가한다.** 실제 `DiagnosticError`는 이미 원문 사유를 이 필드에 저장한다. 렌더링된 `message`를 원문으로 다시 넣어 접두사가 중복되는 일을 막는다.
3. **기존 `EL...` 코드의 유효성을 명시한다.** 문서의 `E_*`는 예시지만 런타임 변환기의 정규식은 실제로 `E_*`만 처리한다. 규약의 설명과 소비자의 구현을 함께 맞춰야 한다.
4. **판별은 구조화된 필드를 우선한다.** 특정 클래스의 `instanceof`만 요구하면 서로 다른 패키지·중복 설치·직렬화 경계에서 같은 데이터 계약의 오류도 놓칠 수 있다. 판별 시 문자열 `code`·`reason`, 유효한 `stage` 등 계약을 검사하며, 임의의 `Error.code`만으로 공통 진단이라고 판단하지 않는다.
5. **기술 경로의 의미를 구분한다.** `path`는 실패한 입력 경로이고 stack의 파일 경로와 다르다. 타입 검사에서는 `target`·`tarType`·`extType` 중 무엇을 가리키는지 정한다.

`DiagnosticError` 사용을 모든 계층에 강제하는 현재 문구에는 저수준 모듈의 예외 또는 향후 독립 공용 모듈 정책이 필요하다. 이 계획은 기존 규약을 자동으로 덮어쓰지 않는다.

### 3.3 확정 명칭과 역할

하위 모듈이 `DiagnosticError`를 사용한다면 두 타입은 같은 진단 체계 안에서 역할을 구분해야 한다.

| 이름 | 역할 |
| --- | --- |
| `DiagnosticError` | 기본 진단. 안정적인 코드·사유·경로·안내·원인을 표현 |
| `ContextError` | 확정된 확장 오류 이름. 템플릿을 치환하고 하위 오류에 현재 문맥을 더해 원인 체인을 표시 |
| 모듈의 `error-factory.js` | 자신의 코드·템플릿을 통합 관리. 필요한 오류 타입을 선택하고 템플릿·값·문맥을 전달 |

기본 `DiagnosticError`도 `cause`를 가진다. 확장형만 원인을 보존한다고 구분하지 않는다. `ContextError`의 추가 책임은 **전달받은 템플릿·값으로 자신의 reason을 생성하고, 하위 모듈의 진단을 포함한 원인 체인을 조합해 표시하는 것**이다. 모듈별 코드 조회는 그 모듈의 `error-factory.js`가 담당한다.

슈퍼셋은 데이터·진단 계약의 관계를 뜻한다. 클래스 이름 변경이나 같은 필드의 존재만으로 `instanceof DiagnosticError` 호환이 생기지는 않는다. 실제 상속을 선택한다면 의존 위치를 정리하고 같은 기본 생성자를 공유해야 한다. 기존 자유 메시지 입력과 생성자 인자 형태는 별도 호환 계약으로 다룬다.

이전 이름의 호환 경로를 제공한다면 기존 import 경로와 export를 유지하고 `ExtendError`를 `ContextError`와 **동일한 생성자**를 가리키는 별칭으로 둔다. 별도 호환 서브클래스는 만들지 않는다. 이 방식은 같은 모듈 인스턴스 안에서 `instanceof ExtendError`와 생성자 동일성을 유지할 수 있지만, 예전 생성자 인자 해석과 `error.name`, `constructor.name`, stack 출력까지 자동 보존하지는 않는다. 구 생성자의 코드 자동 조회 계약은 아래 이전 계획에서 따로 처리한다.

## 4. 목표 구조와 오류 계약

### 4.1 파일 구성

```text
모듈 내부 type.js / 기타 기능 파일
    └─ error-factory.js       내부 메시지 조회·오류 생성
           ├─ error-messages.js   코드·템플릿 데이터
           └─ ContextError        템플릿 치환, 진단 필드와 원인 체인 구성

하위 모듈의 단일 진단
    └─ 해당 모듈의 error-factory.js
           └─ DiagnosticError 또는 필요한 모듈 전용 오류
```

`error-messages.js`는 코드와 템플릿 문자열만 담는다. `error-factory.js`에는 이를 읽는 얇은 조회·생성 함수를 둔다. 현재는 `context-error.js`에 `ContextError`와 공통 `DiagnosticError`를 구현했다. 아래는 형식 예시이며, 실제 카탈로그 문구는 기존 원본을 유지한다.

```js
// src/error-factory.js — 이 패키지 안에서만 사용
import message from './error-messages.js';
import { ContextError } from './context-error.js';

function createError(code, values = [], options = {}) {
    const template = Object.prototype.hasOwnProperty.call(message, code)
        ? message[code]
        : `No message is defined for code '${code}'.`;

    return new ContextError(code, template, { ...options, values });
}

export { createError }; // 내부 파일에서 사용. 공개 index.js에서는 재export하지 않는다.
```

호출부는 내부 생성 함수를 사용한다.

```js
import { createError } from './error-factory.js';

throw createError('EL01102', ['string', 'number'], {
    path: "target['name']",
    cause
});
```

`ContextError`의 목표 인자 형태는 기본 진단과 맞춘 `(code, template, options)`이며, 추가 치환 값은 `options.values`로 전달한다. 카탈로그 조회는 모듈 내부에 남기고 치환 규칙은 공통 오류 구현에서 처리한다. `ContextError`가 사용자 모듈의 `error-factory.js`를 역으로 import하거나 전역 등록을 요구하지 않으므로 모듈 분리와 테스트가 단순해진다.

`createError`는 선택된 오류 생성자에 모듈의 템플릿을 전달하는 내부 함수다. 새 공개 인터페이스 계층이나 `Message` 대체 클래스는 추가하지 않는다. 하위 모듈이 단일 진단만 필요하면 자신의 함수에서 `DiagnosticError`를 사용해도 된다. 메시지 관리 규칙을 맞추기 위해 모든 모듈이 `ContextError`에 의존할 필요는 없다.

### 4.2 필드 계약

| 필드 | 제안 계약 |
| --- | --- |
| `name` | 공통 확장형은 `ContextError`. 실제 모듈 전용 서브클래스는 자신의 이름 사용. 기존 출력과 달라지는 부분을 기록 |
| `code` | 현재 오류의 안정적인 코드. 새 생성 경로는 문자열을 명시적으로 전달. 구 입력 변환이 필요한 경우 RegExp의 `.source`를 사용 |
| `reason` | 현재 오류 자체의 치환 완료 문구. 코드 접두사·경로·hint·하위 원인 제외 |
| `stage` | 던지는 검증 오류의 기본값 3. 단계와 코드 접두사를 혼동하지 않음 |
| `path` | 현재 오류의 입력 경로. 지정하지 않은 wrapper는 원인의 유효한 `path`를 이어받음 |
| `hint` | 현재 오류의 선택적 해결 안내. 원인의 안내는 원인 객체에 보존 |
| `cause` | 감싼 원본 오류 객체. 원본 `stack`은 해당 객체에서 접근 |
| `message` | 현재 오류와 원인 체인을 표시한 문자열. 최종 출력 전환 단계에서 새 형식 적용 |
| `prop` | 전달받은 평탄한 문맥 객체의 own property를 얕게 복사. 원인 prop과 무조건 병합하지 않음 |
| `queue` | 이전 소비자를 위한 독립 배열. 원인 → 현재 오류 순서의 단일 메시지 목록으로 유지하되 원본을 공유하지 않음 |

`cause`가 중첩 관계의 기준이며 `queue`는 호환용 파생 데이터다. 배열을 수정해도 원인이나 다른 오류의 진단이 바뀌지 않아야 한다. `prop`의 복사·독립성 보장은 평탄한 진단 문맥에 한정하고 임의 객체의 깊은 복사는 도입하지 않는다.

`cause`는 일반 프로퍼티로 직접 보존한다. ES2022의 `new Error(message, { cause })` 옵션이 존재한다고 가정하지 않는다. 열거 가능 여부와 직렬화 시 포함 범위는 기존 소비자 확인 후 테스트로 고정한다.

### 4.3 중첩 출력

목표는 **최상위 실패 → 하위 문맥 → 직접 원인** 순서다. 각 노드는 규약의 단일 진단 형식을 사용하며, 두 번째 노드부터 고정된 `Caused by:` 표식을 붙인다.

```text
[Stage 3][EL0130B] Type match failed. (target['name'])
Caused by: [Stage 3][EL01143] Property 'name' does not match the expected type. (target['name'])
Caused by: [Stage 3][EL01102] Type mismatch: expected string, received number. (target['name'])
```

- `reason`과 구조화 필드로 각 행을 만든다. 이미 체인 전체가 들어 있는 하위 `message`를 다시 누적하지 않는다.
- 기존 자유 메시지를 지원하는 호환 경로에서는 코드를 새로 만들지 않고 코드 괄호를 생략한다. 이는 코드 없는 기존 입력에 대한 호환 예외로 규약에 명시한다.
- 일반 `Error`는 원래 이름·메시지를 원인 행에 표시한다. 없는 코드·stage를 임의로 부여하지 않는다.
- 원본 오류의 stack을 문자열로 합치지 않는다. 현재 stack과 원인 객체의 stack을 각각 보존한다.
- 같은 문구나 같은 코드라도 서로 다른 오류 노드이면 보존한다. 문자열 중복 제거로 원인을 없애지 않는다.
- 원인 순회는 반복문으로 처리하고 동일 객체 재방문을 감지해 순환 참조 시 종료한다.
- 깊이에 비례하는 `#`·들여쓰기를 없앤다. 다만 wrap마다 전체 체인을 즉시 만들면 누적 생성 비용이 남으므로 성능 개선 배수를 약속하지 않는다.

이 출력 순서와 접두사는 기존 메시지와 다르다. 카탈로그 교체·결함 수정과 한 번에 배포하지 않고 별도 전환 단계로 검증한다.

### 4.4 생성자와 템플릿

목표 생성자는 코드와 템플릿을 명시적으로 받는다. 기존에는 코드만 받아 공유 카탈로그를 자동 조회했으므로 단순 이름 변경과 생성자 API 이전은 서로 다른 작업이다.

```js
// 기존 내부 호출
new ExtendError(/EL01102/, undefined, ['string', 'number']);

// 목표 내부 호출: 해당 모듈의 error-factory.js가 템플릿을 선택
createError('EL01102', ['string', 'number']);
createError('EL0130B', [], { cause });
```

- 현재 저장소의 내부 `/CODE/` 호출은 소유 모듈의 생성 함수로 명시적으로 이전한다. 기존 `EL...` 코드의 의미는 유지한다.
- 외부의 구 생성자 호출을 지원해야 한다면 소유 카탈로그가 정해진 기존 패키지 경계에서 인자를 변환한다. 그 지원 요구와 제거 시점을 별도로 정하며, 범용 `ContextError`에 특정 모듈 카탈로그를 연결하지 않는다.
- 예전 자유 문자열 첫 인자를 조용히 새 코드로 재해석하지 않는다. 코드 없는 입력의 호환 경로와 새 `(code, template, options)` API를 구분한다.
- 동일 생성자 별칭만으로 구 인자 형태까지 호환된다고 표시하지 않는다. 구 생성자 호환 구현이 필요하면 별도 작업으로 계약·동일성 영향을 검토한다.
- 기존 `$1`, `$2` 치환을 유지한다. `${name}`은 카탈로그·직접 사용 확인 후 필요한 계약을 유지한다.
- `0`, `false`, 빈 문자열을 치환 값으로 인정하고, 미제공 값은 토큰을 유지한다. `null`·생략 인자로 치환기가 실패하지 않아야 한다.
- own-property 조회는 `Object.prototype.hasOwnProperty.call`을 사용한다. `__proto__`, `constructor`, `hasOwnProperty` 같은 키도 상속된 메시지로 조회하지 않는다.
- 누락 코드는 원래 코드를 포함한 대체 문구로 표현한다. 진단 생성 과정에서 별도 오류를 던져 최초 원인을 가리지 않는다. 정적 누락은 카탈로그 검사에서 실패시킨다.

### 4.5 모듈 내부 통합·공개 범위·중복 이름

권장 규칙은 다음과 같다.

1. 각 모듈은 자신의 `error-factory.js`에 코드·템플릿을 통합한다. 기본은 평탄한 표이며, 필요할 때 기능별 파일을 정적 import해 모은다. 런타임 파일 탐색·언어 감지·전역 병합은 하지 않는다.
2. 메시지 표는 가능하면 파일 지역 변수로 유지한다. 내부 생성 함수만 필요한 파일로 export하고, 패키지 루트·배럴·공개 타입 선언에서는 노출하지 않는다. `package.json`의 `exports`에도 메시지 서브패스를 열지 않는다. 현재 저장소에는 `exports`가 없으므로 진입점 구성 단계에서 반영한다.
3. 서로 다른 모듈에서 `message`, `createError`, `error-factory.js` 이름을 반복해서 사용해도 모듈 스코프가 분리되어 충돌하지 않는다. import하는 파일에서 로컬 이름이 겹칠 때만 별칭을 사용한다.
4. 같은 문장이 다른 모듈에 있는 것은 허용한다. 오류 코드의 의미와 대역은 구분한다. 메시지 표가 비공개여도 코드는 오류·로그·외부 소비자에 노출되기 때문이다. 기존 `EL...`는 유지하고 신규 코드는 모듈 접두사 또는 코드 대역을 배정한다.
5. 표 한 개의 중복 키와 기능별 표를 합칠 때의 중복 코드는 검사에서 실패시킨다. 객체 펼침으로 마지막 값이 조용히 앞의 값을 덮어쓰게 두지 않는다.
6. 생성된 오류는 자신의 치환 완료 reason과 원인을 보존한다. 상위 모듈이 하위 카탈로그를 import해 원문을 다시 찾지 않는다.
7. 표의 형태·치환·fallback·진단 필드·표시 규칙은 공통 문서와 검증으로 맞춘다. 카탈로그 비공개 여부와 진단 규약의 공통성은 별개다.

여기서 비공개란 **패키지의 지원 공개 API에 포함하지 않는다는 뜻**이다. 다른 파일에서 사용하려면 내부 ESM export는 필요하다. 파일 간 export까지 완전히 금지하면 모든 호출부를 한 파일로 합쳐야 하므로 권장하지 않는다.

내부 함수의 이름 중복과 오류 클래스의 동일성도 구분한다. 각 패키지가 같은 이름의 `ContextError`·`DiagnosticError`를 복제하면 서로 다른 생성자가 된다. 공통 오류 타입은 가능한 한 같은 구현을 공유하고, 내부 카탈로그와 얇은 도우미만 모듈별로 소유한다.

### 4.6 모듈 전용 오류 클래스 규칙 검토

**모듈에 고유한 오류 타입이 필요한 경우 Error 계열의 전용 클래스를 허용하되, 프로젝트의 공통 진단 부모를 우선한다.** 다음은 코딩 규칙에 반영하기 전의 제안이다.

| 필요 | 기본 선택 |
| --- | --- |
| 코드·문구만 다름 | 새 클래스 없이 `error-factory.js` 항목을 추가하고 기존 오류 타입 사용 |
| 단일 진단에 모듈 고유 분류·추가 데이터·처리가 필요 | `DiagnosticError`를 상속하는 모듈 전용 오류 |
| 템플릿 치환·원인 체인 구성과 모듈 고유 분류가 함께 필요 | `ContextError`를 상속하는 모듈 전용 오류 |
| 원인에 현재 문맥만 추가 | 일반 `ContextError` 사용. 하위 오류를 cause로 보존 |
| 공통 부모 자체의 호환성 구현 | 독립 오류 모듈에서 별도 설계·검증. 각 모듈이 native Error 직접 상속을 반복하지 않음 |

- `Error` 직접 상속을 기본 규칙으로 추가하지 않는다. 현재 코딩 규칙은 신규 내장 클래스 직접 상속을 제한한다. 공통 사용자 정의 오류를 통한 간접 상속으로 Error 계열과 진단 계약을 함께 유지한다.
- 클래스 추가의 근거는 호출자의 구분·복구 방식 또는 추가 데이터·동작이다. 모듈마다 의무적으로 하나씩 만들거나 코드 하나마다 클래스를 만들지 않는다.
- 전용 오류도 `code`, `reason`, `stage`, `path`, `hint`, `cause`의 의미를 보존한다. 모듈 고유 필드는 공통 필드를 다른 의미로 덮어쓰지 않으며, `name`은 실제 오류 타입을 나타낸다.
- 하위 오류의 이름이나 message만 복사하지 않고 원본 cause를 보존한다. 상위에서 감쌀 때도 하위 진단의 code와 reason을 변경하지 않는다.
- 생성자·오류 동작은 클래스에 두고 메시지 문구는 해당 모듈의 `error-factory.js`가 소유한다. 메시지 도우미가 필요한 전용 타입을 선택하며, 전용 클래스가 다시 그 도우미를 import하는 순환 의존은 만들지 않는다.
- 상위 코드가 특정 전용 클래스로 분기해야 한다면 해당 오류 타입은 명시적인 공개 계약으로 export한다. 전용 클래스가 비공개라면 상위 소비자는 공통 진단 필드와 code로 처리한다. 내부 클래스의 이름 문자열을 비교하게 하지 않는다.
- 서로 다른 모듈의 비공개 클래스명은 같아도 문법상 충돌하지 않지만 같은 타입은 아니다. 공개 오류 타입은 역할이 드러나는 이름을 사용한다.
- 기본 부모 선택과 별개로 현재 모듈 계층을 지킨다. 저수준 모듈이 공통 오류를 사용하기 위해 `logic-assembly` 같은 상위 패키지에 역의존하지 않도록 공통 구현 위치를 먼저 정한다.

모듈별로 native `Error`를 직접 상속하면 각 구현이 진단 필드·cause·치환·표시를 따로 유지해야 하며 공통 부모로 처리하기 어려워진다. 전용 타입을 허용하는 목적은 모듈의 오류 의미를 분류하는 데 두고, 진단 규칙의 구현은 공통 부모에 모으는 편이 적합하다.

## 5. 호환성 검토

| 대상 | 판단 | 처리 |
| --- | --- | --- |
| 기존 `/EL.../` 생성자 | 새 생성자와 인자가 다름 | 내부 호출은 모듈의 생성 함수로 이전. 외부 호환 요구는 소유 패키지 경계에서 따로 처리 |
| 자유 메시지·두 번째 prop 인자 | 별도 이전 필요 | 예전 자유 메시지를 새 코드로 조용히 재해석하지 않고, 기존 prop의 경로·문맥을 새 options로 변환 |
| 기존 `EL...` 식별자 | 유지 권장 | `E_TYPE_*`로 일괄 개명하지 않음. 문자열 검색과 기존 코드 단언 보존 |
| `Message` 공개 API | 제거에 따른 비호환 | `get`, 등록·언어 API 소비자를 이전. 새 패키지와 기존 core의 변경 범위를 구분 |
| `error-factory.js` 비공개화 | 내부 ESM export와 공개 API를 구분 | 패키지 루트에서 재export하지 않고 공개 서브패스를 만들지 않음 |
| `ExtendError` → `ContextError` | 이름과 생성자 계약을 각각 검증 | 별칭만으로 이전 인자 해석·name·stack까지 유지된다고 보장하지 않음 |
| `queue` | 타입·순서는 유지 가능 | 공유를 끊고 호환 배열로 유지. 메시지 문구까지 같다고 보장하지 않음 |
| `prop` | 결함 수정이지만 관찰 가능 | 저장·복사·원인 보존 정책을 문서화. wrapper prop과 cause prop 구분 |
| `message`, `toString`, stack 첫 줄 | 새 출력에서는 비호환 | 순서·접두사·name·개행·공백을 회귀 항목으로 관리 |
| 진단 구조의 호환 | 필드 정렬로 개선 가능 | 클래스 동일성과는 별개. 코드·경로·사유 보존을 연동 테스트 |
| `instanceof DiagnosticError` | 필드만 맞춰도 호환되지 않음 | 상위 경계의 명시적 변환 또는 구조 기반 판별 필요 |
| 모듈 전용 오류 | 공통 부모 사용 시 진단 규칙 유지 가능 | 같은 부모 구현을 공유하고 실제 배포 환경에서 `instanceof Error`·공통 부모·전용 타입을 검증 |
| 비-throwing 결과 규약 | 자동 적용하지 않음 | 기존 boolean 함수와 타입 판정 동작 유지 |
| ESM/CJS·구형 런타임 | 현 상태에서는 미보증 | 실제 배포 타깃과 산출물 실행 검증을 별도 구성 |

특히 인접 runtime workspace에서 다음 구현을 확인했다.

1. `logic-runtime/src/diagnostics.js`의 `toDiagnosticError`는 Stage 접두사로 입력을 판별하고, 코드 추출은 `E_*`만 인식한다. 새 형식의 `[Stage 3][EL0130B]`를 그대로 넘기면 `E_RUNTIME_LEGACY_STAGE_FAILURE`로 바뀌고 기존 코드 접두사가 사유에 남을 수 있다.
2. `logic-auto-cli/src/ui.js`의 `friendlyError`는 `instanceof DiagnosticError`인 경우에만 진단 필드를 전달한다. 기존 `ExtendError`나 필드만 맞춘 `ContextError`는 일반 분기로 들어가 `E_CLI_COMMAND_FAILED`로 처리된다. 공통 부모를 실제로 공유하는 경우와 구조만 맞춘 경우를 구분해 검증한다.
3. 현재 `DiagnosticError` 생성자는 원인 객체를 보존하지만 메시지에 원인 체인을 출력하지 않는다. 이 클래스로 감싼다는 것만으로 중첩 출력 요구가 충족되지는 않는다.

따라서 연동 단계에서는 **상위 경계에서 `error.code`·`reason`·`stage`·`path`·`hint`·`cause`를 먼저 읽도록 바꾸고 문자열 파싱은 과거 오류의 fallback으로 한정**한다. 직접 변환이 필요한 지점은 원본 오류를 cause로 남긴다. 이미 렌더링한 message를 reason으로 재사용하지 않는다.

상위 `DiagnosticError`로 변환한 뒤에도 중첩을 보이려면 그 표시 경계 역시 cause 체인을 렌더링해야 한다. CLI가 계속 최상위 `DiagnosticError.message`만 출력하면 현재 구현에서는 원인이 숨겨진다. 코드 보존과 체인 표시를 별도 연동 검증으로 다룬다.

이 외부 패키지 수정은 현재 저장소의 구현 범위를 넘어선다. 계획에는 선행 조건으로 기록하며, 여기서 그 파일들을 변경하지 않는다. 기존 소비자가 있는 패키지의 API 삭제와 출력 전환을 호환성이 유지되는 변경이라고 표시하지 않는다.

## 6. 단계별 실행 계획

### 1단계 — 기준선과 카탈로그 준비

- `type.js`의 실제 코드 참조·치환 인자와 원본 카탈로그의 키·토큰을 대조한다.
- 초기에는 사용 중인 84개 고유 코드를 기준으로 준비하되, 외부에서 직접 생성하는 코드가 있다면 포함 범위를 추가한다. 검색에 없다는 이유만으로 공개 코드를 삭제하지 않는다.
- 현재 `src/error-messages.js`를 대조해 `error-factory.js`의 내부 카탈로그를 준비하고 구분선 데이터는 주석으로 옮긴다. 데이터 통합 후 기존 파일 제거 여부는 참조 확인으로 결정한다.
- `ContextError`와 `DiagnosticError` 공통 구현의 위치를 정한다. 모듈별 메시지 소유권과 공통 오류 의존 방향을 고정한다.
- ESM 실행·공개 진입점과 테스트 실행 환경을 구성한다. 현재 `npm test`는 검증 수단이 아님을 명시한다.
- 기존 출력·생성자·타입 판정 사례를 기준선으로 확보한다. 현재 import 실패와 기존 결함은 별도 기록한다.

완료 기준: 카탈로그 키·placeholder 검사와 단일 오류 생성이 독립적으로 실행된다.

### 2단계 — 내부 error-factory.js와 ContextError 연결

- `src/error-factory.js`에서 기존 `Message` 클래스·다국어·전역 병합을 제거하고 모듈의 표와 얇은 생성 함수로 바꾼다.
- `context-error.js`는 `(code, template, options)`를 받도록 설계하고 치환·원인 체인 기능을 담당하게 한다. 모듈의 카탈로그를 import하지 않는다.
- `type.js`의 내부 호출은 자신의 `error-factory.js` 생성 함수로 이전한다. 기존 코드·치환 값·원인·문맥을 빠뜨리지 않는다.
- `ContextError` 이름과 필요한 기존 export 별칭을 적용하되, 구 생성자 시그니처 호환이 자동 확보됐다고 표시하지 않는다.
- 공개 진입점·서브패스·타입 선언에서 메시지 표와 내부 도우미를 노출하지 않는다.
- wrapper·loader·locale·Rollup alias는 현재 저장소에 없으므로 삭제했다고 기록하지 않는다. 기존 core에서 이전할 때 해당 파일과 설정을 따로 정리한다.

완료 기준: 코드 경로에 언어 감지·JSON I/O·비동기 준비가 없고 기존 내부 오류의 코드·치환·원인이 새 호출 경로에서도 보존된다. 메시지 도우미는 공개 API에 없다.

### 3단계 — 원인 객체와 구조화 필드

- `cause`, `code`, `reason`, `stage`, `path`, 선택적 `hint`를 저장한다.
- `prop`을 보존하고 `queue` 공유를 제거한다. 원본 오류와 문맥 객체를 수정하지 않는다.
- 기존 `prop['error path']`를 `path`로 연결하고 wrapper의 경로 전달 규칙을 적용한다.
- 타입 판정 동작은 유지하고 생성자 호출 이전에 따른 차이를 별도 검증한다. 출력 전환은 다음 단계까지 분리한다.

완료 기준: 같은 원인을 A/B로 감싸도 원본과 두 체인이 서로 오염되지 않고 원본 stack에 접근할 수 있다.

### 4단계 — type.js의 진단 누락 보완

- 일반 객체 키·배열 원소·함수 인자/반환 경로를 전달한다. match의 값 경로는 `target`, allow의 비교 대상 경로는 `tarType`, 잘못된 타입 선언 자체는 `extType`으로 구분한다.
- 배열 경로에는 실제 검사 중인 인덱스를 넣고 키의 따옴표·대괄호를 일관되게 표현한다.
- 반환 검사처럼 catch한 오류를 버리는 wrap을 수정한다.
- 후보가 전부 실패했을 때는 선언 순서상 마지막에 발생한 검사 오류를 대표 cause로 보존한다. 모든 후보를 유일한 인과관계처럼 이어 붙이지 않는다. 예외가 생성되지 않은 literal 실패는 상위 코드·경로로 표현한다.
- 후보 하나가 성공하면 이전 후보의 진단은 최종 성공 결과에 노출하지 않는다.
- 일반 사용자 예외를 후보 실패로 소비하는 기존 정책의 변경, 기본값 주입의 상태 오염, 후보 탐색 성능 최적화는 별도 작업으로 분리한다.

완료 기준: 중첩 객체·배열 실패의 실제 경로와 대표 원인이 보이며 성공/실패 판정과 boolean 반환 계약이 유지된다.

### 5단계 — 진단 규약·출력·소비자 전환

- `error-diagnostics.md`에 원문 reason, 기존 코드 대역, 저수준 오류 타입과 원인 체인 표시 규칙을 보완한다.
- 검토 후 모듈 내부 `error-factory.js`·코드 대역·전용 오류 부모 선택 규칙을 코딩 규칙에 반영한다. 기존 native Error 직접 상속 제한은 임의로 완화하지 않는다.
- 외부 runtime·CLI의 코드 추출·클래스 판별을 구조화 필드 우선으로 이전한다.
- 상위 오류로 변환하는 경로의 최종 표시에도 체인 렌더링 규칙을 적용한다. 중간 클래스가 달라져도 원인이 숨겨지거나 접두사가 중복되지 않아야 한다.
- 준비된 소비자와 함께 새 Stage 형식·최상위 우선 출력·name 정합성을 적용한다.
- 출력 의존 테스트·문서·타입 선언이 있는 패키지를 갱신하고 API 제거와 포맷 변경을 릴리스 변경 사항에 기록한다.

완료 기준: 기존 `EL...` 코드와 원인이 runtime·CLI 경계에서 손실되지 않고, 메시지만 출력하는 소비자도 중첩 내용을 볼 수 있다.

## 7. 검증 항목과 작업 경계

| 검증 | 확인할 내용 |
| --- | --- |
| 카탈로그 | 실제 코드 누락, 문자열 값, placeholder 번호·이름·인자 일치 |
| 모듈 내부 통합 | 표 내부·기능별 통합의 중복 코드 거부, 공개 export·서브패스 미노출, 전역 저장소·역방향 import 없음 |
| 치환 | `$1/$10`, `0/false/빈 문자열`, 생략·null, 필요한 named token, 특수 키 |
| 원인 독립성 | 같은 원인을 감싼 A/B의 queue·prop·message가 서로 바뀌지 않음 |
| 오류 구조 | 최상위와 하위 code·reason·path 유지, 원본 cause 동일성, 원본 stack 접근 |
| 타입 진단 | 중첩 객체, 배열 인덱스, 함수 반환 검사, 후보 전부 실패·후보 성공 |
| 출력 | 단일 Stage 행, 원인 순서, 접두사 중복 없음, 일반 Error, 순환 cause 종료 |
| 호출 이전 | 기존 RegExp·자유 문자열·prop 입력의 새 생성 함수 변환, 별칭과 인자 호환의 구분, boolean 반환 유지 |
| 오류 계층 | `ContextError`와 모듈 전용 오류의 Error 계열 판별, 공통 필드·cause 보존, 공개·비공개 타입 분기 |
| 외부 연동 | runtime 변환 후 `EL...` 유지, CLI에서 일반 오류 코드로 바뀌지 않음, path·hint·cause 보존 |
| 배포 | import 직후 동작, LANG과 무관한 출력, 명시한 모듈 형식·최소 런타임 실행 |

작성·수정 코드는 ES2020을 상한으로 하고 클래스 필드는 생성자 대입, static 상태는 클래스 뒤 대입으로 작성한다. 네이티브 cause 옵션·최상위 await·새 내장 클래스 직접 상속을 도입하지 않는다. 기존 `extends Error`의 호환성은 현존 계약으로 검증하며, 레거시 상속 재설계와 모듈 분리는 별도 범위다. 빌드 성공만으로 IE8 호환을 주장하지 않는다.

이번 계획에 따른 구현 범위는 메시지 저장·오류 보존·진단 전달이다. 타입 검사 알고리즘 전면 재작성, 인터페이스 삭제, Result API 일괄 도입, 전체 코드명 변경, 다중 패키지용 전역 메시지 등록 시스템은 포함하지 않는다.

## 8. 검토 근거

- 현재 저장소: `src/error-factory.js`, `src/error-messages.js`, `src/context-error.js`, `src/type.js`, `package.json`.
- [오류 구조 재검토](EXTEND-ERROR-REVIEW_재검토.ko.md): queue 공유, prop 소실, 경로와 성능 주장 보완.
- [메시지 설계 재검토](MESSAGE-I18N-REVIEW_재검토.ko.md): placeholder 안전성, 공개 API 제거의 호환성.
- [원본 카탈로그 후보](/Volumes/SSD/PJ-Git/logic-core/src/locales/default.js), [기존 오류 테스트](/Volumes/SSD/PJ-Git/logic-core/test/extend-error.test.js), [기존 타입 선언](/Volumes/SSD/PJ-Git/logic-core/types/extend-error.d.ts).
- [DiagnosticError 구현](/Volumes/SSD/PJ-Git/logic-runtime-workspace/packages/logic-assembly/src/diagnostic-error.js), [assembly 의존성](/Volumes/SSD/PJ-Git/logic-runtime-workspace/packages/logic-assembly/package.json).
- [runtime 변환기](/Volumes/SSD/PJ-Git/logic-runtime-workspace/packages/logic-runtime/src/diagnostics.js:21), [CLI 오류 분기](/Volumes/SSD/PJ-Git/logic-runtime-workspace/packages/logic-auto-cli/src/ui.js:215).

외부 구현은 작성 시점 로컬 파일을 읽어 비교했다. 해당 패키지의 테스트 실행이나 전체 소비자 호환성 검증을 완료했다는 의미는 아니다.

## 9. 구현 결과 — 2026-10-21

### 적용한 변경

- `src/context-error.js`: 공통 `DiagnosticError`와 이를 상속한 `ContextError`를 구현했다. 카탈로그 의존은 없다. 기본 진단 데이터, `$1`·`${name}` 치환, 최상위 문맥부터의 원인 체인 표시, 순환 원인 종료를 지원한다.
- 공통 기반은 `Error.prototype` 연결과 stack 캡처를 조합하는 함수 생성자로 작성했다. `ContextError`와 모듈 전용 클래스는 사용자 정의 부모를 상속한다. 새 네이티브 Error 직접 상속과 네이티브 cause 옵션은 추가하지 않았다.
- `cause`는 원본 객체를 보존하며, `message`와 함께 열거하지 않는 프로퍼티로 저장한다. `reason`은 자신의 사유만 가진다. `prop`은 own property를 얕게 복사하고 `queue`는 독립된 호환 배열로 만든다.
- `src/error-messages.js`: 기존 문구를 유지한 단일 언어 데이터로 정리했다. 구분선은 주석으로 옮기고 언어 표식 `EN`은 제거했다. 표는 수정하지 않도록 freeze했다.
- `src/error-factory.js`: 카탈로그 조회 `getMessage`와 내부 생성 함수 `createError`로 바꿨다. 기존 Message 클래스·언어 상태·자동 감지·로더·전역 병합은 제거했다. 두 함수는 내부 파일용 export이며 패키지 루트의 공개 API로 추가하지 않았다.
- `src/type.js`: 실행 연결을 위해 기존 생성자 호출 93곳을 내부 `createError(code, values, options)`로 이전했다. 코드 84종과 치환 값·기존 cause/prop 전달을 유지했다. 타입 검사 알고리즘은 변경하지 않았다.
- `package.json`: 기존 ESM 소스에 맞춰 `type: module`을 지정하고 `npm test`를 Node 기본 테스트 실행기로 연결했다. 테스트 3개 파일을 추가했다.

### 호출 방식과 호환성

```js
// 각 모듈 내부에서 자신의 카탈로그를 사용
import { createError } from './error-factory.js';

throw createError('EL01102', ['string', 'number'], {
    path: 'target.name',
    cause
});
```

```js
// 다른 모듈의 카탈로그에 묶이지 않는 공통 오류 생성
import { ContextError, DiagnosticError } from './context-error.js';

const cause = new DiagnosticError('E_SOURCE', 'Source failed.');
throw new ContextError('E_OPERATION', 'Operation $1 failed.', {
    values: ['save'],
    cause
});
```

기존 default export와 named `ExtendError`는 모두 `ContextError`와 동일한 생성자를 가리킨다. **이름·생성자 동일성 호환이며 예전 `/CODE/, causeOrProp, values` 인자 해석은 제공하지 않는다.** 저장소 내부 호출은 이전했으며, 외부 구 호출이 있다면 위 방식으로 바꿔야 한다. `Message`의 기존 공개 API와 출력 순서·접두사·name도 변경됐다.

### 검증과 남은 범위

- Node 22.16.0에서 `npm test`: 22개 통과. 치환·특수 키·문맥 독립성·원인 객체·외부 구조 진단·순환 cause·모듈 전용 상속·stack 대체 경로·Type 연동을 확인했다.
- Acorn의 `ecmaVersion: 2020`으로 수정한 4개 소스 파일을 파싱했다. 새 오류·메시지 소스에는 금지된 BigInt·Proxy·후방 탐색·내장 클래스 직접 상속이 없는지 AST로 추가 확인했다.
- 작업 전 데이터와 대조해 실제 호출 93곳의 코드 순서, 유지한 메시지의 원문, 타입 검사 알고리즘의 불변을 확인했다. 빌드·구형 브라우저 실행 검증은 하지 않았다.
- `type.js`의 기존 `extType` 경로 표기, 배열 인덱스 전달, 후보 원인 선택, 반환 검사에서 원인을 버리는 지점은 이번 최소 호출 이전에 포함하지 않았다. §6의 4단계 작업으로 남는다.
- 기존 assembly/runtime/CLI와 이 저장소의 `DiagnosticError`는 아직 같은 배포 생성자를 공유하지 않는다. 외부 소비자 이전, 공통 패키지 분리, 공개 진입점·서브패스 정책과 레거시 산출물 검증은 후속 범위다.

### 파일명 정리

- `locales-msg.js` → `error-messages.js`: 단일 언어의 오류 코드·템플릿 데이터.
- `message.js` → `error-factory.js`: 내부 메시지 조회와 오류 생성 함수.
- `extend-error.js` → `context-error.js`: 기본 export인 `ContextError`에 맞춘 파일명. named `ExtendError` 별칭은 유지한다.
- 내부 import·테스트·현재 설계 지침의 경로를 갱신했다. 과거 logic-core 검토와 구현 전 기준선의 경로는 당시 상태를 설명하므로 유지한다.
