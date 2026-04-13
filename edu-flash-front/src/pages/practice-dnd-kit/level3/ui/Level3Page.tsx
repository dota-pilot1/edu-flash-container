import { useState } from 'react'
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'

type ContainerId = 'todo' | 'doing' | 'done'

interface Item {
  id: string
  label: string
}

const initialContainers: Record<ContainerId, Item[]> = {
  todo: [
    { id: 't1', label: 'DnD 기본 학습' },
    { id: 't2', label: 'Sortable 구현' },
    { id: 't3', label: '트리 DnD 적용' },
  ],
  doing: [{ id: 'd1', label: '다중 컨테이너 실습' }],
  done: [{ id: 'x1', label: '프로젝트 세팅' }],
}

function SortableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-md border bg-white px-3 py-2 text-sm shadow-sm ${
        isDragging ? 'opacity-50' : 'border-gray-200'
      }`}
    >
      {children}
    </div>
  )
}

function Container({ id, title, items, color }: { id: string; title: string; items: Item[]; color: string }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="flex flex-col rounded-lg border border-gray-200 bg-gray-50">
      <div className={`rounded-t-lg px-3 py-2 text-sm font-medium ${color}`}>
        {title} ({items.length})
      </div>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[100px] space-y-1.5 p-2">
          {items.map((item) => (
            <SortableCard key={item.id} id={item.id}>
              {item.label}
            </SortableCard>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function findContainer(containers: Record<ContainerId, Item[]>, itemId: string): ContainerId | undefined {
  for (const [key, items] of Object.entries(containers)) {
    if (items.some((i) => i.id === itemId)) return key as ContainerId
  }
  return undefined
}

export function Level3Page() {
  const [containers, setContainers] = useState(initialContainers)
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeItem = activeId
    ? Object.values(containers).flat().find((i) => i.id === activeId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeContainer = findContainer(containers, active.id as string)
    const overContainer = findContainer(containers, over.id as string) ?? (over.id as ContainerId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) return

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]]
      const overItems = [...prev[overContainer]]
      const activeIndex = activeItems.findIndex((i) => i.id === active.id)
      const [movedItem] = activeItems.splice(activeIndex, 1)
      overItems.push(movedItem)

      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeContainer = findContainer(containers, active.id as string)
    if (!activeContainer) return

    const oldIndex = containers[activeContainer].findIndex((i) => i.id === active.id)
    const newIndex = containers[activeContainer].findIndex((i) => i.id === over.id)

    if (oldIndex !== newIndex && newIndex !== -1) {
      setContainers((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
      }))
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 3 — 다중 컨테이너 (칸반)</h1>
      <p className="mt-2 text-gray-500">카드를 다른 컬럼으로 드래그해서 이동시켜보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> 다중 SortableContext, DragOverlay, onDragOver로 컨테이너 간 이동
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Container id="todo" title="📋 할 일" items={containers.todo} color="bg-gray-200 text-gray-700" />
          <Container id="doing" title="🔨 진행 중" items={containers.doing} color="bg-blue-100 text-blue-700" />
          <Container id="done" title="✅ 완료" items={containers.done} color="bg-green-100 text-green-700" />
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="rounded-md border border-blue-300 bg-white px-3 py-2 text-sm shadow-lg">
              {activeItem.label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        onClick={() => setContainers(initialContainers)}
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        리셋
      </button>
    </main>
  )
}
