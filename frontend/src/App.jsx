import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import { NoticeProvider } from './context/NoticeContext'
import useAuth from './hooks/useAuth'
import useNotice from './hooks/useNotice'
import UserLayout from './layouts/UserLayout'
import { AdminCategoriesPage, AdminPedalsPage } from './pages/AdminCatalogPages'
import GigMode from './pages/GigMode'
import { PedalDetailPage, PedalLibraryPage } from './pages/PedalLibraryPage'
import { PedalboardBuilderPage, PedalboardsPage } from './pages/PedalboardsPage'
import {
  AdminRigPresetDetailsPage,
  AdminRigPresetsPage,
  RigPresetDetailsPage,
  RigPresetFormPage,
  RigPresetsPage,
} from './pages/RigPresetsPage'
import { AdminDashboardPage, LoginPage, RegisterPage } from './pages/StudioPages'
import './App.css'

function Workspace() {
  const { user, logout } = useAuth()
  const { flash, notice } = useNotice()
  const navigate = useNavigate()
  const location = useLocation()

  const signOut = async () => {
    try {
      await logout()
    } catch {
      flash('You were signed out, but the server could not confirm token revocation.')
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return <>
    <UserLayout
    sidebar={<aside className="sidebar">
      <Link className="brand" to="/pedalboards"><span className="brand-mark"><span /><span /><span /></span><span>TONE<span className="brand-accent">VAULT</span><small>GUITAR RIG STUDIO</small></span></Link>
      <nav className="side-nav" aria-label="Workspace navigation">
        <Link className="nav-link" to="/pedalboards">My pedalboards</Link>
        <Link className="nav-link" to="/pedals">Pedal library</Link>
        <Link className="nav-link" to="/rig-presets">Rig presets</Link>
        {user?.role === 'admin' && <Link className="nav-link" to="/admin">Admin</Link>}
      </nav>
      <button className="profile-row" onClick={signOut}><span className="avatar">{user?.name?.slice(0, 2).toUpperCase()}</span><span><b>{user?.name}</b><small>Sign out</small></span></button>
    </aside>}
    topbar={<header className="topbar"><div className="breadcrumbs"><span>Workspace</span><b>{location.pathname.startsWith('/pedalboards') ? 'Pedalboards' : 'ToneVault'}</b></div><span className="local-indicator"><i /> Signed in</span></header>}
    footer={<footer className="footer"><span>ToneVault</span><span>Built for the love of tone</span></footer>}
  >
    <Routes>
      <Route path="/" element={<Navigate to="/pedalboards" replace />} />
      <Route path="/pedalboards" element={<PedalboardsPage />} />
      <Route path="/pedalboards/create" element={<PedalboardBuilderPage />} />
      <Route path="/pedals" element={<PedalLibraryPage />} />
      <Route path="/pedals/:id" element={<PedalDetailPage />} />
      <Route path="/rig-presets" element={<RigPresetsPage />} />
      <Route path="/rig-presets/create" element={<RigPresetFormPage />} />
      <Route path="/rig-presets/:id/edit" element={<RigPresetFormPage key={location.pathname} />} />
      <Route path="/rig-presets/:id" element={<RigPresetDetailsPage key={location.pathname} />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage navigate={navigate} />} />
        <Route path="/admin/pedals" element={<AdminPedalsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/rig-presets" element={<AdminRigPresetsPage />} />
        <Route path="/admin/rig-presets/:id" element={<AdminRigPresetDetailsPage key={location.pathname} />} />
      </Route>
      <Route path="*" element={<Navigate to="/pedalboards" replace />} />
    </Routes>
    </UserLayout>
    {notice && <div className="toast" role="status">{notice}</div>}
  </>
}

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/pedalboards/:id/gig-mode" element={<GigMode />} />
      <Route path="*" element={<Workspace />} />
    </Route>
  </Routes>
}

export default function App() {
  return <NoticeProvider><BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter></NoticeProvider>
}
