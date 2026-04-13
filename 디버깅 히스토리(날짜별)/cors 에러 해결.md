# CORS 에러 해결

## 증상

```
Access to XMLHttpRequest at 'http://localhost:8080/api/menus/tree'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

브라우저에서 `localhost:5174`로 접속 시 API 호출이 CORS 에러로 차단됨.

## 원인 (2가지)

### 1. axios가 Vite 프록시를 우회하고 8080 직접 호출

```typescript
// 변경 전 — shared/api/axios.ts
baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
```

`baseURL`이 `http://localhost:8080`으로 하드코딩되어 있어서, Vite 프록시(`/api` → 8080)를 타지 않고 브라우저에서 직접 8080으로 요청. 이 경우 CORS 정책이 적용됨.

### 2. CORS 허용 origin에 5174 누락

```java
// 변경 전 — WebConfig.java
.allowedOrigins("http://localhost:5173")
```

Vite가 5173 포트가 사용 중일 때 5174로 자동 할당하는데, CORS 설정에 5173만 허용되어 있었음.

## 해결

### 1. axios baseURL을 빈 문자열로 변경

```typescript
// 변경 후 — shared/api/axios.ts
baseURL: import.meta.env.VITE_API_URL ?? ''
```

→ 상대 경로(`/api/menus/tree`)로 요청 → Vite 프록시를 통해 8080으로 전달 → 브라우저 입장에서는 same-origin이므로 CORS 미적용.

### 2. CORS에 5174 추가

```java
// 변경 후 — WebConfig.java
.allowedOrigins("http://localhost:5173", "http://localhost:5174")
```

→ 프록시 우회 상황이나 프로덕션 환경 대비.

## 수정 파일

| 파일 | 변경 |
|------|------|
| `edu-flash-front/src/shared/api/axios.ts` | baseURL `'http://localhost:8080'` → `''` |
| `edu-flash-server/.../WebConfig.java` | allowedOrigins에 `localhost:5174` 추가 |

## 교훈

- Vite 프록시를 쓸 때 axios `baseURL`은 **비워야** 프록시를 탐
- Vite는 포트 충돌 시 자동으로 다음 포트를 할당하므로 CORS에 여러 포트를 등록하거나, 프록시에 의존하는 게 안전
