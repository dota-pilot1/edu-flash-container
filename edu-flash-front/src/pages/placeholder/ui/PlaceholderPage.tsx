import { useLocation } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../../../entities/menu'
import type { Menu } from '../../../entities/menu'

function findMenuByPath(menus: Menu[], path: string): Menu | undefined {
  for (const menu of menus) {
    if (menu.path === path) return menu
    const found = findMenuByPath(menu.children, path)
    if (found) return found
  }
  return undefined
}

export function PlaceholderPage() {
  const location = useLocation()
  const { data: menus = [] } = useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: menuApi.getTree,
  })

  const menu = findMenuByPath(menus, location.pathname)

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        {menu?.name ?? location.pathname}
      </h1>
      <p className="mt-4 text-gray-500">구현 예정</p>
    </main>
  )
}
