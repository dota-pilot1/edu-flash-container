# Step 4 — 프론트: entities/menu + shared/api

## 목표
FSD entities 계층에 Menu 타입 정의 + API 함수 생성

## 작업 내용

### 4-1. 타입 정의
```typescript
// entities/menu/model/types.ts
interface Menu {
  id: number; name: string; path: string;
  parentId: number | null; depth: number;
  sortOrder: number; visible: boolean;
  children: Menu[]
}
interface MenuRequest { name, path, parentId, sortOrder, visible }
```

### 4-2. API 함수
```typescript
// entities/menu/api/menuApi.ts
menuApi.getTree()          → GET /api/menus/tree
menuApi.getByDepth(depth)  → GET /api/menus?depth=N
menuApi.getById(id)        → GET /api/menus/{id}
menuApi.create(data)       → POST /api/menus
menuApi.update(id, data)   → PUT /api/menus/{id}
menuApi.delete(id)         → DELETE /api/menus/{id}
```

### 4-3. Vite 프록시
```typescript
// vite.config.ts
server: { proxy: { '/api': 'http://localhost:8080' } }
```

### 4-4. axios baseURL
- `baseURL: ''` (빈 문자열) → Vite 프록시 경유
- 직접 8080 호출 시 CORS 에러 발생하므로 반드시 프록시 사용

## 완료 기준
- [ ] 프론트에서 /api/menus/tree 호출 성공
- [ ] 프록시 경유로 CORS 에러 없음
