import { useState } from 'react'
import type { Menu } from '../../../entities/menu'

interface MenuTreeProps {
  menus: Menu[]
  selectedId: number | null
  onSelect: (menu: Menu) => void
  onAdd: () => void
}

export function MenuTree({ menus, selectedId, onSelect, onAdd }: MenuTreeProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {menus.map((menu) => (
          <TreeNode
            key={menu.id}
            menu={menu}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={onAdd}
          className="w-full rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          + 메뉴 추가
        </button>
      </div>
    </div>
  )
}

function TreeNode({
  menu,
  selectedId,
  onSelect,
  depth = 0,
}: {
  menu: Menu
  selectedId: number | null
  onSelect: (menu: Menu) => void
  depth?: number
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = menu.children.length > 0
  const isSelected = menu.id === selectedId

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center rounded px-2 py-1.5 text-sm ${
          isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(menu)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="mr-1 text-gray-400"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="mr-1 w-3" />
        )}
        <span className={!menu.visible ? 'opacity-40' : ''}>{menu.name}</span>
      </div>
      {expanded &&
        hasChildren &&
        menu.children.map((child) => (
          <TreeNode
            key={child.id}
            menu={child}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}
