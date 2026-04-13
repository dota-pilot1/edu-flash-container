import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TreeItem } from '../../model/types'

interface Props {
  item: TreeItem
  isDragDisabled?: boolean
  isDragging?: boolean
  hasChildren?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

export function SortableMenuItem({ item, hasChildren, isExpanded, onToggle }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${(item.depth - 1) * 24}px`,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isSortableDragging ? 'z-50 opacity-50' : 'z-0'}`}
    >
      {/* 계층 가이드 라인 */}
      {item.depth > 1 && (
        <div 
          className="absolute -left-3 top-[-8px] bottom-[50%] w-[1px] bg-slate-200"
          style={{ left: '-12px' }}
        />
      )}
      {item.depth > 1 && (
        <div 
          className="absolute -left-3 top-[50%] w-2 h-[1px] bg-slate-200"
          style={{ left: '-12px' }}
        />
      )}

      <div
        className={`group flex items-center gap-0.5 rounded-md px-1.5 py-1 transition-colors ${
          isSortableDragging ? 'bg-indigo-50 shadow-sm ring-1 ring-indigo-100' : 'hover:bg-slate-100'
        }`}
      >
        {/* 접기/펼치기 화살표 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle?.()
          }}
          className={`flex h-4 w-4 items-center justify-center rounded transition-colors hover:bg-slate-200 ${
            hasChildren ? 'visible' : 'invisible'
          }`}
        >
          <svg
            className={`h-2.5 w-2.5 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 미니멀 아이콘 */}
        <div className="flex h-5 w-5 items-center justify-center text-slate-400">
          {hasChildren ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* 라벨 (전체 항상 드래그 가능) */}
        <div className="flex flex-1 items-center gap-1.5 overflow-hidden ml-1">
          <span className={`truncate text-[12.5px] tracking-tight ${
            item.depth === 1 ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'
          }`}>
            {item.label}
          </span>
        </div>

        {/* 핸들 (항상 활성화) */}
        <div
          {...attributes}
          {...listeners}
          className="flex h-5 w-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-200"
        >
          <svg className="h-3 w-3 text-slate-300" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="4" cy="4" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
            <circle cx="12" cy="4" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
