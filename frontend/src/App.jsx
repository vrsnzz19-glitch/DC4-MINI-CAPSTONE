import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NoticeProvider } from './context/NoticeContext'
import AuthProvider from './context/AuthContext'
import useAuth from './hooks/useAuth'
import useNotice from './hooks/useNotice'
import apiClient from './services/apiClient'
import UserLayout from './layouts/UserLayout'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute'
import { PedalDetailPage, PedalLibraryPage } from './pages/PedalLibraryPage'
import { AdminCategoriesPage, AdminPedalsPage } from './pages/AdminCatalogPages'
import {
  AdminDashboardPage,
  LoginPage,
  RegisterPage,
} from './pages/StudioPages'
import {
  PedalboardBuilderPage,
  PedalboardDetailsPage,
  PedalboardFormPage,
  PedalboardsPage,
} from './pages/PedalboardsPage'
import {
  AdminRigPresetDetailsPage,
  AdminRigPresetsPage,
  RigPresetDetailsPage,
  RigPresetFormPage,
  RigPresetsPage,
} from './pages/RigPresetsPage'
import './App.css'

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

function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>
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
    || ({ '/builder': 'Pedalboard Builder', '/pedalboards/create': 'Create Pedalboard', '/rig-presets': 'Rig Presets', '/rig-presets/create': 'Create Rig Preset', '/admin/pedals': 'Admin Pedals', '/admin/categories': 'Admin Categories', '/admin/rig-presets': 'Admin Rig Presets' })[location.pathname]
    || (location.pathname.startsWith('/rig-presets/') ? 'Rig Preset Details' : location.pathname.startsWith('/pedals/') ? 'Pedal Details' : location.pathname.startsWith('/pedalboards/') ? 'Pedalboard Details' : 'Dashboard')
  return <>
    <UserLayout sidebar={<Sidebar mobileOpen={mobileOpen} closeMenu={() => setMobileOpen(false)} onLogout={handleLogout} user={user} />} topbar={<Topbar onMenu={() => setMobileOpen(true)} title={pageName} user={user} />} footer={<footer className="footer"><span>© 2026 ToneVault</span><span>Built for the love of tone <b>✳</b></span><span>Studio workspace</span></footer>}>
      <Routes>
        <Route path="/" element={<Dashboard navigate={navigate} />} />
        <Route path="/pedals" element={<PedalLibraryPage />} />
        <Route path="/pedals/:id" element={<PedalDetailPage />} />
        <Route path="/pedalboards" element={<PedalboardsPage />} />
        <Route path="/pedalboards/create" element={<PedalboardFormPage />} />
        <Route path="/pedalboards/:id/edit" element={<PedalboardFormPage key={location.pathname} />} />
        <Route path="/pedalboards/:id/builder" element={<PedalboardBuilderPage key={location.pathname} />} />
        <Route path="/pedalboards/:id" element={<PedalboardDetailsPage key={location.pathname} />} />
        <Route path="/builder" element={<Navigate to="/pedalboards" replace />} />
        <Route path="/rig-presets" element={<RigPresetsPage />} />
        <Route path="/rig-presets/create" element={<RigPresetFormPage key={location.pathname} />} />
        <Route path="/rig-presets/:id/edit" element={<RigPresetFormPage key={location.pathname} />} />
        <Route path="/rig-presets/:id" element={<RigPresetDetailsPage key={location.pathname} />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage navigate={navigate} />} />
          <Route path="/admin/overview" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/pedals" element={<AdminPedalsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/rig-presets" element={<AdminRigPresetsPage />} />
          <Route path="/admin/rig-presets/:id" element={<AdminRigPresetDetailsPage key={location.pathname} />} />
        </Route>
        <Route path="*" element={<Dashboard navigate={navigate} />} />
      </Routes>
    </UserLayout>
    {notice && <div className="toast" role="status"><Icon name="check" size={17} />{notice}</div>}
  </>
}

