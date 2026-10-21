# ExtendError 구조·비용 의견 재검토

> 재검토일: 2026-10-14  
> 원본: [EXTEND-ERROR-REVIEW.ko.md](EXTEND-ERROR-REVIEW.ko.md)  
> 기준: Git `d96dbab`, Node 22.16.0, 소스 직접 실행

## 1. 결론

코드 기반 메시지와 원인 정보를 제공하는 오류 타입은 유지할 가치가 있다. 큐 공유와 prop 미할당은 실제 결함이다. 다만 **"plain Error로 구현 불가", "4곳 수정으로 30배", "수정 10줄이면 해결"은 재현된 사실과 수정안의 충분성을 넘어선 주장**이므로 수정한다.

## 2. 확인한 결함과 수정 범위

| 원본 항목 | 판정 | 재검토 의견 |
| --- | --- | --- |
| §3.1 queue 참조 공유 | 유지, 우선 수정 | 원인을 wrap할 때 원본 배열을 변경해 서로 독립적인 체인이 오염됨 |
| §3.2 prop 미할당 | 유지·설명 보완 | 첫 오류의 message에는 문자열 prop이 출력된다. `.prop`에 저장하지 않아 다음 wrap에서 소실되는 것이 정확한 증상 |
| §3.3 name Error | 유지 | 실제 name은 Error이고 별도 toString과 불일치. 수정은 진단 개선이나 메시지·stack 표현 변화는 확인 필요 |
| §3.3 cause 미설정 | 개선 후보 | 현재 원인 객체를 보존하지 않는다. 표준 cause 사용은 유용하지만 레거시 지원과 속성 노출 정책을 함께 결정 |
| 1~3 모두 설계 변경 아님 | 수정 | queue 복사는 결함 수정에 가깝다. prop 포맷·name·cause의 출력 및 직렬화 변경은 외부 관찰 가능 |

재현:

```js
const base = new ExtendError('base');
const a = new ExtendError('A', base);
const b = new ExtendError('B', base);
// base.queue === a.queue === b.queue → true
// b.message → "base\n# A\n## B"

const p = new ExtendError('inner', {style:'required'});
// p.message → "style : required\ninner", p.prop → {}
// new ExtendError('outer', p).message → "inner\n# outer"
```

`_queue = p_prop.queue.slice()`는 원인 큐 오염을 막는 적절한 최소 방향이다. 다만 긴 **정상 체인**의 포맷 비용까지 없애지는 않는다. `_buildMsgQueue`는 깊이에 비례한 `#`를 각 줄에 넣으므로 길이 n의 최종 문자열은 O(n²)다. 동일 원인을 N번 감싸 큐를 계속 키우면 반복 전체의 문자 생성량은 그보다 더 커진다. 원문의 "한 줄로 O(n²) 발산 제거"는 잘못된 참조 공유로 생기는 불필요한 증가에 한정한다.

prop을 저장할 때도 원본 객체 공유·복사·필드 병합 정책을 정해야 한다. `_buildMessageProp`은 문자열 값만 출력하므로 `this.prop` 추가만으로 모든 구조 정보를 표현하지는 않는다.

## 3. error path는 prop만 고쳐서 복구되지 않음

원본은 배열 인덱스가 안 보이는 현상을 prop 소실로 설명하지만 원인이 둘이다.

1. prop은 ExtendError wrap 시 소실된다 (`extend-error.js:86~109`).
2. 배열 후보 검사는 재귀 호출에 같은 pathName을 전달하며 인덱스를 추가하지 않는다 (`type.js:1176`). 실패 후보의 상세 예외도 버리고 최종 EL01118로 바꾼다.

따라서 `this.prop = _prop`만 추가해도 `target[1]` 정보가 자동으로 생기지는 않는다. union 키 정보, 배열 인덱스, 후보별 원인의 수집·선택 규칙을 함께 검토해야 한다. 원문의 "원인 스택 체인 제공"도 현재 구현에는 맞지 않는다. 일반 Error를 감쌀 때 보존하는 것은 message이며 cause/원본 stack 객체는 유지하지 않는다.

## 4. 성능 수치 재평가

현재 환경에서 케이스별 5,000회 warm-up 후 20,000회씩 5라운드 실행했다. boolean 결과를 누적해 사용했으며 아래는 ns/op의 중앙값이다.

