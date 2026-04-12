import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Menu, MenuRequest } from '../../../entities/menu'

interface MenuDetailProps {
  menu: Menu | null
  allMenus: Menu[]
  defaultParentId?: number | null
  onSave: (data: MenuRequest, id?: number) => void
  onDelete: (id: number) => void
}

function flattenMenus(menus: Menu[], result: { id: number; name: string; depth: number }[] = []) {
  for (const menu of menus) {
    result.push({ id: menu.id, name: menu.name, depth: menu.depth })
    if (menu.children.length > 0) {
      flattenMenus(menu.children, result)
    }
  }
  return result
}

export function MenuDetail({ menu, allMenus, defaultParentId, onSave, onDelete }: MenuDetailProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MenuRequest>({
    defaultValues: {
      name: '',
      path: '',
      parentId: null,
      sortOrder: 0,
      visible: true,
    },
  })

  useEffect(() => {
    if (menu) {
      reset({
        name: menu.name,
        path: menu.path,
        parentId: menu.parentId,
        sortOrder: menu.sortOrder,
        visible: menu.visible,
      })
    } else {
      reset({
        name: '',
        path: '',
        parentId: defaultParentId ?? null,
        sortOrder: 0,
        visible: true,
      })
    }
  }, [menu, defaultParentId, reset])

  const flatMenus = flattenMenus(allMenus).filter((m) => menu?.id !== m.id)

  const onSubmit = (data: MenuRequest) => {
    const parsed = {
      ...data,
      parentId: data.parentId ? Number(data.parentId) : null,
      sortOrder: Number(data.sortOrder),
    }
    onSave(parsed, menu?.id)
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {menu ? '메뉴 수정' : '새 메뉴'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">이름</label>
          <input
            {...register('name', { required: '이름을 입력하세요' })}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">경로</label>
          <input
            {...register('path', { required: '경로를 입력하세요' })}
            placeholder="/study"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.path && <p className="mt-1 text-xs text-red-500">{errors.path.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">상위 메뉴</label>
          <select
            {...register('parentId')}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">없음 (1차 메뉴)</option>
            {flatMenus.map((m) => (
              <option key={m.id} value={m.id}>
                {'─'.repeat(m.depth - 1)} {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">정렬 순서</label>
          <input
            type="number"
            {...register('sortOrder', { required: true })}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('visible')}
            id="visible"
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="visible" className="text-sm text-gray-700">노출</label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            저장
          </button>
          {menu && (
            <button
              type="button"
              onClick={() => onDelete(menu.id)}
              className="rounded bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              삭제
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
