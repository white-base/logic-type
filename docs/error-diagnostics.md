# 오류·진단 규약

새 코드가 실행을 중단해야 할 때는 `logic-assembly`의 `DiagnosticError`를 사용한다. 오류 소비자는
문자열을 파싱하지 않고 `error.stage`, `error.code`, `error.path`, `error.hint`, `error.cause`를 사용한다.

```js
throw new DiagnosticError('E_SQL_COLUMN_DATA_TYPE', 'dataType must be a non-empty string.', {
  path: 'dataType',
  hint: 'SQLColumn 속성의 타입과 허용값을 확인하세요.',
  cause
});
```

표시 형식은 항상 `[Stage 3][E_CODE] message (path) — hint`이다. `stage`는 기본값 3이며, 3은 halt를
뜻한다. 테스트는 문구보다 `code`와 구조화된 필드를 우선 검증한다.

## 예외를 던지지 않는 진단 — 결과 객체 규약

일부 계층은 **의도적으로 throw하지 않는다.** 호출자가 오류를 하나씩 잡는 대신 **여러 건을 한 번에
수집해야 하는 경우**(CLI가 파일 하나의 모든 문법 오류를 모아 보여주는 경우 등)가 그것이다.
이때는 `DiagnosticError` 대신 아래 형태의 결과 객체를 반환한다.

```js
// 성공
{ ok: true, token: { /* 파싱 결과 */ } }

// 실패
{ ok: false, code: 'CONTRACT_002', message: '...', position: 11, stage: 3 }
```

- `ok`로 성공/실패를 가른다. 실패에도 `code`와 `stage`를 실어 throw 경로와 같은 방식으로 소비한다.
- `position`은 원문 문자열 안의 0-기반 위치다(문자열 파서 전용).
- **판정 자체가 미확정인 지점**은 임의의 기본값을 채우지 않고 `code`를 미확정 코드로,
  `openItem`에 미결 항목 ID를 실어 되돌린다. 이 경우 심각도가 정해지지 않았으므로 `stage`를
  붙이지 않는다.

현재 이 규약을 쓰는 곳: `packages/logic-assembly/src/contract-syntax/`
(계약·네임스페이스 문법 파서, [spec/18](spec/18-contract-namespace-syntax.md) §13).
같은 패키지의 기존 계약 토큰 파서(`src/contract/`)는 `ContractTokenError`를 **던지는** 쪽이며
전표(`E_TOKEN_*`)도 별개다 — 두 계층을 섞지 않는다.

## 현재 이행 범위

`logic-assembly`, `logic-auto-cli`, `logic-runtime`, `logic-sql-entity`의 사용자 노출 검증·조립 실패는
이 규약으로 이행됐다. 과거 `[Stage3]` 표기는 `[Stage 3][E_CODE]`로 정규화했고, CLI·테스트는 메시지
정규식 대신 `error.code`와 `error.stage`를 우선 사용한다. 계약 토큰 파서의 `ContractTokenError`는
호환성을 위해 이름은 유지하되 `DiagnosticError`를 상속하며, 관계 폴더의 비-throwing diagnostics는
각각의 공개 구조를 유지한다.


## config 선택자 진단

| 코드 | 의미 |
|---|---|
| `E_CONFIG_PATH` | 비어 있는 경로·배열, 잘못된 기호 조합 또는 예외만 있는 규칙 |
| `E_CONFIG_DUPLICATE` | 같은 positive 선택자 또는 같은 항목의 선택자가 중복됨 |
| `E_CONFIG_CONFLICT` | 같은 항목에서 동일 적용 범위에 덮어쓰기·병합을 동시에 지정함 |
| `E_CONFIG_TARGET` | 선언 그래프에 선택자의 기준 경로가 없거나 유일하지 않음 |
| `E_CONFIG_EFFECTIVE_PATH` | 최종 값 조회에 선택자 기호나 여러 경로를 지정함 |
| `E_CONTEXT_KEY_RESERVED` | 실제 Context key에 `*`·`+` 또는 끝의 `-`를 사용함 |
| `W_CONFIG_EXCLUDE_UNUSED` | 같은 config 규칙의 적용 범위와 겹치지 않는 예외 (`logic validate` 경고) |

prop의 JSON 값·타입·선택값 오류는 기존 `E_PROP_VALUE`·`E_PROP_TYPE`·`E_PROP_ENUM`을 사용한다.
선택자와 병합 규칙은 [prop/config 규격](spec/20-module-prop.md)을 참고한다.

### Schema 실행 후처리

`E_CLI_SCHEMA_RECREATE_DEPENDENT_TABLE`은 recreate 원본을 참조하는 기존 테이블이 재생성 목록에 없고,
물리 이름 변경 또는 참조 데이터 손실 위험이 있는 경우다. 변경 전에 중단하며 diff에 차단 대상을 표시한다.
참조 테이블도 명시적으로 함께 recreate하거나 데이터 보존용 마이그레이션을 별도로 준비한다.

`E_CLI_SCHEMA_POSTCOMMIT_WRITE_FAILED`는 DDL 트랜잭션이 커밋된 뒤 lock/Entry manifest의 파일 저장이
실패한 경우다. DB 롤백 실패와 구분한다. DB 실행 영수증을 읽는 다음 sync/diff가 이름·소비 상태를 복구하며,
동일 recreate를 다시 실행하지 않는다. 전체 규칙은 [물리 명명 규격](spec/17-sql-physical-naming.md) §5.1.
