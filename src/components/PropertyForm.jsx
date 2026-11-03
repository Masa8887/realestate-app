import { useState } from 'react'

const EMPTY = { name: '', rent: '', area: '', layout: '' }

// 物件の登録・編集フォーム
// initial を渡すと編集、渡さなければ新規登録として動く
export default function PropertyForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial ? { name: initial.name, rent: String(initial.rent), area: initial.area, layout: initial.layout } : EMPTY,
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // 前後の空白を除き、家賃は数値に変換して渡す
      await onSubmit({
        name: values.name.trim(),
        rent: Number(values.rent),
        area: values.area.trim(),
        layout: values.layout.trim(),
      })
    } catch (err) {
      setError(`保存に失敗しました：${err.message}`)
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{initial ? '物件を編集' : '物件を新規登録'}</h2>

      <div className="property-form-fields">
        <label>
          物件名
          <input name="name" value={values.name} onChange={handleChange} required />
        </label>
        <label>
          家賃（円）
          <input name="rent" type="number" min="0" step="1" value={values.rent} onChange={handleChange} required />
        </label>
        <label>
          エリア
          <input name="area" value={values.area} onChange={handleChange} placeholder="例：東京都渋谷区" required />
        </label>
        <label>
          間取り
          <input name="layout" value={values.layout} onChange={handleChange} placeholder="例：1LDK" required />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="property-form-actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : initial ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
