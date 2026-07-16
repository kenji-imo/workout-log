import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('profile') || '{}'))
  const records = JSON.parse(localStorage.getItem('records') || '[]')
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')

  const today = new Date().toDateString()
  const todaySession = sessions.find(s => new Date(s.date).toDateString() === today)
  const latestRecord = records[records.length - 1]

  const initial = parseFloat(profile.startWeight) || parseFloat(profile.weight) || 0
  const current = parseFloat(profile.weight) || 0
  const target = parseFloat(profile.targetWeight) || 0
  const diff = current - target
  const progress = initial !== target
  ? Math.min(Math.max(
      Math.abs(initial - current) / Math.abs(initial - target),
      0), 1)
  : 1

  const updateWeight = (value) => {
    const updated = { ...profile, weight: value }
    setProfile(updated)
    localStorage.setItem('profile', JSON.stringify(updated))
  }

  const muscles = ['胸','肩','腕','背中','腹','脚']
  const muscleColors = {
    '胸':'#E94560','肩':'#FF6B35','腕':'#4ECDC4',
    '背中':'#45B7D1','腹':'#96CEB4','脚':'#FFEAA7'
  }

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
        <div>
          <p style={{ color:'#B0B0C0', fontSize:'14px' }}>こんにちは！</p>
          <h1 style={{ fontSize:'26px', fontWeight:'900', color:'#fff' }}>
            {profile.nickname || 'トレーニー'}
          </h1>
        </div>
        <div style={{
          width:'50px', height:'50px', borderRadius:'50%',
          background:'linear-gradient(to right,#E94560,#FF6B35)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'24px'
        }}>🔥</div>
      </div>

      <div className="px-20">
        {/* 本日のタスク */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <h2 style={{ color:'#fff', fontSize:'16px', fontWeight:'700' }}>📅 本日のトレーニング</h2>
            <span style={{ color:'#B0B0C0', fontSize:'12px' }}>
              {new Date().toLocaleDateString('ja-JP',{month:'numeric',day:'numeric',weekday:'short'})}
            </span>
          </div>
          {todaySession?.muscles?.length > 0 ? (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {todaySession.muscles.map(m => (
                <span key={m} style={{
                  padding:'6px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'700',
                  background: muscleColors[m] + '33',
                  border: `1px solid ${muscleColors[m]}`,
                  color:'#fff'
                }}>{m}</span>
              ))}
            </div>
          ) : (
            <p style={{ color:'#B0B0C0' }}>😴 今日は休養日です</p>
          )}
        </div>

        {/* 目標体重進捗 */}
        <div className="card">
          <h2 style={{ color:'#fff', fontSize:'16px', fontWeight:'700', marginBottom:'12px' }}>🎯 目標体重への進捗</h2>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <div>
              <p style={{ color:'#B0B0C0', fontSize:'12px' }}>現在</p>
              <p style={{ color:'#fff', fontSize:'22px', fontWeight:'900' }}>{current.toFixed(1)} kg</p>
            </div>
            <div style={{ color:'#B0B0C0', fontSize:'20px', alignSelf:'center' }}>→</div>
            <div style={{ textAlign:'right' }}>
              <p style={{ color:'#B0B0C0', fontSize:'12px' }}>目標</p>
              <p style={{ fontSize:'22px', fontWeight:'900',
                background:'linear-gradient(to right,#E94560,#FF6B35)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
              }}>{target.toFixed(1)} kg</p>
            </div>
          </div>
          <div style={{ background:'#1A1A2E', borderRadius:'8px', height:'10px', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:'8px',
              background:'linear-gradient(to right,#E94560,#FF6B35)',
              width:`${progress * 100}%`, transition:'width 0.5s'
            }} />
          </div>
          <p style={{ color:'#B0B0C0', fontSize:'12px', marginTop:'8px' }}>
            {Math.abs(diff) > 0.1 ? `あと ${Math.abs(diff).toFixed(1)} kg ✊` : '目標達成！🎉'}
          </p>
        </div>

        {/* ナビゲーション */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {[
            { label:'カレンダー', icon:'📅', path:'/calendar' },
            { label:'記録', icon:'📝', path:'/record' },
            { label:'グラフ', icon:'📊', path:'/graph' },
            { label:'プロフィール', icon:'👤', path:'/profile' },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              background:'#16213E', border:'none', borderRadius:'16px',
              padding:'20px', cursor:'pointer', color:'#fff',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'
            }}>
              <span style={{ fontSize:'28px' }}>{item.icon}</span>
              <span style={{ fontWeight:'700', fontSize:'14px' }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 直近の記録 */}
        {latestRecord && (
          <div className="card" style={{ marginTop:'16px' }}>
            <h2 style={{ color:'#fff', fontSize:'16px', fontWeight:'700', marginBottom:'12px' }}>🕐 直近の記録</h2>
            <div style={{ display:'flex', justifyContent:'space-around' }}>
              {[
                { label:'種目数', value:`${latestRecord.exercises?.length || 0}`, unit:'種目' },
                { label:'消費Cal', value:`${Math.round(latestRecord.totalCalories || 0)}`, unit:'kcal' },
                { label:'体重', value:`${latestRecord.bodyWeight?.toFixed(1) || '-'}`, unit:'kg' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'20px', fontWeight:'900', color:'#fff' }}>{s.value}</p>
                  <p style={{ fontSize:'10px', color:'#B0B0C0' }}>{s.unit}</p>
                  <p style={{ fontSize:'11px', color:'#B0B0C0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
