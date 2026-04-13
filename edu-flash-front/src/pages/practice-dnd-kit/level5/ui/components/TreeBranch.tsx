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
    <div className="relative">
      <SortableMenuItem
        item={node}
        isDragDisabled={node.depth !== filterDepth}
        isDragging={activeId === node.id}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggle={() => onToggleExpanded(node.id)}
      />
      
      {/* 자식 렌더링 시 상단 여백 조절 및 연속성 있는 레이아웃 */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
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
