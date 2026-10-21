# type.js 명세·분리 설계 재검토

> 재검토일: 2026-10-14  
> 원본: [TYPE-SPEC.ko.md](TYPE-SPEC.ko.md)  
> 기준: Git `d96dbab`, 소스 직접 실행 및 기존 type 테스트 6파일 확인

## 1. 결론

값 검사와 타입 관계 검사를 구별하고 정규화·오류·인터페이스 관례를 모듈 경계로 분리하자는 방향은 타당하다. 그러나 **"현재 구현 명세"에 실행되지 않는 예제와 JSON 왕복 보장이 섞여 있다.** "관례 몇 줄만 역전하면 낮은 난이도로 100% 보존"이라는 분리 평가는 계약 검증을 생략하고 있어 수정한다.

분리 전에 이 문서를 관찰된 동작과 앞으로 원하는 계약으로 나눠야 한다. 결함을 고치는 일과 현 동작을 보존하는 일을 같은 단계의 완료 조건으로 사용할 수 없다.

## 2. 개념·수량·분류 정정

| 원본 설명 | 재검토 의견 |
| --- | --- |
| `$type` 11종 | leaf 9 + 복합 5 = 일반 분류 14종. `_hasType`은 테스트 예외용 `etc`까지 허용하므로 허용 코드와 일반 타입 집합도 구분 |
| kind 13종 | array 5개 / choice 8개의 분류별 개수다. 공통 이름이 겹치며 테스트 예외용 `_ETC_`도 존재 |
| `union`이 선택형 union | 이 구현의 union은 모든 선언 속성을 요구하는 구조체다. A\|B 선택 관계는 choice |
| special type을 그대로 통과 | `extendType`은 새 객체에 정해진 필드를 truthy 조건으로 복사. 원본 identity·모든 메타 필드·falsy 보존이 안 됨 |
| `opt=1`이면 반드시 생성 | instanceof/상속 관계로 먼저 성공하면 생성하지 않는 경로도 있음. 구조 비교로 넘어갈 때 생성 가능 |
| Map/Set/Promise는 union | 인스턴스와 생성자를 구분. Promise 등의 생성자 함수는 이름 기반으로 class 분류 가능 |
| allowType은 이론적으로 정확한 치환 관계 | 현재 DSL의 허용 규칙이다. 함수 인자·반환 비교 방향 및 기본값 규칙이 일반 부분타입 이론과 동일하다는 증명은 없음 |

직접 Type을 import하는 소비자 파일은 6개다. type.js 바깥의 직접 호출 표면은 matchType/allowType/deepEqual이지만, 나머지 API도 검사기 내부와 외부 계약에서 사용된다. "직접 소비자 호출이 적음"을 제거 난이도로 바꾸지 않는다.

## 3. 실행 예제에서 바로잡을 내용

### special type은 공통 형식으로 정상 지원되지 않음

| 원문의 예제 또는 주장 | 현재 실행 결과 | 근거 |
| --- | --- | --- |
| `{$type:'union',ref:{a:String}}`에 `{a:'ok'}` match | false / throwing API는 예외 | unionMatch가 `eType.ref[key]` 대신 `extType[key]` 사용 (`type.js:1323`) |
| `{$type:'class',ref:MyClass}`에 인스턴스 match | false | `target instanceof extType`에서 우변이 함수가 아닌 객체 (`type.js:1301`) |
| `{$type:'array',kind:'_SEQ_',list:[String]}`에 `['a']` match | false | 공통 사전검사가 ref 존재를 요구 (`type.js:1073`) |
| special union의 allow는 true, match는 false | 재현 | 버그의 근거는 두 API의 결과 차이 자체보다 각 엔진의 필드 접근 불일치 |

따라서 §4.8은 "현재 지원 예제"가 아니라 구현 불완전 사례로 표시해야 한다. `ref`만 추가하면 모든 special type 문제가 해결되는 것도 아니다.

### 인터페이스 예제의 분기 설명

원문 §7.3의 `Util.implements(FileReader, this, IReader)`는 실제로 **matchType**을 호출한다. `util.js:176`은 전달된 인터페이스 IReader가 아니라 첫 인자 `p_ctor`의 `_KIND === 'interface'` 여부로 분기하기 때문이다. FileReader에 해당 플래그가 없으면 allowType 경로가 아니다. 호출 API를 임시 감싸 기록해 matchType 한 번 호출을 확인했다.

