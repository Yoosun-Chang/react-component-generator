# AGENTS.md

## Operational Commands

패키지 매니저: **bun 고정** — npm, yarn, pnpm 절대 사용 금지.

```
bun install              # 의존성 설치
bun run dev              # 백엔드(3002) + 프론트엔드(5173) 동시 실행
bun run server           # 백엔드만 실행 (watch 모드)
bun run build            # tsc + vite 프로덕션 빌드
bun run lint             # ESLint 실행
```

## Golden Rules

**Immutable (절대 변경 불가)**

- API 키를 코드에 하드코딩하지 마라. 클라이언트 전달 키 → `.env` 환경변수 순서로만 처리한다.
- `/api/config` 엔드포인트는 키 존재 여부(boolean)만 반환한다. 키 값 자체를 절대 노출하지 마라.
- react-live 실행 제약을 변경하려면 `LivePreview` 동작 방식과 서버 `SYSTEM_PROMPT`를 **반드시 함께** 수정해야 한다. 어느 한쪽만 수정하면 런타임 오류가 발생한다.

**Do's**

- 새 AI provider 추가 시 `server/index.ts`의 `Provider` 타입, `ENV_KEYS`, `callXxx` 함수, `resolveApiKey`를 일관되게 확장한다.
- 프론트엔드 컴포넌트 파일명은 PascalCase (`ComponentCard.tsx`), 훅 파일명은 camelCase with `use` prefix (`useComponentGenerator.ts`).
- 커밋 메시지는 한국어 컨벤션: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.

**Don'ts**

- 생성된 AI 코드(react-live에서 실행되는 코드)에 `import` 문, TypeScript 문법, CSS import를 절대 허용하지 마라.
- `src/` 프론트엔드 코드에서 서버를 직접 호출하지 마라. 반드시 `/api/*` Vite 프록시를 통해야 한다.
- `server/index.ts`에 새 엔드포인트를 무분별하게 추가하지 마라. 현재 두 엔드포인트(`/api/config`, `/api/generate`)로 기능 범위가 완결되어 있다.

## Project Context

AI(Anthropic Claude, Google Gemini)를 통해 React 컴포넌트 코드를 생성하고, `react-live`로 브라우저에서 즉시 미리보기하는 UI 워크벤치.

Tech Stack: React 19, Vite 8, TypeScript 5.9, Bun, react-live 4, ESLint 9

## Standards & References

- TypeScript strict mode 사용. `any` 타입 사용 시 명시적 이유 필요.
- ESLint 설정: `eslint.config.js` 참고. lint 오류는 빌드 전 반드시 해결.
- 환경변수 추가 시 `.env.example`도 함께 업데이트.
- 규칙과 코드 사이에 괴리가 발생하면 이 파일 업데이트를 제안하라.

## Context Map

- **[백엔드 API 서버 수정 (server/)](./server/AGENTS.md)** — Bun 서버, AI API 호출 로직, `SYSTEM_PROMPT`, 후처리 함수 수정 시.
- **[프론트엔드 UI 수정 (src/)](./src/AGENTS.md)** — React 컴포넌트, 훅, react-live 렌더링 관련 작업 시.
- **[TDD 규칙](./.claude/rules/tdd.md)** — 비즈니스 로직, API, 유틸, 훅, 버그 수정 작업 시 RED-GREEN-REFACTOR 사이클 준수.
