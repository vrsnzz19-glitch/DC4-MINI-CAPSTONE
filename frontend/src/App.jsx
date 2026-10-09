import { useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NoticeProvider } from './context/NoticeContext'
import AuthProvider from './context/AuthContext'
import useAuth from './hooks/useAuth'
import useNotice from './hooks/useNotice'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute'
import {
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminPedalsPage,
  AdminRigPresetsPage,
  CreatePedalboardPage,
  LoginPage,
  PedalboardDetailsPage,
  PedalDetailsPage,
  RegisterPage,
} from './pages/StudioPages'
import './App.css'

const pedals = [
  { id: 1, name: 'DS-1 Distortion', brand: 'BOSS', category: 'Distortion', type: 'Clipping', status: 'Available', color: 'orange', initials: 'DS' },
  { id: 2, name: 'Tube Screamer', brand: 'Ibanez', category: 'Overdrive', type: 'Overdrive', status: 'Available', color: 'green', initials: 'TS' },
  { id: 3, name: 'Phase 90', brand: 'MXR', category: 'Modulation', type: 'Phaser', status: 'Available', color: 'red', initials: '90' },
  { id: 4, name: 'DD-7 Digital Delay', brand: 'BOSS', category: 'Delay', type: 'Digital Delay', status: 'Available', color: 'blue', initials: 'DD' },
  { id: 5, name: 'Holy Grail', brand: 'Electro-Harmonix', category: 'Reverb', type: 'Reverb', status: 'Available', color: 'silver', initials: 'HG' },
  { id: 6, name: 'CH-1 Super Chorus', brand: 'BOSS', category: 'Modulation', type: 'Chorus', status: 'Available', color: 'blue', initials: 'CH' },
  { id: 7, name: 'Blues Driver BD-2', brand: 'BOSS', category: 'Overdrive', type: 'Blues Driver', status: 'Available', color: 'blue', initials: 'BD' },
  { id: 8, name: 'Big Muff Pi', brand: 'Electro-Harmonix', category: 'Fuzz', type: 'Fuzz', status: 'Available', color: 'black', initials: 'BM' },
  { id: 9, name: 'Carbon Copy', brand: 'MXR', category: 'Delay', type: 'Analog Delay', status: 'Available', color: 'green', initials: 'CC' },
  { id: 10, name: 'Cry Baby Wah', brand: 'Dunlop', category: 'Filter', type: 'Wah', status: 'Available', color: 'black', initials: 'CB' },
  { id: 11, name: 'RV-6 Reverb', brand: 'BOSS', category: 'Reverb', type: 'Reverb', status: 'Available', color: 'blue', initials: 'RV' },
  { id: 12, name: 'Dyna Comp', brand: 'MXR', category: 'Dynamics', type: 'Compressor', status: 'Available', color: 'red', initials: 'DC' },
  { id: 13, name: 'Micro POG', brand: 'Electro-Harmonix', category: 'Pitch', type: 'Octave', status: 'Available', color: 'silver', initials: 'POG' },
  { id: 14, name: 'Small Clone', brand: 'Electro-Harmonix', category: 'Modulation', type: 'Chorus', status: 'Available', color: 'blue', initials: 'SC' },
  { id: 15, name: 'Phase 95', brand: 'MXR', category: 'Modulation', type: 'Phaser', status: 'Available', color: 'red', initials: '95' },
  { id: 16, name: 'Oceans 11', brand: 'Electro-Harmonix', category: 'Reverb', type: 'Reverb', status: 'Available', color: 'blue', initials: 'O11' },
  { id: 17, name: 'SD-1 Super OverDrive', brand: 'BOSS', category: 'Overdrive', type: 'Overdrive', status: 'Available', color: 'yellow', initials: 'SD' },
  { id: 18, name: 'RAT 2', brand: 'Pro Co', category: 'Distortion', type: 'Distortion', status: 'Available', color: 'black', initials: 'RAT' },
  { id: 19, name: 'Flashback 2', brand: 'TC Electronic', category: 'Delay', type: 'Digital Delay', status: 'Available', color: 'silver', initials: 'FB' },
  { id: 20, name: 'PolyTune 3', brand: 'TC Electronic', category: 'Tuner', type: 'Tuner', status: 'Available', color: 'white', initials: 'PT' },
]

