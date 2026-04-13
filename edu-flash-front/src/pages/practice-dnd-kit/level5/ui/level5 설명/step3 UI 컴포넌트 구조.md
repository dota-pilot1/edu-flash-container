# Step 3 — UI 컴포넌트 구조

## 컴포넌트 계층

```
Level5Page
├── DndContext (sensors, collisionDetection, onDragStart, onDragEnd)
│   ├── SortableContext (sortableIds, verticalListSortingStrategy)
│   │   └── tree.map(node =>
│   │       ├── SortableMenuItem (1차 메뉴)
│   │       └── node.children.map(child =>
│   │           └── SortableMenuItem (2차 메뉴)
│   │       )
│   │   )
│   └── DragOverlay
│       └── DragOverlayCard
```

## SortableMenuItem — 핵심 패턴

```tsx
function SortableMenuItem({ item, isDragDisabled, isDragging }) {
  const { setNodeRef, transform, transition, isDragging: isSortableDragging }
    = useSortable({ id: item.id, disabled: isDragDisabled })

  return (
    // 외부 div: useSortable ref + transform (위치 이동 담당)
    <div ref={setNodeRef} style={{ transform, transition }}
         className={isSortableDragging ? 'opacity-0' : ''}>
      
      // 내부 div: 시각적 카드 (attributes + listeners 여기에)
      <div {...attributes} {...listeners}>
        드래그 핸들 | 아이콘 | 메뉴명 | 잠김 뱃지
      </div>
    </div>
  )
}
```

### 왜 div가 2중인가?
- **외부 div**: `useSortable`의 transform/transition 적용 → 다른 아이템이 비켜주는 애니메이션
- **내부 div**: 시각적 카드 디자인 → isDragging일 때 외부만 opacity-0으로 숨기고, DragOverlay가 대신 표시
- 한 div에 합치면 opacity-0이 transform과 충돌

### disabled 처리
```typescript
useSortable({ id: item.id, disabled: isDragDisabled })
```
- `isDragDisabled = item.depth !== filterDepth`
- 1차 메뉴 모드에서 2차 메뉴는 드래그 불가
- 시각적으로 "잠김" 뱃지 표시 + cursor-default

## DragOverlayCard — 드래그 중 분신

```tsx
function DragOverlayCard({ item }) {
  return (
    <div className="border-blue-300 shadow-xl">
      드래그 핸들(파란색) | 아이콘(파란색) | 메뉴명
      {item.depth === 1 && "하위 메뉴도 함께 이동"}  // 1차 메뉴일 때만 표시
    </div>
  )
}
```

- 원본과 거의 같은 디자인이지만 **파란색 테마 + 그림자**로 구분
- 1차 메뉴 드래그 시 "하위 메뉴도 함께 이동" 안내 텍스트

## Step 9 (메뉴 관리 DnD) 적용 시 달라지는 점

| Level 5 (실습) | Step 9 (실전) |
|---------------|--------------|
| 하드코딩된 메뉴 데이터 | DB에서 useQuery로 조회 |
| useState로 상태 관리 | useMutation + invalidateQueries |
| treeAwareMove (프론트만) | PUT /api/menus/reorder API 호출 |
| 리셋 버튼 | 저장 시 서버에 영구 반영 |
