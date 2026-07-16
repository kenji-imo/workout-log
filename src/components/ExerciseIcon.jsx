import MuscleIcon from './MuscleIcon'

const S = 4

const Head = (props) => <circle r="5" {...props} />

function Pictogram({ accent, children }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%">
      <g fill="none" stroke={accent} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

const pictograms = {
  'バーベルベンチプレス': (accent) => (
    <Pictogram accent={accent}>
      <line x1="8" y1="42" x2="52" y2="42" />
      <Head cx="14" cy="34" fill={accent} stroke="none" />
      <line x1="19" y1="35" x2="40" y2="35" />
      <path d="M40 35 L48 40 L46 50" />
      <line x1="22" y1="33" x2="22" y2="14" />
      <line x1="10" y1="14" x2="34" y2="14" />
    </Pictogram>
  ),
  'ダンベルフライ': (accent) => (
    <Pictogram accent={accent}>
      <line x1="8" y1="42" x2="52" y2="42" />
      <Head cx="14" cy="34" fill={accent} stroke="none" />
      <line x1="19" y1="35" x2="40" y2="35" />
      <path d="M40 35 L48 40 L46 50" />
      <path d="M23 33 Q14 26 10 22" />
      <path d="M23 33 Q32 26 36 22" />
      <circle cx="10" cy="22" r="3" fill={accent} stroke="none" />
      <circle cx="36" cy="22" r="3" fill={accent} stroke="none" />
    </Pictogram>
  ),
  'プッシュアップ': (accent) => (
    <Pictogram accent={accent}>
      <line x1="6" y1="50" x2="54" y2="50" />
      <Head cx="12" cy="32" fill={accent} stroke="none" />
      <line x1="16" y1="34" x2="46" y2="44" />
      <line x1="24" y1="37" x2="24" y2="50" />
      <line x1="46" y1="44" x2="50" y2="50" />
    </Pictogram>
  ),
  'バーベルショルダープレス': (accent) => (
    <Pictogram accent={accent}>
      <Head cx="30" cy="14" fill={accent} stroke="none" />
      <line x1="30" y1="19" x2="30" y2="40" />
      <line x1="30" y1="40" x2="22" y2="54" />
      <line x1="30" y1="40" x2="38" y2="54" />
      <line x1="30" y1="22" x2="30" y2="8" />
      <line x1="30" y1="8" x2="18" y2="8" />
      <line x1="30" y1="8" x2="42" y2="8" />
      <line x1="18" y1="8" x2="18" y2="4" />
      <line x1="42" y1="8" x2="42" y2="4" />
    </Pictogram>
  ),
  'ラテラルレイズ': (accent) => (
    <Pictogram accent={accent}>
      <Head cx="30" cy="14" fill={accent} stroke="none" />
      <line x1="30" y1="19" x2="30" y2="40" />
      <line x1="30" y1="40" x2="22" y2="54" />
      <line x1="30" y1="40" x2="38" y2="54" />
      <line x1="30" y1="23" x2="12" y2="23" />
      <line x1="30" y1="23" x2="48" y2="23" />
      <circle cx="10" cy="23" r="3" fill={accent} stroke="none" />
      <circle cx="50" cy="23" r="3" fill={accent} stroke="none" />
    </Pictogram>
  ),
  'バーベルカール': (accent) => (
    <Pictogram accent={accent}>
      <Head cx="30" cy="14" fill={accent} stroke="none" />
      <line x1="30" y1="19" x2="30" y2="40" />
      <line x1="30" y1="40" x2="22" y2="54" />
      <line x1="30" y1="40" x2="38" y2="54" />
      <path d="M22 22 L20 32 L28 26" />
      <path d="M38 22 L40 32 L32 26" />
      <line x1="20" y1="32" x2="40" y2="32" />
    </Pictogram>
  ),
  'トライセプスプッシュダウン': (accent) => (
    <Pictogram accent={accent}>
      <line x1="30" y1="2" x2="30" y2="18" strokeDasharray="2 3" />
      <Head cx="30" cy="20" fill={accent} stroke="none" />
      <line x1="30" y1="25" x2="30" y2="44" />
      <line x1="30" y1="44" x2="24" y2="56" />
      <line x1="30" y1="44" x2="36" y2="56" />
      <path d="M22 27 L22 34 L26 40" />
      <path d="M38 27 L38 34 L34 40" />
    </Pictogram>
  ),
  'デッドリフト': (accent) => (
    <Pictogram accent={accent}>
      <line x1="6" y1="54" x2="54" y2="54" />
      <Head cx="14" cy="18" fill={accent} stroke="none" />
      <line x1="16" y1="22" x2="34" y2="40" />
      <line x1="34" y1="40" x2="30" y2="54" />
      <line x1="34" y1="40" x2="40" y2="54" />
      <line x1="20" y1="26" x2="18" y2="50" />
      <line x1="6" y1="50" x2="30" y2="50" />
    </Pictogram>
  ),
  'バーベルロウ': (accent) => (
    <Pictogram accent={accent}>
      <Head cx="14" cy="20" fill={accent} stroke="none" />
      <line x1="16" y1="24" x2="34" y2="40" />
      <line x1="34" y1="40" x2="30" y2="54" />
      <line x1="34" y1="40" x2="42" y2="52" />
      <path d="M20 28 L14 40 L24 36" />
      <line x1="8" y1="40" x2="24" y2="36" />
    </Pictogram>
  ),
  'チンニング': (accent) => (
    <Pictogram accent={accent}>
      <line x1="14" y1="6" x2="46" y2="6" />
      <Head cx="30" cy="18" fill={accent} stroke="none" />
      <path d="M20 8 L24 16" />
      <path d="M40 8 L36 16" />
      <line x1="30" y1="23" x2="30" y2="42" />
      <line x1="30" y1="42" x2="24" y2="56" />
      <line x1="30" y1="42" x2="36" y2="56" />
    </Pictogram>
  ),
  'クランチ': (accent) => (
    <Pictogram accent={accent}>
      <line x1="6" y1="48" x2="54" y2="48" />
      <path d="M18 30 L26 30 L34 38" />
      <line x1="18" y1="30" x2="18" y2="48" />
      <line x1="34" y1="38" x2="34" y2="48" />
      <path d="M18 30 Q30 22 38 26" />
      <Head cx="40" cy="24" fill={accent} stroke="none" />
    </Pictogram>
  ),
  'プランク': (accent) => (
    <Pictogram accent={accent}>
      <line x1="6" y1="50" x2="54" y2="50" />
      <Head cx="12" cy="30" fill={accent} stroke="none" />
      <line x1="16" y1="32" x2="46" y2="38" />
      <line x1="18" y1="33" x2="18" y2="46" />
      <line x1="46" y1="38" x2="50" y2="50" />
    </Pictogram>
  ),
  'バーベルスクワット': (accent) => (
    <Pictogram accent={accent}>
      <Head cx="30" cy="12" fill={accent} stroke="none" />
      <line x1="18" y1="18" x2="42" y2="18" />
      <line x1="30" y1="17" x2="30" y2="32" />
      <path d="M30 32 L20 40 L20 54" />
      <path d="M30 32 L40 40 L40 54" />
    </Pictogram>
  ),
  'レッグプレス': (accent) => (
    <Pictogram accent={accent}>
      <line x1="8" y1="46" x2="24" y2="30" />
      <Head cx="10" cy="42" fill={accent} stroke="none" />
      <path d="M18 34 L30 34 L38 24" />
      <line x1="38" y1="10" x2="38" y2="38" />
    </Pictogram>
  ),
}

export default function ExerciseIcon({ name, muscle, accent, size = 26 }) {
  const draw = pictograms[name]
  if (draw) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        {draw(accent)}
      </div>
    )
  }
  return <MuscleIcon muscle={muscle} size={size * 0.7} />
}
