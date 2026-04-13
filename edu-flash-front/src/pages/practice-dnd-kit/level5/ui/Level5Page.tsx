import { useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
]

function SortableTreeItem({ item, isDragDisabled }: { item: TreeItem; isDragDisabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isDragDisabled,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm transition-all ${
        isDragging ? 'z-10 border-blue-300 opacity-50 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md'
      } ${isDragDisabled ? 'cursor-default opacity-60' : 'cursor-grab'}`}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-mono text-gray-500"
        style={{ marginLeft: `${(item.depth - 1) * 20}px` }}
      >
        {item.depth}
      </span>
      <span>{item.label}</span>
      {isDragDisabled && (
        <span className="ml-auto text-[10px] text-gray-400">같은 depth만 이동 가능</span>
      )}
    </div>
  )
}

export function Level5Page() {
  const [items, setItems] = useState(initialItems)
  const [filterDepth, setFilterDepth] = useState<number>(1)

  const sortableIds = items.filter((i) => i.depth === filterDepth).map((i) => i.id)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeItem = items.find((i) => i.id === active.id)
    const overItem = items.find((i) => i.id === over.id)
    if (!activeItem || !overItem || activeItem.depth !== overItem.depth) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 5 — 트리 정렬 (메뉴 순서 변경)</h1>
      <p className="mt-2 text-gray-500">같은 depth의 메뉴끼리만 순서를 바꿀 수 있습니다.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> depth별 SortableContext 분리, disabled 드래그, Step 9 메뉴 DnD의 핵심 패턴
      </div>

      <div className="mt-6 flex gap-2">
        <span className="text-sm text-gray-500 leading-8">정렬 대상:</span>
        {[1, 2].map((d) => (
          <button
            key={d}
            onClick={() => setFilterDepth(d)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              filterDepth === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d}차 메뉴
          </button>
        ))}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="mt-4 space-y-1.5">
            {items.map((item) => (
              <SortableTreeItem
                key={item.id}
                item={item}
                isDragDisabled={item.depth !== filterDepth}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 rounded-md bg-gray-50 p-4">
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
        className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        리셋
      </button>
    </main>
  )
}
