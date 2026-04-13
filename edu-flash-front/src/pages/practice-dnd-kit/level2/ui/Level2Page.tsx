import { useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border bg-white px-4 py-3 transition-shadow ${
        isDragging ? 'z-10 border-blue-300 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {children}
    </div>
  )
}

const initialItems = [
  { id: 'item-1', label: '🍎 사과' },
  { id: 'item-2', label: '🍌 바나나' },
  { id: 'item-3', label: '🍇 포도' },
  { id: 'item-4', label: '🍊 오렌지' },
  { id: 'item-5', label: '🍓 딸기' },
]

export function Level2Page() {
  const [items, setItems] = useState(initialItems)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id)
        const newIndex = prev.findIndex((i) => i.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 2 — 정렬 리스트</h1>
      <p className="mt-2 text-gray-500">아이템을 드래그해서 순서를 변경해보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> SortableContext, useSortable, arrayMove, verticalListSortingStrategy
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-8 space-y-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">{index + 1}</span>
                  <span>{item.label}</span>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 rounded-md bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">현재 순서:</h3>
        <p className="mt-1 text-sm text-gray-500">{items.map((i) => i.label).join(' → ')}</p>
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
