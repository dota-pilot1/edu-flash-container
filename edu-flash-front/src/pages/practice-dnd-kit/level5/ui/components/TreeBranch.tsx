import type { TreeNode } from '../../model/types'
import { SortableMenuItem } from './SortableMenuItem'

interface Props {
  node: TreeNode
  filterDepth: number
  activeId: string | null
}

export function TreeBranch({ node, filterDepth, activeId }: Props) {
  return (
    <div>
      <SortableMenuItem
        item={node}
        isDragDisabled={node.depth !== filterDepth}
        isDragging={activeId === node.id}
      />
      
      {/* 재귀적 구조: 자식이 있다면 그 자식들도 다시 TreeBranch로 렌더링 */}
      {node.children.length > 0 && (
        <div className="mt-2 space-y-2 pb-2">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              filterDepth={filterDepth}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
