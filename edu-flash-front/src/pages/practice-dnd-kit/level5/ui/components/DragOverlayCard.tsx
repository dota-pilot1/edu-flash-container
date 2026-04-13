import type { TreeItem } from '../../model/types'

interface Props {
  item: TreeItem
}

export function DragOverlayCard({ item }: Props) {
  return (
    <div className={`flex items-center rounded-lg border border-blue-300 bg-white shadow-xl ${
      item.depth === 1 ? 'px-4 py-3' : 'px-3 py-2'
    }`}>
      <svg className="mr-3 h-4 w-4 shrink-0 text-blue-400" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="4" cy="3" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="13" r="1.5" />
        <circle cx="12" cy="3" r="1.5" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
      </svg>
      <span className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
        item.depth === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
      }`}>
        {item.label.charAt(0)}
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
        {item.depth === 1 && (
          <p className="text-[11px] text-blue-500">하위 메뉴도 함께 이동</p>
        )}
      </div>
    </div>
  )
}
