import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, ErrorMessage, LoadingSpinner } from '../components/ui'
import apiClient from '../services/apiClient'

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

  const [eqBands, setEqBands] = useState(() => Array.from({ length: 24 }, () => 0))
  const [meterLevels, setMeterLevels] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get(`/pedalboards/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setBoard(data.data)
        setLoadedId(id)
        const pedals = data.data.pedals || []
        setActivePedals(Object.fromEntries(pedals.map((p) => [p.id, false])))
        setPedalLevels(Object.fromEntries(pedals.map((p) => [p.id, { volume: 75, gain: 45, drive: 30, tone: 50 }])))
        setMeterLevels(Object.fromEntries(pedals.map((p) => [p.id, 0])))
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

  // --- LIVE ANIMATION ENGINE ---
  useEffect(() => {
    if (isLoading || !board) return;
    const interval = setInterval(() => {
      setMeterLevels(prev => {
        const next = { ...prev }
        board.pedals?.forEach(pedal => {
          const isOn = activePedals[pedal.id]
          const vol = pedalLevels[pedal.id]?.volume || 75
          if (isOn) {
            const targetMax = (vol / 100) * 100
            const jump = (Math.random() - 0.5) * 45
            let newLevel = (prev[pedal.id] || 0) + jump
            if (newLevel > targetMax) newLevel = targetMax
            if (newLevel < 15) newLevel = 15 + Math.random() * 25
            next[pedal.id] = newLevel
          } else {
            next[pedal.id] = Math.max(0, (prev[pedal.id] || 0) - 25)
          }
        })
        return next
      })

      setEqBands(prev => {
        const activeCount = board.pedals?.filter(p => activePedals[p.id]).length || 0
        const energy = Math.min(activeCount, 4) / 4
        return prev.map(val => {
          if (activeCount > 0) {
            const jump = (Math.random() - 0.5) * 35
            let newH = val + jump
            const maxH = 30 + (energy * 65)
            if (newH > maxH) newH = maxH
            if (newH < 10) newH = 10 + Math.random() * 20
            return newH
          }
          return Math.max(0, val - 15)
        })
      })
    }, 220) 
    return () => clearInterval(interval)
  }, [board, activePedals, pedalLevels, isLoading])

  const togglePedal = (pedalId) => setActivePedals(c => ({ ...c, [pedalId]: !c[pedalId] }))
  const updatePedalLevel = (pedalId, control, value) => setPedalLevels(c => ({ ...c, [pedalId]: { ...c[pedalId], [control]: Number(value) } }))

  if (error) return <div className="gig-mode-page"><div className="gig-mode-container"><ErrorMessage onRetry={() => { setError(''); setIsLoading(true); setRetry(v => v + 1) }}>{error}</ErrorMessage><Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link></div></div>
  if (isLoading || loadedId !== id) return <LoadingSpinner label="Booting up live rig..." />
  if (!board) return <EmptyState title="Pedalboard not found" message="This saved rig could not be found." action={<Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link>} />

  const anyPedalOn = Object.values(activePedals).some(v => v)

  return <div className="gig-mode-page" style={{ 
    backgroundColor: '#09090b', 
    minHeight: '100vh', 
    color: '#fff', 
    fontFamily: 'system-ui, -apple-system, sans-serif', 
    display: 'flex', 
    flexDirection: 'column',
    backgroundImage: 'radial-gradient(circle at 50% 0%, #1f1f22 0%, #09090b 70%)',
    overflowX: 'hidden'
  }}>
    
    <style>{`
      /* --- SHRUNK DIMENSIONS PARA KASYA SA SCREEN --- */
      .glass-panel {
        background: rgba(24, 24, 27, 0.65);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      }

      .top-layout { display: flex; justify-content: center; gap: 16px; max-width: 1000px; margin: 15px auto 0; padding: 0 20px; width: 100%; z-index: 10; }
      
      /* MASTER EQ - Pinaikli ang height at pinaliit ang width */
      .master-eq-panel { width: 300px; flex-shrink: 0; padding: 15px; display: flex; flex-direction: column; height: 260px; }
      .eq-sliders { display: flex; flex: 1; gap: 3px; align-items: flex-end; margin-top: 15px; }
      .eq-band { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; position: relative; }
      .eq-bar { width: 100%; background: linear-gradient(to top, #10b981, #84cc16, #eab308); border-radius: 3px; transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: absolute; bottom: 0; box-shadow: 0 0 10px rgba(234, 179, 8, 0.2); }
      .eq-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ns-resize; writing-mode: bt-lr; -webkit-appearance: slider-vertical; z-index: 10; }

      /* CHANNEL MIXER - Pinaikli din */
      .mixer-panel { flex: 1; max-width: 650px; padding: 15px 0; display: flex; flex-direction: column; height: 260px; }
      .mixer-channels-container { display: flex; overflow-x: auto; flex: 1; padding: 0 10px; }
      .channel-strip { width: 80px; flex-shrink: 0; background: rgba(39, 39, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; display: flex; flex-direction: column; padding: 10px 5px; margin-right: 8px; }
      .fader-section { flex: 1; display: flex; gap: 8px; justify-content: center; padding: 10px 0; }
      .fader-track { width: 6px; background: #09090b; border-radius: 3px; position: relative; box-shadow: inset 0 2px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.05); }
      .fader-cap { width: 18px; height: 12px; background: linear-gradient(to bottom, #e4e4e7, #71717a); border-radius: 3px; position: absolute; left: -6px; transform: translateY(-50%); box-shadow: 0 4px 8px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.5); pointer-events: none; }
      .fader-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ns-resize; writing-mode: bt-lr; -webkit-appearance: slider-vertical; }
      
      .meter-pair { width: 8px; display: flex; gap: 2px; background: #09090b; padding: 2px; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8); }
      .meter-bar { flex: 1; border-radius: 2px; position: relative; overflow: hidden; background: #18181b; }
      .meter-fill { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #10b981 65%, #eab308 85%, #ef4444 98%); transition: height 0.22s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 5px rgba(16, 185, 129, 0.4); }
      
      .ms-btn { flex: 1; font-size: 9px; font-weight: 800; padding: 4px 0; border: none; border-radius: 4px; cursor: pointer; background: #27272a; color: #a1a1aa; transition: all 0.15s ease; }
      .ms-btn.mute.active { background: #ef4444; color: #fff; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }

      /* PEDALBOARD - Pinaikli at pinaliit ang mga pedal */
      .board-wrapper { flex: 1; display: flex; justify-content: center; align-items: flex-start; margin-top: 20px; padding: 0 20px 40px; perspective: 1400px; z-index: 5; }
      
      .pedalboard-wood { 
        width: 100%; max-width: 800px; min-height: 300px; /* Pinaliit mula 420px */
        background: linear-gradient(145deg, #2a1b12, #180e08);
        border-radius: 12px; padding: 30px 25px; /* Pinaliit ang padding */
        box-shadow: 
          inset 0 15px 30px rgba(0,0,0,0.9), 
          inset 0 -8px 15px rgba(0,0,0,0.8),
          0 30px 60px rgba(0,0,0,0.9),
          0 0 0 10px #1c130d;
        border: 2px solid #4a2e1b;
        position: relative; 
        transform: rotateX(15deg); 
        transform-style: preserve-3d; 
      }

      .pedalboard-wood::after {
        content: ''; position: absolute; inset: 0; border-radius: 10px;
        background-image: repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px);
        pointer-events: none; opacity: 0.5;
      }

      /* Grid ng Pedals */
      .pedal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 20px; align-content: start; transform-style: preserve-3d; justify-content: center; }
      .pedal-wrapper { position: relative; transform: translateZ(20px); transform-style: preserve-3d; transition: transform 0.3s ease; }
      .pedal-wrapper:hover { transform: translateZ(30px) translateY(-3px); }

      /* Pinaliit na Pedal */
      .dynamic-pedal { 
        position: relative; width: 100%; aspect-ratio: 2 / 3; border-radius: 6px; 
        display: flex; flex-direction: column; align-items: center; padding: 10px 8px;
        box-shadow: 
          0 15px 25px rgba(0,0,0,0.9),
          inset 0 2px 4px rgba(255,255,255,0.4), 
          inset 0 -6px 10px rgba(0,0,0,0.7), 
          inset 3px 0 6px rgba(255,255,255,0.15), 
          inset -3px 0 6px rgba(0,0,0,0.5);
        border: 1px solid rgba(0,0,0,0.8);
        transition: all 0.3s ease;
      }
      
      .dynamic-pedal.is-on { 
        box-shadow: 
          0 20px 30px rgba(0,0,0,0.95),
          0 0 30px 3px var(--pedal-glow),
          inset 0 2px 5px rgba(255,255,255,0.6), 
          inset 0 -6px 12px rgba(0,0,0,0.8);
        transform: translateY(-2px);
      }

      .dynamic-pedal::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%); pointer-events: none; border-radius: 6px; }
      
      .pedal-rim { position: absolute; bottom: -4px; left: 0; right: 0; height: 6px; background: linear-gradient(to bottom, #a1a1aa, #27272a); border-radius: 0 0 6px 6px; z-index: -1; box-shadow: 0 3px 5px rgba(0,0,0,0.9); }
      
      /* Knobs */
      .custom-knob-wrapper { display: flex; flex-direction: column; align-items: center; gap: 3px; }
      .custom-knob { position: relative; width: 28px; height: 28px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #52525b, #111); box-shadow: 0 3px 6px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; }
      .custom-knob-pointer { position: absolute; top: 0; left: 50%; width: 3px; height: 8px; background: #fff; border-radius: 2px; transform-origin: 50% 14px; transform: translateX(-50%); transition: transform 0.1s ease-out; box-shadow: 0 0 4px rgba(0,0,0,0.8); }
      .custom-knob-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; writing-mode: bt-lr; -webkit-appearance: slider-vertical; z-index: 10; }
      .custom-knob-label { font-size: 7px; font-weight: 800; color: rgba(255,255,255,0.9); text-transform: uppercase; text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
    `}</style>

    {/* Header - Pinaliit ang padding at font size */}
    <header style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#ef4444', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444', animation: 'pulse 2s infinite' }} /> LIVE GIG POV
        </span>
        <h1 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>{board.name}</h1>
      </div>
      <Link to="/pedalboards" style={{ background: 'rgba(39, 39, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', transition: 'all 0.2s' }}>
        Exit stage
      </Link>
    </header>

    {/* Top Panels - Pinaikli ang layout */}
    <div className="top-layout">
      {/* EQ Panel */}
      <div className="glass-panel master-eq-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>MASTER EQ</span>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: anyPedalOn ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', background: anyPedalOn ? '#10b981' : '#ef4444', borderRadius: '50%' }} /> 
            {anyPedalOn ? 'LIVE' : 'IDLE'}
          </span>
        </div>
        <div className="eq-sliders">
          {eqBands.map((height, index) => (
            <div className="eq-band" key={index}>
              <div className="eq-bar" style={{ height: `${height}%` }} />
              <input type="range" min="0" max="100" value={height} onChange={(e) => {
                const newBands = [...eqBands]; newBands[index] = Number(e.target.value); setEqBands(newBands);
              }} className="eq-input" />
            </div>
          ))}
        </div>
      </div>

      {/* Mixer Panel */}
      <div className="glass-panel mixer-panel">
        <div style={{ padding: '0 15px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>CHANNEL MIXER</div>
        <div className="mixer-channels-container">
          {board.pedals?.map((pedal) => {
            const isOn = Boolean(activePedals[pedal.id])
            const levels = pedalLevels[pedal.id] || { volume: 75 }
            const numericId = Number(pedal.id) || 1
            const pedalColor = PEDAL_COLORS[(numericId - 1) % PEDAL_COLORS.length]
            const currentLevel = meterLevels[pedal.id] || 0

            return (
              <div className="channel-strip" key={`mixer-${pedal.id}`}>
                <div style={{ textAlign: 'center', fontSize: '8px', fontWeight: '800', color: isOn ? pedalColor : '#71717a', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pedal.name}
                </div>
                <div className="fader-section">
                  <div style={{ position: 'relative', height: '100%', width: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div className="fader-track">
                      <div className="fader-cap" style={{ top: `${100 - levels.volume}%` }} />
                      <input type="range" min="0" max="100" value={levels.volume} onChange={(e) => updatePedalLevel(pedal.id, 'volume', e.target.value)} className="fader-input" style={{ height: '100%', top: 0 }} />
                    </div>
                  </div>
                  <div className="meter-pair">
                    <div className="meter-bar"><div className="meter-fill" style={{ height: `${currentLevel}%` }} /></div>
                    <div className="meter-bar"><div className="meter-fill" style={{ height: `${currentLevel * 0.9}%` }} /></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
                  <button className={`ms-btn mute ${!isOn ? 'active' : ''}`} onClick={() => togglePedal(pedal.id)}>MUTE</button>
                  <button className="ms-btn solo">SOLO</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>

    {/* Pedalboard - Pinaliit din */}
    <div className="board-wrapper">
      <div className="pedalboard-wood">
        <div className="pedal-grid">
          {board.pedals?.map((pedal) => {
            const isOn = Boolean(activePedals[pedal.id])
            const pedalName = pedal.name || pedal.model || 'Pedal'
            const levels = pedalLevels[pedal.id] || { volume: 75, gain: 45, drive: 30, tone: 50 }
            const numericId = Number(pedal.id) || 1
            const pedalColor = PEDAL_COLORS[(numericId - 1) % PEDAL_COLORS.length]

            return (
              <div className="pedal-wrapper" key={`pedal-${pedal.id}`}>
                <section 
                  className={`dynamic-pedal ${isOn ? 'is-on' : ''}`} 
                  style={{ backgroundColor: pedalColor, '--pedal-glow': pedalColor }}
                >
                  <div className="pedal-rim" />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)', fontWeight: '900' }}>IN</span>
                    <span style={{
                      backgroundColor: isOn ? '#fff' : 'rgba(0,0,0,0.6)',
                      boxShadow: isOn ? `0 0 10px 2px #fff, 0 0 4px ${pedalColor}` : 'inset 0 2px 3px rgba(0,0,0,0.9)',
                      border: '1px solid rgba(0,0,0,0.8)', width: '8px', height: '8px', borderRadius: '50%'
                    }} />
                    <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)', fontWeight: '900' }}>OUT</span>
                  </div>

                  <div style={{ textAlign: 'center', width: '100%', marginTop: '6px', position: 'relative', zIndex: 2 }}>
                    <span style={{ display: 'block', fontSize: '8px', fontWeight: '800', color: 'rgba(255,255,255,0.8)' }}>{pedal.brand || 'ToneVault'}</span>
                    <span style={{ display: 'block', fontSize: '9px', fontWeight: '900', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)', lineHeight: 1.1 }}>{pedalName}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', margin: '12px 0', position: 'relative', zIndex: 2 }}>
                    {[
                      { key: 'volume', label: 'Vol' },
                      { key: 'gain', label: 'Gain' },
                      { key: 'drive', label: 'Drive' },
                      { key: 'tone', label: 'Tone' },
                    ].map((control) => {
                      const rotation = (levels[control.key] / 100) * 270 - 135;
                      return (
                        <div className="custom-knob-wrapper" key={control.key}>
                          <div className="custom-knob">
                            <div className="custom-knob-pointer" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />
                            <input type="range" min="0" max="100" className="custom-knob-input" value={levels[control.key]} onChange={(event) => updatePedalLevel(pedal.id, control.key, event.target.value)} />
                          </div>
                          <span className="custom-knob-label">{control.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  <button type="button" onClick={() => togglePedal(pedal.id)} style={{ 
                    marginTop: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', zIndex: 2
                  }}>
                    <span aria-hidden="true" style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'radial-gradient(circle at 40% 30%, #fff, #e4e4e7 20%, #71717a 70%, #27272a)',
                      boxShadow: isOn ? '0 4px 8px rgba(0,0,0,0.9), inset 0 3px 6px rgba(255,255,255,1)' : '0 10px 15px rgba(0,0,0,0.9), inset 0 -3px 6px rgba(0,0,0,0.7), inset 0 3px 6px rgba(255,255,255,0.8)',
                      border: '1px solid rgba(0,0,0,0.4)', transform: isOn ? 'translateY(2px)' : 'translateY(0)', transition: 'all 0.1s ease'
                    }}>
                      <i style={{ display: 'block', width: '80%', height: '80%', margin: '10%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)' }} />
                    </span>
                    <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '1px', color: isOn ? '#fff' : '#a1a1aa', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </section>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
}