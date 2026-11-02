import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// ログイン画面
export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } = await signIn(email, password)
    setSubmitting(false)

    if (error) {
      if (error.code === 'email_not_confirmed') {
        // 会員登録後、確認メールのリンクをまだクリックしていない場合
        setError('メールアドレスの確認が完了していません。確認メール内のリンクをクリックしてからログインしてください。')
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      }
      return
    }
    // ログイン成功後は物件一覧へ
    navigate('/properties', { replace: true })
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>ログイン</h1>

        <label>
          メールアドレス
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>

        <label>
          パスワード
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'ログイン中...' : 'ログイン'}
        </button>

        <p className="auth-switch">
          アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
        </p>
      </form>
    </div>
  )
}
