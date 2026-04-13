import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TreeItem } from '../../model/types'

interface Props {
  item: TreeItem
  isDragDisabled: boolean // 정렬 대상이 아닌 레벨은 핸들 비활성화
  isDragging?: boolean
  hasChildren?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

export function SortableMenuItem({ item, isDragDisabled, hasChildren, isExpanded, onToggle }: Props) {
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
    marginLeft: `${(item.depth - 1) * 40}px` 
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isSortableDragging ? 'opacity-0' : ''}`}
    >
      <div
        className={`group flex items-center rounded-lg border bg-white transition-all ${
          isDragDisabled
            ? 'border-gray-100 opacity-80'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        } ${item.depth === 1 ? 'px-4 py-3' : 'px-3 py-2'}`}
      >
        {/* 열고 닫기 화살표 버튼 (자식이 있을 때만 노출) */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation() // 드래그 이벤트와 충돌 방지
              onToggle?.()
            }}
            className="mr-1 flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
          >
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* 자식이 없는 메뉴를 위한 더미 공간 (정렬 맞춤용) */}
        {!hasChildren && <div className="mr-1 w-6" />}

        {/* 드래그 핸들 (정렬 대상 뎁스일 때만 작동) */}
        <div 
          {...(!isDragDisabled ? attributes : {})} 
          {...(!isDragDisabled ? listeners : {})} 
          className={`p-1 ${isDragDisabled ? 'cursor-default opacity-20' : 'cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-blue-500'}`}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
            <circle cx="12" cy="3" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
          </svg>
        </div>

        {/* 메뉴 아이콘 */}
        <span className={`mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
          item.depth === 1
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {item.label.charAt(0)}
        </span>

        {/* 메뉴 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`truncate ${item.depth === 1 ? 'text-sm font-semibold text-gray-900' : 'text-sm text-gray-600'}`}>
              {item.label}
            </p>
            {isDragDisabled && (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">잠김</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