const initialBoards = [
  { id: 1, name: 'My Rock Setup', owner: 'Alex Morgan', updated: 'Oct 06, 2026', count: 6, style: 'rock' },
  { id: 2, name: 'Clean Tone Board', owner: 'Alex Morgan', updated: 'Oct 03, 2026', count: 4, style: 'clean' },
  { id: 3, name: 'Ambient Setup', owner: 'Alex Morgan', updated: 'Sep 28, 2026', count: 7, style: 'ambient' },
]

const initialPresets = [
  { id: 1, name: 'Clean Worship Tone', board: 'Clean Tone Board', guitar: 'Fender Stratocaster', tuning: 'E Standard', amp: 'Gain 3 · Bass 5 · Mid 6 · Treble 5', status: 'Approved', color: 'green' },
  { id: 2, name: 'Rock Lead', board: 'My Rock Setup', guitar: 'Gibson Les Paul', tuning: 'E Standard', amp: 'Gain 7 · Bass 6 · Mid 7 · Treble 6', status: 'Submitted', color: 'orange' },
  { id: 3, name: 'Ambient Delay', board: 'Ambient Setup', guitar: 'Fender Jazzmaster', tuning: 'D Standard', amp: 'Gain 2 · Bass 4 · Mid 5 · Treble 6', status: 'Draft', color: 'muted' },
  { id: 4, name: 'Blues Drive', board: 'My Rock Setup', guitar: 'Fender Telecaster', tuning: 'E Standard', amp: 'Gain 4 · Bass 5 · Mid 7 · Treble 5', status: 'Archived', color: 'purple' },
]

const chainStart = [
  { id: 31, name: 'Chromatic Tuner', brand: 'BOSS', type: 'Tuner', color: 'white', initials: 'TU' },
  { id: 32, name: 'Dyna Comp', brand: 'MXR', type: 'Compressor', color: 'red', initials: 'DC' },
  { id: 33, name: 'Tube Screamer', brand: 'Ibanez', type: 'Overdrive', color: 'green', initials: 'TS' },
  { id: 34, name: 'DS-1 Distortion', brand: 'BOSS', type: 'Distortion', color: 'orange', initials: 'DS' },
  { id: 35, name: 'Digital Delay', brand: 'BOSS', type: 'Delay', color: 'blue', initials: 'DD' },
  { id: 36, name: 'Holy Grail', brand: 'Electro-Harmonix', type: 'Reverb', color: 'silver', initials: 'HG' },
]

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    pedal: <><rect x="6" y="2.5" width="12" height="19" rx="3" /><circle cx="12" cy="8" r="2" /><circle cx="12" cy="17" r="1" /></>,
    board: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h3v6H7zM14 9h3v6h-3z" /></>,
    preset: <><path d="M5 3h14v18l-7-4-7 4z" /><path d="M9 8h6M9 11h6" /></>,
    admin: <><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="m9 12 2 2 4-4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    tune: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    guitar: <><path d="M14 4 20 3l1 1-1 6-3 2-3-3z" /><path d="m13 10-7 7a3 3 0 1 0 4 4l7-7" /><path d="m15 8 2 2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    up: <><path d="m6 14 6-6 6 6" /></>,
    down: <><path d="m6 10 6 6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg {...common}>{paths[name] || paths.grid}</svg>
}

function Button({ children, variant = 'secondary', icon, className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{icon && <Icon name={icon} size={16} />}{children}</button>
}

function StatusBadge({ children, tone }) {
  const className = tone || String(children).toLowerCase()
  return <span className={`status-badge status-${className}`}>{children}</span>
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>
}

function PedalCard({ pedal, onView }) {
  return <Card className="pedal-card">
    <div className={`pedal-visual pedal-${pedal.color}`}><span className="pedal-brand">{pedal.brand}</span><span className="pedal-face">{pedal.initials}</span><span className="pedal-led" /><span className="pedal-footswitch" /></div>
    <div className="pedal-card-body">
      <div className="pedal-title-row"><div><h3>{pedal.name}</h3><p>{pedal.brand}</p></div><StatusBadge tone="green">{pedal.status}</StatusBadge></div>
      <div className="tag-row"><span className="tag">{pedal.category}</span><span className="tag tag-dim">{pedal.type}</span></div>
      <Button className="full-button" onClick={() => onView(pedal)}>View pedal <Icon name="arrow" size={15} /></Button>
    </div>
  </Card>
}

function PedalGrid({ items, onView }) {
  if (!items.length) return <EmptyState title="No pedals found" message="Try a different search or clear your filters." />
  return <div className="pedal-grid">{items.map((pedal) => <PedalCard key={pedal.id} pedal={pedal} onView={onView} />)}</div>
}

function SearchBar({ value, onChange }) {
  return <label className="search-bar"><Icon name="search" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search pedals, brands..." /><kbd>⌘ K</kbd></label>
}

function FilterBar({ category, setCategory, type, setType }) {
  return <div className="filter-bar"><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{[...new Set(pedals.map((pedal) => pedal.category))].sort().map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option>{[...new Set(pedals.map((pedal) => pedal.type))].sort().map((item) => <option key={item}>{item}</option>)}</select></label><Button icon="tune" onClick={() => { setCategory(''); setType('') }}>Clear filters</Button></div>
}

function Pagination({ page, setPage, total }) {
  const pageCount = Math.max(1, Math.ceil(total / 6))
  return <div className="pagination"><span>Showing <b>{total === 0 ? 0 : (page - 1) * 6 + 1}–{Math.min(page * 6, total)}</b> of <b>{total}</b> pedals</span><div><Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={`page-number ${page === number ? 'selected' : ''}`} onClick={() => setPage(number)}>{number}</button>)}<Button disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next <Icon name="arrow" size={14} /></Button></div></div>
}

