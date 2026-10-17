import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, ErrorMessage, LoadingSpinner } from '../components/ui'
import apiClient from '../services/apiClient'

const visualizerBars = Array.from({ length: 48 }, (_, index) => ({
  height: 0.2 + ((index * 17 + index * index * 7) % 77) / 100,
  delay: `${(index % 12) * -0.09}s`,
}))

const crowdMembers = Array.from({ length: 32 }, (_, index) => ({
  x: index * 40 + 15,
  headY: 34 + (index % 3) * 3,
  height: 34 + ((index * 11) % 19),
  arm: index % 3,
  delay: `${(index % 7) * -0.22}s`,
}))

// Added Color Palette for unique pedal colors
const PEDAL_COLORS = [
  '#ea580c', '#dc2626', '#0284c7', '#9333ea', '#059669', 
  '#d97706', '#db2777', '#0891b2', '#4f46e5', '#65a30d'
]

export default function GigMode() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [activePedals, setActivePedals] = useState({})
  const [pedalLevels, setPedalLevels] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get(`/pedalboards/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setBoard(data.data)
        setLoadedId(id)
        setActivePedals(Object.fromEntries((data.data.pedals || []).map((pedal) => [pedal.id, false])))
        setPedalLevels(Object.fromEntries((data.data.pedals || []).map((pedal) => [pedal.id, { volume: 70, gain: 45, drive: 30, tone: 50 }])))
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || 'Unable to load this pedalboard.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [id, retry])

  const togglePedal = (pedalId) => {
    setActivePedals((current) => ({ ...current, [pedalId]: !current[pedalId] }))
  }

  const updatePedalLevel = (pedalId, control, value) => {
    setPedalLevels((current) => ({
      ...current,
      [pedalId]: { ...current[pedalId], [control]: Number(value) },
    }))
  }

  if (error) return <div className="gig-mode-page"><div className="gig-mode-container"><ErrorMessage onRetry={() => { setError(''); setIsLoading(true); setRetry((value) => value + 1) }}>{error}</ErrorMessage><Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link></div></div>
  if (isLoading || loadedId !== id) return <LoadingSpinner label="Loading your live rig..." />
  if (!board) return <EmptyState title="Pedalboard not found" message="This saved rig could not be found." action={<Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link>} />

  return <div className="gig-mode-page">
    
    {/* Inline styles for the custom knob UI and dynamic pedal colors */}
    <style>{`
      .custom-knob-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .custom-knob {
        position: relative;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #3f3f46, #111);
        box-shadow: 0 6px 10px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-knob-pointer {
        position: absolute;
        top: 0;
        left: 50%;
        width: 3px;
        height: 12px;
        background: #fff;
        border-radius: 2px;
        transform-origin: 50% 22px;
        transform: translateX(-50%);
        transition: transform 0.1s ease-out;
      }
      .custom-knob-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        writing-mode: bt-lr; 
        -webkit-appearance: slider-vertical;
        z-index: 10;
      }
      .custom-knob-label {
        font-size: 9px;
        font-weight: 700;
        color: #a1a1aa;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      /* Dynamic pedal enclosure styles */
      .dynamic-pedal {
        border: 1px solid rgba(0,0,0,0.4);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease;
      }
      
      .dynamic-pedal::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%);
        pointer-events: none;
      }
    `}</style>

    <div className="gig-stage-backdrop" aria-hidden="true">
      <div className="gig-stage-light gig-stage-light-blue" />
      <div className="gig-stage-light gig-stage-light-purple" />
      <div className="gig-stage-light gig-stage-light-amber" />
      <div className="gig-stage-beam gig-stage-beam-left" />
      <div className="gig-stage-beam gig-stage-beam-right" />
      <svg className="gig-crowd" viewBox="0 0 1300 100" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="crowd-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#090a09" stopOpacity="0" />
            <stop offset=".32" stopColor="#090a09" stopOpacity=".82" />
            <stop offset="1" stopColor="#050605" />
          </linearGradient>
        </defs>
        <path fill="url(#crowd-fade)" d="M0 42Q70 19 140 42T280 38T420 45T560 36T700 43T840 38T980 44T1120 35T1300 42V100H0Z" />
        {crowdMembers.map((person, index) => <g
          className="gig-crowd-person"
          key={index}
          style={{ '--crowd-delay': person.delay }}
          transform={`translate(${person.x} ${person.headY})`}
        >
          <circle cx="0" cy="0" r="5" />
          <path d={`M-10 34Q-11 15 -5 9H5Q11 15 10 34Z${person.arm === 0 ? ' M-7 16L-17 5L-20 -7 M7 16L17 5L20 -7' : person.arm === 1 ? ' M-7 17L-17 27 M7 17L17 27' : ' M-7 16L-16 11L-19 0 M7 16L16 11L19 0'}`} />
        </g>)}
      </svg>
    </div>
    <div className="gig-mode-container">
      <header className="gig-mode-header">
        <div><span className="gig-live-indicator"><i /> LIVE GIG POV</span><h1>{board.name}</h1></div>
        <Link className="button button-secondary" to="/pedalboards">Exit stage</Link>
      </header>

      <main className="gig-stage">
        <div className="gig-stage-heading"><span className="eyebrow">STAGE SIGNAL CHAIN</span><p>Tap a footswitch to toggle each effect.</p></div>
        <div className="gig-visualizer" role="img" aria-label="Animated audio spectrum visualizer">
          <div className="gig-visualizer-label"><span>STAGE OUTPUT</span><span><i /> LIVE MIX</span></div>
          <div className="gig-eq-bars" aria-hidden="true">{visualizerBars.map((bar, index) => <i
            key={index}
            style={{ '--bar-height': bar.height, '--bar-delay': bar.delay }}
          />)}</div>
        </div>
        
        {board.pedals?.length
          ? <div className="gig-pedals">
            {board.pedals.map((pedal, index) => {
              const isOn = Boolean(activePedals[pedal.id])
              const pedalName = pedal.name || pedal.model || 'Pedal'
              const levels = pedalLevels[pedal.id] || { volume: 70, gain: 45, drive: 30, tone: 50 }
              
              // DYNAMIC COLOR LOGIC
              const numericId = Number(pedal.id) || 1
              const pedalColor = PEDAL_COLORS[(numericId - 1) % PEDAL_COLORS.length]

              const knobControls = [
                { key: 'volume', label: 'Volume' },
                { key: 'gain', label: 'Gain' },
                { key: 'drive', label: 'Drive' },
                { key: 'tone', label: 'Tone' },
              ]

              return <div className="gig-chain-step" key={pedal.id}>
                
                {/* Applied dynamic background color and class here */}
                <section 
                  className={`gig-pedal dynamic-pedal ${isOn ? 'gig-pedal-on' : ''}`} 
                  aria-label={`${pedalName} controls`} 
                  style={{ 
                    backgroundColor: pedalColor,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    padding: '20px 15px', 
                    gap: '15px',
                    boxShadow: isOn 
                      ? `0 0 20px -5px ${pedalColor}, inset 0 2px 5px rgba(255,255,255,0.2)` // Glows in its own color when ON
                      : `0 10px 20px -5px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.2)`
                  }}
                >
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
                    <span className="gig-pedal-brand" style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{pedal.brand || 'ToneVault'}</span>
                    
                    {/* LED now glows in the pedal's specific color */}
                    <span 
                      className={`gig-pedal-led ${isOn ? 'is-on' : ''}`} 
                      aria-hidden="true" 
                      style={{
                        backgroundColor: isOn ? '#fff' : 'rgba(0,0,0,0.4)',
                        boxShadow: isOn 
                          ? `0 0 10px 2px ${pedalColor}, inset 0 1px 2px rgba(0,0,0,0.5)` 
                          : 'inset 0 1px 3px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(0,0,0,0.5)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'center', width: '100%', marginTop: '10px', position: 'relative', zIndex: 2 }}>
                    <span className="gig-pedal-name" style={{ display: 'block', fontSize: '14px', fontWeight: '900', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{pedalName}</span>
                    <span className="gig-pedal-type" style={{ display: 'block', fontSize: '10px', opacity: 0.8, marginTop: '4px', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>{pedal.type || pedal.category?.name || 'Effect'}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', margin: '20px 0', position: 'relative', zIndex: 2 }}>
                    {knobControls.map((control) => {
                      const rotation = (levels[control.key] / 100) * 270 - 135;
                      return (
                        <div className="custom-knob-wrapper" key={control.key}>
                          <div className="custom-knob">
                            <div className="custom-knob-pointer" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              className="custom-knob-input"
                              value={levels[control.key]}
                              aria-label={`${pedalName} ${control.label}`}
                              onChange={(event) => updatePedalLevel(pedal.id, control.key, event.target.value)}
                            />
                          </div>
                          <span className="custom-knob-label" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 1px rgba(0,0,0,0.5)' }}>{control.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    className="gig-footswitch-button"
                    aria-label={`${pedalName}: ${isOn ? 'on' : 'off'}. Toggle effect`}
                    aria-pressed={isOn}
                    onClick={() => togglePedal(pedal.id)}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginTop: 'auto', 
                      marginBottom: '10px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative', 
                      zIndex: 2
                    }}
                  >
                    <span className="gig-footswitch" aria-hidden="true" style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 40% 30%, #fff, #d4d4d8 20%, #71717a 70%, #3f3f46)',
                      boxShadow: isOn 
                        ? '0 6px 12px rgba(0,0,0,0.8), inset 0 4px 8px rgba(255,255,255,0.9)' 
                        : '0 12px 20px rgba(0,0,0,0.7), inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.8)',
                      border: '1px solid rgba(0,0,0,0.2)',
                      transform: isOn ? 'translateY(3px)' : 'translateY(0)',
                      transition: 'all 0.1s ease'
                    }}>
                      <i style={{ display: 'block', width: '80%', height: '80%', margin: '10%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)' }} />
                    </span>
                    <span className="gig-pedal-status" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '1.5px', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                  </button>

                </section>
                {index < board.pedals.length - 1 && <span className={`gig-patch-cable ${isOn ? 'is-active' : ''}`} aria-hidden="true" />}
              </div>
            })}
          </div>
          : <EmptyState title="No pedals in this rig" message="Edit this pedalboard and add pedals to play it in Gig POV." />}
      </main>

      <footer className="gig-mode-footer"><span><i /> READY FOR LIVE PERFORMANCE</span><span>{board.pedals?.length || 0} PEDALS · EFFECTS ARE LOCAL TO THIS SESSION</span></footer>
    </div>
  </div>
}