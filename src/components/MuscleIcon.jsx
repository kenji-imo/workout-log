const baseColor = '#3A3A5A'

const muscleColors = {
  '胸': '#E94560', '肩': '#FF6B35', '腕': '#4ECDC4',
  '背中': '#45B7D1', '腹': '#96CEB4', '脚': '#FFEAA7'
}

const highlightMap = {
  '胸': { chest: true },
  '肩': { shoulders: true },
  '腕': { arms: true },
  '背中': { chest: true, abs: true },
  '腹': { abs: true },
  '脚': { legs: true },
}

export default function MuscleIcon({ muscle, size = 28 }) {
  const accent = muscleColors[muscle] || '#E94560'
  const h = highlightMap[muscle] || {}
  const c = {
    chest: h.chest ? accent : baseColor,
    abs: h.abs ? accent : baseColor,
    shoulders: h.shoulders ? accent : baseColor,
    arms: h.arms ? accent : baseColor,
    legs: h.legs ? accent : baseColor,
  }

  return (
    <svg viewBox="0 0 60 100" width={size} height={size * 1.6} style={{ flexShrink: 0 }}>
      <circle cx="30" cy="10" r="8" fill={baseColor} />
      <rect x="18" y="20" width="24" height="16" rx="6" fill={c.chest} />
      <rect x="18" y="36" width="24" height="16" rx="6" fill={c.abs} />
      <circle cx="14" cy="24" r="5" fill={c.shoulders} />
      <circle cx="46" cy="24" r="5" fill={c.shoulders} />
      <rect x="6" y="24" width="9" height="24" rx="4" fill={c.arms} />
      <rect x="45" y="24" width="9" height="24" rx="4" fill={c.arms} />
      <rect x="19" y="52" width="9" height="34" rx="4" fill={c.legs} />
      <rect x="32" y="52" width="9" height="34" rx="4" fill={c.legs} />
    </svg>
  )
}
