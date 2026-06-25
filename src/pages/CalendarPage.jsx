import { useState } from 'react'

const muscleColors = {
  '胸':'#E94560','肩':'#FF6B35','腕':'#4ECDC4',
  '背中':'#45B7D1','腹':'#96CEB4','脚':'#FFEAA7'
}
const muscles = ['胸','肩','腕','背中','腹','脚']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showSheet, setShowSheet] = useState(false)
  const [sessions, setSessions] = useState(() =>
    JSON.parse(localStorage.getItem('sessions') || '[]')
  )
  const [selectedMuscles, setSelectedMuscles] = useState([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const getSession = (day) => {
    if (!day) return null
    const d = new Date(year, month, day).toDateString()
    return sessions.find(s => new Date(s.date).toDateString() === d)
  }

  const openSheet = (day) => {
    const date = new Date(year, month, day)
    setSelectedDate(date)
    const session = sessions.find(s => new Date(s.date).toDateString() === date.toDateString())
    setSelectedMuscles(session?.muscles || [])
    setShowSheet(true)
  }

  const saveSession = () => {
    const dateStr = selectedDate.toDateString()
    const updated = sessions.filter(s => new Date(s.date).toDateString() !== dateStr)
    if (selectedMuscles.length > 0) {
      updated.push({ date: selectedDate.toISOString(), muscles: selectedMuscles })
    }
    setSessions(updated)
    localStorage.setItem('sessions', JSON.stringify(updated))
    setShowSheet(false)
  }

  const toggleMuscle = (m) => {
    setSelectedMuscles(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )
  }

  return (
    <div>
      <h1 className="page-header">カレンダー</h1>
      <div className="px-20">
        {/* 月ナビ */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
          <button onClick={() => setCurrentDate(new Date(year, month-1, 1))} style={{
            background:'#16213E', border:'none', color:'#fff', borderRadius:'50%',
            width:'36px', height:'36px', fontSize:'18px', cursor:'pointer'
          }}>‹</button>
          <h2 style={{ color:'#fff', fontWeight:'700' }}>{year}年 {month+1}月</h2>
          <button onClick={() => setCurrentDate(new Date(year, month+1, 1))} style={{
            background:'#16213E', border:'none', color:'#fff', borderRadius:'50%',
            width:'36px', height:'36px', fontSize:'18px', cursor:'pointer'
          }}>›</button>
        </div>

        {/* 曜日ヘッダー */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'8px' }}>
          {['日','月','火','水','木','金','土'].map((d,i) => (
            <div key={d} style={{
              textAlign:'center', fontSize:'12px', fontWeight:'700',
              color: i===0 ? '#E94560' : i===6 ? '#45B7D1' : '#B0B0C0',
              padding:'4px 0'
            }}>{d}</div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="card" style={{ padding:'12px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
            {days.map((day, i) => {
              const session = getSession(day)
              const isToday = day && new Date(year,month,day).toDateString() === new Date().toDateString()
              const isSelected = day && new Date(year,month,day).toDateString() === selectedDate.toDateString()
              const weekday = (i % 7)
              return (
                <div key={i} onClick={() => day && openSheet(day)} style={{
                  height:'44px', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', borderRadius:'8px',
                  cursor: day ? 'pointer' : 'default',
                  background: isSelected ? 'linear-gradient(to right,#E94560,#FF6B35)' :
                               isToday ? 'rgba(233,69,96,0.15)' : 'transparent',
                  border: isToday && !isSelected ? '1px solid #E94560' : 'none',
                }}>
                  {day && <>
                    <span style={{
                      fontSize:'14px', fontWeight: isSelected||isToday ? '700':'400',
                      color: isSelected ? '#fff' :
                             weekday===0 ? '#E94560' : weekday===6 ? '#45B7D1' : '#fff'
                    }}>{day}</span>
                    {session && (
                      <div style={{ display:'flex', gap:'2px', marginTop:'2px' }}>
                        {session.muscles.slice(0,3).map(m => (
                          <div key={m} style={{
                            width:'4px', height:'4px', borderRadius:'50%',
                            background: muscleColors[m]
                          }} />
                        ))}
                      </div>
                    )}
                  </>}
                </div>
              )
            })}
          </div>
        </div>

        {/* 選択日の詳細 */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <div>
              <p style={{ color:'#fff', fontWeight:'700' }}>
                {selectedDate.toLocaleDateString('ja-JP',{month:'long',day:'numeric'})}
              </p>
              <p style={{ color:'#B0B0C0', fontSize:'12px' }}>
                {selectedDate.toLocaleDateString('ja-JP',{weekday:'long'})}
              </p>
            </div>
            <button onClick={() => openSheet(selectedDate.getDate())} style={{
              background:'linear-gradient(to right,#E94560,#FF6B35)',
              border:'none', borderRadius:'20px', color:'#fff',
              padding:'8px 16px', fontWeight:'700', cursor:'pointer', fontSize:'13px'
            }}>
              {getSession(selectedDate.getDate()) ? '✏️ 編集' : '＋ 追加'}
            </button>
          </div>
          {(() => {
            const s = getSession(selectedDate.getDate())
            return s?.muscles?.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {s.muscles.map(m => (
                  <span key={m} style={{
                    padding:'6px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'700',
                    background: muscleColors[m]+'33', border:`1px solid ${muscleColors[m]}`, color:'#fff'
                  }}>{m}</span>
                ))}
              </div>
            ) : <p style={{ color:'#B0B0C0' }}>予定なし</p>
          })()}
        </div>
      </div>

      {/* 入力シート */}
      {showSheet && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'flex-end', zIndex:100
        }} onClick={() => setShowSheet(false)}>
          <div style={{
            background:'#16213E', borderRadius:'20px 20px 0 0',
            padding:'24px 20px 40px', width:'100%', maxWidth:'480px', margin:'0 auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width:'40px', height:'5px', borderRadius:'3px',
              background:'#B0B0C0', margin:'0 auto 20px' }} />
            <h2 style={{ color:'#fff', textAlign:'center', marginBottom:'20px' }}>
              部位を選択
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'24px' }}>
              {muscles.map(m => (
                <button key={m} onClick={() => toggleMuscle(m)} style={{
                  padding:'16px 8px', borderRadius:'14px', border:'none', cursor:'pointer',
                  background: selectedMuscles.includes(m) ? muscleColors[m]+'33' : '#1A1A2E',
                  outline: selectedMuscles.includes(m) ? `1.5px solid ${muscleColors[m]}` : 'none',
                  color:'#fff', fontWeight:'700', fontSize:'15px'
                }}>{m}</button>
              ))}
            </div>
            <button className="accent-btn" onClick={saveSession}>保存</button>
          </div>
        </div>
      )}
    </div>
  )
}