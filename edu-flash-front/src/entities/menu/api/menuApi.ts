import { api } from '../../../shared/api'
import type { Menu, MenuRequest } from '../model/types'

export const menuApi = {
  getTree: () =>
    api.get<Menu[]>('/api/menus/tree').then((res) => res.data),

  getByDepth: (depth: number) =>
    api.get<Menu[]>('/api/menus', { params: { depth } }).then((res) => res.data),

  getById: (id: number) =>
    api.get<Menu>(`/api/menus/${id}`).then((res) => res.data),

  create: (data: MenuRequest) =>
    api.post<Menu>('/api/menus', data).then((res) => res.data),

  update: (id: number, data: MenuRequest) =>
    api.put<Menu>(`/api/menus/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/api/menus/${id}`),
}
