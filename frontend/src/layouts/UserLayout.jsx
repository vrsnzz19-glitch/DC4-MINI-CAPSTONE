export default function UserLayout({ sidebar, topbar, children, footer }) {
  return <div className="app-shell">{sidebar}<div className="main-shell">{topbar}<main className="main-content">{children}</main>{footer}</div></div>
}
