import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TreeItem } from '../../model/types'

interface Props {
  item: TreeItem
  isDragDisabled: boolean // 이제 항상 false에 가깝겠지만 타입 유지를 위해 둠
  isDragging?: boolean
}

export function SortableMenuItem({ item }: Props) {
  // 모든 아이템이 항상 드래그 가능하도록 설정
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
        {...attributes}
        {...listeners}
        className={`group flex items-center rounded-lg border bg-white transition-all cursor-grab border-gray-200 hover:border-gray-300 hover:shadow-sm active:cursor-grabbing ${item.depth === 1 ? 'px-4 py-3' : 'px-3 py-2'}`}
      >
        {/* 드래그 핸들 - 이제 항상 표시 */}
        <svg className="mr-3 h-4 w-4 shrink-0 text-gray-300 group-hover:text-blue-500" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
          <circle cx="12" cy="3" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
        </svg>

        {/* 메뉴 아이콘 */}
        <span className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
          item.depth === 1
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {item.label.charAt(0)}
        </span>

        {/* 메뉴 정보 */}
        <div className="flex-1 min-w-0">
          <p className={`truncate ${item.depth === 1 ? 'text-sm font-semibold text-gray-900' : 'text-sm text-gray-600'}`}>
            {item.label}
          </p>
          <p className="text-[11px] text-gray-400">
            {item.depth}차 메뉴
          </p>
        </div>
      </div>
    </div>
  )
}