function PedalboardCard({ board, onOpen, onEdit }) {
  return <Card className="board-card"><div className={`board-art art-${board.style}`}><span className="art-label">SIGNAL CHAIN</span><div className="art-pedals"><i /><i /><i /><i /><i /></div><div className="art-cable" /></div><div className="board-card-body"><div className="board-card-title"><div><h3>{board.name}</h3><span className="muted-small">{board.count} pedals · {board.owner}</span></div><button className="icon-button" aria-label="More options"><Icon name="more" /></button></div><div className="board-meta"><span><Icon name="clock" size={14} /> Updated {board.updated}</span><div><Button onClick={() => onEdit(board)}>Edit</Button><Button variant="primary" onClick={() => onOpen(board)}>View board</Button></div></div></div></Card>
}

function PedalChainItem({ pedal, index, count, onMove, onRemove, onSettings }) {
  return <div className="chain-pedal">
    <div className={`mini-pedal pedal-${pedal.color}`}><span>{pedal.initials}</span><i /></div>
    <div className="chain-info"><strong>{pedal.name}</strong><span>{pedal.brand} · {pedal.type}</span></div>
    <div className="chain-actions"><button aria-label="Move pedal up" disabled={index === 0} onClick={() => onMove(index, -1)}><Icon name="up" size={15} /></button><button aria-label="Move pedal down" disabled={index === count - 1} onClick={() => onMove(index, 1)}><Icon name="down" size={15} /></button><button aria-label="Pedal settings" onClick={() => onSettings(pedal)}><Icon name="tune" size={15} /></button><button aria-label="Remove pedal" onClick={() => onRemove(pedal.id)}><Icon name="close" size={15} /></button></div>
  </div>
}

function SignalChain({ chain, onMove, onRemove, onSettings }) {
  return <div className="signal-chain">
    <div className="chain-end"><span className="end-icon"><Icon name="guitar" size={20} /></span><b>Guitar</b><small>Input</small></div>
    {chain.map((pedal, index) => <div className="chain-step" key={pedal.id}><span className="chain-wire" /><PedalChainItem pedal={pedal} index={index} count={chain.length} onMove={onMove} onRemove={onRemove} onSettings={onSettings} /><span className="chain-wire" /></div>)}
    <div className="chain-end amp-end"><span className="amp-stack"><i /><i /></span><b>Amplifier</b><small>Output</small></div>
  </div>
}

function RigPresetCard({ preset, onOpen }) {
  return <Card className="preset-card"><div className="preset-card-top"><div className="preset-icon"><Icon name="preset" size={20} /></div><StatusBadge tone={preset.color}>{preset.status}</StatusBadge></div><h3>{preset.name}</h3><p className="preset-board"><Icon name="board" size={15} /> {preset.board}</p><div className="preset-details"><div><span>Guitar</span><b>{preset.guitar}</b></div><div><span>Tuning</span><b>{preset.tuning}</b></div><div className="amp-detail"><span>Amp settings</span><b>{preset.amp}</b></div></div><button className="text-link" onClick={() => onOpen(preset)}>View preset <Icon name="arrow" size={14} /></button></Card>
}

