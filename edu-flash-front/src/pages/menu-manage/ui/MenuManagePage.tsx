import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '../../../entities/menu'
import type { Menu, MenuRequest } from '../../../entities/menu'
import { MenuTree } from '../../../features/menu-manage'
import { MenuDetail } from '../../../features/menu-manage'

export function MenuManagePage() {
  const queryClient = useQueryClient()
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [isNew, setIsNew] = useState(false)

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: menuApi.getTree,
  })

  const createMutation = useMutation({
    mutationFn: (data: MenuRequest) => menuApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setSelectedMenu(null)
      setIsNew(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MenuRequest }) => menuApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setSelectedMenu(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => menuApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setSelectedMenu(null)
    },
  })

  const handleSave = (data: MenuRequest, id?: number) => {
    if (id) {
      updateMutation.mutate({ id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('이 메뉴를 삭제하시겠습니까? 하위 메뉴도 함께 삭제됩니다.')) {
      deleteMutation.mutate(id)
    }
  }

  const handleAdd = () => {
    setSelectedMenu(null)
    setIsNew(true)
  }

  const handleSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsNew(false)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-5xl">
      <div className="w-64 shrink-0 border-r border-gray-200 bg-white">
        <MenuTree
          menus={menus}
          selectedId={selectedMenu?.id ?? null}
          onSelect={handleSelect}
          onAdd={handleAdd}
        />
      </div>
      <div className="flex-1 bg-white">
        {selectedMenu || isNew ? (
          <MenuDetail
            menu={selectedMenu}
            allMenus={menus}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            왼쪽에서 메뉴를 선택하거나 추가하세요
          </div>
        )}
      </div>
    </div>
  )
}
