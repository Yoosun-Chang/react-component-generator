# src/AGENTS.md

## Module Context

React 19 + Vite 기반 프론트엔드. `react-live`를 통해 AI가 생성한 코드를 브라우저 런타임에서 직접 실행·렌더링한다. react-live의 실행 제약이 이 모듈의 핵심 설계 제약이다.

## Tech Stack & Constraints

- React 19 (Concurrent 기능 사용 가능, 단 현재 사용하지 않음).
- `react-live 4` — `LiveProvider`, `LiveError`, `LivePreview` 컴포넌트로 코드 실행.
- TypeScript 사용 (생성된 AI 코드는 JS only, 프론트엔드 자체 코드는 TS).
- 상태 관리: useState/useEffect만 사용 — 외부 상태 라이브러리(Zustand, Redux 등) 도입 금지.
- 스타일: CSS 파일(`App.css`, `index.css`) + 인라인 스타일. CSS-in-JS 라이브러리 도입 금지.

## Implementation Patterns

**컴포넌트 역할 분담**

- `App.tsx` — 전역 상태(provider, apiKey, envKeys) 보유. 레이아웃 조합 담당.
- `useComponentGenerator.ts` — 컴포넌트 목록 상태 + generate/remove/clearAll 액션만 담당. API 호출 포함.
- `ComponentCard.tsx` — 개별 생성 결과. LivePreview/CodeView 탭 전환 포함.
- `LivePreview.tsx` — react-live 래퍼. 이 파일만 `react-live`를 직접 import한다.

**react-live 실행 환경 제약 (AI 생성 코드에 적용)**

react-live가 실행하는 코드는 다음 규칙을 반드시 따라야 한다:

- `import` 문 금지 — React는 전역 스코프에 이미 존재.
- TypeScript 문법 금지 — 순수 JavaScript만 허용.
- CSS import 금지 — 인라인 스타일(`style={{}}`)만 허용.
- 파일 끝에 `render(<ComponentName />)` 반드시 포함.

이 제약을 완화하려면 `LivePreview.tsx`의 `LiveProvider` 설정과 서버의 `SYSTEM_PROMPT`를 동시에 변경해야 한다.

**API 호출 패턴**

```
fetch('/api/generate', { method: 'POST', body: JSON.stringify({ prompt, provider, apiKey }) })
```

`/api/*`는 Vite 프록시가 `localhost:3002`로 전달. 직접 `localhost:3002`를 참조하지 마라.

## Local Golden Rules

**Do's**

- 새 컴포넌트 추가 시 `src/components/` 하위에 PascalCase 파일명으로 생성.
- 새 훅 추가 시 `src/hooks/` 하위에 `use` prefix camelCase 파일명으로 생성.
- 공유 타입은 `src/types/index.ts`에 정의한다.

**Don'ts**

- `LivePreview.tsx` 외부에서 `react-live` API를 직접 사용하지 마라.
- `useComponentGenerator.ts`에 UI 로직(상태 외)을 혼재시키지 마라.
- `App.tsx`에 비즈니스 로직을 직접 작성하지 마라 — 훅으로 분리한다.
- 생성된 AI 코드 평가에 `eval()`이나 `new Function()`을 사용하지 마라 — react-live가 담당한다.
