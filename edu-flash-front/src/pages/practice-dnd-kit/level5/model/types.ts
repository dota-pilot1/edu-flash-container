export interface TreeItem {
  id: string
  label: string
  depth: number
  parentId: string | null
}

export interface TreeNode extends TreeItem {
  children: TreeNode[]
}
