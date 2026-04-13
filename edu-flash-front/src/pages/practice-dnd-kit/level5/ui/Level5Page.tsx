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
  const [menuStyle, setMenuStyle] = useState<'sidebar' | 'header'>('sidebar')

  // 열려있는 메뉴들의 ID를 관리하는 Set
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['menu-learning', 'item-courses'])) 

  // 메뉴 열고 닫기 토글 함수
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 전체 토글
  const toggleAll = () => {
    if (expandedIds.size > 0) setExpandedIds(new Set())
    else {
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
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16 font-sans text-slate-900 antialiased">
      <div className="mx-auto max-w-6xl flex flex-col items-center">
        
        {/* [TOP] Header & Tabs */}
        <header className="mb-12 text-center">
          <h1 className="text-[14px] font-black tracking-[0.2em] text-indigo-600 uppercase mb-4">LMS Architecture</h1>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-8">Universal Tree Navigation</h2>
          
          <div className="inline-flex rounded-xl bg-slate-200/60 p-1.5 shadow-inner">
            <button
              onClick={() => setMenuStyle('sidebar')}
              className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-all ${
                menuStyle === 'sidebar' ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sidebar Menu
            </button>
            <button
              onClick={() => setMenuStyle('header')}
              className={`flex items-center gap-2 rounded-lg px-8 py-2.5 text-sm font-bold transition-all ${
                menuStyle === 'header' ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Header Dropdown
            </button>
          </div>
        </header>

        {/* [MIDDLE] Main Preview Area */}
        <section className="w-full mb-24 flex justify-center min-h-[400px]">
          {menuStyle === 'sidebar' ? (
            <div className="w-[360px] h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center justify-between">
                <span className="text-[12px] font-black text-indigo-600 tracking-widest uppercase">Editor</span>
                <button onClick={toggleAll} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 px-2 py-1 rounded-md transition-all active:scale-95 shadow-sm">
                  {expandedIds.size > 0 ? "COLLAPSE ALL" : "EXPAND ALL"}
                </button>
              </div>
              <div className="max-h-[600px] overflow-y-auto px-3 py-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-1">
                      {tree.map((node) => (
                        <TreeBranch key={node.id} node={node} filterDepth={0} activeId={activeId} expandedIds={expandedIds} onToggleExpanded={toggleExpanded} />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay dropAnimation={null}>{activeItem ? <DragOverlayCard item={activeItem} /> : null}</DragOverlay>
                </DndContext>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl h-fit rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Navigation Bar (GNB)</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="p-16 flex flex-col items-center">
                <nav className="flex h-16 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-8 shadow-sm relative z-50">
                  <div className="text-xl font-black tracking-tighter text-indigo-600 mr-12 ml-4 italic">LMS</div>
                  <div className="flex h-full flex-1 justify-around">
                    {tree.map((node) => (
                      <div key={node.id} className="group relative flex h-full items-center px-4 cursor-pointer">
                        <span className="text-[14px] font-bold text-slate-600 transition-colors group-hover:text-indigo-600">{node.label}</span>
                        {node.children && node.children.length > 0 && (
                          <div className="absolute left-1/2 top-[100%] z-50 hidden -translate-x-1/2 min-w-[200px] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_30px_90px_rgba(0,0,0,0.2)] group-hover:block animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col gap-1">
                              {node.children.map(child => (
                                <div key={child.id} className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                                  {child.label}
                                  {child.children && child.children.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 group-hover/item:bg-indigo-500" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
                <div className="mt-12 text-center">
                  <p className="text-[13px] text-slate-400 font-medium">Hover over the menu items to see hierarchical mega-menus</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* [BOTTOM] Technical Concept Board */}
        <section className="w-full pt-16 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-8">
            <div className="p-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-600 text-[10px] text-white flex items-center justify-center italic">01</span>
                Atomic Block
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-500">
                부모 이동 시 하위 노드를 하나로 묶어 처리하는 <strong>Atomic-Move</strong> 알고리즘으로 데이터 무결성을 보장합니다.
              </p>
            </div>
            <div className="p-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-600 text-[10px] text-white flex items-center justify-center italic">02</span>
                Hybrid Flow
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-500">
                <strong>Flat Source</strong>의 효율성과 <strong>Recursive View</strong>의 직관성을 결합한 하이브리드 데이터 흐름을 채택했습니다.
              </p>
            </div>
            <div className="p-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-600 text-[10px] text-white flex items-center justify-center italic">03</span>
                Infinite Depth
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-500">
                재귀적 컴포넌트 설계를 통해 <strong>n-Depth</strong>까지 대응 가능하며, Folding 기능을 통해 복잡도를 관리합니다.
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 py-4 px-6 bg-slate-100/50 rounded-2xl border border-slate-200/50 overflow-hidden">
             <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <span>React</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>dnd-kit</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Tailwind</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>TypeScript</span>
             </div>
          </div>
        </section>

      </div>
    </main>
  )
}
