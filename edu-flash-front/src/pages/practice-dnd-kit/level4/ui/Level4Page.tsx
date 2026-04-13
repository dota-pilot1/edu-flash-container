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
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

// 학습 포인트:
// SortableContext는 "밀림(shift)" 애니메이션이 기본 → 그리드 swap에 부적합
// useDraggable + useDroppable 조합으로 순수 swap 구현
// DragOverlay로 드래그 중 시각적 피드백

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

// 각 그리드 셀: 드래그 가능 + 드롭 대상
function GridCell({
  id,
  children,
  color,
  isDragActive,
  isOver,
}: {
  id: string
  children: React.ReactNode
  color: string
  isDragActive: boolean
  isOver: boolean
}) {
  // useDraggable: 이 셀을 집을 수 있게
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({ id })

  // useDroppable: 다른 셀이 여기 위로 올 수 있게
  const { setNodeRef: setDropRef, isOver: isOverThis } = useDroppable({ id })

  const active = isOver || isOverThis

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={(node) => {
        setDragRef(node)
        setDropRef(node)
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex h-24 cursor-grab items-center justify-center rounded-lg border text-2xl font-bold shadow-sm transition-all ${color} ${
        isDragging
          ? 'opacity-0'  // 원본 숨기기 → DragOverlay가 대신 표시
          : active
            ? 'ring-2 ring-blue-400 scale-105' // 드롭 대상 하이라이트
            : 'hover:shadow-md'
      }`}
    >
      {children}
    </div>
  )
}

export function Level4Page() {
  const [items, setItems] = useState(initialItems)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // swap: 두 아이템의 위치만 교체 (나머지는 안 움직임)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const arr = [...prev]
        const oldIndex = arr.findIndex((i) => i.id === active.id)
        const newIndex = arr.findIndex((i) => i.id === over.id)
        ;[arr[oldIndex], arr[newIndex]] = [arr[newIndex], arr[oldIndex]]
        return arr
      })
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 4 — 그리드 스왑</h1>
      <p className="mt-2 text-gray-500">아이템을 드래그해서 1:1로 자리를 바꿔보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> SortableContext 없이 useDraggable + useDroppable로 순수 swap 구현, DragOverlay
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-8 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <GridCell
              key={item.id}
              id={item.id}
              color={item.color}
              isDragActive={activeId !== null}
              isOver={false}
            >
              {item.label}
            </GridCell>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className={`flex h-24 w-full items-center justify-center rounded-lg border text-2xl font-bold shadow-lg ${activeItem.color}`}>
              {activeItem.label}
            </div>
          ) : null}
        </DragOverlay>
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
