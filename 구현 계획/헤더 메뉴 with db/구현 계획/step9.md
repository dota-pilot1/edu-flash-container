# Step 9 — 메뉴 드래그 앤 드롭 순서 변경

## 목표
같은 depth 내에서 메뉴 순서를 DnD로 변경, 서버에 sortOrder 반영

## 범위
- ✅ 같은 부모(depth) 내 순서 변경 (홈 ↔ 학습 ↔ 내 카드 ↔ 설정)
- ❌ 부모 이동 (2차 메뉴를 다른 1차 메뉴로 이동) — 추후 확장

## 작업 내용

### 9-1. 라이브러리 설치
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 9-2. 백엔드 API 추가
```
PUT /api/menus/reorder
Body: [{ id: 1, sortOrder: 0 }, { id: 2, sortOrder: 1 }, ...]
```
- MenuController에 reorder 엔드포인트 추가
- MenuService에서 벌크 업데이트 (같은 parentId 그룹)

### 9-3. 프론트 entities/menu 확장
```typescript
// api/menuApi.ts
menuApi.reorder(items: { id: number; sortOrder: number }[])
  → PUT /api/menus/reorder
```

### 9-4. MenuTree DnD 적용
```
features/menu-manage/
└── ui/MenuTree.tsx    (수정) DndContext + SortableContext 적용
```

- 같은 부모의 children을 `SortableContext`로 감싸기
- 각 TreeNode를 `useSortable` 훅으로 래핑
- 드래그 핸들 (⠿ 아이콘) 추가
- 드래그 시 시각적 피드백 (opacity, 드래그 오버레이)
- 드롭 시 `onDragEnd` → sortOrder 재계산 → reorder API 호출

### 9-5. 트리 구조에서의 DnD 규칙
- 같은 parentId를 가진 노드끼리만 정렬 가능
- 다른 depth 영역으로 드래그 시 → 무시 (drop 안 됨)
- 드롭 후 → `invalidateQueries(['menus'])` → 트리 갱신

### 9-6. 헤더 반영
- 트리에서 순서 변경 → API 호출 → 헤더 메뉴 순서도 자동 갱신
- useQuery 캐시 무효화로 별도 작업 불필요

## 완료 기준
- [ ] 1차 메뉴 간 DnD 순서 변경 가능
- [ ] 2차 메뉴 간 (같은 부모 하위) DnD 순서 변경 가능
- [ ] 드롭 후 서버에 sortOrder 저장
- [ ] 헤더 메뉴 순서 자동 반영
- [ ] 다른 depth로 드래그 시 무시됨