function Dashboard({ navigate }) {
  const [catalogPedals, setCatalogPedals] = useState([])
  const [pedalCount, setPedalCount] = useState(0)
  const [pedalboardCount, setPedalboardCount] = useState(null)
  const [pedalboardError, setPedalboardError] = useState('')
  const [isLoadingPedals, setIsLoadingPedals] = useState(true)
  const [pedalError, setPedalError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedals', { params: { per_page: 4 }, signal: controller.signal })
      .then((response) => {
        setCatalogPedals(response.data.data)
        setPedalCount(response.data.meta.total)
      })
      .catch((error) => {
        if (!controller.signal.aborted) setPedalError(error.response?.data?.message || 'Unable to load recent pedals.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingPedals(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedalboards', { params: { page: 1 }, signal: controller.signal })
      .then((response) => setPedalboardCount(response.data.meta.total))
      .catch((error) => {
        if (!controller.signal.aborted) setPedalboardError(error.response?.data?.message || 'Unable to load your pedalboards.')
      })
    return () => controller.abort()
  }, [])

  return <>
    <div className="welcome-banner"><div className="welcome-copy"><span className="eyebrow banner-eyebrow">THURSDAY, OCTOBER 08, 2026</span><h1>Good evening, Alex <span>✳</span></h1><p>Your sound is taking shape. Ready to find your next tone?</p><Button variant="cream" icon="arrow" onClick={() => navigate('/pedalboards')}>View your pedalboards <Icon name="arrow" size={15} /></Button></div><div className="welcome-art"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><div className="hero-pedal"><span>TV</span><i /><small>TONEVAULT</small></div><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div></div></div>
    <div className="dashboard-section-top"><div><span className="eyebrow">YOUR STUDIO</span><h2>At a glance</h2></div><span className="updated-label"><i /> Updated just now</span></div>
    <div className="stats-grid">
      <StatCard label="Total pedals" number={isLoadingPedals ? '—' : pedalCount} note="In your library" icon="pedal" trend="Browse catalog" tone="orange" />
      <StatCard label="My pedalboards" number={pedalboardCount ?? '—'} note={pedalboardError ? 'Unable to load boards' : 'Across your studio'} icon="board" trend="View all" tone="purple" />
      <StatCard label="Rig presets" number="5" note="Tone recipes saved" icon="preset" trend="2 approved" tone="green" />
      <Card className="quote-card"><span className="quote-mark">“</span><p>Tone is in the fingers,<br />but the pedals help.</p><span>— every guitarist, eventually</span><div className="quote-wave">〰〰〰〰〰〰〰</div></Card>
    </div>
    <div className="dashboard-columns"><Card className="recent-card"><div className="card-heading"><div><span className="eyebrow">RECENTLY IN YOUR LIBRARY</span><h2>Popular pedals</h2></div><button className="text-link" onClick={() => navigate('/pedals')}>View library <Icon name="arrow" size={14} /></button></div>{pedalError ? <p className="muted" role="alert">{pedalError}</p> : isLoadingPedals ? <div className="mini-library-loading" role="status">Loading pedals...</div> : catalogPedals.length ? <div className="mini-library">{catalogPedals.map((pedal) => <div className="mini-library-row" key={pedal.id}><div className="library-icon pedal-black">{(pedal.model || pedal.name).slice(0, 2).toUpperCase()}</div><div><b>{pedal.name}</b><span>{pedal.brand} · {pedal.category?.name || pedal.type}</span></div><Icon name="chevron" size={16} /></div>)}</div> : <p className="muted">No pedals in the catalog yet.</p>}</Card><Card className="quick-card"><span className="eyebrow">MAKE SOME NOISE</span><h2>Quick actions</h2><p>Jump back into your creative flow.</p><button className="quick-action" onClick={() => navigate('/pedals')}><span className="quick-icon"><Icon name="search" /></span><span><b>Browse pedals</b><small>Find your next sound</small></span><Icon name="arrow" size={16} /></button><button className="quick-action" onClick={() => navigate('/pedalboards/create')}><span className="quick-icon"><Icon name="plus" /></span><span><b>Create pedalboard</b><small>Build a new signal chain</small></span><Icon name="arrow" size={16} /></button><button className="quick-action" onClick={() => navigate('/rig-presets')}><span className="quick-icon"><Icon name="preset" /></span><span><b>View rig presets</b><small>Explore your tone recipes</small></span><Icon name="arrow" size={16} /></button></Card></div>
  </>
}

function StatCard({ label, number, note, icon, trend, tone }) {
  return <Card className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon name={icon} size={20} /></div><div className="stat-content"><span>{label}</span><b>{number}</b><small>{note}</small></div><div className="stat-footer"><span className={`stat-dot ${tone}`} />{trend}</div></Card>
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