function EmptyState({ title, message, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon name="search" size={22} /></div><h3>{title}</h3><p>{message}</p>{action}</div>
}

function CreatePreviewForm({ type, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const isBoard = type === 'new-board'

  return <form className="form-stack" onSubmit={(event) => { event.preventDefault(); if (name.trim()) onCreate(name.trim(), description.trim()) }}>
    <p className="muted">Preview-only form. This creates a temporary item in local React state; no backend request is made.</p>
    <label className="field-label">Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder={isBoard ? 'e.g. Sunday Session Board' : 'e.g. Warm Clean Tone'} /></label>
    <label className="field-label">{isBoard ? 'Description' : 'Amp settings'}<textarea rows="3" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={isBoard ? 'What makes this board yours?' : 'Gain 3 · Bass 5 · Mid 6 · Treble 5'} /></label>
    <Button variant="primary" type="submit" icon="plus">{isBoard ? 'Create board' : 'Save draft preset'}</Button>
  </form>
}

function Modal({ title, onClose, children, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><div><span className="eyebrow">TONEVAULT PREVIEW</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></div>{children}</section></div>
}

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'grid' },
  { label: 'Pedal Library', path: '/pedals', icon: 'pedal' },
  { label: 'Pedalboards', path: '/pedalboards', icon: 'board' },
  { label: 'Rig Presets', path: '/rig-presets', icon: 'preset' },
  { label: 'Admin', path: '/admin', icon: 'admin' },
]

function Sidebar({ mobileOpen, closeMenu, onLogout, user }) {
  const visibleNavItems = navItems.filter((item) => item.label !== 'Admin' || user.role === 'admin')
  const initials = user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return <>
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <Link to="/" className="brand" onClick={closeMenu}><span className="brand-mark"><span /><span /><span /></span><span>TONE<span className="brand-accent">VAULT</span><small>GUITAR RIG STUDIO</small></span></Link>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">{visibleNavItems.map((item) => <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon name={item.icon} /><span>{item.label}</span>{item.label === 'Admin' && <span className="admin-dot" />}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-tip"><span className="tip-mark">✳</span><b>Chase your tone.</b><p>Every great sound starts with an idea.</p><div className="tip-wave">〰〰〰〰〰</div></div><button className="profile-row" onClick={onLogout}><span className="avatar">{initials}</span><span><b>{user.name}</b><small>{user.role === 'admin' ? 'Administrator' : 'Guitarist'}</small></span><Icon name="logout" size={16} /></button></div>
    </aside>
    {mobileOpen && <button className="drawer-scrim" onClick={closeMenu} aria-label="Close navigation menu" />}
  </>
}

function Topbar({ onMenu, title, user }) {
  const initials = user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return <header className="topbar"><button className="mobile-menu-button" aria-label="Open navigation" onClick={onMenu}><Icon name="menu" size={21} /></button><div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><b>{title}</b></div><div className="topbar-right"><span className="local-indicator"><i /> Signed in</span><button className="topbar-avatar" aria-label={`Signed in as ${user.name}`}>{initials}</button></div></header>
}

function AppFrame() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [boards, setBoards] = useState(initialBoards)
  const [presets, setPresets] = useState(initialPresets)
  const [chain, setChain] = useState(chainStart)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [settings, setSettings] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const { notice, flash } = useNotice()
  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      flash('You were signed out, but the server could not confirm token revocation.')
    } finally {
      navigate('/login', { replace: true })
    }
  }
  const pageName = navItems.find((item) => item.path === location.pathname)?.label
    || ({ '/builder': 'Pedalboard Builder', '/pedalboards/create': 'Create Pedalboard', '/admin/pedals': 'Admin Pedals', '/admin/categories': 'Admin Categories', '/admin/rig-presets': 'Admin Rig Presets' })[location.pathname]
    || (location.pathname.startsWith('/pedals/') ? 'Pedal Details' : location.pathname.startsWith('/pedalboards/') ? 'Pedalboard Details' : 'Dashboard')
  const filteredPedals = useMemo(() => pedals.filter((pedal) => {
    const query = search.toLowerCase()
    return (!query || `${pedal.name} ${pedal.brand} ${pedal.category} ${pedal.type}`.toLowerCase().includes(query))
      && (!category || pedal.category === category)
      && (!type || pedal.type === type)
  }), [search, category, type])
  const pages = Math.max(1, Math.ceil(filteredPedals.length / 6))
  const visiblePedals = filteredPedals.slice((Math.min(page, pages) - 1) * 6, Math.min(page, pages) * 6)
  function updateChain(index, direction) {
    const next = [...chain]
    const destination = index + direction
    if (destination < 0 || destination >= next.length) return
    ;[next[index], next[destination]] = [next[destination], next[index]]
    setChain(next)
  }

  function addPedal(pedal) {
    setChain((current) => [...current, { ...pedal, id: Date.now(), initials: pedal.initials || pedal.name.slice(0, 2).toUpperCase() }])
    setModal(null)
  }

  const saveBoard = () => { setBoards((current) => current.map((board) => board.id === 1 ? { ...board, count: chain.length, updated: 'Just now' } : board)); flash('Your changes are saved in this preview session.') }

  return <>
    <UserLayout sidebar={<Sidebar mobileOpen={mobileOpen} closeMenu={() => setMobileOpen(false)} onLogout={handleLogout} user={user} />} topbar={<Topbar onMenu={() => setMobileOpen(true)} title={pageName} user={user} />} footer={<footer className="footer"><span>© 2026 ToneVault</span><span>Built for the love of tone <b>✳</b></span><span>Studio workspace</span></footer>}>
      <Routes>
        <Route path="/" element={<Dashboard navigate={navigate} />} />
        <Route path="/pedals" element={<PedalLibrary search={search} setSearch={(value) => { setSearch(value); setPage(1) }} category={category} setCategory={(value) => { setCategory(value); setPage(1) }} type={type} setType={(value) => { setType(value); setPage(1) }} visiblePedals={visiblePedals} filteredPedals={filteredPedals} page={Math.min(page, pages)} setPage={setPage} onView={(pedal) => navigate(`/pedals/${pedal.id}`)} />} />
        <Route path="/pedals/:id" element={<PedalDetailsPage pedal={pedals.find((pedal) => pedal.id === Number(location.pathname.split('/').pop()))} onAdd={addPedal} />} />
        <Route path="/pedalboards" element={<Pedalboards boards={boards} onOpen={(board) => navigate(`/pedalboards/${board.id}`)} onEdit={() => navigate('/builder')} onCreate={() => navigate('/pedalboards/create')} />} />
        <Route path="/pedalboards/create" element={<CreatePedalboardPage onCreate={(name) => {
          const board = { id: Date.now(), name, owner: 'Alex Morgan', updated: 'Just now', count: 0, style: 'clean' }
          setBoards((current) => [...current, board])
          navigate(`/pedalboards/${board.id}`)
          flash('Added to this browser preview only.')
        }} />} />
        <Route path="/pedalboards/:id" element={<PedalboardDetailsPage board={boards.find((board) => board.id === Number(location.pathname.split('/').pop()))} onEdit={() => navigate('/builder')} />} />
        <Route path="/builder" element={<Builder chain={chain} onMove={updateChain} onRemove={(id) => setChain((current) => current.filter((pedal) => pedal.id !== id))} onSettings={(pedal) => setModal({ type: 'settings', value: pedal })} onAdd={() => setModal({ type: 'add-pedal' })} onSave={saveBoard} />} />
        <Route path="/rig-presets" element={<RigPresets presets={presets} onOpen={(preset) => setModal({ type: 'preset', value: preset })} onCreate={() => setModal({ type: 'new-preset' })} />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage pedals={pedals} presets={presets} navigate={navigate} onReview={(preset) => setModal({ type: 'preset', value: preset })} />} />
          <Route path="/admin/overview" element={<AdminLayout><AdminPreview presets={presets} navigate={navigate} onNotice={flash} onReview={(preset) => setModal({ type: 'preset', value: preset })} /></AdminLayout>} />
          <Route path="/admin/pedals" element={<AdminPedalsPage pedals={pedals} />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage pedals={pedals} />} />
          <Route path="/admin/rig-presets" element={<AdminRigPresetsPage presets={presets} onReview={(preset) => setModal({ type: 'preset', value: preset })} />} />
        </Route>
        <Route path="*" element={<Dashboard navigate={navigate} />} />
      </Routes>
    </UserLayout>
    {notice && <div className="toast" role="status"><Icon name="check" size={17} />{notice}</div>}
    {modal && <Modal title={modal.type === 'pedal' ? modal.value.name : modal.type === 'settings' ? `${modal.value.name} settings` : modal.type === 'preset' ? modal.value.name : modal.type === 'add-pedal' ? 'Add a pedal' : modal.type === 'new-board' ? 'Create pedalboard' : modal.type === 'new-preset' ? 'Create rig preset' : 'Category management'} onClose={() => setModal(null)} wide={modal.type === 'add-pedal'}>
      {modal.type === 'pedal' && <div className="detail-modal"><div className={`pedal-visual pedal-${modal.value.color}`}><span className="pedal-brand">{modal.value.brand}</span><span className="pedal-face">{modal.value.initials}</span><span className="pedal-led" /><span className="pedal-footswitch" /></div><div><span className="tag">{modal.value.category}</span><p>{modal.value.type} effect by {modal.value.brand}.</p><Button variant="primary" onClick={() => addPedal(modal.value)}>Add to current board</Button></div></div>}
      {modal.type === 'settings' && <div className="form-stack"><p className="muted">Adjust the local settings for {modal.value.name}.</p>{['Level', 'Tone', 'Mix'].map((key) => <label className="range-setting" key={key}><span>{key}<b>{settings[`${modal.value.id}-${key}`] ?? 50}%</b></span><input type="range" value={settings[`${modal.value.id}-${key}`] ?? 50} onChange={(event) => setSettings((current) => ({ ...current, [`${modal.value.id}-${key}`]: event.target.value }))} /></label>)}<label className="field-label">Notes<textarea rows="3" placeholder="Add a note for this pedal..." /></label><Button variant="primary" onClick={() => { setModal(null); flash('Pedal settings updated in local preview.') }}>Done</Button></div>}
      {modal.type === 'add-pedal' && <div className="add-pedal-grid">{pedals.filter((pedal) => !chain.some((item) => item.name === pedal.name)).map((pedal) => <button key={pedal.id} className="add-pedal-option" onClick={() => addPedal(pedal)}><span className={`mini-pedal pedal-${pedal.color}`}><span>{pedal.initials}</span></span><span><b>{pedal.name}</b><small>{pedal.brand} · {pedal.type}</small></span><Icon name="plus" size={17} /></button>)}</div>}
      {(modal.type === 'new-board' || modal.type === 'new-preset') && <CreatePreviewForm type={modal.type} onCreate={(name, description) => {
        if (modal.type === 'new-board') {
          setBoards((current) => [...current, { id: Date.now(), name, owner: 'Alex Morgan', updated: 'Just now', count: 0, style: 'clean' }])
          navigate('/pedalboards')
        } else {
          setPresets((current) => [...current, { id: Date.now(), name, board: 'My Rock Setup', guitar: 'Fender Stratocaster', tuning: 'E Standard', amp: description || 'Gain 3 · Bass 5 · Mid 6 · Treble 5', status: 'Draft', color: 'muted' }])
          navigate('/rig-presets')
        }
        setModal(null)
        flash('Added to this browser preview only.')
      }} />}
      {modal.type === 'preset' && <div className="form-stack"><div className="preset-modal-status"><StatusBadge tone={modal.value.color}>{modal.value.status}</StatusBadge></div><div className="preset-modal-grid"><div><small>Pedalboard</small><b>{modal.value.board}</b></div><div><small>Guitar</small><b>{modal.value.guitar}</b></div><div><small>Tuning</small><b>{modal.value.tuning}</b></div><div><small>Amp settings</small><b>{modal.value.amp}</b></div></div><p className="muted">Preset details are sample content for the visual preview.</p></div>}
    </Modal>}
  </>
}

