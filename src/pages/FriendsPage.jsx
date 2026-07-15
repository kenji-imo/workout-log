import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function getWeekStart() {
  const now = new Date()
  const day = now.getDay() // 0=日曜
  const diff = day === 0 ? 6 : day - 1 // 月曜始まりにする
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

export default function FriendsPage() {
  const [myId, setMyId] = useState(null)
  const [codeInput, setCodeInput] = useState('')
  const [message, setMessage] = useState('')
  const [incoming, setIncoming] = useState([])
  const [friends, setFriends] = useState([])
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setMyId(user.id)

    const { data: incomingReqs } = await supabase
      .from('friendships')
      .select('id, user_id')
      .eq('friend_id', user.id)
      .eq('status', 'pending')

    if (incomingReqs?.length) {
      const ids = incomingReqs.map(r => r.user_id)
      const { data: fromProfiles } = await supabase
        .from('profiles').select('id, nickname').in('id', ids)
      setIncoming(incomingReqs.map(r => ({
        reqId: r.id,
        nickname: fromProfiles?.find(p => p.id === r.user_id)?.nickname || '???'
      })))
    } else {
      setIncoming([])
    }

    const { data: accepted } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

    const friendIds = (accepted || []).map(f =>
      f.user_id === user.id ? f.friend_id : f.user_id
    )

    let friendProfiles = []
    if (friendIds.length) {
      const { data } = await supabase
        .from('profiles').select('id, nickname').in('id', friendIds)
      friendProfiles = data || []
    }
    setFriends(friendProfiles)

    const allIds = [user.id, ...friendIds]
    const weekStart = getWeekStart()
    const { data: trainingRows } = await supabase
      .from('training_days')
      .select('user_id, date')
      .gte('date', weekStart)
      .in('user_id', allIds)

    const countMap = {}
    allIds.forEach(id => { countMap[id] = 0 })
    ;(trainingRows || []).forEach(row => {
      countMap[row.user_id] = (countMap[row.user_id] || 0) + 1
    })

    const nameMap = { [user.id]: 'あなた' }
    friendProfiles.forEach(p => { nameMap[p.id] = p.nickname })

    const rankingList = allIds
      .map(id => ({ id, name: nameMap[id] || '???', count: countMap[id] || 0 }))
      .sort((a, b) => b.count - a.count)

    setRanking(rankingList)
    setLoading(false)
  }

  const sendRequest = async () => {
    setMessage('')
    const code = codeInput.trim().toUpperCase()
    if (!code) return

    const { data: targetProfile, error: findError } = await supabase
      .from('profiles')
      .select('id, nickname')
      .eq('friend_code', code)
      .single()

    if (findError || !targetProfile) {
      setMessage('そのコードのユーザーが見つかりませんでした')
      return
    }
    if (targetProfile.id === myId) {
      setMessage('自分自身は追加できません')
      return
    }

    const { error: insertError } = await supabase
      .from('friendships')
      .insert({ user_id: myId, friend_id: targetProfile.id, status: 'pending' })

    if (insertError) {
      setMessage('すでに申請済み、またはフレンドです')
      return
    }

    setMessage(`${targetProfile.nickname} さんに申請を送りました`)
    setCodeInput('')
  }

  const acceptRequest = async (reqId) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', reqId)
    loadAll()
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', color: '#fff', textAlign: 'center' }}>読み込み中...</div>
    )
  }

  return (
    <div>
      <div style={{ padding: '16px 20px 12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>フレンド</h1>
      </div>

      <div className="px-20">
        <div className="card" style={{ marginBottom: '16px' }}>
          <p style={{ color: '#B0B0C0', fontSize: '13px', marginBottom: '8px' }}>フレンドコードで追加</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              placeholder="例：AB12CD"
              style={{ flex: 1, textTransform: 'uppercase' }}
            />
            <button onClick={sendRequest} style={{
              padding: '0 20px', borderRadius: '10px', border: 'none',
              background: '#E94560', color: '#fff', fontWeight: '700', cursor: 'pointer'
            }}>追加</button>
          </div>
          {message && (
            <p style={{ color: '#4ECDC4', fontSize: '13px', marginTop: '8px' }}>{message}</p>
          )}
        </div>

        {incoming.length > 0 && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <p style={{ color: '#fff', fontWeight: '700', marginBottom: '10px' }}>フレンド申請</p>
            {incoming.map(req => (
              <div key={req.reqId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0'
              }}>
                <span style={{ color: '#fff' }}>{req.nickname}</span>
                <button onClick={() => acceptRequest(req.reqId)} style={{
                  padding: '6px 16px', borderRadius: '20px', border: 'none',
                  background: '#4ECDC4', color: '#0F3460', fontWeight: '700', cursor: 'pointer'
                }}>承認</button>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <p style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
            🏆 今週のトレーニング日数ランキング
          </p>
          {ranking.length === 0 && (
            <p style={{ color: '#B0B0C0', fontSize: '13px' }}>データがありません</p>
          )}
          {ranking.map((r, idx) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: idx < ranking.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
            }}>
              <span style={{
                width: '28px', textAlign: 'center', fontWeight: '900',
                color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#B0B0C0'
              }}>{idx + 1}</span>
              <span style={{ flex: 1, color: r.name === 'あなた' ? '#E94560' : '#fff', fontWeight: '700' }}>
                {r.name}
              </span>
              <span style={{
                fontWeight: '900',
                background: 'linear-gradient(to right,#E94560,#FF6B35)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{r.count} 日</span>
            </div>
          ))}
        </div>

        {friends.length === 0 && (
          <p style={{ color: '#B0B0C0', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
            まだフレンドがいません。フレンドコードを教え合って追加しましょう！
          </p>
        )}
      </div>
    </div>
  )
}