| 사례 | 중앙값 | 관찰 |
| --- | ---: | --- |
| `isMatchType(String,'abc')` | 52 | 기본 성공 |
| `isMatchType(String,123)` | 3,222 | 기본 실패 |
| choice의 첫 후보 String 성공 | 344 | 후보 실패 없음 |
| choice의 네 번째 후보 RegExp 성공 | 12,436 | 앞의 세 후보 실패 |

choice는 `[[String,Number,Boolean,RegExp]]`를 사용했다. 이번에는 약 36배 차이지만 환경·warm-up·입력·순서에 따른 **이 한 사례의 비율**이다. 전체 애플리케이션의 30배 개선 예상치로 사용할 수 없다.

원문의 벤치마크는 Node 세부 버전·반복별 분산·호출 결과 사용 방식이 충분히 고정되어 있지 않다. 독립 microbenchmark의 비용을 빼서 "56%는 stack, 40%는 추가분"으로 정확히 분해하거나 그 비율이 안정적이라고 확정하기도 어렵다. 재사용 throw와 새 Error throw의 비용 차이는 할당이 중요한 후보라는 근거로만 사용한다.

"성공 경로는 ExtendError 비용 0"도 범위를 제한해야 한다. 단순 String 검사에서는 오류가 없지만 **후보 몇 개가 실패한 뒤 성공하는 choice도 성공 경로**다.

## 5. sentinel 수정안 검토

후보 탐색에서 진단 문자열을 완성하지 않는 방향은 타당하다. 하지만 원안의 sentinel 예제는 완결된 구현안이 아니다.

- `_execMatch/_execAllow` 안에서 silent가 전파돼도 `extendType`의 정규화 실패, 생성자·getter 오류 등 다른 함수의 예외 생성은 남는다.
- 중첩 catch가 sentinel을 다시 `new ExtendError`로 감싸면 할당이 계속 발생한다. silent를 재귀 호출에 넘기는 것만으로 충분하지 않다.
- 원래 코드의 광범위한 catch는 진짜 사용자 코드 오류까지 후보 실패로 소비할 수 있다. sentinel을 도입한다면 `e === sentinel`인 경우와 다른 예외를 구분할지 먼저 정한다.
- 실패한 union 후보가 입력에 주입한 기본값은 남는다. 성능 최적화와 별개로 탐색의 상태 오염 문제다.
- 모듈 전역 silent 카운터는 getter·생성자에서 검사가 다시 호출되는 재진입 상황과 예외 뒤 복구를 검토해야 한다. 호출별 상태가 더 명확하다.
- 공유 가능한 sentinel에 기존 ExtendError 큐 wrap을 적용하면 sentinel 자체의 queue가 오염될 수 있다.

boolean/Result 반환, 지연된 진단 객체, 내부 sentinel 중 무엇이 적절한지는 비교 구현 뒤 결정한다. "해법은 boolean이 아니다"처럼 다른 선택지를 미리 배제할 근거는 없다. 미구현 sentinel안의 700ns 예측도 삭제한다.

## 6. 존재 가치와 호환성 판단

plain Error의 message/cause/custom 필드로도 체인과 코드 정보를 구현할 수 있다. 따라서 "plain Error로는 불가"는 철회한다. 현재 ExtendError API가 그 기능을 이미 제공하고 소비자가 의존한다는 점이 유지 근거다.

`default.js`에는 EL 접두 키 251개가 있지만 구분선 등도 포함된다. 실제 사용 진단 251개로 단정하지 않는다. `core.json`은 로케일이 아니라 `{"CORE":"SUCCESS"}` 데이터이며, 언어 지원은 기본 영어와 ko다.

현재 하위 소스의 ExtendError 문자열 출현은 170+156+30=356건이다. import·주석도 포함한 검색 수여서 실행 사용량은 아니다. `.queue` 검색 결과에는 TransactionQueue 등 다른 객체도 섞이므로, 단순 grep만으로 오류 queue 호환성 검토를 완료했다고 할 수 없다.

권장 순서는 **queue 독립성 수정 → prop·경로 보존 계약과 name/cause 정의 → 후보 탐색 오류/상태 분리 → 성능 비교**다. 기존 테스트 30개 스위트의 항목과 별도의 직접 재현을 확인했다. 다만 테스트 명령은 종료 뒤 비동기 로케일 경고로 종료 코드 1이었다. [공통 실행 결과](AI-COLLABORATION-DRAFT_재검토.ko.md#2-공통-검증-기준선)를 함께 봐야 하며, 상위 패키지 회귀는 후속 구현 시 필요하다.
