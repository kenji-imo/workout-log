import { useState } from 'react'
import { supabase } from '../supabaseClient'

function generateFriendCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
  if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname: nickname || 'トレーニー' },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2E',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#16213E', borderRadius: '20px', padding: '32px 24px',
        width: '100%', maxWidth: '360px'
      }}>
        <h1 style={{ color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
          {mode === 'signup' ? '新規登録' : 'ログイン'}
        </h1>

        {mode === 'signup' && (
          <input
            type="text"
            placeholder="ニックネーム"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="パスワード(6文字以上)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: '#E94560', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: '#E94560', color: '#fff', fontWeight: 'bold', fontSize: '16px',
          marginTop: '8px'
        }}>
          {loading ? '処理中...' : mode === 'signup' ? '登録する' : 'ログイン'}
        </button>

        <p style={{ color: '#B0B0C0', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          {mode === 'signup' ? 'すでにアカウントをお持ちですか?' : 'アカウントをお持ちでないですか?'}
          <span
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            style={{ color: '#FF6B35', marginLeft: '8px', cursor: 'pointer' }}
          >
            {mode === 'signup' ? 'ログイン' : '新規登録'}
          </span>
        </p>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #2A2A4A',
  background: '#1A1A2E', color: '#fff', marginBottom: '12px', fontSize: '15px'
}
