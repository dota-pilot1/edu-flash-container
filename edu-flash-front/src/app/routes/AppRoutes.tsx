import { Routes, Route } from 'react-router'
import { HomePage } from '../../pages/home'
import { MenuManagePage } from '../../pages/menu-manage'
import { PlaceholderPage } from '../../pages/placeholder'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu-manage" element={<MenuManagePage />} />
      <Route path="*" element={<PlaceholderPage />} />
    </Routes>
  )
}
