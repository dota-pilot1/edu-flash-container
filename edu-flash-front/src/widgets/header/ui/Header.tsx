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
    <header className="border-b border-slate-200 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[15px] font-semibold tracking-[0.12em] text-foreground">
            EF
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Learning Workspace
            </span>
            <span className="text-[20px] font-semibold tracking-tight text-foreground">
              Edu Flash
            </span>
          </div>
        </Link>
        <nav className="flex h-11 items-center gap-1 rounded-xl bg-slate-100 p-1 text-[14px]">
          {visibleMenus.map((menu) => (
            <HeaderMenu key={menu.id} menu={menu} currentPath={location.pathname} />
          ))}
          <div className="mx-1 h-4 w-px bg-slate-300" />
          <Link
            to="/menu-manage"
            className={`flex h-9 items-center rounded-lg px-4 font-medium transition-colors ${
              location.pathname === '/menu-manage'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-slate-200 hover:text-foreground'
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
        className={`flex h-9 items-center rounded-lg px-4 font-medium transition-colors ${
          isActive
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-slate-200 hover:text-foreground'
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
        className={`flex h-9 items-center gap-1.5 rounded-lg px-4 font-medium transition-colors ${
          isActive
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-slate-200 hover:text-foreground'
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
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[220px] overflow-hidden rounded-xl bg-white p-1 text-popover-foreground shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          {menu.children
            .filter((c) => c.visible)
            .map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  navigate(child.path)
                  setOpen(false)
                }}
                className={`flex h-9 w-full items-center rounded-lg px-3.5 text-left text-sm font-medium transition-colors ${
                  currentPath === child.path
                    ? 'bg-slate-200 text-foreground'
                    : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
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