function Dashboard({ navigate }) {
  return <>
    <div className="welcome-banner"><div className="welcome-copy"><span className="eyebrow banner-eyebrow">THURSDAY, OCTOBER 08, 2026</span><h1>Good evening, Alex <span>✳</span></h1><p>Your sound is taking shape. Ready to find your next tone?</p><Button variant="cream" icon="arrow" onClick={() => navigate('/builder')}>Continue building <Icon name="arrow" size={15} /></Button></div><div className="welcome-art"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><div className="hero-pedal"><span>TV</span><i /><small>TONEVAULT</small></div><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div></div></div>
    <div className="dashboard-section-top"><div><span className="eyebrow">YOUR STUDIO</span><h2>At a glance</h2></div><span className="updated-label"><i /> Updated just now</span></div>
    <div className="stats-grid">
      <StatCard label="Total pedals" number="20" note="In your library" icon="pedal" trend="+4 this month" tone="orange" />
      <StatCard label="My pedalboards" number="3" note="Across your studio" icon="board" trend="View all" tone="purple" />
      <StatCard label="Rig presets" number="5" note="Tone recipes saved" icon="preset" trend="2 approved" tone="green" />
      <Card className="quote-card"><span className="quote-mark">“</span><p>Tone is in the fingers,<br />but the pedals help.</p><span>— every guitarist, eventually</span><div className="quote-wave">〰〰〰〰〰〰〰</div></Card>
    </div>
    <div className="dashboard-columns"><Card className="recent-card"><div className="card-heading"><div><span className="eyebrow">RECENTLY IN YOUR LIBRARY</span><h2>Popular pedals</h2></div><button className="text-link" onClick={() => navigate('/pedals')}>View library <Icon name="arrow" size={14} /></button></div><div className="mini-library">{pedals.slice(0, 4).map((pedal) => <div className="mini-library-row" key={pedal.id}><div className={`library-icon pedal-${pedal.color}`}>{pedal.initials}</div><div><b>{pedal.name}</b><span>{pedal.brand} · {pedal.category}</span></div><Icon name="chevron" size={16} /></div>)}</div></Card><Card className="quick-card"><span className="eyebrow">MAKE SOME NOISE</span><h2>Quick actions</h2><p>Jump back into your creative flow.</p><button className="quick-action" onClick={() => navigate('/pedals')}><span className="quick-icon"><Icon name="search" /></span><span><b>Browse pedals</b><small>Find your next sound</small></span><Icon name="arrow" size={16} /></button><button className="quick-action" onClick={() => navigate('/builder')}><span className="quick-icon"><Icon name="plus" /></span><span><b>Create pedalboard</b><small>Build a new signal chain</small></span><Icon name="arrow" size={16} /></button><button className="quick-action" onClick={() => navigate('/rig-presets')}><span className="quick-icon"><Icon name="preset" /></span><span><b>View rig presets</b><small>Explore your tone recipes</small></span><Icon name="arrow" size={16} /></button></Card></div>
  </>
}

