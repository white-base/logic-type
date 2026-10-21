# JavaScript 코딩 규칙

> 결정일: 2026-10-21 (Asia/Seoul)  
> 상태: 사용자와 합의한 작성 기준. 기존 소스 전환과 ESLint/Babel 설정 반영은 별도 작업이다.  
> 기준: **ES2020 + 레거시 호환성을 위한 기능 제한**

## 1. 적용 범위와 필수 기준

코어 JavaScript 소스의 작성 문법은 ES2020으로 고정한다. 새 코드와 수정하는 코드는 이 기준을 따르며, ES2021 이상 문법이나 실험 문법을 추가하지 않는다. 언어 기준을 `latest` 또는 `ESNext`로 바꾸지 않는다.

`src/type.js`, `src/context-error.js`, `src/error-factory.js`는 독립 모듈로 분리할 예정이므로 이번 검토 및 코어 문법 일괄 전환 범위에서 제외한다. 분리 모듈의 작성 기준은 해당 작업에서 따로 정한다. 이 제외가 해당 파일의 명시적인 버그 수정 요청까지 막는 것은 아니다.

기존 JavaScript 인터페이스(`src/i-*.js`)는 제거할 계획이다. 기존 인터페이스의 ES2022 문법을 유지하기 위해 코어의 언어 기준을 올리거나 새 인터페이스 계층을 추가하지 않는다. 기존 파일 삭제와 구현·타입 선언·공개 export·테스트의 의존 정리는 별도 구현 작업에서 처리한다.

## 2. ES2020을 강제하는 이유

