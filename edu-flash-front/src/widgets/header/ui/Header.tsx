import { Link, useLocation } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../../../entities/menu'

export function Header() {
  const location = useLocation()
  const { data: menus = [] } = useQuery({
    queryKey: ['menus', 'depth', 1],
    queryFn: () => menuApi.getByDepth(1),
  })

  const visibleMenus = menus.filter((m) => m.visible)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Edu Flash
        </Link>
        <nav className="flex gap-4 text-sm">
          {visibleMenus.map((menu) => (
            <Link
              key={menu.id}
              to={menu.path}
              className={
                location.pathname === menu.path
                  ? 'font-medium text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }
            >
              {menu.name}
            </Link>
          ))}
          <span className="text-gray-300">|</span>
          <Link
            to="/menu-manage"
            className={
              location.pathname === '/menu-manage'
                ? 'font-medium text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }
          >
            메뉴 관리
          </Link>
        </nav>
      </div>
    </header>
  )
}
