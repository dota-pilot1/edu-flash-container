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
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'

// 학습 포인트:
// 전략: 드래그 중에는 하이라이트만, 드롭 시 swap + framer-motion layout 애니메이션
// 드래그 중 미리보기 swap은 dnd-kit transform과 framer-motion layout이 충돌하므로 안 씀
// key={item.id}로 React가 아이템을 추적 → 배열 swap 시 motion layout이 위치 전환 애니메이션

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

function GridCell({
  item,
  activeId,
}: {
  item: { id: string; label: string; color: string }
  activeId: string | null
}) {
  // 드래그 시작 감지 (transform은 적용하지 않음 — DragOverlay가 대신 보여줌)
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: item.id })
  // 드롭 대상 감지
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: item.id })

  return (
    // motion.div에 layout → 배열 순서 바뀌면 자동으로 위치 애니메이션
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      ref={(node) => { setDragRef(node); setDropRef(node) }}
      {...attributes}
      {...listeners}
      className={`flex h-24 cursor-grab items-center justify-center rounded-lg border text-2xl font-bold shadow-sm select-none ${item.color} ${
        isDragging
          ? 'opacity-0'                          // 원본 숨김 → DragOverlay가 표시
          : isOver && activeId !== item.id
            ? 'ring-2 ring-blue-400 scale-110'    // 드롭 대상 하이라이트
            : 'hover:shadow-md'
      }`}
    >
      {item.label}
    </motion.div>
  )
}

// 배열에서 두 요소의 위치를 교체하는 유틸 함수
function arraySwap<T extends { id: string }>(arr: T[], fromId: string, toId: string): T[] {
  const result = [...arr]
  const fromIndex = result.findIndex((i) => i.id === fromId)
  const toIndex = result.findIndex((i) => i.id === toId)
  if (fromIndex === -1 || toIndex === -1) return result
  ;[result[fromIndex], result[toIndex]] = [result[toIndex], result[fromIndex]]
  return result
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

  // 드롭 시 swap → motion layout이 애니메이션 처리
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      setItems((prev) => arraySwap(prev, active.id as string, over.id as string))
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 4 — 그리드 스왑</h1>
      <p className="mt-2 text-gray-500">아이템을 드래그해서 1:1로 자리를 바꿔보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> motion.div layout으로 swap 애니메이션, key=item.id로 React 추적
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-8 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <GridCell key={item.id} item={item} activeId={activeId} />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className={`flex h-24 items-center justify-center rounded-lg border text-2xl font-bold shadow-lg ${activeItem.color}`}>
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
