import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Properties from './pages/Properties.jsx'

// 画面のルーティング設定
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
      {/* それ以外の URL は物件一覧へ（未ログインならさらにログイン画面へ） */}
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  )
}
