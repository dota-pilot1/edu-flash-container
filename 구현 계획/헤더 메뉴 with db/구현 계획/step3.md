# Step 3 — 백엔드: Security + CORS

## 목표
개발 환경에서 프론트 연동 가능하도록 보안/CORS 설정

## 작업 내용

### 3-1. SecurityConfig
- `@EnableWebSecurity`
- 전체 `permitAll()` (개발용, 추후 인증 추가)
- CSRF 비활성화

### 3-2. WebConfig (CORS)
- `/api/**` 경로에 `localhost:5173`, `localhost:5174` 허용
- GET, POST, PUT, DELETE 허용
- Vite 포트 자동 변경 대비 (5173 사용 중이면 5174로 할당됨)

## 완료 기준
- [ ] 프론트(5173/5174)에서 API 호출 시 CORS 에러 없음
- [ ] Security가 API 요청 차단하지 않음