### kind·리터럴의 조건

```js
Type.isMatchType([['_REQ_', undefined]], undefined); // true
Type.isMatchType(1, 2);                              // true
Type.isMatchType([1], [2]);                          // false
```

`_REQ_` choice가 undefined를 무조건 거절한다는 표는 수정해야 한다. 명시적인 undefined 후보는 통과한다. 리터럴도 scalar 위치에서는 타입+기본값이지만 배열 후보·튜플·choice 위치에서는 값 일치 규칙이 적용될 수 있다. "리터럴은 언제나 기본값"으로 일반화하지 않는다.

Object와 빈 객체의 구분은 원문의 실행 예제대로 재현됐다. `isMatchType(Object,{})`는 false, Object와 Date는 true, Map/Set 인스턴스는 union이다. 이 분류를 일반 JS typeof와 혼동하지 않도록 명세에 별도로 설명할 필요가 있다.

## 4. typeObject는 JSON 왕복 계약이 아님

| 사례 | 이번 결과 |
| --- | --- |
| `Type.typeObject({a:String})` 후 JSON 왕복, 다시 match | false |
| `JSON.stringify(Type.typeObject(1n))` | BigInt 직렬화 TypeError |
| `Type.typeObject(fn)` 및 `fn._TYPE.params=[String]` | 원본 params[0]이 String에서 `{$type:'string'}` 객체로 바뀜 |
| `Type.typeObject(SideEffect)` | 생성자 1회 실행 |

union 출력은 `_prop`을 갖지만 정규화·match는 이 표현을 완전하게 읽지 않는다. 역변환 API도 없다. RegExp·Symbol·undefined·함수 참조 등도 별도 표현 규칙 없이 일반 JSON으로 보존되지 않는다.

`typeObject`는 현재 타입 설명용 재귀 전개에 가깝다. 저장·전달·복원 가능한 스키마 포맷으로 제공하려면 버전, 지원 타입, 역변환, 순환 참조, 참조 동일성, 생성자 등록 방식을 별도로 설계해야 한다. 원문의 "JSON 왕복 가능" 강점 평가는 철회한다.

## 5. 구조 문제 판정

| 원본 절 | 판정 | 보완 의견 |
| --- | --- | --- |
| §9.1 단일 파일 7계층 | 유지 | 파일 분해는 도움되지만 단일 파일 자체가 결함 증명은 아님. 책임과 호출 방향부터 고정 |
| §9.2 엔진 통합 | 조건부 | 정규화·경로·진단 공통부는 공유 가능. 값 검사와 타입 허용 규칙은 다르므로 모든 분기를 한 엔진으로 합칠 필요는 없음 |
| §9.3 레지스트리 중복 | 유지 | 타입 목록·kind·`bigi¡nt` 오기 확인. 테스트용 sentinel과 공개 집합도 분리 |
| §9.4 예외 탐색 비용 | 유지 | 후보 실패 후 성공에도 비용 큼. boolean/Result/sentinel 중 선택은 비교 구현으로 판단 |
| §9.5 입력 변경 | 유지·우선순위 상향 | boolean 검사와 **실패한 검사**도 입력을 바꾼다. 후보 탐색의 독립성을 해칠 수 있음 |
| §9.6 함수 파싱 | 유지 | `_TYPE` 우선화는 유용. parsing 실패를 빈 params로 바꾸는 동작 변경 시 기존 API 영향 검토 |
| §9.7 object 분류 | 유지 | 지원 내장 객체·realm·구조체의 경계를 명시해야 함 |
| §9.8 미완성 주석 | 유지보수 의견 | 실행 결함과 분리하여 정리 |
| §9.9 OLD_ENV | 정리 방향 유지 | 테스트로 도달 가능하므로 "현재 실행 불가"와는 구분 |
| §9.10 범용 유틸 이동 | 조건부 | Type과 Util 사이의 새 import 순환을 만들지 않도록 중립 모듈이 더 적절할 수 있음 |

실패 시 변형 예:

