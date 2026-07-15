import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function ProfilePage() {
  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem('profile') || '{}')
  )
  const [saved, setSaved] = useState(false)
  const [friendCode, setFriendCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchFriendCode = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('friend_code')
        .eq('id', user.id)
        .single()
      if (data) setFriendCode(data.friend_code)
    }
    fetchFriendCode()
  }, [])

  const copyFriendCode = () => {
    navigator.clipboard.writeText(friendCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const update = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const save = () => {
    localStorage.setItem('profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const diff = parseFloat(profile.weight) - parseFloat(profile.targetWeight)
  const diffAbs = Math.abs(diff)
  
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'900', color:'#fff' }}>プロフィール</h1>
        <button onClick={save} style={{
          background:'none', border:'none',
          fontSize:'16px', fontWeight:'700', cursor:'pointer',
          background:'linear-gradient(to right,#E94560,#FF6B35)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
        }}>保存</button>
      </div>

      <div className="px-20">
        {/* アバター */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{
            width:'90px', height:'90px', borderRadius:'50%', margin:'0 auto 12px',
            background:'linear-gradient(135deg,#16213E,#0F3460)',
            border:'2px solid #E94560',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'44px'
          }}>💪</div>
          <h2 style={{ color:'#fff', fontSize:'22px', fontWeight:'900' }}>
            {profile.nickname || '名前を設定してください'}
          </h2>
          <p style={{ color:'#B0B0C0', fontSize:'14px', marginTop:'4px' }}>
            {profile.gender} · {profile.age}歳
          </p>
        </div>

        

        {/* フレンドコード */}
        {friendCode && (
          <div className="card" onClick={copyFriendCode} style={{ marginBottom:'24px', cursor:'pointer', textAlign:'center' }}>
            <p style={{ color:'#B0B0C0', fontSize:'12px', marginBottom:'6px' }}>あなたのフレンドコード(タップでコピー)</p>
            <p style={{ color:'#fff', fontSize:'24px', fontWeight:'900', letterSpacing:'4px' }}>
              {copied ? 'コピーしました！' : friendCode}
            </p>
          </div>
        )}

        {/* フォーム */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginBottom:'6px' }}>ニックネーム</p>
            <input value={profile.nickname || ''} onChange={e => update('nickname', e.target.value)} placeholder="例：たろう" />
          </div>

          <div>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginBottom:'6px' }}>年齢</p>
            <input type="number" value={profile.age || ''} onChange={e => update('age', e.target.value)} placeholder="例：22" />
          </div>

          <div>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginBottom:'6px' }}>性別</p>
            <div style={{ display:'flex', gap:'8px' }}>
              {['男性','女性','その他'].map(g => (
                <button key={g} onClick={() => update('gender', g)} style={{
                  flex:1, padding:'10px', borderRadius:'10px', border:'none',
                  background: profile.gender===g ? '#E94560' : '#16213E',
                  color:'#fff', fontWeight:'700', cursor:'pointer'
                }}>{g}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginBottom:'6px' }}>現在の体重 (kg)</p>
            <input type="number" value={profile.weight || ''} onChange={e => update('weight', e.target.value)} placeholder="例：70.5" />
          </div>

          <div>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginBottom:'6px' }}>目標体重 (kg)</p>
            <input type="number" value={profile.targetWeight || ''} onChange={e => update('targetWeight', e.target.value)} placeholder="例：65.0" />
          </div>
        </div>

        {/* 差分カード */}
        {profile.weight && profile.targetWeight && (
          <div className="card" style={{ marginTop:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'32px' }}>{diff !== 0 ? '🎯' : '🎉'}</span>
              <div>
                <p style={{ color:'#fff', fontWeight:'700' }}>
                  {diff !== 0
                    ? `目標まであと ${diffAbs.toFixed(1)} kg`
                    : '目標体重に達しています！'}
                </p>
                <p style={{ color:'#B0B0C0', fontSize:'12px', marginTop:'4px' }}>
                  一緒に頑張りましょう💪
                </p>
              </div>
            </div>
          </div>
        )}

        <button className="accent-btn" style={{ marginTop:'24px' }} onClick={save}>
          変更を保存
        </button>

        <button onClick={() => supabase.auth.signOut()} style={{
          width:'100%', marginTop:'12px', padding:'14px', borderRadius:'12px',
          border:'1px solid rgba(233,69,96,0.4)', background:'transparent',
          color:'#E94560', fontWeight:'700', cursor:'pointer'
        }}>
          ログアウト
        </button>
      </div>

      {/* 保存トースト */}
      {saved && (
        <div style={{
          position:'fixed', bottom:'100px', left:'50%', transform:'translateX(-50%)',
          background:'rgba(78,205,196,0.9)', color:'#fff', padding:'10px 24px',
          borderRadius:'20px', fontWeight:'700', zIndex:300
        }}>✅ 保存しました</div>
      )}
    </div>
  )
}
