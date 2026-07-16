import { useState } from 'react'

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('男性')
  const [weight, setWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')

  const save = () => {
    const profile = { nickname, age, gender, weight, targetWeight, startWeight: weight }
    localStorage.setItem('profile', JSON.stringify(profile))
    localStorage.setItem('isProfileSetup', 'true')
    onComplete()
  }

  return (
    <div style={{ padding: '40px 24px', minHeight: '100vh', background: '#1A1A2E' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px' }}>💪</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', marginTop: '12px' }}>
          プロフィール設定
        </h1>
        <p style={{ color: '#B0B0C0', marginTop: '8px' }}>あなたの情報を入力してください</p>
      </div>

      {/* ステップインジケーター */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '4px',
            background: i <= step ? '#E94560' : '#16213E'
          }} />
        ))}
      </div>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>基本情報</h2>
          <div>
            <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '6px' }}>ニックネーム</p>
            <input placeholder="例：たろう" value={nickname} onChange={e => setNickname(e.target.value)} />
          </div>
          <div>
            <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '6px' }}>年齢</p>
            <input placeholder="例：22" type="number" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div>
            <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '6px' }}>性別</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['男性','女性','その他'].map(g => (
                <button key={g} onClick={() => setGender(g)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  background: gender === g ? '#E94560' : '#16213E',
                  color: '#fff', fontWeight: '700', cursor: 'pointer'
                }}>{g}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>体重・目標</h2>
          <div>
            <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '6px' }}>現在の体重 (kg)</p>
            <input placeholder="例：70.5" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div>
            <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '6px' }}>目標体重 (kg)</p>
            <input placeholder="例：65.0" type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} />
          </div>
          {weight && targetWeight && (
            <div className="card" style={{ marginTop: '8px' }}>
              <p style={{ color: '#fff', fontWeight: '700' }}>
                目標まであと {Math.abs(parseFloat(weight) - parseFloat(targetWeight)).toFixed(1)} kg 
              </p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>確認</h2>
          <div className="card">
            {[
              ['ニックネーム', nickname],
              ['年齢', `${age}歳`],
              ['性別', gender],
              ['体重', `${weight} kg`],
              ['目標体重', `${targetWeight} kg`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                borderBottom: '1px solid rgba(176,176,192,0.2)' }}>
                <span style={{ color: '#B0B0C0' }}>{label}</span>
                <span style={{ color: '#fff', fontWeight: '700' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{
            flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
            background: '#16213E', color: '#B0B0C0', fontSize: '16px',
            fontWeight: '700', cursor: 'pointer'
          }}>戻る</button>
        )}
        <button className="accent-btn" style={{ flex: 2 }}
          onClick={() => step < 2 ? setStep(step + 1) : save()}>
          {step < 2 ? '次へ' : 'はじめる'}
        </button>
      </div>
    </div>
  )
}
