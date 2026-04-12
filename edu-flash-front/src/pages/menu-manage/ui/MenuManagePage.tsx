import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '../../../entities/menu'
import type { Menu, MenuRequest } from '../../../entities/menu'
import { MenuTree, MenuDetail, ContextMenu } from '../../../features/menu-manage'
import type { ContextMenuState, InlineAddState } from '../../../features/menu-manage'

function toKebab(name: string) {
  return '/' + name.replace(/\s+/g, '-').toLowerCase()
}

export function MenuManagePage() {
  const queryClient = useQueryClient()
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [inlineAdd, setInlineAdd] = useState<InlineAddState | null>(null)

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: menuApi.getTree,
  })

  const createMutation = useMutation({
    mutationFn: (data: MenuRequest) => menuApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setInlineAdd(null)
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

  const handleSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setInlineAdd(null)
  }

  const handleInlineSubmit = (name: string, parentId: number | null) => {
    const depth = parentId
      ? (findMenuById(menus, parentId)?.depth ?? 0) + 1
      : 1
    const parentPath = parentId ? (findMenuById(menus, parentId)?.path ?? '') : ''
    const path = parentPath === '/' ? toKebab(name) : parentPath + toKebab(name)

    createMutation.mutate({
      name,
      path,
      parentId,
      sortOrder: 0,
      visible: true,
    })
  }

  const handleAddChild = (parent: Menu) => {
    setInlineAdd({ parentId: parent.id, depth: parent.depth + 1 })
    setSelectedMenu(null)
  }

  const handleAddRoot = () => {
    setInlineAdd({ parentId: null, depth: 1 })
    setSelectedMenu(null)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="w-80 shrink-0 border-r border-gray-200">
        <MenuTree
          menus={menus}
          selectedId={selectedMenu?.id ?? null}
          inlineAdd={inlineAdd}
          onSelect={handleSelect}
          onContextMenu={setContextMenu}
          onInlineSubmit={handleInlineSubmit}
          onInlineCancel={() => setInlineAdd(null)}
          onAddRoot={handleAddRoot}
        />
      </div>
      <div className="flex-1 bg-white">
        {selectedMenu ? (
          <MenuDetail
            menu={selectedMenu}
            allMenus={menus}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <p className="text-sm">메뉴를 선택하면 상세 정보를 수정할 수 있습니다</p>
            <p className="mt-1 text-xs">우클릭으로 하위 메뉴를 추가하세요</p>
          </div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          canAddChild={contextMenu.menu.depth < 3}
          onAddChild={() => handleAddChild(contextMenu.menu)}
          onDelete={() => handleDelete(contextMenu.menu.id)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

function findMenuById(menus: Menu[], id: number): Menu | undefined {
  for (const menu of menus) {
    if (menu.id === id) return menu
    const found = findMenuById(menu.children, id)
    if (found) return found
  }
  return undefined
}
