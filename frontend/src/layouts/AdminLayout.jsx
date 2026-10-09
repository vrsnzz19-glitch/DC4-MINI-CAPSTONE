import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/pedals', label: 'Pedals' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/rig-presets', label: 'Rig presets' },
]

export default function AdminLayout({ children }) {
  return <div className="admin-layout"><nav className="admin-tabs" aria-label="Admin sections">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.end}>{link.label}</NavLink>)}</nav>{children}</div>
}
