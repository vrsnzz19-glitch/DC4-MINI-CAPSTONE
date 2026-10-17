import { useNavigate } from 'react-router-dom'

const PEDAL_COLORS = [
  '#ea580c', // orange
  '#dc2626', // red
  '#0284c7', // blue
  '#9333ea', // purple
  '#059669', // green
  '#d97706', // amber
  '#db2777', // pink
  '#0891b2', // cyan
  '#4f46e5', // indigo
  '#65a30d', // lime
]

function getPedalColor(pedal) {
  if (!pedal) return PEDAL_COLORS[0]
  const id = Number(pedal.id) || 1
  return PEDAL_COLORS[(id - 1) % PEDAL_COLORS.length]
}

export function PedalCard({ pedal }) {
  const navigate = useNavigate()
  if (!pedal) return null

  const accent = getPedalColor(pedal)
  const categoryLabel = typeof pedal.category === 'object' ? pedal.category?.name : pedal.category || 'Effects'

  return (
    <div
      onClick={() => navigate(`/pedals/${pedal.id || 1}`)}
      style={{
        width: '100%',
        maxWidth: '110px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.2s ease, filter 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.filter = 'brightness(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.filter = 'brightness(1)'
      }}
    >
      {/* 3D Pedal Enclosure */}
      <div
        style={{
          width: '100%',
          aspectRatio: '2 / 3.2', // Extra tall, realistic proportions
          backgroundColor: accent,
          borderRadius: '6px',
          padding: '8px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          // Complex shadows for 3D metal depth
          boxShadow: `
            0 12px 20px -8px rgba(0,0,0,0.9),
            0 4px 6px -2px rgba(0,0,0,0.6),
            inset 0 1px 2px rgba(255,255,255,0.4),
            inset 0 -4px 10px rgba(0,0,0,0.5),
            inset 2px 0 4px rgba(255,255,255,0.1),
            inset -2px 0 4px rgba(0,0,0,0.4)
          `,
          // Subtle metallic sheen
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.1) 100%)`,
        }}
      >
        {/* Screws */}
        <div style={{ position: 'absolute', top: '5px', left: '5px', width: '4px', height: '4px', borderRadius: '50%', background: '#52525b', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', top: '5px', right: '5px', width: '4px', height: '4px', borderRadius: '50%', background: '#52525b', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: '5px', left: '5px', width: '4px', height: '4px', borderRadius: '50%', background: '#52525b', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '4px', height: '4px', borderRadius: '50%', background: '#52525b', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)' }} />

        {/* LED & Top Jacks Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 2px', marginTop: '2px' }}>
          <span style={{ fontSize: '5px', fontFamily: 'monospace', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>IN</span>
          
          {/* Glowing LED */}
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 6px #ef4444, inset 0 1px 2px rgba(255,255,255,0.8)',
              border: '1px solid rgba(0,0,0,0.5)',
            }}
          />
          
          <span style={{ fontSize: '5px', fontFamily: 'monospace', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>OUT</span>
        </div>

        {/* 3D Knobs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%', justifyContent: 'center', padding: '0 4px', marginTop: '4px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #3f3f46, #09090b)',
                border: '1px solid #18181b',
                boxShadow: '0 2px 4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2)',
                margin: '0 auto',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Knob Pointer */}
              <div style={{ width: '2px', height: '5px', background: '#e4e4e7', marginTop: '2px', borderRadius: '1px' }} />
            </div>
          ))}
        </div>

        {/* Brand & Model Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', margin: '4px 0' }}>
          <span style={{ fontSize: '6px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
            {pedal.brand || 'PEDAL'}
          </span>
          <h3 style={{ fontSize: '8px', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.2px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
            {pedal.model || pedal.type || 'FX'}
          </h3>
        </div>

        {/* 3D Metallic Footswitch */}
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg at 50% 50%, #a1a1aa 0deg, #f4f4f5 90deg, #71717a 180deg, #27272a 270deg, #a1a1aa 360deg)',
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.7),
              inset 0 2px 4px rgba(255,255,255,0.6),
              inset 0 -2px 4px rgba(0,0,0,0.6)
            `,
            border: '1px solid #18181b',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Footswitch inner detail */}
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.3)', background: 'radial-gradient(circle at 40% 40%, #e4e4e7, #52525b)' }} />
        </div>
      </div>

      {/* Caption */}
      <span
        style={{
          marginTop: '10px',
          fontSize: '8px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
          color: '#a1a1aa',
          textAlign: 'center',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {categoryLabel}
      </span>
    </div>
  )
}