# 메시지·다국어 설계 의견 재검토

> 재검토일: 2026-10-14  
> 원본: [MESSAGE-I18N-REVIEW.ko.md](MESSAGE-I18N-REVIEW.ko.md)  
> 기준: Git `d96dbab`; 소스·카탈로그·하위 wrapper·실행 결과 대조

## 1. 결론

오류 코드·한국어 진단·중앙 카탈로그를 유지하고 초기화를 명시적으로 만들자는 방향은 타당하다. 다만 **자동 감지의 일괄 제거, 미사용 키의 무위험 삭제, 정적 import만으로 보안 문제 해결, 기존 API의 minor 교체 가능**이라는 결론은 수정해야 한다.

목표는 언어 선택과 준비 시점을 예측 가능하게 만드는 것이다. 한국어 제공 자체나 비동기 로케일 로딩 자체를 잘못된 설계로 확정할 근거는 없다.

## 2. 원본 의견별 판정

| 항목 | 판정 | 재검토 의견 |
| --- | --- | --- |
| 오류 코드·카탈로그 유지 | 유지 | 번역과 독립적인 식별자가 유용하다. 현재는 코드가 주로 메시지 문자열에 포함되므로 구조화된 error.code 제공은 별도 개선 과제 |
| 에러 체인이 잘 작동함 | 수정 | 기본 출력은 되지만 queue 참조 오염·prop 소실이 재현됨. [오류 재검토](EXTEND-ERROR-REVIEW_재검토.ko.md) |
| 한국어 opt-in 정적 모듈 | 방향 유지 | 동기 준비와 번들 경로 단순화에 유리한 선택지. 자동 감지 API까지 반드시 폐기해야 하는 것은 아님 |
| 모든 소비자에게 TLA 요구 | 범위 한정 | 소스 ESM·ESM 번들에는 해당. CJS/UMD는 별도 wrapper여서 TLA를 요구하지 않으나 준비 시점이 다름 |
| 자동 감지가 로그 검색을 불가능하게 함 | 과장 축소 | 문자열 기반 그룹핑 설정에 따라 영향이 있다. 코드 기반 검색·그룹핑까지 불가능한 것은 아님 |
| 주석 처리된 한국어 단언이 자동 감지 때문에 깨진 증거 | 근거 부족 | 주석과 현재 코드만으로 당시 실패 원인을 확정할 수 없음 |
| 영어가 기계 번역된 것이 원인 | 표현 수정 | 오탈자·용어 불일치는 확인 가능. 번역 생성 방식이나 사용자의 체감 원인은 코드만으로 확인할 수 없음 |
| placeholder 치환은 손댈 필요 없음 | 철회 | 직접 hasOwnProperty 호출로 특수 객체에서 실패. 입력 계약·안전한 own-property 조회 필요 |
| 정적 import면 prototype pollution 자연 해소 | 철회 | 공개 importMessage가 객체 병합을 계속 허용하면 위험은 남음. 로케일 전달 방식과 병합 안전성은 별도 |
| 콘솔을 영어로 고정 | 선택 정책 | 한국어 개발자 진단이라는 목표와 충돌할 수 있음. 언어를 소비자가 명시적으로 선택하도록 하는 것으로 충분 |

## 3. 카탈로그 수치와 삭제 판단

root `src/*.js`의 `/CODE/` 문자열을 정규식으로 검색한 결과는 원문과 동일했다. 이는 주석을 포함한 정적 검색이며 외부 소비자·동적 Message.get 호출 전체를 뜻하지 않는다.

| 항목 | 재측정 |
| --- | ---: |
| 기본 카탈로그 키 | 277 |
| 소스 검색 코드 집합 | 199 |
| 카탈로그에만 존재 | 81 |
| 구분선 값 | 45 |
| 소스 검색에만 존재 | 3 |

영어의 `EL0324`, `EL0321`, `EL0323`는 각각 `EL03242`, `EL03321`, `EL03323`의 오기다. 이 누락 수정과 재발 검사 제안은 유지한다.

영어/한국어의 키 차이는 오기 3쌍과 EN/KO 언어 표식이다. 그런데 `test/message.test.js:34,110` 등은 KO를 실제로 조회한다. 원문의 "언어 표식은 참조 0회"와 "277→199 정리는 위험 없음"은 그대로 적용할 수 없다.

구분선은 데이터가 아닌 주석으로 옮길 후보지만 공개 get(code)로 조회할 수 있었던 키다. 36개 기타 미참조 키도 외부 사용이 없다고 증명되지 않았다. 삭제 전에 deprecated 정책과 하위 카탈로그 의존을 확인한다. 키 집합 검사는 의도한 메타 키 차이를 허용하고, 실제 메시지 코드·placeholder 번호/이름 일치를 별도로 검사하는 방식이 적절하다.

## 4. 초기화 문제의 실제 범위

`LANG=ko_KR.UTF-8`로 Node CJS 번들을 require하면 즉시 출력은 영어였고, 10ms 뒤 같은 코드는 한국어였다. 즉 `currentLang === 'ko'`여도 카탈로그 준비가 완료됐다는 뜻이 아니다. 명시적 ready/init 계약이 필요하다는 근거는 충분하다.

