import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

const exerciseDB = {
  '胸': ['バーベルベンチプレス','インクラインベンチプレス','デクラインベンチプレス','ダンベルベンチプレス','ダンベルフライ','ケーブルクロスオーバー','チェストプレス（マシン）','ペックデック','プッシュアップ','ディップス'],
  '肩': ['バーベルショルダープレス','ダンベルショルダープレス','ラテラルレイズ','フロントレイズ','リアデルトフライ','アーノルドプレス','バーベルアップライトロウ','ショルダープレス（マシン）','ケーブルラテラルレイズ','ケトルベルウィンドミル'],
  '腕': ['バーベルカール','スカルクラッシャー','ダンベルカール','ハンマーカール','コンセントレーションカール','トライセプスプッシュダウン','ケーブルカール','アームカール（マシン）','ダンベルトライセプスEX','チンニング（ナローグリップ）'],
  '背中': ['デッドリフト','バーベルロウ','ダンベルロウ','ラットプルダウン','シーテッドロウ','チンニング','フェイスプル','ローイング（マシン）','ケトルベルスイング','ルーマニアンデッドリフト'],
  '腹': ['クランチ','レッグレイズ','プランク','ロシアンツイスト','ケーブルクランチ','アブローラー','バイシクルクランチ','ハンギングレッグレイズ','アブドミナル（マシン）'],
  '脚': ['バーベルスクワット','フロントスクワット','ルーマニアンデッドリフト','バーベルランジ','ゴブレットスクワット','ケトルベルスイング','レッグプレス','レッグカール','レッグエクステンション','カーフレイズ','ブルガリアンスプリットスクワット'],
}

const metValues = {
  'バーベルベンチプレス':5.0,'デッドリフト':6.0,'バーベルスクワット':6.0,
  'ケトルベルスイング':6.0,'default':4.5
}

const muscleColors = {
  '胸':'#E94560','肩':'#FF6B35','腕':'#4ECDC4',
  '背中':'#45B7D1','腹':'#96CEB4','脚':'#FFEAA7'
}

