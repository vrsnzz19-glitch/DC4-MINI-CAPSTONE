import { Link } from 'react-router-dom'

export default function PublicLayout({ children, title = 'Your tone, your way.' }) {
  return <main className="public-layout">
    <Link to="/" className="public-brand"><span className="brand-mark"><span /><span /><span /></span><span>TONE<span className="brand-accent">VAULT</span></span></Link>
    <div className="public-layout-grid"><section className="public-promo"><span className="eyebrow">GUITAR RIG STUDIO</span><h1>{title}</h1><p>Build your sound. Save every detail. Find your next favorite tone.</p><div className="public-promo-art" aria-hidden="true">TV</div></section><section className="public-form-region">{children}</section></div>
    <p className="public-preview-note">Secure sign-in · Your account stays yours.</p>
  </main>
}
