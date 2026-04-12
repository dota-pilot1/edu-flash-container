import { useEffect, useRef } from 'react'

interface ContextMenuProps {
  x: number
  y: number
  canAddChild: boolean
  onAddChild: () => void
  onDelete: () => void
  onClose: () => void
}

export function ContextMenu({ x, y, canAddChild, onAddChild, onDelete, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[160px] rounded-md border border-gray-200 bg-white p-1 shadow-md"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => { onAddChild(); onClose() }}
        disabled={!canAddChild}
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[13px] text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
        </svg>
        하위 메뉴 추가
      </button>
      <div className="mx-1 my-1 h-px bg-gray-100" />
      <button
        onClick={() => { onDelete(); onClose() }}
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        삭제
      </button>
    </div>
  )
}
