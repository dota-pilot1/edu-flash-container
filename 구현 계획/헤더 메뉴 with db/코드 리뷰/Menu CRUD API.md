# Menu CRUD API

## 백엔드

### 파일 구조

```
com.eduflash
├── menu/
│   ├── domain/
│   │   ├── Menu.java                      (신규) Self-referencing 엔티티, 1/2/3차 트리
│   │   └── MenuRepository.java            (신규) JpaRepository, 트리/depth 조회
│   ├── application/
│   │   └── MenuService.java               (신규) CRUD + 트리 조회 비즈니스 로직
│   └── presentation/
│       ├── MenuController.java            (신규) REST API (/api/menus)
│       └── dto/
│           ├── MenuRequest.java           (신규) 생성/수정 요청 DTO (validation)
│           └── MenuResponse.java          (신규) 응답 DTO (children 재귀 트리)
└── global/
    └── config/
        ├── SecurityConfig.java            (신규) @EnableWebSecurity, 전체 permitAll
        └── WebConfig.java                 (수정) CORS localhost:5173, 5174 허용

src/main/resources/
├── application.yaml                       (수정) DB 연결 + defer-datasource-initialization
└── data.sql                               (신규) 초기 1차 메뉴 4개 INSERT
```

### 구현 기능

- [x] Menu 엔티티 — Self-referencing (@ManyToOne parent ↔ @OneToMany children)
- [x] GET /api/menus/tree — 전체 메뉴 트리 조회 (1차 기준, children 재귀 포함)
- [x] GET /api/menus?depth=N — 특정 depth 메뉴 조회
- [x] GET /api/menus/{id} — 단건 조회
- [x] POST /api/menus — 메뉴 생성 (parentId 지정 시 depth 자동 계산)
- [x] PUT /api/menus/{id} — 메뉴 수정
- [x] DELETE /api/menus/{id} — 메뉴 삭제 (cascade로 하위 메뉴 함께 삭제)
- [x] Security — 전체 permitAll (개발용)
- [x] CORS — localhost:5173, 5174 허용
- [x] 초기 데이터 — 홈, 학습, 내 카드, 설정 (1차 메뉴 4개)

---

## 프론트엔드

### 파일 구조

```
src/
├── entities/menu/
│   ├── model/types.ts                     (신규) Menu, MenuRequest 인터페이스
│   ├── api/menuApi.ts                     (신규) axios CRUD 함수 (getTree, create, update, delete)
│   └── index.ts                           (신규) public API
├── features/menu-manage/
│   ├── ui/MenuTree.tsx                    (수정) shadcn/ui 스타일, 인라인 추가, 우클릭 컨텍스트 메뉴
│   ├── ui/MenuDetail.tsx                  (수정) defaultParentId prop 추가
│   ├── ui/ContextMenu.tsx                 (신규) 우클릭 메뉴 (하위 추가 / 삭제)
│   └── index.ts                           (수정) ContextMenu, InlineAddState export
├── pages/menu-manage/
│   ├── ui/MenuManagePage.tsx              (수정) 인라인 추가 + 컨텍스트 메뉴 연동, 전체 폭
│   └── index.ts                           (신규) public API
├── pages/study-frontend/
│   ├── ui/StudyFrontendPage.tsx           (신규) /study/frontend 전용 페이지
│   └── index.ts                           (신규) public API
├── pages/placeholder/
│   ├── ui/PlaceholderPage.tsx             (신규) "구현 예정" 페이지 (메뉴명 표시)
│   └── index.ts                           (신규) public API
├── widgets/header/
│   └── ui/Header.tsx                      (수정) DB 트리 조회, 하위 메뉴 드롭다운, active 상태
├── shared/api/
│   └── axios.ts                           (수정) baseURL '' (프록시 경유)
├── app/routes/
│   └── AppRoutes.tsx                      (수정) /menu-manage, /study/frontend, * 라우트
└── vite.config.ts                         (수정) /api → localhost:8080 프록시 추가
```

### 구현 기능

- [x] entities/menu — Menu 타입 정의 + axios API 함수 (CRUD + 트리)
- [x] MenuTree — shadcn/ui 스타일, 재귀 TreeNode, 인라인 메뉴 추가 (Enter 즉시 생성)
- [x] ContextMenu — 우클릭 메뉴 (하위 메뉴 추가 / 삭제), depth<3 제한
- [x] MenuDetail — React Hook Form 폼 (기존 메뉴 수정 전용)
- [x] MenuManagePage — 전체 폭, 인라인 추가 + 컨텍스트 메뉴 연동
- [x] Header — 하위 메뉴 없으면 Link, 있으면 드롭다운 (children 기반 분기)
- [x] StudyFrontendPage — /study/frontend 전용 페이지
- [x] PlaceholderPage — catch-all 라우트, 메뉴명 기반 "구현 예정" 표시
- [x] Vite 프록시 — /api 요청 → localhost:8080 자동 전달

## 연동 설정

- Vite 프록시: `/api` → `http://localhost:8080` (vite.config.ts)
- CORS: `http://localhost:5173`, `http://localhost:5174` 허용 (WebConfig.java)
- Axios baseURL: `''` (빈 문자열 → Vite 프록시 경유, 직접 8080 호출 시 CORS 에러)
