import type { TreeItem } from './types'

export const initialItems: TreeItem[] = [
  // 1. Dashboard
  { id: 'menu-dashboard', label: 'Dashboard', depth: 1, parentId: null },
  { id: 'item-overview', label: 'Overview', depth: 2, parentId: 'menu-dashboard' },
  { id: 'item-analytics', label: 'Analytics', depth: 2, parentId: 'menu-dashboard' },

  // 2. My Learning
  { id: 'menu-learning', label: 'My Learning', depth: 1, parentId: null },
  { id: 'item-courses', label: 'Online Courses', depth: 2, parentId: 'menu-learning' },
  { id: 'item-react-master', label: 'React Masterclass', depth: 3, parentId: 'item-courses' },
  { id: 'item-next-pro', label: 'Next.js Pro', depth: 3, parentId: 'item-courses' },
  { id: 'item-assignments', label: 'Assignments', depth: 2, parentId: 'menu-learning' },
  { id: 'item-study-group', label: 'Study Groups', depth: 2, parentId: 'menu-learning' },

  // 3. Resources
  { id: 'menu-resources', label: 'Resources', depth: 1, parentId: null },
  { id: 'item-e-books', label: 'Digital E-Books', depth: 2, parentId: 'menu-resources' },
  { id: 'item-video-arch', label: 'Video Archive', depth: 2, parentId: 'menu-resources' },

  // 4. Community
  { id: 'menu-community', label: 'Community', depth: 1, parentId: null },
  { id: 'item-notice', label: 'Notice Board', depth: 2, parentId: 'menu-community' },
  { id: 'item-qna', label: 'Q&A Support', depth: 2, parentId: 'menu-community' },

  // 5. Settings
  { id: 'menu-settings', label: 'Settings', depth: 1, parentId: null },
  { id: 'item-account', label: 'Account Info', depth: 2, parentId: 'menu-settings' },
  { id: 'item-security', label: 'Security & Privacy', depth: 2, parentId: 'menu-settings' },
  { id: 'item-billing', label: 'Billing & Plan', depth: 2, parentId: 'menu-settings' },
]
