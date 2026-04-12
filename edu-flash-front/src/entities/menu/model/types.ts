export interface Menu {
  id: number
  name: string
  path: string
  parentId: number | null
  depth: number
  sortOrder: number
  visible: boolean
  children: Menu[]
}

export interface MenuRequest {
  name: string
  path: string
  parentId: number | null
  sortOrder: number
  visible: boolean
}
