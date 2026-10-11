export default function Compass() {
  return (
    <svg className="compass" viewBox="-50 -50 100 100" aria-hidden>
      <circle r="44" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path
          key={a}
          d={a % 90 === 0 ? 'M0 -40 L6 0 L0 6 L-6 0 Z' : 'M0 -28 L4 0 L0 4 L-4 0 Z'}
          transform={`rotate(${a})`}
          fill={a === 0 ? '#a3271f' : a % 90 === 0 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
      <text y="-46" textAnchor="middle" fontSize="9" fill="currentColor">T</text>
      <text y="52" textAnchor="middle" fontSize="8" fill="currentColor">O</text>
      <text x="49" y="3" textAnchor="middle" fontSize="8" fill="currentColor">L</text>
      <text x="-49" y="3" textAnchor="middle" fontSize="8" fill="currentColor">P</text>
    </svg>
  )
}
