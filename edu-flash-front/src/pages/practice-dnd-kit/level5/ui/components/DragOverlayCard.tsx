import type { TreeItem } from '../../model/types'

interface Props {
  item: TreeItem
}

export function DragOverlayCard({ item }: Props) {
  return (
    <div className="flex w-[280px] items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50/90 px-3 py-2 shadow-lg ring-1 ring-indigo-500/20 backdrop-blur-sm">
      {/* 미니멀 아이콘 */}
      <div className="flex h-5 w-5 items-center justify-center text-indigo-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <span className="truncate text-sm font-semibold text-indigo-900">
        {item.label}
      </span>

      {/* 옮기는 중임을 나타내는 배지 */}
      <div className="ml-auto flex h-5 items-center rounded-full bg-indigo-500 px-2 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
        Moving
      </div>
    </div>
  )
}
