# buildTree 함수를 이용한 트리 구조 ui 렌더링 과정 집중 분석

## 1. 함수의 전체 코드
```typescript
export function buildTree(items: TreeItem[]): TreeNode[] {
  const roots: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  // 1단계: 모든 아이템 보관함(Map) 등록
  for (const item of items) {
    // 각각의 요소를 찾은뒤 with item.id
    // 그 자리에 새로운 객체를 만들어서 대체 (바뀐 내용은 children: [] 추가)
    map.set(item.id, { ...item, children: [] })
  }

  // 2단계: 부모-자식 관계 연결
  for (const item of items) {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      // 부모가 있으면 부모의 children 배열에 나를 추가 (참조 활용)
      map.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}
```

## 2. 데이터 변화 시각화

### [1단계: Map 등록 결과]
모든 아이템이 `children: []` 주머니를 가지고 이름표(ID)와 함께 보관소에 저장됩니다.

**before:**
```javascript
{ id: 'menu-1', label: '홈', depth: 1, parentId: null },
{ id: 'menu-2', label: '학습', depth: 1, parentId: null },
{ id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2' },
...
```

**after:**
```javascript
{ id: 'menu-1', label: '홈', depth: 1, parentId: null, children: [] },
{ id: 'menu-2', label: '학습', depth: 1, parentId: null, children: [] },
{ id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2', children: [] },
...
```

### [2단계: 부모-자식 관계 연결 결과]
부모 노드의 `children` 배열 안에 자식 노드들이 들어간 계층 구조가 완성됩니다.

**after (최종 roots 배열):**
```javascript
[  
  { id: 'menu-1', label: '홈', depth: 1, parentId: null, children: [] },
  { 
    id: 'menu-2', 
    label: '학습', 
    depth: 1, 
    parentId: null, 
    children: [
      { id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2', children: [] },
      { id: 'menu-2-2', label: '백엔드', depth: 2, parentId: 'menu-2', children: [] }
    ] 
  },
  { id: 'menu-3', label: '내 카드', depth: 1, parentId: null, children: [] },
  { 
    id: 'menu-4', 
    label: '설정', 
    depth: 1, 
    parentId: null, 
    children: [
      { id: 'menu-4-1', label: '프로필', depth: 2, parentId: 'menu-4', children: [] },
      { id: 'menu-4-2', label: '알림', depth: 2, parentId: 'menu-4', children: [] }
    ] 
  }
]
```

## 3. 계층형 UI 렌더링 (TSX 리액트 코드)

가공된 `roots` 배열을 순회하며 리액트 컴포넌트로 변환하는 최종 단계입니다.

```tsx
{tree.map((node) => (
  /* [부모 노드 렌더링] */
  <div key={node.id}>
    <SortableMenuItem 
      item={node} 
      isDragDisabled={node.depth !== filterDepth} 
    />
    
    /* [자식 노드 존재 여부 확인 후 렌더링] */
    {node.children.length > 0 && (
      <div className="mt-2 space-y-2 pb-2 pl-8"> {/* pl-8로 시각적 들여쓰기 구현 */}
        {node.children.map((child) => (
          <SortableMenuItem
            key={child.id}
            item={child}
            isDragDisabled={child.depth !== filterDepth}
          />
        ))}
      </div>
    )}
  </div>
))}
```

### 🔍 렌더링 핵심 포인트
1.  **중첩 Map**: `tree.map` 안에서 다시 `node.children.map`을 호출함으로써 시각적인 계층 구조(Tree)를 완성합니다.
2.  **조건부 렌더링**: `{node.children.length > 0 && ...}` 를 통해 자식이 있는 경우에만 서브 메뉴 영역을 렌더링합니다.
3.  **컴포넌트 재사용**: 부모 노드와 자식 노드 모두 동일한 `<SortableMenuItem />` 컴포넌트를 사용하며, 디자인적 차이(들여쓰기 등)는 CSS 클래스로 처리합니다.