function StatCard({ label, number, note, icon, trend, tone }) {
  return <Card className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon name={icon} size={20} /></div><div className="stat-content"><span>{label}</span><b>{number}</b><small>{note}</small></div><div className="stat-footer"><span className={`stat-dot ${tone}`} />{trend}</div></Card>
}

function PedalLibrary({ search, setSearch, category, setCategory, type, setType, visiblePedals, filteredPedals, page, setPage, onView }) {
  return <><SectionHeading eyebrow="THE COLLECTION" title="Pedal library" description="A universe of tone, one stomp at a time." action={<span className="collection-count"><span /> {pedals.length} pedals in collection</span>} /><Card className="library-tools"><SearchBar value={search} onChange={setSearch} /><FilterBar category={category} setCategory={setCategory} type={type} setType={setType} /></Card><div className="library-results-label"><span>Showing <b>{filteredPedals.length}</b> pedals</span><span className="sort-button">Sorted by: <b>Name A–Z</b> <Icon name="down" size={14} /></span></div><PedalGrid items={visiblePedals} onView={onView} /><Pagination page={page} setPage={setPage} total={filteredPedals.length} /></>
}

function Pedalboards({ boards, onOpen, onEdit, onCreate }) {
  return <><SectionHeading eyebrow="YOUR BUILDS" title="Pedalboards" description="Your sound, laid out from input to amp." action={<Button variant="primary" icon="plus" onClick={onCreate}>New pedalboard</Button>} /><div className="boards-banner"><div className="boards-banner-icon"><Icon name="board" size={21} /></div><div><b>Three boards. Endless possibilities.</b><p>Shape, save, and revisit the sounds you love.</p></div><span className="boards-banner-count">03 <small>BOARDS</small></span></div><div className="board-grid">{boards.map((board) => <PedalboardCard key={board.id} board={board} onOpen={onOpen} onEdit={onEdit} />)}</div></>
}

