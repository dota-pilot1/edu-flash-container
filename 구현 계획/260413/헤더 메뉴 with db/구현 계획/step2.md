# Step 2 — 백엔드: CRUD API + DTO

## 목표
Menu CRUD REST API 구현, 트리 구조 JSON 응답

## 작업 내용

### 2-1. DTO
```
menu/presentation/dto/
├── MenuRequest.java     # name, path, parentId, sortOrder, visible (validation)
└── MenuResponse.java    # Menu → 트리 JSON (children 재귀 변환)
```

### 2-2. MenuService
- `getMenuTree()` — 루트 메뉴 조회 → MenuResponse 트리 변환
- `getMenusByDepth(depth)` — 특정 depth 조회
- `getMenu(id)` — 단건
- `createMenu(request)` — parentId로 상위 지정, depth 자동 계산
- `updateMenu(id, request)` — 메뉴 수정
- `deleteMenu(id)` — cascade 삭제

### 2-3. MenuController
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/menus/tree | 전체 트리 조회 |
| GET | /api/menus?depth=N | depth별 조회 |
| GET | /api/menus/{id} | 단건 |
| POST | /api/menus | 생성 |
| PUT | /api/menus/{id} | 수정 |
| DELETE | /api/menus/{id} | 삭제 |

## 완료 기준
- [ ] GET /api/menus/tree → children 포함 트리 JSON
- [ ] POST → depth 자동 계산
- [ ] DELETE → 하위 메뉴 cascade 삭제
- [ ] curl로 CRUD 전체 테스트