```js
const value = {};
Type.isMatchType({role:'user', age:Number}, value); // false
console.log(value); // {role:'user'}
```

`isMatchType`은 단순 조회 함수처럼 보이지만 실패해도 앞서 주입한 기본값을 되돌리지 않는다. 후보별 검사·커스텀 getter·생성자 실행까지 고려하면 객체 원복만으로 순수 검증이 보장되지도 않는다.

## 6. 결합도·분리 설계 평가

"직접 import 1개"는 맞지만 ExtendError는 Message 초기화·카탈로그·오류 포맷에 전이 의존한다. `_UNION`, `super`, `_KIND`, `_TYPE`, 예약 키는 코드 줄 수보다 **의미와 관찰 가능 동작**으로 평가해야 한다. "90%가 ExtendError", "8줄이므로 분리 난이도 낮음"에는 측정 가능한 기준이 없어 수치를 제거한다.

원문의 hooks 예제는 방향 설명으로는 유용하나 다음이 빠져 있다.

- 기본 Error와 ExtendError는 생성자 인자의 의미가 다르다. ErrorClass 주입 하나만으로 코드/prop/queue/cause 형식을 보존할 수 없다. 오류 factory 또는 진단 데이터 계약이 필요하다.
- getTypes를 core에 남기면서 외부 검사기의 class/function 비교가 이를 계속 사용한다면 경계 인터페이스를 명시해야 한다.
- `getAllProperties/deepEqual`을 util로 옮기고 Type이 재수출하려고 Util을 import하면 현재 `Util → Type`과 순환이 생긴다. 독립 object-utils 모듈을 양쪽이 참조하는 안을 먼저 검토한다.
- hooks 도입 뒤 기존 `_KIND`, `_TYPE`, 상속된 `_UNION`, own `super`, 예약 키의 해석 순서를 유지해야 한다.
- ESM/CJS에서 별도 인스턴스가 로드되면 생성자 identity·instanceof·오류 identity·레지스트리 공유를 검증해야 한다.
- 단계 8의 "matchType 4곳 + allowType 1곳"은 Util의 matchType 호출을 누락한다. 현재 matchType 호출 지점은 컬렉션 3 + namespace 1 + Util 1이다.

"core에서 검사기 제거"와 "독립 검사기를 core 의존성으로 계속 사용"은 서로 다른 설계다. 원안의 어댑터는 후자이며, 목표 문구도 그에 맞게 수정해야 한다.

## 7. 권장 순서 수정

1. 기존 6개 type 테스트와 소비자 테스트를 기준선으로 기록하고 special type·falsy·입력 변경·JSON 설명 API의 공백을 추가로 규정한다.
2. 생성자 실행, 기본값 주입, 파싱 fallback을 지원 계약으로 남길지 결정한다. 실패 경로와 오류 정보도 포함한다.
3. 공통 유틸을 중립 모듈로 추출하고 Type facade는 유지한다. 테스트 통과뿐 아니라 import graph와 초기화 순서를 검증한다.
4. 오류 factory 및 metadata hooks를 도입하되 실제 동등성 검증 후 분리 완료를 판단한다.
5. 순수 검증·새 DSL·파싱 opt-in 같은 의미 변경을 별도로 버전화한다. 물리 파일 분해와 묶지 않는다.
6. 독립 패키지 또는 subpath 중 배포 단위를 정하고 ESM/CJS/브라우저 및 상위 패키지 회귀를 검증한다.

예외 기반 구현을 결과 기반으로 바꾸더라도 공개 동작이 동일하면 반드시 major 변경일 필요는 없다. 반대로 parser 실패 처리·기본값 주입·삭제·생성자 실행 정책이 바뀌면 그 변경의 관찰 가능성에 따라 버전을 결정해야 한다.

이번에는 분리 구현이나 상위 패키지 테스트를 수행하지 않았다. 기존 전체 테스트의 763개 항목 통과와 위 직접 재현은 확인했으나, 테스트 명령은 종료 뒤 비동기 로케일 경고로 종료 코드 1이었다. [공통 실행 결과](AI-COLLABORATION-DRAFT_재검토.ko.md#2-공통-검증-기준선)를 함께 참조한다. 현재 검토 의견을 구현 계획으로 확정하는 것은 후속 작업이다.