function Builder({ chain, onMove, onRemove, onSettings, onAdd, onSave }) {
  return <><SectionHeading eyebrow="SIGNAL CHAIN STUDIO" title="My Rock Setup" description="Arrange the pieces that make your sound yours." action={<Button variant="primary" onClick={onSave} icon="check">Save pedalboard</Button>} /><div className="builder-toolbar"><div className="board-picker"><div className="board-picker-icon"><Icon name="board" /></div><span><small>EDITING PEDALBOARD</small><b>My Rock Setup <Icon name="down" size={14} /></b></span></div><div className="builder-toolbar-right"><span className="draft-indicator"><i /> Local changes</span><Button icon="plus" onClick={onAdd}>Add pedal</Button></div></div><Card className="signal-card"><div className="signal-card-heading"><div><span className="eyebrow">YOUR SIGNAL PATH</span><h2>From first note to final echo</h2></div><span className="signal-count">{chain.length} pedals</span></div><SignalChain chain={chain} onMove={onMove} onRemove={onRemove} onSettings={onSettings} /><div className="signal-footer"><span><i /> Signal flows left to right</span><span>Drag-free preview · Use arrows to reorder</span></div></Card><div className="builder-note"><span>✳</span><p><b>Make it yours.</b> Pedal changes stay in your browser preview and are not sent to a server.</p></div></>
}

