import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Mail } from 'lucide-react'
import Logo from './Logo.jsx'

/**
 * Floating editorial nav bar. Transparent over the hero, swaps to a
 * frosted cream surface once the user scrolls past it. Mobile drawer
 * for narrow screens. ESC closes the drawer. Meeting CTA + email.
 */
const NAV_LINKS = [
  { href: '#project',  label: 'הפרויקט' },
  { href: '#wellness', label: 'וולנס' },
  { href: '#apts',     label: 'דירות' },
  { href: '#location', label: 'מיקום' },
  { href: '#gallery',  label: 'גלריה' },
  { href: '#contact',  label: 'צור קשר' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="ניווט ראשי">
        <a href="#top" className="site-nav-brand" aria-label="G Park · Wellness Living">
          <Logo height={28} variant={scrolled ? 'dark' : 'light'} />
        </a>

        <ul className="site-nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href} className="site-nav-link">{l.label}</a></li>
          ))}
          <li><Link to="/catalog" className="site-nav-link site-nav-link--catalog">קטלוג</Link></li>
        </ul>

        <div className="site-nav-actions">
          <a href="#contact" className="site-nav-cta">תיאום פגישה</a>
          <button
            type="button"
            className="site-nav-burger"
            aria-label={open ? 'סגרו תפריט' : 'פתחו תפריט'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.6} /> : <Menu size={22} strokeWidth={1.6} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`site-nav-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        hidden={!open}
      >
        <div className="site-nav-drawer-head">
          <Logo height={32} variant="light" />
          <p className="site-nav-drawer-tagline">ריזורט פרטי. רמת השרון.</p>
        </div>

        <ul className="site-nav-drawer-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>{l.label}</a>
            </li>
          ))}
          <li>
            <Link to="/catalog" onClick={close}>קטלוג מלא</Link>
          </li>
        </ul>
        <div className="site-nav-drawer-cta">
          <a href="#contact" className="btn btn-primary" onClick={close}>תיאום פגישה</a>
          <a href="mailto:sales@g-park.life" className="btn btn-ghost" dir="ltr" onClick={close}>
            <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>sales@g-park.life</span>
          </a>
        </div>
      </div>
    </>
  )
}
