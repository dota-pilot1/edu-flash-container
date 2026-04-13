import type { TreeNode } from '../../model/types'
import { SortableMenuItem } from './SortableMenuItem'

interface Props {
  node: TreeNode
  filterDepth: number
  activeId: string | null
  expandedIds: Set<string>
  onToggleExpanded: (id: string) => void
}

export function TreeBranch({ node, filterDepth, activeId, expandedIds, onToggleExpanded }: Props) {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <SortableMenuItem
        item={node}
        isDragDisabled={node.depth !== filterDepth}
        isDragging={activeId === node.id}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggle={() => onToggleExpanded(node.id)}
      />
      
      {/* 재귀적 구조: 자식이 있고 + 부모가 열려 있을 때만 렌더링 */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2 pb-2">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              filterDepth={filterDepth}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