function RigPresets({ presets, onOpen, onCreate }) {
  return <><SectionHeading eyebrow="TONE RECIPES" title="Rig presets" description="Save the settings behind your signature sound." action={<Button variant="primary" icon="plus" onClick={onCreate}>New preset</Button>} /><div className="preset-summary"><div><span className="eyebrow">YOUR PRESETS</span><b>{presets.length} <small>saved tones</small></b></div><div className="preset-summary-divider" /><div><StatusBadge tone="green">2 Approved</StatusBadge><StatusBadge tone="orange">1 Submitted</StatusBadge><StatusBadge tone="muted">1 Draft</StatusBadge></div></div><div className="preset-grid">{presets.map((preset) => <RigPresetCard key={preset.id} preset={preset} onOpen={onOpen} />)}</div></>
}

function AdminPreview({ presets, navigate, onReview, onNotice }) {
  const pending = presets.filter((preset) => preset.status === 'Submitted')
  return <><SectionHeading eyebrow="STUDIO CONTROL" title="Admin overview" description="A quick look at the ToneVault collection." action={<span className="admin-preview-pill"><Icon name="admin" size={15} /> ADMIN PREVIEW</span>} /><div className="admin-stats"><AdminStat label="Total pedals" value="20" icon="pedal" /><AdminStat label="Total categories" value="10" icon="grid" /><AdminStat label="Total pedalboards" value="3" icon="board" /><AdminStat label="Pending rig presets" value={String(pending.length).padStart(2, '0')} icon="preset" /></div><div className="admin-manage-grid"><AdminManageCard number="01" title="Manage pedals" text="Review the pedal catalog and its details." count="20 pedals" onClick={() => navigate('/pedals')} /><AdminManageCard number="02" title="Manage categories" text="Keep your effect families organized." count="10 categories" onClick={() => onNotice('Category management is a frontend-only preview.')} /><AdminManageCard number="03" title="Review rig presets" text="Submitted tone recipes waiting for review." count={`${pending.length} to review`} onClick={() => pending[0] && onReview(pending[0])} /></div><Card className="review-table-card"><div className="card-heading"><div><span className="eyebrow">REQUIRES ATTENTION</span><h2>Preset review queue</h2></div><span className="table-count">{pending.length} awaiting review</span></div><div className="table-wrap"><table><thead><tr><th>PRESET NAME</th><th>OWNER</th><th>PEDALBOARD</th><th>SUBMITTED</th><th>STATUS</th><th /></tr></thead><tbody>{pending.length ? pending.map((preset) => <tr key={preset.id}><td><b>{preset.name}</b></td><td>Alex Morgan</td><td>{preset.board}</td><td>Oct 07, 2026</td><td><StatusBadge tone="orange">Submitted</StatusBadge></td><td><button className="text-link" onClick={() => onReview(preset)}>Review <Icon name="arrow" size={14} /></button></td></tr>) : <tr><td colSpan="6"><EmptyState title="All caught up" message="No presets are waiting for review." /></td></tr>}</tbody></table></div></Card><p className="preview-disclaimer"><Icon name="admin" size={15} /> This admin screen is a visual preview. It does not manage live data.</p></>
}

function AdminStat({ label, value, icon }) {
  return <Card className="admin-stat"><span className="admin-stat-icon"><Icon name={icon} size={19} /></span><span>{label}</span><b>{value}</b><small>In the collection</small></Card>
}

function AdminManageCard({ number, title, text, count, onClick }) {
  return <button className="admin-manage-card" onClick={onClick}><span className="manage-number">{number}</span><span className="manage-icon"><Icon name={number === '01' ? 'pedal' : number === '02' ? 'grid' : 'preset'} /></span><b>{title}</b><p>{text}</p><span className="manage-bottom">{count}<Icon name="arrow" size={15} /></span></button>
}

export default function App() {
  return <NoticeProvider><BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="*" element={<AppFrame />} />
    </Route>
  </Routes></AuthProvider></BrowserRouter></NoticeProvider>
}