전체 Jest 실행도 항목은 30스위트·763개 통과했지만 `Cannot log after tests are done`이라는 비동기 경고 때문에 종료 코드가 1이었다. 시작 언어를 영어로 고정한 재실행도 같았다. 이는 이번에 확인한 초기화·테스트 종료 시점 문제이며, 원문의 주석 처리된 단언이 왜 생겼는지를 증명하는 결과와는 구분한다.

반면 UMD의 일반 브라우저 분기에서는 fs를 사용하지 않고 fetch를 실행한다. 경로가 적절한 브라우저 유사 VM 조건에서는 ko.json 로딩이 성공했다. "CDN·hoisting·serverless는 같은 이유로 전부 깨짐" 대신 파일 위치와 재번들링·currentScript 조건에 따른 실패로 설명해야 한다.

`changeLanguage`는 언어별 저장소를 사용하므로 병렬 호출이 항상 번역을 서로 다른 언어 저장소에 섞는다고 단정할 수 없다. 그러나 currentLang을 로드 전에 변경하고 동시 로드의 중복 방지·완료 정책이 없어 준비 시점과 호출 순서 계약은 불명확하다. 서버 요청별 언어를 공유 static으로 변경하면 요청 격리도 따로 검토해야 한다.

## 5. 제안 API의 호환성 보완

원문의 `Message.use(catalog)`는 새 API 방향을 설명하는 초안으로는 유용하다. 하지만 현 API의 단순 별칭 대체가 될 수는 없다.

| 현재 계약 | 원안의 위험 | 필요한 보완 |
| --- | --- | --- |
| `changeLanguage('ko'): Promise<void>` | `use(catalog)`는 인자·비동기 결과가 다름 | 기존 문자열 API와 반환 Promise를 유지할 호환 경로 또는 major 전환 |
| `importMessage(codes, localePath)` | 정적 use만 남기면 경로 기반 상위 메시지 확장 기능 소실 | 하위 카탈로그 등록·선택·기본 언어 fallback 계약 보존 |
| 여러 패키지의 default/언어 메시지 병합 | current를 catalog 하나로 교체하면 다른 패키지 번역이 사라질 수 있음 | 여러 카탈로그의 병합 또는 namespace별 저장 구조 |
| 공개 `autoDetect`, `resetLang`, `$storage` | 삭제나 저장 구조 변경은 관찰 가능 | deprecated·별칭·지원 버전 정책 |
| ko의 CJS/ESM 사용 | `./locales/ko`에 ESM 파일만 연결하면 기존 CJS 정책과 불일치 가능 | 로케일 서브패스도 지원 소비자 조건별 검증 |

`../logic-entity`, `../logic-bind-model`, `../logic-sql-entity` 모두 `importMessage(defaultCode, localesPath)`와 `autoDetect()` wrapper를 사용한다. core 한 곳의 loader를 지운다고 상위 패키지의 I/O·TLA도 없어지는 것은 아니다.

minor에서 정적 주입 API를 **추가**하는 것과 기존 자동 초기화·경로 로딩을 **제거**하는 것을 분리해야 한다. 기존 소비자의 관찰 가능한 동작이 달라진다면 하위 호환을 확보하거나 major 변경으로 다룬다.

## 6. 입력 안전성은 별도 수정

```js
// 별도 Node 프로세스에서 실행하고 반드시 정리
try {
  Message.importMessage(JSON.parse('{"__proto__":{"logicCoreReview":"yes"}}'));
  console.log(({}).logicCoreReview); // yes
} finally { delete Object.prototype.logicCoreReview; }

Message.importMessage({EL_REVIEW:'${name}'});
const values = Object.create(null); values.name = 'kim';
Message.get('EL_REVIEW', values); // TypeError: namedValues.hasOwnProperty is not a function
```

`_deepMerge`와 `_replacePlaceholders`는 `Object.prototype.hasOwnProperty.call` 등을 사용하고 위험 경로·허용 값·객체 구조를 검증해야 한다. null prototype 저장소를 쓰더라도 모든 입력 병합·조회가 안전해지는지는 별도 확인한다. 정적 로케일·다국어 유지 여부와 관계없이 필요한 수정이다.

## 7. 외부 추세 설명의 수정

Zod의 공식 문서는 기본 영어 로케일의 자동 로드, 명시적 로케일 설정, 동적 import를 이용한 지연 로드를 모두 제시한다. 따라서 "추세는 비동기에서 정적으로 이동했고 모두 정적 방식"이라는 표는 부정확하다. 환경 언어의 자동 선택과 로케일 모듈의 자동 포함도 구별해야 한다. [Zod 국제화 문서](https://zod.dev/error-customization#internationalization)

언어 수·여러 프레임워크의 제공 방식은 버전에 따라 변한다. 이번 설계 판단에는 그 개수나 산업 전체 추세를 근거로 사용하지 않는다. 명시적인 언어 선택과 로드 준비 상태를 제공하는 사례로만 참고한다.

카탈로그에서 오류 설명 문서를 생성하자는 제안은 유지한다. 다만 저장소·배포 주소를 확정하기 전 문서 URL을 오류마다 넣지는 않는다. 메시지 포맷 변경과 사용 언어 정책도 각각 선택 가능하게 둔다.

권장 순서는 **키 오기 및 병합 안전성 → 카탈로그 검증 → 명시적 정적 등록 API 추가 → 상위 패키지 이전 → 기존 로딩/자동 감지의 단계적 정책 변경**이다.
