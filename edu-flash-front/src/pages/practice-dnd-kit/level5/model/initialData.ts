import type { TreeItem } from './types'

export const initialItems: TreeItem[] = [
  { id: 'menu-1', label: '홈', depth: 1, parentId: null },
  { id: 'menu-2', label: '학습', depth: 1, parentId: null },
  { id: 'menu-2-1', label: '프론트엔드', depth: 2, parentId: 'menu-2' },
  { id: 'menu-2-1-1', label: '리액트 숙련', depth: 3, parentId: 'menu-2-1' },
  { id: 'menu-2-2', label: '백엔드', depth: 2, parentId: 'menu-2' },
  { id: 'menu-3', label: '내 카드', depth: 1, parentId: null },
  { id: 'menu-4', label: '설정', depth: 1, parentId: null },
  { id: 'menu-4-1', label: '프로필', depth: 2, parentId: 'menu-4' },
  { id: 'menu-4-2', label: '알림', depth: 2, parentId: 'menu-4' },
]
