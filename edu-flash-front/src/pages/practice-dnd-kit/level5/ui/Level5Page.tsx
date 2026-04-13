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

  // 전체 펼치기
  const expandAll = () => {
    const allIds = items.filter(i => items.some(child => child.parentId === i.id)).map(i => i.id)
    setExpandedIds(new Set(allIds))
  }

  // 전체 접기
  const collapseAll = () => setExpandedIds(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null
  const tree = buildTree(items)

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
    <main className="min-h-screen bg-slate-50/50 p-8 font-sans text-slate-900 antialiased">
      {/* 1. 사이드바 컨테이너 */}
      <div className="mx-auto w-[320px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        
        {/* 2. 사이드바 헤더 */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold tracking-tight text-slate-800 italic">EDU FLASH</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={expandAll}
                className="rounded p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
                title="전체 펼치기"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={collapseAll}
                className="rounded p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
                title="전체 접기"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <div className="mx-1 h-3 w-[1px] bg-slate-200" />
              <button
                onClick={() => setItems(initialItems)}
                className="rounded p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
                title="초기화"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 3. 트리 리스트 영역 (DndContext 포함) */}
        <div className="max-h-[600px] overflow-y-auto px-2 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-0.5">
                {tree.map((node) => (
                  <TreeBranch
                    key={node.id}
                    node={node}
                    filterDepth={0}
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
        </div>
      </div>
    </main>
  )
}
