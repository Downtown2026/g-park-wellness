import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

/**
 * Sticky CTA — fixed bar at the bottom. Appears after the user scrolls
 * past the hero and hides once the contact section is in view (so it
 * doesn't compete with the actual form).
 */
export default function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.7
      const contact = document.getElementById('contact')
      let nearContact = false
      if (contact) {
        const rect = contact.getBoundingClientRect()
        nearContact = rect.top < window.innerHeight * 0.9
      }
      setVisible(past && !nearContact)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`sticky-cta ${visible ? 'is-visible' : ''}`}
      role="complementary"
      aria-label="פעולה מהירה"
      aria-hidden={!visible}
    >
      <div className="sticky-cta-copy">
        <strong>השאירו פרטים</strong>
        <span>תמהיל דירות וזמינות</span>
      </div>
      <div className="sticky-cta-actions">
        <a href="#contact" className="sticky-cta-btn sticky-cta-btn--primary">
          <span>טופס</span>
          <ArrowLeft size={14} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
