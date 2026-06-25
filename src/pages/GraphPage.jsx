import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const muscles = ['胸','肩','腕','背中','腹','脚']
const muscleColors = {
  '胸':'#E94560','肩':'#FF6B35','腕':'#4ECDC4',
  '背中':'#45B7D1','腹':'#96CEB4','脚':'#FFEAA7'
}

export default function GraphPage() {
  const [selectedMuscle, setSelectedMuscle] = useState('胸')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [period, setPeriod] = useState('3m')

  const records = JSON.parse(localStorage.getItem('records') || '[]')

  // 選択部位の種目一覧
  const availableExercises = [...new Set(
    records.flatMap(r => r.exercises || [])
      .filter(e => e.muscle === selectedMuscle)
      .map(e => e.name)
  )]

  const exercise = selectedExercise || availableExercises[0] || ''

  // 期間フィルタ
  const cutoff = new Date()
  if (period === '1m') cutoff.setMonth(cutoff.getMonth() - 1)
  else if (period === '3m') cutoff.setMonth(cutoff.getMonth() - 3)
  else cutoff.setFullYear(2000)

  // グラフデータ生成
  const graphData = records
    .filter(r => new Date(r.date) >= cutoff)
    .map(r => {
      const exList = (r.exercises || []).filter(e => e.name === exercise)
      if (exList.length === 0) return null
      const totalVol = exList.reduce((sum, e) =>
        sum + e.sets.reduce((s2, s) => s2 + (parseFloat(s.weight)||0)*(parseInt(s.reps)||0), 0), 0)
      const allSets = exList.flatMap(e => e.sets)
      const avgRPE = allSets.length > 0
        ? allSets.reduce((sum, s) => sum + (parseInt(s.rpe)||0), 0) / allSets.length
        : 0
      return {
        date: new Date(r.date).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'}),
        総負荷: Math.round(totalVol),
        RPE: parseFloat(avgRPE.toFixed(1))
      }
    })
    .filter(Boolean)

  const maxVol = Math.max(...graphData.map(d => d.総負荷), 0)
  const avgVol = graphData.length > 0
    ? Math.round(graphData.reduce((s,d) => s+d.総負荷, 0) / graphData.length) : 0
  const avgRPE = graphData.length > 0
    ? (graphData.reduce((s,d) => s+d.RPE, 0) / graphData.length).toFixed(1) : 0

  return (
    <div>
      <h1 className="page-header">グラフ</h1>
      <div className="px-20">

        {/* 部位選択 */}
        <div style={{ display:'flex', gap:'8px', overflowX:'auto', marginBottom:'16px', paddingBottom:'4px' }}>
          {muscles.map(m => (
            <button key={m} onClick={() => { setSelectedMuscle(m); setSelectedExercise('') }} style={{
              padding:'8px 16px', borderRadius:'20px', border:'none', cursor:'pointer',
              background: selectedMuscle===m ? muscleColors[m]+'44' : '#16213E',
              outline: selectedMuscle===m ? `1px solid ${muscleColors[m]}` : 'none',
              color:'#fff', fontWeight:'700', fontSize:'13px', whiteSpace:'nowrap'
            }}>{m}</button>
          ))}
        </div>

        {/* 種目選択 */}
        {availableExercises.length > 0 ? (
          <div className="card">
            <p style={{ color:'#B0B0C0', fontSize:'12px', marginBottom:'8px' }}>種目を選択</p>
            <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
              {availableExercises.map(name => (
                <button key={name} onClick={() => setSelectedExercise(name)} style={{
                  padding:'6px 14px', borderRadius:'20px', border:'none', cursor:'pointer',
                  background: exercise===name ? '#E94560' : '#1A1A2E',
                  color:'#fff', fontWeight:'700', fontSize:'12px', whiteSpace:'nowrap'
                }}>{name}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign:'center', padding:'40px 20px' }}>
            <p style={{ fontSize:'40px', marginBottom:'12px' }}>📊</p>
            <p style={{ color:'#fff', fontWeight:'700' }}>記録がありません</p>
            <p style={{ color:'#B0B0C0', fontSize:'13px', marginTop:'8px' }}>
              {selectedMuscle}のトレーニングを記録するとグラフが表示されます
            </p>
          </div>
        )}

        {graphData.length > 0 && <>
          {/* 期間選択 */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
            {[['1m','1ヶ月'],['3m','3ヶ月'],['all','全期間']].map(([v,l]) => (
              <button key={v} onClick={() => setPeriod(v)} style={{
                flex:1, padding:'8px', borderRadius:'10px', border:'none', cursor:'pointer',
                background: period===v ? '#E94560' : '#16213E',
                color:'#fff', fontWeight:'700', fontSize:'13px'
              }}>{l}</button>
            ))}
          </div>

          {/* 総負荷グラフ */}
          <div className="card">
            <h2 style={{ color:'#fff', fontWeight:'700', marginBottom:'16px' }}>📈 総負荷 (kg)</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={graphData} margin={{ top:5, right:10, left:-20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,176,192,0.2)" />
                <XAxis dataKey="date" tick={{ fill:'#B0B0C0', fontSize:10 }} />
                <YAxis tick={{ fill:'#B0B0C0', fontSize:10 }} />
                <Tooltip
                  contentStyle={{ background:'#16213E', border:'none', borderRadius:'10px', color:'#fff' }}
                />
                <Bar dataKey="総負荷" fill="url(#volGrad)" radius={[4,4,0,0]} />
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E94560" />
                    <stop offset="100%" stopColor="#FF6B35" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RPEグラフ */}
          <div className="card">
            <h2 style={{ color:'#fff', fontWeight:'700', marginBottom:'16px' }}>💪 RPE平均</h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={graphData} margin={{ top:5, right:10, left:-20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,176,192,0.2)" />
                <XAxis dataKey="date" tick={{ fill:'#B0B0C0', fontSize:10 }} />
                <YAxis domain={[0,10]} tick={{ fill:'#B0B0C0', fontSize:10 }} />
                <Tooltip
                  contentStyle={{ background:'#16213E', border:'none', borderRadius:'10px', color:'#fff' }}
                />
                <Line type="monotone" dataKey="RPE" stroke="#FF6B35"
                  strokeWidth={2.5} dot={{ fill:'#E94560', r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 統計 */}
          <div className="card">
            <h2 style={{ color:'#fff', fontWeight:'700', marginBottom:'12px' }}>統計</h2>
            <div style={{ display:'flex', justifyContent:'space-around' }}>
              {[
                { label:'最大総負荷', value:`${maxVol}`, unit:'kg' },
                { label:'平均総負荷', value:`${avgVol}`, unit:'kg' },
                { label:'平均RPE', value:`${avgRPE}`, unit:'/ 10' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'22px', fontWeight:'900', color:'#fff' }}>{s.value}</p>
                  <p style={{ fontSize:'10px', color:'#B0B0C0' }}>{s.unit}</p>
                  <p style={{ fontSize:'11px', color:'#B0B0C0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>}
      </div>
    </div>
  )
}