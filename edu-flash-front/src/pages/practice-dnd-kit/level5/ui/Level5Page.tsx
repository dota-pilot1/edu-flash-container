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
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// 분리한 데이터 및 유틸 가져오기
import { initialItems } from '../model/initialData'
import { buildTree, treeAwareMove } from '../lib/treeUtils'

// 분리한 컴포넌트 가져오기
import { TreeBranch } from './components/TreeBranch'
import { DragOverlayCard } from './components/DragOverlayCard'

export function Level5Page() {
  const [items, setItems] = useState(initialItems)
  const [filterDepth, setFilterDepth] = useState<number>(1)
  const [activeId, setActiveId] = useState<string | null>(null)

  // 열려있는 메뉴들의 ID를 관리하는 Set
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['menu-2'])) 

  // 메뉴 열고 닫기 토글 함수
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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

    // 드래그한 요소가 없거나, 드래그한 요소와 드롭된 요소가 같으면 아무것도 하지 않음
    if (!over || active.id === over.id) return

    setItems((prev) => treeAwareMove(prev, active.id as string, over.id as string))
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Level 5 — 트리 정렬 (메뉴 순서 변경)</h1>
          <p className="mt-1 text-gray-500">같은 depth의 메뉴끼리만 순서를 바꿀 수 있습니다.</p>
        </div>
        <button
          onClick={() => setItems(initialItems)}
          className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          초기화
        </button>
      </div>

      {/* 학습 포인트 섹션 */}
      <div className="mt-6 rounded-xl bg-blue-50/50 p-4 ring-1 ring-inset ring-blue-100">
        <h3 className="text-sm font-semibold text-blue-900">학습 포인트</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-blue-700">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <strong>Tree Strategy:</strong> 플랫 데이터를 트리로 변환하여 렌더링
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <strong>Block Move:</strong> 1차 메뉴 이동 시 하위 메뉴까지 함께 이동
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <strong>Componentization:</strong> 계층 구조를 TreeBranch 단위로 분리
          </li>
        </ul>
      </div>

      {/* depth 필터 */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">정렬 대상:</span>
          {[1, 2].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDepth(d)}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${filterDepth === d
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                }`}
            >
              {d}차 메뉴
            </button>
          ))}
        </div>
      </div>

      {/* 트리 리스트 영역 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-6 space-y-2">
            {tree.map((node) => (
              <TreeBranch
                key={node.id}
                node={node}
                filterDepth={filterDepth}
                activeId={activeId}
                expandedIds={expandedIds}
                onToggleExpanded={toggleExpanded}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeItem ? <DragOverlayCard item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* 현재 데이터 상태 표시 */}
      <div className="mt-10 border-t border-gray-100 pt-6">
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">{filterDepth}차 메뉴 순서</h3>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Storage State</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {items
              .filter((i) => i.depth === filterDepth)
              .map((i, idx) => (
                <div key={i.id} className="flex items-center gap-2">
                  <span className="flex h-6 items-center rounded bg-white px-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                    {idx + 1}. {i.label}
                  </span>
                  {idx < items.filter(i => i.depth === filterDepth).length - 1 && (
                    <span className="text-gray-300">→</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
