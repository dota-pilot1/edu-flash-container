# Step 2 — 프론트: 메뉴 관리 페이지 (트리 + CRUD)

## 목표
왼쪽 트리 사이드바 + 오른쪽 상세 폼으로 메뉴 CRUD 관리 UI 구현

## 레이아웃
```
┌─────────────────────────────────────────────┐
│  헤더                                        │
├──────────────┬──────────────────────────────┤
│  📂 메뉴 트리  │  메뉴 상세 정보              │
│              │                              │
│  ▼ 홈        │  이름: [        ]             │
│  ▼ 학습      │  경로: [        ]             │
│    ├ 기초     │  상위: [▾ 선택   ]            │
│    └ 심화     │  순서: [        ]             │
│  ▼ 내 카드   │  노출: [✅]                   │
│  ▼ 설정      │                              │
│              │  [저장]  [삭제]               │
│──────────────│                              │
│ [+ 메뉴 추가] │                              │
└──────────────┴──────────────────────────────┘
```

## 작업 내용

### 2-1. FSD 구조
```
src/
├── entities/menu
│   ├── api/menuApi.ts           # axios CRUD 함수
│   ├── model/types.ts           # Menu 타입 (children 포함 트리)
│   └── index.ts
├── features/menu-manage
│   ├── ui/MenuTree.tsx          # 왼쪽: 트리 사이드바 컴포넌트
│   ├── ui/MenuDetail.tsx        # 오른쪽: 상세 폼 (React Hook Form)
│   └── index.ts
├── pages/menu-manage
│   ├── ui/MenuManagePage.tsx    # 레이아웃 조합 (트리 + 상세)
│   └── index.ts
└── app/routes
    └── AppRoutes.tsx            # /menu-manage 라우트 추가
```

### 2-2. entities/menu
```typescript
// model/types.ts
interface Menu {
  id: number
  name: string
  path: string
  parentId: number | null
  depth: number
  sortOrder: number
  visible: boolean
  children: Menu[]
}

interface MenuRequest {
  name: string
  path: string
  parentId: number | null
  sortOrder: number
  visible: boolean
}
```

```typescript
// api/menuApi.ts
- getMenuTree(): Menu[]           → GET /api/menus/tree
- getMenu(id): Menu               → GET /api/menus/{id}
- createMenu(req): Menu           → POST /api/menus
- updateMenu(id, req): Menu       → PUT /api/menus/{id}
- deleteMenu(id): void            → DELETE /api/menus/{id}
```

### 2-3. MenuTree (왼쪽 사이드바)
- useQuery로 트리 데이터 조회
- 재귀 컴포넌트로 1/2/3차 메뉴 렌더링
- 클릭 시 선택된 메뉴 → 오른쪽 폼에 데이터 바인딩
- 하단 [+ 메뉴 추가] 버튼

### 2-4. MenuDetail (오른쪽 폼)
- React Hook Form으로 폼 관리
- 필드: 이름, 경로(수동입력), 상위메뉴(select), 순서, 노출여부
- [저장] → 신규면 POST, 수정이면 PUT
- [삭제] → DELETE 후 트리 갱신
- useMutation + invalidateQueries로 저장/삭제 후 트리 자동 갱신

### 2-5. 헤더에 "메뉴 관리" 링크 하드코딩 추가
- Header.tsx에 관리자용 링크로 `/menu-manage` 추가

## 완료 기준
- [ ] /menu-manage 접속 시 왼쪽 트리 + 오른쪽 폼 표시
- [ ] 트리에서 메뉴 클릭 → 오른쪽에 상세 정보 표시
- [ ] 메뉴 추가/수정/삭제 가능
- [ ] 저장/삭제 후 트리 자동 갱신