1. **ES5 방식의 작성 비용을 줄인다.** 구형 브라우저 때문에 IIFE, 함수 생성자, 수동 prototype 연결, `arguments` 변환을 반복하면 코드가 복잡해진다. `const`·`let`, 구조 분해, rest/spread, 템플릿 문자열, `class`·`extends`, `?.`, `??` 등 ES2020까지의 기능으로 가독성과 유지보수성을 개선한다.
2. **소스 작성 기준과 배포 환경을 분리한다.** 개발자는 고정된 ES2020 규칙으로 작성하고, 배포 환경에 맞춘 문법 변환은 Rollup에 연결한 Babel이 담당한다. 런타임 API는 별도의 폴리필 또는 대체 구현 정책으로 관리한다.
3. **현재 필요한 객체 모델을 ES2020으로 표현할 수 있다.** 인스턴스 필드는 생성자에서, static 필드는 클래스 선언 뒤에서 대입한다. 인터페이스 제거 계획까지 고려하면 클래스 필드를 사용하기 위해 ES2022를 채택할 필요가 없다.
4. **클래스 필드와 private 기능의 추가 변환을 피한다.** Babel은 ES2022 클래스 필드도 변환할 수 있지만, 설정에 따라 필드 정의 helper나 `Object.defineProperty`가 추가된다. private 변환에는 `WeakMap`·`WeakSet`과 helper가 필요할 수 있다. 생성자 대입과 일반 프로퍼티로 충분한 곳에서는 이런 변환 및 런타임 의존을 추가하지 않는다. 실제 출력 크기와 비용은 사용 기능·타깃·설정에 따라 달라지며, ES2020이라는 이름만으로 더 작은 번들을 보장하지는 않는다. [클래스 필드 변환](https://babeljs.io/docs/babel-plugin-transform-class-properties), [private 변환](https://babeljs.io/docs/babel-plugin-transform-private-methods)
5. **업데이트로 허용 문법이 바뀌는 일을 막는다.** 작성 기준을 연도로 고정하면 도구를 업데이트해도 소스의 허용 범위가 자동 확대되지 않는다. 기준 상향은 호환성 요구와 실제 필요를 확인한 별도 결정으로 다룬다.

ES2020은 작성 문법의 상한이다. ES2020에 포함된 모든 기능을 구형 브라우저에서 재현할 수 있다는 의미는 아니므로 아래 제한을 함께 적용한다.

## 3. 허용하는 작성 방식

| 항목 | 규칙 |
| --- | --- |
| 변수 | `const`를 기본으로 쓰고 재할당할 때 `let`을 쓴다. 레거시 출력 때문에 새 소스에 `var`를 쓰지 않는다. |
| 모듈 | 정적 `import`/`export`를 사용한다. 모듈 범위로 충분한 IIFE는 제거할 수 있다. |
| 함수 | 일반 함수, 화살표 함수, 기본 매개변수, rest 매개변수, 구조 분해, 템플릿 문자열을 사용할 수 있다. |
| 간결한 표현 | `?.`, `??`, 객체 축약 표기와 rest/spread를 사용할 수 있다. `||`와 `??`는 falsy 값 처리 의미가 다르므로 기계적으로 치환하지 않는다. |
| 클래스 | `class`, 사용자 정의 클래스 간 `extends`, 일반 메서드, static 메서드, getter/setter 문법을 사용할 수 있다. IE8 지원 여부는 별도다. |
| 인스턴스 상태 | 생성자 안에서 `this.name = value`로 초기화한다. |
| static 상태 | 클래스 선언 뒤 `ClassName.name = value`로 지정한다. static 메서드는 클래스 안에 작성할 수 있다. |
| 내부 상태 | 기존 `_`·`$` 프로퍼티 계약을 유지한다. 접두사는 실제 접근 제한이 아니다. 실제 은닉이 필요한 곳에만 클로저를 사용한다. |

허용 예:

```js
class Item {
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }

    static create(name) {
        return new Item(name);
    }
}

Item._NS = 'Meta';
Item._PARAMS = ['name'];
```

필드 선언을 대입으로 바꾸면 상속받은 setter 호출 여부 등 의미가 달라질 수 있다. 기존 `Object.defineProperty`의 검증, own property 여부, `enumerable`·`configurable`·`writable` 계약은 확인 후 유지한다. 콜백의 동적인 `this`가 필요한 일반 함수를 화살표 함수로 일괄 변경하지 않는다.

## 4. ES2020 이하 기능 중 금지하는 항목

아래 항목은 레거시와 공유하는 코어 코드에 새로 도입하지 않는다. 특정 환경 전용 구현이 필요하면 코어와 분리된 진입점에서 지원 환경과 의존성을 명시한다. 코어 사용을 허용하려면 이 정책을 별도로 변경해야 한다.

| 항목 | 금지 범위 | 이유와 대안 |
| --- | --- | --- |
| `BigInt` | `1n` 같은 리터럴, `BigInt()` 변환, BigInt 연산, `BigInt64Array`·`BigUint64Array` 의존 | Babel의 BigInt 플러그인은 파싱만 지원하며 BigInt 연산을 구형 표현으로 변환하지 않는다. 큰 정수 식별자는 문자열로 유지하고, 연산이 필요하면 임의 정밀도 구현을 별도로 검토한다. `Number`로 바꿔 정밀도를 잃는 우회는 하지 않는다. [Babel 설명](https://babeljs.io/docs/babel-plugin-syntax-bigint) |
| `Proxy` | `new Proxy()`, `Proxy.revocable()`에 의존하는 객체 모델 | 제한적인 폴리필로 임의 프로퍼티 추가·삭제와 모든 trap을 동일하게 재현할 수 없다. 명시적 메서드나 필요한 프로퍼티의 descriptor로 구현한다. [Proxy 폴리필의 제한](https://github.com/GoogleChrome/proxy-polyfill#readme) |
| 정규식 후방 탐색 | `(?<=...)`, `(?<!...)` | 기존 정규식 문법으로 변환할 수 없는 기능이다. 캡처 그룹과 후처리 등으로 표현한다. 리터럴을 `new RegExp()` 문자열로 옮겨도 구형 엔진의 실행 문제는 해결되지 않는다. [regexpu-core의 제한](https://github.com/mathiasbynens/regexpu-core#caveats) |
| 내장 클래스 직접 상속 | `class ... extends Array`, `Error`, `Map` 등 | Babel의 내장 클래스 상속 변환에는 구형 IE 지원 한계가 있다. 코어에서는 조합과 사용자 정의 클래스 상속을 사용한다. 별도 분리 대상인 기존 오류 클래스의 재설계는 이번 규칙 적용과 분리한다. [Babel의 내장 클래스 상속 제약](https://babeljs.io/docs/babel-plugin-transform-classes#caveats) |

호환성 어댑터에서 `typeof BigInt !== 'undefined'`처럼 기능 존재만 확인하는 방어 코드는 허용할 수 있다. 이는 BigInt 값 생성이나 연산을 허용하는 예외가 아니다. 미지원 전역을 `value === BigInt`처럼 직접 참조하면 `ReferenceError`가 발생할 수 있으므로 사용하지 않는다. 지원되지 않는 문법은 실행하지 않는 분기에 있어도 파싱 오류를 일으킬 수 있다.

## 5. 폴리필·변환 검증 후 사용하는 항목

아래 항목은 일괄 금지하지 않는다. 새 의존을 추가할 때 목표 환경, 변환 결과, 폴리필 제공 주체를 확인하고 기록한다.

| 항목 | 사용 조건 |
| --- | --- |
| `Promise`, `async/await` | 비동기 처리가 필요한 곳에 사용한다. 목표 환경에 맞는 문법 변환과 Promise·필요 런타임 제공을 확인한다. 동기 API를 불필요하게 비동기로 바꾸지 않는다. |
| generator, async generator, `for await...of` | 필요한 경우에만 사용하고 변환 helper, iterator, Promise 등 런타임 의존을 확인한다. 단순 배열 순회에 불필요하게 도입하지 않는다. |
| `Symbol`, `Map`, `Set`, `WeakMap`, `WeakSet`, `Reflect` | 사용 메서드별 지원과 폴리필 한계를 확인한다. 네이티브 Symbol primitive나 weak reference의 GC 의미가 폴리필에서도 동일하다고 가정하지 않는다. |
| `for...of`, iterable 구조 분해·spread | 임의 iterable은 iterator 지원을 확인한다. 배열이라고 가정하는 변환 옵션을 모든 iterable에 적용하지 않는다. |
| `globalThis`, `Object.assign`, `Object.entries`, `Object.fromEntries`, `Array.from`, `.includes()`, `.flat()`, `.flatMap()`, `String.matchAll`, `Promise.allSettled` 등 | ES2020 이하 API라도 문법 변환만으로 제공되지 않는다. 지원 환경에 맞는 폴리필 또는 대체 구현을 확인한다. |
| 동적 `import()` | 환경별 로더·별도 진입점에서 필요할 때 사용한다. 레거시 산출물에 원래 문법이 남지 않는지 검사하고, Node 전용 로딩 코드가 브라우저 경로에 섞이지 않도록 한다. |
| `import.meta` | 환경별 진입점에서 사용한다. ESM/CJS/UMD 각각의 치환 결과와 URL·경로 의미를 확인한다. |
| 정규식 named group, Unicode 속성 이스케이프, `s`·`u` 플래그 등 | 정규식 리터럴의 변환 지원과 helper를 확인한다. Babel의 리터럴 변환이 동적으로 구성한 `new RegExp()` 문자열까지 바꾸지는 않는다. |
| `fetch`, `URL`, `Intl`, DOM·Node 전용 API | ECMAScript 문법 기준과 별도인 환경 API다. 어댑터·환경별 진입점에서 제공 여부를 관리하고 공통 코어가 무조건 존재한다고 가정하지 않는다. |

폴리필은 소비 애플리케이션이 제공할지, 별도 호환 진입점이 제공할지 명시한다. 라이브러리의 기본 진입점에서 알리지 않은 전역 폴리필을 추가하지 않는다. [Babel의 런타임 요구 사항](https://babeljs.io/docs/caveats#polyfills), [정규식 변환 범위](https://babeljs.io/docs/babel-plugin-transform-unicode-property-regex)

## 6. ES2020을 넘는 문법과 API

다음 문법은 사용하지 않는다.

- public/private 인스턴스 필드와 static 필드, `#private` 메서드·접근자, static 초기화 블록, `#name in object`.
- 최상위 `await`. 초기화가 필요하면 명시적인 비동기 초기화 함수 또는 `ready` Promise를 제공하고 진입점별 완료 시점을 일치시킨다.
- 논리 대입 연산자 `&&=`, `||=`, `??=`, 숫자 구분자(`1_000`) 등 ES2021 이상 문법.
- 데코레이터 등 ES2020에 포함되지 않은 제안·실험 문법.

`Object.hasOwn()`, `.at()`, `Error`의 `cause` 옵션 같은 ES2020 이후 API도 기본 가용 API로 가정하지 않는다. 메서드나 옵션 호출은 ES2020 파서에 통과할 수 있으므로, 도입하려면 별도 호환성 검토와 정책 변경이 필요하다.

## 7. 배포 호환성과 기존 코드 전환

| 책임 | 관리 방식 |
| --- | --- |
| 소스의 허용 문법 | 이 문서와 ESLint의 ES2020 기준 |
| 모듈 결합·ESM/CJS/UMD 출력 | Rollup |
| 목표 환경에 맞춘 문법 변환 | Babel의 명시적인 `targets` |
| 내장·환경 API | 폴리필 또는 대체 구현 정책 |
| 지원 보증 | 산출물 문법 검사와 목표 환경 실행 검증 |

Rollup의 `output.generatedCode: 'es5'`는 Rollup이 만드는 wrapper/helper의 문법만 제어한다. 소스 전체를 ES5로 변환하는 설정이 아니다. [Rollup 공식 설명](https://rollupjs.org/configuration-options/#output-generatedcode)

ES2020 채택은 IE8 지원을 보장하지 않는다. 현재 컬렉션과 메타 객체는 일반 객체의 getter/setter 및 `Object.defineProperty`에 의존하며, IE8은 일반 객체 접근자를 동일하게 제공하지 못한다. IE8을 지원 대상으로 유지하려면 이 구조의 처리 방안과 실제 검증을 별도로 정한다. Babel 설정만으로 해결됐다고 기록하지 않는다. [Babel의 IE8 제약](https://babeljs.io/docs/caveats#internet-explorer)

기존 코드 전환 시 다음 사항을 확인한다.

- 공개 함수 생성자를 네이티브 `class`로 바꾸면 기존 `Parent.call(this)` 방식 상속이 깨질 수 있다. 내부 코드뿐 아니라 외부 확장 계약도 확인한다.
- descriptor, 콜백의 `this`, 이벤트 취소, 직렬화 결과를 보존한다. 생성자 이름을 사용하는 현재 직렬화에서는 압축본의 이름 보존 정책도 확인한다.
- 현재 `src/i-*.js`에는 static 필드가 있고 `src/message-wrap.js`에는 최상위 `await`가 남아 있다. 현재 소스 전체가 ES2020을 준수한다고 표시하지 않는다.
- 현재 `src/meta-registry.js`에는 `Symbol`·`BigInt` 전역 직접 비교가 남아 있다. 신규 코드의 모범으로 복사하지 않고, 후속 전환에서 미지원 환경의 참조 오류와 정책에 맞는 처리 방안을 정한다.
- 문법 기준 변경, 인터페이스 제거, 독립 모듈 분리를 한 번의 기계적인 치환으로 처리하지 않는다.

## 8. 도구 반영 기준과 현재 상태

이 문서와 루트 `AGENTS.md`가 향후 작업의 기준이다. 과거 `doscs/` 검토의 ES2020·ES2022 제안이나 현재 소스에 남아 있는 문법을 근거로 이 결정을 임의 변경하지 않는다.

자동 검사와 빌드 설정을 반영할 때는 다음 기준을 적용한다.

- ESLint의 `ecmaVersion`은 `2020`으로 고정한다. `.js`의 ESM과 `.cjs`의 CommonJS 모드는 구분한다.
- ES2020 파서도 BigInt 문법을 허용하므로 별도 제한 규칙이 필요하다. BigInt 리터럴·전역 사용, `Proxy`, 정규식 후방 탐색 등은 AST·정규식 검사나 적합한 lint 규칙으로 검증한다.
- ESLint의 문법 버전만으로 내장 메서드와 환경 API의 지원을 검증했다고 간주하지 않는다.
- Babel에는 실제 지원할 브라우저·Node 타깃을 명시한다. 테스트용 현재 Node 설정을 브라우저 지원 정책으로 사용하지 않는다.
- 배포 산출물은 각 모듈 형식과 목표 문법으로 파싱하고, 필요한 기능을 최소 지원 환경에서 실행한다. ES5 파싱 통과만으로 IE8 런타임 지원을 단정하지 않는다.
- TypeScript `target`을 맞추더라도 `noEmit` 상태의 설정은 실제 배포 JavaScript를 변환하지 않는다는 점을 구분한다.

2026-10-21 기록 작업에서는 문서와 참조 지침만 반영했다. 소스, ESLint/Babel/Rollup 설정, 인터페이스 및 독립 모듈 분리 구현은 변경하지 않았다.
