import { useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const colors = [
  'bg-red-100 text-red-700 border-red-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-teal-100 text-teal-700 border-teal-200',
]

const initialItems = Array.from({ length: 9 }, (_, i) => ({
  id: `grid-${i + 1}`,
  label: `${i + 1}`,
  color: colors[i],
}))

function SortableGridItem({ id, children, color }: { id: string; children: React.ReactNode; color: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex h-24 cursor-grab items-center justify-center rounded-lg border text-2xl font-bold shadow-sm transition-shadow ${color} ${
        isDragging ? 'z-10 opacity-50 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      {children}
    </div>
  )
}

export function Level4Page() {
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
      <h1 className="text-2xl font-bold text-gray-900">Level 4 — 그리드 정렬</h1>
      <p className="mt-2 text-gray-500">그리드 아이템을 드래그해서 위치를 바꿔보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> rectSortingStrategy, 그리드 레이아웃에서의 정렬
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {items.map((item) => (
              <SortableGridItem key={item.id} id={item.id} color={item.color}>
                {item.label}
              </SortableGridItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 rounded-md bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">현재 순서:</h3>
        <p className="mt-1 text-sm text-gray-500">{items.map((i) => i.label).join(', ')}</p>
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
