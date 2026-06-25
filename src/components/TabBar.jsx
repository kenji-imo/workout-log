import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path:'/', icon:'🏠', label:'ホーム' },
  { path:'/calendar', icon:'📅', label:'カレンダー' },
  { path:'/record', icon:'📝', label:'記録' },
  { path:'/graph', icon:'📊', label:'グラフ' },
  { path:'/profile', icon:'👤', label:'プロフィール' },
]

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
      width:'100%', maxWidth:'480px',
      background:'#16213E',
      boxShadow:'0 -4px 12px rgba(0,0,0,0.5)',
      display:'flex', zIndex:50
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex:1, padding:'10px 0 14px', border:'none', background:'none',
            cursor:'pointer', display:'flex', flexDirection:'column',
            alignItems:'center', gap:'3px'
          }}>
            <span style={{ fontSize:'22px', transform: active ? 'scale(1.15)' : 'scale(1)',
              transition:'transform 0.2s' }}>{tab.icon}</span>
            <span style={{
              fontSize:'10px', fontWeight:'700',
              color: active ? '#E94560' : '#B0B0C0'
            }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}