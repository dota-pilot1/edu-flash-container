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
        └── WebConfig.java                 (신규) CORS localhost:5173 허용

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
- [x] CORS — localhost:5173 허용
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
│   ├── ui/MenuTree.tsx                    (신규) 왼쪽 트리 사이드바 (재귀 TreeNode)
│   ├── ui/MenuDetail.tsx                  (신규) 오른쪽 상세 폼 (React Hook Form)
│   └── index.ts                           (신규) public API
├── pages/menu-manage/
│   ├── ui/MenuManagePage.tsx              (신규) 트리+폼 레이아웃, useMutation CRUD
│   └── index.ts                           (신규) public API
├── pages/placeholder/
│   ├── ui/PlaceholderPage.tsx             (신규) "구현 예정" 페이지 (메뉴명 표시)
│   └── index.ts                           (신규) public API
├── widgets/header/
│   └── ui/Header.tsx                      (수정) DB 1차 메뉴 동적 렌더링 + active 상태 + 메뉴 관리 링크
├── app/routes/
│   └── AppRoutes.tsx                      (수정) /menu-manage, /* (catch-all) 라우트 추가
└── vite.config.ts                         (수정) /api → localhost:8080 프록시 추가
```

### 구현 기능

- [x] entities/menu — Menu 타입 정의 + axios API 함수 (CRUD + 트리)
- [x] MenuTree — 재귀 트리 컴포넌트, 펼침/접기, 선택 하이라이트, visible OFF 투명도
- [x] MenuDetail — React Hook Form 폼 (이름, 경로, 상위메뉴 select, 순서, 노출)
- [x] MenuManagePage — 왼쪽 트리 + 오른쪽 폼 레이아웃, TanStack Query useMutation
- [x] Header — DB 1차 메뉴 useQuery 렌더링, visible 필터, 현재 경로 active 표시
- [x] PlaceholderPage — catch-all 라우트, 메뉴명 기반 "구현 예정" 표시
- [x] Vite 프록시 — /api 요청 → localhost:8080 자동 전달

## 연동 설정

- Vite 프록시: `/api` → `http://localhost:8080` (vite.config.ts)
- CORS: `http://localhost:5173` 허용 (WebConfig.java)
- Axios baseURL: `http://localhost:8080` (shared/api/axios.ts, 프록시 사용 시 미사용)
