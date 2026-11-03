import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import PropertyForm from '../components/PropertyForm.jsx'
import { createProperty, deleteProperty, fetchProperties, updateProperty } from '../lib/properties.js'

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // フォームの状態：null＝非表示、'new'＝新規登録、物件オブジェクト＝その物件を編集
  const [editing, setEditing] = useState(null)

  // 画面表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  // 新規登録・編集フォームの送信（失敗時はフォーム側でエラーを表示する）
  const handleSubmit = async (values) => {
    if (editing === 'new') {
      const created = await createProperty(values)
      setProperties([created, ...properties])
    } else {
      const updated = await updateProperty(editing.id, values)
      setProperties(properties.map((p) => (p.id === updated.id ? updated : p)))
    }
    setEditing(null)
  }

  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return
    setError('')
    try {
      await deleteProperty(property.id)
      setProperties(properties.filter((p) => p.id !== property.id))
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

  return (
    <div className="properties-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-user">
          <span>{user?.email}</span>
          <button className="secondary" onClick={handleLogout}>ログアウト</button>
        </div>
      </header>

      <main className="properties-main">
        {editing ? (
          // key を変えて、編集対象が切り替わったらフォームの入力内容をリセットする
          <PropertyForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? null : editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div className="toolbar">
            <button onClick={() => setEditing('new')}>＋ 物件を登録</button>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="empty">読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className="empty">登録された物件はまだありません。</p>
        ) : (
          <div className="card-grid">
            {properties.map((property) => (
              <article key={property.id} className="card">
                <h2>{property.name}</h2>
                <p className="rent">
                  {property.rent.toLocaleString('ja-JP')}<span>円／月</span>
                </p>
                <p className="area">{property.area}・{property.layout}</p>
                <div className="card-actions">
                  <button className="secondary" onClick={() => setEditing(property)}>編集</button>
                  <button className="danger" onClick={() => handleDelete(property)}>削除</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
