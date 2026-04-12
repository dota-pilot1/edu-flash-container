import { QueryProvider, RouterProvider } from './providers'
import { AppRoutes } from './routes/AppRoutes'
import { Header } from '../widgets/header'
import './styles/index.css'

export function App() {
  return (
    <QueryProvider>
      <RouterProvider>
        <Header />
        <AppRoutes />
      </RouterProvider>
    </QueryProvider>
  )
}
