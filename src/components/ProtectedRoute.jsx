import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// ログイン済みのユーザーだけが見られるページを囲む
// 未ログインの場合はログイン画面へリダイレクトする
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="loading">読み込み中...</p>
  if (!session) return <Navigate to="/login" replace />

  return children
}
