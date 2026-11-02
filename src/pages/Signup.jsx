import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// 会員登録画面
export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(`会員登録に失敗しました：${error.message}`)
      return
    }

    if (data.session) {
      // メール確認が不要な設定の場合はそのままログイン状態になる
      navigate('/properties', { replace: true })
    } else {
      // メール確認が必要な設定の場合（Supabase の初期設定）
      setMessage('確認メールを送信しました。メール内のリンクをクリックしてからログインしてください。')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label>
          メールアドレス
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>

        <label>
          パスワード（6文字以上）
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </label>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>

        <p className="auth-switch">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
