import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../../../entities/menu'
import type { Menu } from '../../../entities/menu'

export function Header() {
  const location = useLocation()
  const { data: menus = [] } = useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: menuApi.getTree,
  })

  const visibleMenus = menus.filter((m) => m.visible)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Edu Flash
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {visibleMenus.map((menu) => (
            <HeaderMenu key={menu.id} menu={menu} currentPath={location.pathname} />
          ))}
          <span className="mx-2 text-gray-300">|</span>
          <Link
            to="/menu-manage"
            className={`rounded-lg px-3 py-2 transition-colors ${
              location.pathname === '/menu-manage'
                ? 'bg-blue-50 font-medium text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            메뉴 관리
          </Link>
        </nav>
      </div>
    </header>
  )
}

function HeaderMenu({ menu, currentPath }: { menu: Menu; currentPath: string }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasChildren = menu.children.filter((c) => c.visible).length > 0
  const isActive =
    currentPath === menu.path ||
    menu.children.some((c) => currentPath === c.path)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!hasChildren) {
    return (
      <Link
        to={menu.path}
        className={`rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? 'bg-blue-50 font-medium text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {menu.name}
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? 'bg-blue-50 font-medium text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {menu.name}
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {menu.children
            .filter((c) => c.visible)
            .map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  navigate(child.path)
                  setOpen(false)
                }}
                className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                  currentPath === child.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {child.name}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