function TimerModal({ onClose }) {
  const [selected, setSelected] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [running, setRunning] = useState(false)
  const timerRef = useRef(null)

  const presets = [30, 60, 90, 120, 180]

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(timerRef.current)
            setRunning(false)
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  const reset = (sec) => {
    clearInterval(timerRef.current)
    setRunning(false)
    setSelected(sec)
    setRemaining(sec)
  }

  const progress = remaining / selected

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200
    }}>
      <div style={{
        background:'#16213E', borderRadius:'24px', padding:'32px 24px',
        width:'320px', textAlign:'center'
      }}>
        <h2 style={{ color:'#fff', marginBottom:'24px' }}>インターバルタイマー</h2>

        {/* 円形プログレス */}
        <div style={{ position:'relative', width:'160px', height:'160px', margin:'0 auto 24px' }}>
          <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#1A1A2E" strokeWidth="12" />
            <circle cx="80" cy="80" r="70" fill="none"
              stroke={progress > 0.6 ? '#4ECDC4' : progress > 0.3 ? '#FF6B35' : '#E94560'}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress)}`}
              style={{ transition:'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position:'absolute', inset:0, display:'flex',
            alignItems:'center', justifyContent:'center'
          }}>
            <span style={{ fontSize:'36px', fontWeight:'900', color:'#fff', fontFamily:'monospace' }}>
              {Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}
            </span>
          </div>
        </div>

        {/* プリセット */}
        <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'24px' }}>
          {presets.map(s => (
            <button key={s} onClick={() => reset(s)} style={{
              padding:'6px 10px', borderRadius:'20px', border:'none', cursor:'pointer',
              background: selected===s ? '#E94560' : '#1A1A2E',
              color:'#fff', fontSize:'12px', fontWeight:'700'
            }}>{s}s</button>
          ))}
        </div>

        {/* ボタン */}
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <button onClick={() => reset(selected)} style={{
            width:'56px', height:'56px', borderRadius:'50%', border:'none',
            background:'#1A1A2E', color:'#fff', fontSize:'20px', cursor:'pointer'
          }}>↺</button>
          <button onClick={() => setRunning(!running)} style={{
            width:'72px', height:'72px', borderRadius:'50%', border:'none',
            background:'linear-gradient(to right,#E94560,#FF6B35)',
            color:'#fff', fontSize:'24px', cursor:'pointer'
          }}>{running ? '⏸' : '▶'}</button>
          <button onClick={onClose} style={{
            width:'56px', height:'56px', borderRadius:'50%', border:'none',
            background:'#1A1A2E', color:'#fff', fontSize:'20px', cursor:'pointer'
          }}>✕</button>
        </div>

        {remaining === 0 && (
          <p style={{ color:'#4ECDC4', fontWeight:'700', marginTop:'16px' }}>
            ✅ インターバル終了！次のセットへ
          </p>
        )}
      </div>
    </div>
  )
}

export default function RecordPage() {
  const [bodyWeight, setBodyWeight] = useState('')
  const [exercises, setExercises] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [pickerMuscle, setPickerMuscle] = useState('胸')
  const [showTimer, setShowTimer] = useState(false)
  const [saved, setSaved] = useState(false)

  const profile = JSON.parse(localStorage.getItem('profile') || '{}')
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const today = new Date().toDateString()
  const todaySession = sessions.find(s => new Date(s.date).toDateString() === today)

  useEffect(() => {
    setBodyWeight(profile.weight || '')
  }, [])

  const addExercise = (name, muscle) => {
    setExercises(prev => [...prev, {
      id: Date.now(), name, muscle, sets: []
    }])
    setShowPicker(false)
  }

  const addSet = (exId) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      const last = ex.sets[ex.sets.length - 1]
      return { ...ex, sets: [...ex.sets, {
        id: Date.now(),
        weight: last?.weight || '',
        reps: last?.reps || '10',
        rpe: last?.rpe || 7
      }]}
    }))
  }

  const updateSet = (exId, setId, field, value) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      return { ...ex, sets: ex.sets.map(s =>
        s.id === setId ? { ...s, [field]: value } : s
      )}
    }))
  }

  const removeSet = (exId, setId) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      return { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
    }))
  }

  const totalVolume = (ex) =>
    ex.sets.reduce((sum, s) => sum + (parseFloat(s.weight)||0) * (parseInt(s.reps)||0), 0)

  const calcCalories = (ex) => {
    const met = metValues[ex.name] || metValues['default']
    const bw = parseFloat(bodyWeight) || 70
    const durationHours = ex.sets.length * 2 / 60
    return bw * met * durationHours
  }

  const totalCalories = exercises.reduce((sum, ex) => sum + calcCalories(ex), 0)

  const saveRecord = async () => {
    const records = JSON.parse(localStorage.getItem('records') || '[]')
    const record = {
      date: new Date().toISOString(),
      bodyWeight: parseFloat(bodyWeight) || 0,
      exercises,
      totalCalories
    }
    records.push(record)
    localStorage.setItem('records', JSON.stringify(records))

    // Supabaseにも「今日トレーニングした」ことを記録(フレンドランキング用)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const todayDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      await supabase.from('training_days').upsert(
        { user_id: user.id, date: todayDate },
        { onConflict: 'user_id,date' }
      )
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'900', color:'#fff' }}>記録</h1>
        <button onClick={() => setShowTimer(true)} style={{
          background:'none', border:'none', fontSize:'24px', cursor:'pointer'
        }}>⏱️</button>
      </div>

      <div className="px-20">
        {/* 体重入力 */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontSize:'28px' }}>⚖️</span>
            <div style={{ flex:1 }}>
              <p style={{ color:'#B0B0C0', fontSize:'12px' }}>今日の体重</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                <input
                  type="number"
                  value={bodyWeight}
                  onChange={e => setBodyWeight(e.target.value)}
                  style={{ width:'80px', fontSize:'22px', fontWeight:'900', padding:'4px 8px' }}
                  placeholder="0.0"
                />
                <span style={{ color:'#B0B0C0', fontSize:'16px' }}>kg</span>
              </div>
            </div>
            {bodyWeight && profile.targetWeight && (
              <div style={{ textAlign:'right' }}>
                <p style={{ color:'#B0B0C0', fontSize:'11px' }}>目標まで</p>
                <p style={{ fontSize:'16px', fontWeight:'900',
                  background:'linear-gradient(to right,#E94560,#FF6B35)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
                }}>{Math.max(parseFloat(bodyWeight)-parseFloat(profile.targetWeight),0).toFixed(1)} kg</p>
              </div>
            )}
          </div>
        </div>

        {/* 本日の部位 */}
        {todaySession?.muscles?.length > 0 && (
          <div style={{ marginBottom:'16px' }}>
            <p style={{ color:'#fff', fontWeight:'700', marginBottom:'10px' }}>本日の部位</p>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {todaySession.muscles.map(m => (
                <button key={m} onClick={() => { setPickerMuscle(m); setShowPicker(true) }} style={{
                  padding:'8px 14px', borderRadius:'20px', border:`1px solid ${muscleColors[m]}`,
                  background: muscleColors[m]+'22', color:'#fff', fontWeight:'700',
                  cursor:'pointer', fontSize:'13px'
                }}>{m} ＋</button>
              ))}
            </div>
          </div>
        )}

        {/* 種目リスト */}
        {exercises.map(ex => (
          <div key={ex.id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
              <div>
                <p style={{ color:'#fff', fontWeight:'700', fontSize:'15px' }}>{ex.name}</p>
                <p style={{ color:'#B0B0C0', fontSize:'12px' }}>{ex.muscle}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:'11px', color:'#B0B0C0' }}>総負荷</p>
                <p style={{ fontSize:'14px', fontWeight:'700',
                  background:'linear-gradient(to right,#E94560,#FF6B35)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
                }}>{totalVolume(ex).toFixed(0)} kg</p>
              </div>
            </div>

            {/* セットヘッダー */}
            {ex.sets.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'36px 1fr 1fr 1fr 24px',
                gap:'6px', marginBottom:'6px', padding:'0 4px' }}>
                {['SET','重量','回数','RPE',''].map(h => (
                  <p key={h} style={{ color:'#B0B0C0', fontSize:'10px', fontWeight:'700', textAlign:'center' }}>{h}</p>
                ))}
              </div>
            )}

            {/* セット行 */}
            {ex.sets.map((s, idx) => (
              <div key={s.id} style={{ display:'grid', gridTemplateColumns:'36px 1fr 1fr 1fr 24px',
                gap:'6px', marginBottom:'6px', alignItems:'center' }}>
                <div style={{ background:'rgba(233,69,96,0.2)', borderRadius:'8px',
                  textAlign:'center', padding:'8px 0', color:'#fff', fontSize:'13px', fontWeight:'700' }}>
                  {idx+1}
                </div>
                <input type="number" value={s.weight}
                  onChange={e => updateSet(ex.id, s.id, 'weight', e.target.value)}
                  style={{ textAlign:'center', padding:'8px 4px', fontSize:'14px' }}
                  placeholder="0" />
                <input type="number" value={s.reps}
                  onChange={e => updateSet(ex.id, s.id, 'reps', e.target.value)}
                  style={{ textAlign:'center', padding:'8px 4px', fontSize:'14px' }}
                  placeholder="0" />
                <select value={s.rpe}
                  onChange={e => updateSet(ex.id, s.id, 'rpe', parseInt(e.target.value))}
                  style={{ background:'#1A1A2E', border:'1px solid rgba(233,69,96,0.3)',
                    borderRadius:'12px', color: s.rpe>=8?'#E94560':s.rpe>=5?'#FF6B35':'#4ECDC4',
                    padding:'8px 4px', fontSize:'14px', fontWeight:'700', textAlign:'center' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <button onClick={() => removeSet(ex.id, s.id)} style={{
                  background:'none', border:'none', color:'#E94560', fontSize:'16px', cursor:'pointer'
                }}>✕</button>
              </div>
            ))}

            <button onClick={() => addSet(ex.id)} style={{
              width:'100%', padding:'8px', borderRadius:'8px', border:'none',
              background:'rgba(233,69,96,0.1)', color:'#E94560',
              fontWeight:'700', cursor:'pointer', marginTop:'4px'
            }}>＋ セットを追加</button>
          </div>
        ))}

        {/* 種目追加ボタン */}
        <button onClick={() => setShowPicker(true)} style={{
          width:'100%', padding:'16px', borderRadius:'14px',
          border:'1px dashed rgba(233,69,96,0.5)', background:'#16213E',
          color:'#E94560', fontWeight:'700', fontSize:'15px', cursor:'pointer',
          marginBottom:'16px'
        }}>＋ 種目を追加</button>

        {/* サマリー */}
        {exercises.length > 0 && (
          <div className="card">
            <h2 style={{ color:'#fff', fontWeight:'700', marginBottom:'12px' }}>📊 本日のサマリー</h2>
            <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'16px' }}>
              {[
                { label:'種目数', value:`${exercises.length}`, unit:'種目' },
                { label:'総負荷', value:`${exercises.reduce((s,e)=>s+totalVolume(e),0).toFixed(0)}`, unit:'kg' },
                { label:'消費Cal', value:`${Math.round(totalCalories)}`, unit:'kcal' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'22px', fontWeight:'900', color:'#fff' }}>{s.value}</p>
                  <p style={{ fontSize:'10px', color:'#B0B0C0' }}>{s.unit}</p>
                  <p style={{ fontSize:'11px', color:'#B0B0C0' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <button className="accent-btn" onClick={saveRecord}>記録を保存</button>
          </div>
        )}
      </div>

      {/* 種目ピッカー */}
      {showPicker && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'flex-end', zIndex:100
        }} onClick={() => setShowPicker(false)}>
          <div style={{
            background:'#16213E', borderRadius:'20px 20px 0 0',
            padding:'24px 20px 40px', width:'100%', maxWidth:'480px',
            margin:'0 auto', maxHeight:'70vh', overflow:'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width:'40px', height:'5px', borderRadius:'3px',
              background:'#B0B0C0', margin:'0 auto 20px' }} />
            <h2 style={{ color:'#fff', textAlign:'center', marginBottom:'16px' }}>種目を選択</h2>

            {/* 部位タブ */}
            <div style={{ display:'flex', gap:'8px', overflowX:'auto', marginBottom:'16px', paddingBottom:'4px' }}>
              {Object.keys(exerciseDB).map(m => (
                <button key={m} onClick={() => setPickerMuscle(m)} style={{
                  padding:'6px 14px', borderRadius:'20px', border:'none',
                  background: pickerMuscle===m ? muscleColors[m]+'44' : '#1A1A2E',
                  outline: pickerMuscle===m ? `1px solid ${muscleColors[m]}` : 'none',
                  color:'#fff', fontWeight:'700', fontSize:'13px',
                  cursor:'pointer', whiteSpace:'nowrap'
                }}>{m}</button>
              ))}
            </div>

            {/* 種目リスト */}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {exerciseDB[pickerMuscle].map(name => (
                <button key={name} onClick={() => addExercise(name, pickerMuscle)} style={{
                  background:'#1A1A2E', border:'none', borderRadius:'12px',
                  padding:'14px 16px', color:'#fff', fontWeight:'600',
                  cursor:'pointer', textAlign:'left', fontSize:'14px',
                  display:'flex', justifyContent:'space-between', alignItems:'center'
                }}>
                  {name}
                  <span style={{ color:'#E94560', fontSize:'18px' }}>＋</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* タイマー */}
      {showTimer && <TimerModal onClose={() => setShowTimer(false)} />}

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
