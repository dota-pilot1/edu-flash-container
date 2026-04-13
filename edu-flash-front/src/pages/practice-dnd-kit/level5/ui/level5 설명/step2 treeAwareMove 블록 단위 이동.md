# Step 2 — treeAwareMove: 블록 단위 이동

## 문제: 단순 arrayMove의 한계

```
[홈, 학습, 프론트엔드, 백엔드, 내 카드, 설정]
```

여기서 "학습"을 "설정" 뒤로 `arrayMove`하면:

```
[홈, 프론트엔드, 백엔드, 내 카드, 설정, 학습]
```

**프론트엔드, 백엔드가 학습에서 분리됨!** 하위 메뉴가 따라가지 않는 문제.

## 해결: 블록 단위 이동

### 1단계: flat 배열을 블록으로 분리

```typescript
// 1차 메뉴를 만날 때마다 새 블록 시작
const blocks: TreeItem[][] = []
let currentBlock: TreeItem[] = []

for (const item of items) {
  if (item.depth === 1) {
    if (currentBlock.length > 0) blocks.push(currentBlock)
    currentBlock = [item]        // 새 블록 시작
  } else {
    currentBlock.push(item)      // 현재 블록에 추가
  }
}
if (currentBlock.length > 0) blocks.push(currentBlock)
```

결과:
```
blocks = [
  [홈],                          // 블록 0
  [학습, 프론트엔드, 백엔드],      // 블록 1 (부모+자식 묶음)
  [내 카드],                      // 블록 2
  [설정, 프로필, 알림],            // 블록 3 (부모+자식 묶음)
]
```

### 2단계: 블록 단위로 arrayMove

```typescript
const oldIndex = blocks.findIndex((b) => b[0].id === activeId)   // 학습 블록: 1
const newIndex = blocks.findIndex((b) => b[0].id === overId)     // 설정 블록: 3
const reordered = arrayMove(blocks, oldIndex, newIndex)
```

결과:
```
reordered = [
  [홈],
  [내 카드],
  [설정, 프로필, 알림],
  [학습, 프론트엔드, 백엔드],      // 통째로 이동!
]
```

### 3단계: flat으로 펼치기

```typescript
return reordered.flat()
// [홈, 내 카드, 설정, 프로필, 알림, 학습, 프론트엔드, 백엔드]
```

## 2차 메뉴 이동

2차 메뉴는 블록 단위가 아니라 **같은 부모 내에서만** 개별 이동:

```typescript
if (activeItem.parentId !== overItem.parentId) return items  // 다른 부모면 무시
const oldIndex = items.findIndex((i) => i.id === activeId)
const newIndex = items.findIndex((i) => i.id === overId)
return arrayMove(items, oldIndex, newIndex)
```

- "프론트엔드" ↔ "백엔드" (같은 부모 "학습") → OK
- "프론트엔드" ↔ "프로필" (다른 부모) → 무시
