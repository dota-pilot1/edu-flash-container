import { useState } from 'react'
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove, defaultAnimateLayoutChanges, type AnimateLayoutChanges } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'

// 구조적 이해:
// DndContext: 드래그 앤 드롭 컨텍스트
// closestCorners: 가장 가까운 모서리 충돌 감지
// DragOverlay: 드래그 중인 요소의 "분신" — 마우스를 따라다니는 복제본
// PointerSensor: 마우스/터치 감지 센서, activationConstraint로 미세 움직임 무시
// onDragStart: 드래그 시작 → activeId 저장
// onDragOver: 드래그 중 다른 컨테이너 위 → 아이템을 해당 컨테이너로 이동
// onDragEnd: 드롭 완료 → 같은 컨테이너 내 순서 정렬

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

// 부드러운 전환의 핵심:
// wasDragging: true → 드래그 끝난 직후 레이아웃 점프 방지
const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })

function SortableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges,
  })

  // transform: 드래그 중 아이템의 실시간 위치 (마우스 따라감)
  // transition: 다른 아이템들이 "비켜주는" 애니메이션
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
      // isDragging → opacity-0: 원본 숨기고 DragOverlay만 보여줌
      className={`cursor-grab rounded-md border bg-white px-3 py-2 text-sm shadow-sm ${isDragging ? 'opacity-0' : 'border-gray-200'
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

  // 센서 설정: 5px 이상 움직여야 드래그 시작
  // → 클릭과 드래그를 구분, 미세 떨림 방지
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const activeItem = activeId
    ? Object.values(containers).flat().find((i) => i.id === activeId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // 핵심: 컨테이너 간 이동 + 같은 컨테이너 내 정렬을 모두 여기서 처리
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    // 드래그 중인 아이템의 컨테이너
    const activeContainer = findContainer(containers, active.id as string)

    // 마우스가 올라가 있는 곳의 컨테이너
    const overContainer = findContainer(containers, over.id as string) ?? (over.id as ContainerId)

    // 컨테이너가 없으면 리턴
    if (!activeContainer || !overContainer) return

    // 다른 컨테이너로 이동하는 경우
    if (activeContainer !== overContainer) {
      setContainers((prev) => {
        const activeItems = [...prev[activeContainer]]
        const overItems = [...prev[overContainer]]
        const activeIndex = activeItems.findIndex((i) => i.id === active.id)
        const [movingItem] = activeItems.splice(activeIndex, 1)

        // 핵심: push가 아니라 over 위치에 삽입 → 부드러운 삽입 효과
        const overIndex = overItems.findIndex((i) => i.id === over.id)
        if (overIndex >= 0) {
          overItems.splice(overIndex, 0, movingItem)
        } else {
          overItems.push(movingItem)
        }

        return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems }
      })
    }
    // 같은 컨테이너 내 순서 변경
    else {
      const activeIndex = containers[activeContainer].findIndex((i) => i.id === active.id)
      const overIndex = containers[activeContainer].findIndex((i) => i.id === over.id)

      if (activeIndex !== overIndex && overIndex !== -1) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }))
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 3 — 다중 컨테이너 (칸반)</h1>
      <p className="mt-2 text-gray-500">카드를 다른 컬럼으로 드래그해서 이동시켜보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> 다중 SortableContext, DragOverlay, onDragOver에서 위치 삽입, PointerSensor
      </div>

      <DndContext
        sensors={sensors}
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
