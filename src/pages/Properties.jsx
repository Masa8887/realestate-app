import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { properties } from '../data/properties.js'

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="properties-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-user">
          <span>{user?.email}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>

      <main className="card-grid">
        {properties.map((property) => (
          <article key={property.id} className="card">
            <h2>{property.name}</h2>
            <p className="rent">
              {property.rent.toLocaleString('ja-JP')}<span>円／月</span>
            </p>
            <p className="area">{property.area}</p>
          </article>
        ))}
      </main>
    </div>
  )
}
