# server/AGENTS.md

## Module Context

Bun 내장 HTTP 서버. `SYSTEM_PROMPT`를 AI에 전달하고 응답을 후처리하여 react-live에서 실행 가능한 코드를 반환한다. 이 모듈만 AI API(외부 네트워크)에 직접 접근한다.

## Tech Stack & Constraints

- 런타임: Bun — Node.js API가 아닌 `Bun.serve()` 사용.
- HTTP 클라이언트: Bun 내장 `fetch` — axios, node-fetch 등 외부 라이브러리 사용 금지.
- TypeScript 허용 (프론트엔드와 달리 이 파일은 TS로 작성됨).
- 외부 의존성 추가 금지 — 현재 서버는 zero-dependency 구조를 유지한다.

## Implementation Patterns

**엔드포인트 구조**

```
GET  /api/config   → { envKeys: { anthropic: boolean, google: boolean } }
POST /api/generate → { prompt, provider, apiKey? } → { code }
```

**새 AI Provider 추가 순서**

1. `Provider` 타입에 새 값 추가.
2. `ENV_KEYS`에 환경변수 매핑 추가.
3. `callXxx(prompt, apiKey)` 함수 작성 — `Promise<string>` 반환.
4. `fetch()` 분기에 새 provider 추가.
5. `.env.example`에 새 키 추가.

**후처리 함수 (절대 제거 금지)**

- `stripCodeFences`: AI가 반환한 마크다운 코드 펜스 제거.
- `ensureRenderCall`: `render(<ComponentName />)` 호출이 없으면 자동 추가. react-live 실행을 위해 필수.

## Local Golden Rules

**Do's**

- `SYSTEM_PROMPT` 수정 시 `src/components/LivePreview.tsx`의 실행 환경 제약과 일치하는지 확인한다.
- AI API 오류 응답은 HTTP 상태코드(429, 503 등)에 맞게 분기 처리한다.
- `resolveApiKey`를 통해서만 API 키를 결정한다 — 직접 `process.env`를 참조하지 마라.

**Don'ts**

- `ENV_KEYS` 객체나 API 키 값을 응답 body에 포함하지 마라.
- `SYSTEM_PROMPT`에서 "import 금지", "TypeScript 금지" 규칙을 제거하지 마라 — react-live 실행이 깨진다.
- Bun 서버를 Express나 Hono 등으로 교체하지 마라 (현재 구조로 충분하다).
