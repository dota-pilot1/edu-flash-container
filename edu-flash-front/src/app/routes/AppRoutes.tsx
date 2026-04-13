import { Routes, Route } from 'react-router'
import { HomePage } from '../../pages/home'
import { MenuManagePage } from '../../pages/menu-manage'
import { PlaceholderPage } from '../../pages/placeholder'
import { StudyFrontendPage } from '../../pages/study-frontend'
import { Level1Page } from '../../pages/practice-dnd-kit/level1'
import { Level2Page } from '../../pages/practice-dnd-kit/level2'
import { Level3Page } from '../../pages/practice-dnd-kit/level3'
import { Level4Page } from '../../pages/practice-dnd-kit/level4'
import { Level5Page } from '../../pages/practice-dnd-kit/level5'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu-manage" element={<MenuManagePage />} />
      <Route path="/study/frontend" element={<StudyFrontendPage />} />
      <Route path="/practice-dnd-kit/level1" element={<Level1Page />} />
      <Route path="/practice-dnd-kit/level2" element={<Level2Page />} />
      <Route path="/practice-dnd-kit/level3" element={<Level3Page />} />
      <Route path="/practice-dnd-kit/level4" element={<Level4Page />} />
      <Route path="/practice-dnd-kit/level5" element={<Level5Page />} />
      <Route path="*" element={<PlaceholderPage />} />
    </Routes>
  )
}
