# Step 1 — 데이터 구조와 트리 변환

## flat 배열 vs 트리 구조

Level 5의 핵심은 **데이터는 flat 배열, 렌더링은 트리**로 관리하는 것입니다.

### flat 배열 (상태 관리용)
```typescript
const items: TreeItem[] = [
  { id: 'menu-1', label: '홈',       depth: 1, parentId: null },
  { id: 'menu-2', label: '학습',     depth: 1, parentId: null },
  { id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2' },
  { id: 'menu-2-2', label: '백엔드',   depth: 2, parentId: 'menu-2' },
  { id: 'menu-3', label: '내 카드',   depth: 1, parentId: null },
  ...
]
```
- 배열 순서 = 화면 표시 순서
- `parentId`로 부모-자식 관계 표현
- `arrayMove`로 순서 변경이 간단

### 트리 구조 (렌더링용)
```typescript
function buildTree(items: TreeItem[]): TreeNode[] {
  // Map으로 모든 노드 등록
  // parentId가 있으면 부모의 children에 추가
  // parentId가 없으면 roots에 추가
}
```
- 화면에 들여쓰기 + 부모-자식 관계 표현
- `tree.map(node => ...)` + `node.children.map(child => ...)`

### 왜 이중 구조인가?
- **flat 배열**: DnD 순서 변경이 쉬움 (`arrayMove` 한 줄)
- **트리 구조**: 렌더링이 자연스러움 (부모 아래 자식 표시)
- 매 렌더링마다 `buildTree(items)` 호출 → 항상 최신 트리

## SortableContext에 넣는 id

```typescript
const sortableIds = items
  .filter((i) => i.depth === filterDepth)  // 선택한 depth만
  .map((i) => i.id)                        // id만 추출
```

- 1차 메뉴 모드: `['menu-1', 'menu-2', 'menu-3', 'menu-4']`
- 2차 메뉴 모드: `['menu-2-1', 'menu-2-2', 'menu-4-1', 'menu-4-2']`
- **이 목록에 없는 아이템은 드래그 불가** (disabled 처리)
