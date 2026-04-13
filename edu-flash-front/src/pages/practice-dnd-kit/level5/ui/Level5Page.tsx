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

  // 전체 토글 (하나라도 열려있으면 전체 닫기, 아니면 전체 열기)
  const toggleAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set())
    } else {
      const allIds = items.filter(i => items.some(child => child.parentId === i.id)).map(i => i.id)
      setExpandedIds(new Set(allIds))
    }
  }

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
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12 font-sans text-slate-900 antialiased">
      {/* 중앙 정렬 대시보드 컨테이너 */}
      <div className="mx-auto flex max-w-5xl items-start gap-12">
        
        {/* [좌측] 사이드바 에디터 영역 */}
        <div className="w-[320px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          {/* 사이드바 헤더 */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[13px] font-black tracking-tighter text-indigo-600">EDU FLASH</h1>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-900"
                >
                  <svg 
                    className={`h-3 w-3 transition-transform duration-300 ${expandedIds.size > 0 ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {expandedIds.size > 0 ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>
          </div>

          {/* 트리 영역 */}
          <div className="max-h-[640px] overflow-y-auto px-2 py-4">
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

        {/* [우측] 구현 컨셉 및 기술 스택 보드 */}
        <div className="flex-1 pt-2">
          <header className="mb-8">
            <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 ring-1 ring-inset ring-indigo-200">
              Technical Documentation
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Tree DnD Architecture</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
              초경량 1차원 배열 데이터를 기반으로 무한 계층 구조를 제어하는<br/> 
              가장 효율적이고 안정적인 트리 관리 시스템입니다.
            </p>
          </header>

          <div className="grid gap-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[12px] font-bold text-white">1</div>
                <h3 className="text-sm font-bold text-slate-800">Atomic Block Move Strategy</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-500">
                부모 노드 이동 시 하위 자손들을 하나의 <strong>원자(Atomic) 단위</strong>로 묶어 이사시키는 블록화 알고리즘입니다. 
                이동의 정밀도는 사용자가 선택한 노드의 뎁스에 맞춰 자동으로 튜닝됩니다.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[12px] font-bold text-white">2</div>
                <h3 className="text-sm font-bold text-slate-800">Hybrid Source Management</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-500">
                데이터 조작은 <strong>Flat Array</strong>에서, UI 표현은 <strong>Recursive Tree</strong> 구조로 수행합니다. 1D 데이터의 안정성과 계층 UI의 직관성을 모두 잡은 현대적 아키텍처입니다.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[12px] font-bold text-white">3</div>
                <h3 className="text-sm font-bold text-slate-800">Modern Sidebar UI Concept</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-500">
                shadcn/ui의 미니멀리즘을 기반으로 한 <strong>Sidebar 인터페이스</strong>입니다. 
                불필요한 요소를 제거하고 수직 가이드라인을 통해 구조적 몰입감을 극대화했습니다.
              </p>
            </section>
          </div>

          <footer className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Next.js 14</span>
              <span className="h-1 w-1 rounded-full bg-slate-200" />
              <span>Dnd-kit</span>
              <span className="h-1 w-1 rounded-full bg-slate-200" />
              <span>TailwindCSS</span>
            </div>
          </footer>
        </div>

      </div>
    </main>
  )
}
