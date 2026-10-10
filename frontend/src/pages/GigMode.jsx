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
        setPedalLevels(Object.fromEntries((data.data.pedals || []).map((pedal) => [pedal.id, { volume: 70, gain: 45 }])))
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

  if (error) return <div className="gig-mode-page"><ErrorMessage onRetry={() => { setError(''); setIsLoading(true); setRetry((value) => value + 1) }}>{error}</ErrorMessage><Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link></div>
  if (isLoading || loadedId !== id) return <LoadingSpinner label="Loading your live rig..." />
  if (!board) return <EmptyState title="Pedalboard not found" message="This saved rig could not be found." action={<Link className="button button-secondary" to="/pedalboards">Back to pedalboards</Link>} />

  return <div className="gig-mode-page">
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
            const levels = pedalLevels[pedal.id] || { volume: 70, gain: 45 }
            return <div className="gig-chain-step" key={pedal.id}>
              <section className={`gig-pedal ${isOn ? 'gig-pedal-on' : ''}`} aria-label={`${pedalName} controls`}>
                <span className="gig-pedal-brand">{pedal.brand || 'ToneVault'}</span>
                <span className={`gig-pedal-led ${isOn ? 'is-on' : ''}`} aria-hidden="true" />
                <span className="gig-pedal-name">{pedalName}</span>
                <span className="gig-pedal-type">{pedal.type || pedal.category?.name || 'Effect'}</span>
                <div className="gig-pedal-parameters">
                  {[
                    { key: 'volume', label: 'Volume', value: levels.volume },
                    { key: 'gain', label: 'Gain', value: levels.gain },
                  ].map((control) => <label className="gig-pedal-control" key={control.key}>
                    <span><span>{control.label}</span><output htmlFor={`${control.key}-${pedal.id}`}>{control.value}%</output></span>
                    <input
                      id={`${control.key}-${pedal.id}`}
                      type="range"
                      min="0"
                      max="100"
                      value={control.value}
                      aria-label={`${pedalName} ${control.label}`}
                      style={{ '--control-progress': `${control.value}%` }}
                      onChange={(event) => updatePedalLevel(pedal.id, control.key, event.target.value)}
                    />
                  </label>)}
                </div>
                <button
                  type="button"
                  className="gig-footswitch-button"
                  aria-label={`${pedalName}: ${isOn ? 'on' : 'off'}. Toggle effect`}
                  aria-pressed={isOn}
                  onClick={() => togglePedal(pedal.id)}
                >
                  <span className="gig-footswitch" aria-hidden="true"><i /></span>
                  <span className="gig-pedal-status">{isOn ? 'ENGAGED' : 'BYPASS'}</span>
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
}
