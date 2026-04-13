import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 학습 포인트:
// 트리 구조에서의 DnD 핵심: 1차 메뉴 이동 시 하위 메뉴도 함께 이동
// 데이터를 flat 배열로 관리하되, 렌더링은 트리 구조로 보여줌
// SortableContext에는 같은 depth의 id만 넣어서 정렬 제한

interface TreeItem {
  id: string
  label: string
  depth: number
  parentId: string | null
}

const initialItems: TreeItem[] = [
  { id: 'menu-1', label: '홈', depth: 1, parentId: null },
  { id: 'menu-2', label: '학습', depth: 1, parentId: null },
  { id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2' },
  { id: 'menu-2-2', label: '백엔드', depth: 2, parentId: 'menu-2' },
  { id: 'menu-3', label: '내 카드', depth: 1, parentId: null },
  { id: 'menu-4', label: '설정', depth: 1, parentId: null },
  { id: 'menu-4-1', label: '프로필', depth: 2, parentId: 'menu-4' },
  { id: 'menu-4-2', label: '알림', depth: 2, parentId: 'menu-4' },
]

// flat 배열 → 트리 구조로 변환 (렌더링용)
interface TreeNode extends TreeItem {
  children: TreeNode[]
}

function buildTree(items: TreeItem[]): TreeNode[] {
  const roots: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  for (const item of items) {
    map.set(item.id, { ...item, children: [] })
  }
  for (const item of items) {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

// 1차 메뉴 이동 시 하위 메뉴도 함께 이동하는 arrayMove
function treeAwareMove(items: TreeItem[], activeId: string, overId: string): TreeItem[] {
  const activeItem = items.find((i) => i.id === activeId)
  const overItem = items.find((i) => i.id === overId)
  if (!activeItem || !overItem || activeItem.depth !== overItem.depth) return items

  // 1차 메뉴인 경우: 본인 + 하위 메뉴를 하나의 블록으로 이동
  if (activeItem.depth === 1) {
    // 블록 단위로 분리: [부모+자식들, 부모+자식들, ...]
    const blocks: TreeItem[][] = []
    let currentBlock: TreeItem[] = []

    for (const item of items) {
      if (item.depth === 1) {
        if (currentBlock.length > 0) blocks.push(currentBlock)
        currentBlock = [item]
      } else {
        currentBlock.push(item)
      }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock)

    // 블록 단위로 순서 변경
    const oldIndex = blocks.findIndex((b) => b[0].id === activeId)
    const newIndex = blocks.findIndex((b) => b[0].id === overId)
    const reordered = arrayMove(blocks, oldIndex, newIndex)

    return reordered.flat()
  }

  // 2차 이상: 개별 아이템만 이동 (같은 부모 내에서)
  if (activeItem.parentId !== overItem.parentId) return items
  const oldIndex = items.findIndex((i) => i.id === activeId)
  const newIndex = items.findIndex((i) => i.id === overId)
  return arrayMove(items, oldIndex, newIndex)
}

function SortableMenuItem({
  item,
  isDragDisabled,
  isDragging,
}: {
  item: TreeItem
  isDragDisabled: boolean
  isDragging: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id, disabled: isDragDisabled })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isSortableDragging ? 'opacity-0' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`group flex items-center rounded-lg border bg-white transition-all ${
          isDragDisabled
            ? 'cursor-default border-gray-100'
            : 'cursor-grab border-gray-200 hover:border-gray-300 hover:shadow-sm active:cursor-grabbing'
        } ${item.depth === 1 ? 'px-4 py-3' : 'ml-8 px-3 py-2'}`}
      >
        {/* 드래그 핸들 */}
        {!isDragDisabled && (
          <svg className="mr-3 h-4 w-4 shrink-0 text-gray-300 group-hover:text-gray-500" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
            <circle cx="12" cy="3" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
          </svg>
        )}
        {isDragDisabled && <span className="mr-3 w-4" />}

        {/* 메뉴 아이콘 */}
        <span className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
          item.depth === 1
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {item.label.charAt(0)}
        </span>

        {/* 메뉴 정보 */}
        <div className="flex-1 min-w-0">
          <p className={`truncate ${item.depth === 1 ? 'text-sm font-semibold text-gray-900' : 'text-sm text-gray-600'}`}>
            {item.label}
          </p>
          <p className="text-[11px] text-gray-400">
            {item.depth}차 메뉴
          </p>
        </div>

        {/* 상태 */}
        {isDragDisabled && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
            잠김
          </span>
        )}
      </div>
    </div>
  )
}

// DragOverlay용 카드
function DragOverlayCard({ item }: { item: TreeItem }) {
  return (
    <div className={`flex items-center rounded-lg border border-blue-300 bg-white shadow-xl ${
      item.depth === 1 ? 'px-4 py-3' : 'px-3 py-2'
    }`}>
      <svg className="mr-3 h-4 w-4 shrink-0 text-blue-400" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
        <circle cx="12" cy="3" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
      </svg>
      <span className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
        item.depth === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
      }`}>
        {item.label.charAt(0)}
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
        {item.depth === 1 && (
          <p className="text-[11px] text-blue-500">하위 메뉴도 함께 이동</p>
        )}
      </div>
    </div>
  )
}

export function Level5Page() {
  const [items, setItems] = useState(initialItems)
  const [filterDepth, setFilterDepth] = useState<number>(1)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null
  const tree = buildTree(items)

  // 현재 depth의 sortable id 목록
  const sortableIds = items
    .filter((i) => i.depth === filterDepth)
    .map((i) => i.id)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    setItems((prev) => treeAwareMove(prev, active.id as string, over.id as string))
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 5 — 트리 정렬 (메뉴 순서 변경)</h1>
      <p className="mt-2 text-gray-500">같은 depth의 메뉴끼리만 순서를 바꿀 수 있습니다.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> treeAwareMove(블록 단위 이동), depth별 SortableContext 분리, Step 9 핵심 패턴
      </div>

      {/* depth 필터 */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm text-gray-500">정렬 대상:</span>
        {[1, 2].map((d) => (
          <button
            key={d}
            onClick={() => setFilterDepth(d)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterDepth === d
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {d}차 메뉴
          </button>
        ))}
      </div>

      {/* 트리 리스트 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="mt-4 space-y-1">
            {tree.map((node) => (
              <div key={node.id}>
                <SortableMenuItem
                  item={node}
                  isDragDisabled={node.depth !== filterDepth}
                  isDragging={activeId === node.id}
                />
                {node.children.length > 0 && (
                  <div className="space-y-1 py-1">
                    {node.children.map((child) => (
                      <SortableMenuItem
                        key={child.id}
                        item={child}
                        isDragDisabled={child.depth !== filterDepth}
                        isDragging={activeId === child.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeItem ? <DragOverlayCard item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* 현재 순서 표시 */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">{filterDepth}차 메뉴 순서:</h3>
        <p className="mt-1 text-sm text-gray-500">
          {items
            .filter((i) => i.depth === filterDepth)
            .map((i) => i.label)
            .join(' → ')}
        </p>
      </div>

      <button
        onClick={() => setItems(initialItems)}
        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        리셋
      </button>
    </main>
  )
}
