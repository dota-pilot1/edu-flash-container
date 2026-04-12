import { useState, useRef, useEffect } from 'react'
import type { Menu } from '../../../entities/menu'

interface ContextMenuState {
  menu: Menu
  x: number
  y: number
}

export interface InlineAddState {
  parentId: number | null
  depth: number
}

interface MenuTreeProps {
  menus: Menu[]
  selectedId: number | null
  inlineAdd: InlineAddState | null
  onSelect: (menu: Menu) => void
  onContextMenu?: (state: ContextMenuState) => void
  onInlineSubmit: (name: string, parentId: number | null) => void
  onInlineCancel: () => void
  onAddRoot: () => void
}

export type { ContextMenuState }

export function MenuTree({
  menus,
  selectedId,
  inlineAdd,
  onSelect,
  onContextMenu,
  onInlineSubmit,
  onInlineCancel,
  onAddRoot,
}: MenuTreeProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">메뉴 구조</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {menus.map((menu) => (
          <TreeNode
            key={menu.id}
            menu={menu}
            selectedId={selectedId}
            inlineAdd={inlineAdd}
            onSelect={onSelect}
            onContextMenu={onContextMenu}
            onInlineSubmit={onInlineSubmit}
            onInlineCancel={onInlineCancel}
          />
        ))}

        {inlineAdd && inlineAdd.parentId === null && (
          <InlineInput
            depth={0}
            onSubmit={(name) => onInlineSubmit(name, null)}
            onCancel={onInlineCancel}
          />
        )}
      </div>

      <div className="border-t border-gray-100 p-2">
        <button
          onClick={onAddRoot}
          className="flex w-full items-center justify-center gap-1.5 rounded-md py-2 text-[13px] text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
          </svg>
          메뉴 추가
        </button>
      </div>
    </div>
  )
}

function InlineInput({
  depth,
  onSubmit,
  onCancel,
}: {
  depth: number
  onSubmit: (name: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim())
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="mx-1 mb-px flex items-center rounded-md bg-blue-50 ring-1 ring-blue-200"
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onCancel}
        placeholder="이름 입력 후 Enter"
        className="w-full bg-transparent py-1.5 pr-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>
  )
}

function TreeNode({
  menu,
  selectedId,
  inlineAdd,
  onSelect,
  onContextMenu,
  onInlineSubmit,
  onInlineCancel,
  depth = 0,
}: {
  menu: Menu
  selectedId: number | null
  inlineAdd: InlineAddState | null
  onSelect: (menu: Menu) => void
  onContextMenu?: (state: ContextMenuState) => void
  onInlineSubmit: (name: string, parentId: number | null) => void
  onInlineCancel: () => void
  depth?: number
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = menu.children.length > 0
  const isSelected = menu.id === selectedId
  const showInlineHere = inlineAdd?.parentId === menu.id

  useEffect(() => {
    if (showInlineHere) setExpanded(true)
  }, [showInlineHere])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.({ menu, x: e.clientX, y: e.clientY })
  }

  return (
    <div>
      <div
        className={`group mx-1 mb-px flex cursor-pointer items-center rounded-md px-2 py-1.5 text-[13px] transition-colors ${
          isSelected
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect(menu)}
        onContextMenu={handleContextMenu}
      >
        {hasChildren || showInlineHere ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className={`mr-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors ${
              isSelected ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg
              className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="mr-1 w-4 shrink-0" />
        )}

        <span className={`truncate ${!menu.visible ? 'opacity-30' : ''}`}>
          {menu.name}
        </span>
      </div>

      {expanded && (
        <>
          {hasChildren &&
            menu.children.map((child) => (
              <TreeNode
                key={child.id}
                menu={child}
                selectedId={selectedId}
                inlineAdd={inlineAdd}
                onSelect={onSelect}
                onContextMenu={onContextMenu}
                onInlineSubmit={onInlineSubmit}
                onInlineCancel={onInlineCancel}
                depth={depth + 1}
              />
            ))}

          {showInlineHere && (
            <InlineInput
              depth={depth + 1}
              onSubmit={(name) => onInlineSubmit(name, menu.id)}
              onCancel={onInlineCancel}
            />
          )}
        </>
      )}
    </div>
  )
}
