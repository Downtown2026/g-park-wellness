import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: '',          label: 'בחרו קטגוריה…', disabled: true },
  { value: 'rooms-3',   label: '3 חדרים' },
  { value: 'rooms-4',   label: '4 חדרים' },
  { value: 'rooms-5',   label: '5 חדרים' },
  { value: 'garden',    label: 'דירת גן' },
  { value: 'setback',   label: 'מיני פנטהאוז (קומת נסיגה)' },
  { value: 'penthouse', label: 'פנטהאוז' },
]

/**
 * Contact — lead capture. Listens for `gpark:contact-prefill` events
 * dispatched by ApartmentFinder so a tab CTA opens this form with the
 * matching type already selected.
 *
 * Submission is a stub — wire to the CRM endpoint when available.
 */
export default function Contact() {
  const [type, setType] = useState('')
  const [sent, setSent] = useState(false)

  // Hydrate from sessionStorage (deep links) + listen for live prefill events.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('gpark.contact.type')
      if (stored) setType(stored)
    } catch (e) { /* private mode */ }

    const onPrefill = (e) => {
      if (e.detail?.type) setType(e.detail.type)
    }
    window.addEventListener('gpark:contact-prefill', onPrefill)
    return () => window.removeEventListener('gpark:contact-prefill', onPrefill)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      name:  form.elements.namedItem('name')?.value?.trim()  || '',
      phone: form.elements.namedItem('phone')?.value?.trim() || '',
      type,
    }
    // TODO: wire to CRM
    console.log('[G Park] lead submitted:', data)
    setSent(true)
    form.reset()
    setType('')
  }

  return (
    <section className="contact" id="contact" aria-label="טופס יצירת קשר">
      <div className="contact-shell">
        <motion.span
          className="eyebrow contact-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          — השאירו פרטים
        </motion.span>
        <motion.h2
          className="contact-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          רוצה לבדוק איזו דירה <em>נשארה?</em>
        </motion.h2>
        <motion.p
          className="contact-intro"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          השאירו פרטים — איש מכירות מטעמנו יחזור אליכם לשיחת היכרות קצרה,
          ישלח לכם תמהיל דירות וזמינות עדכנית, ויזמין אתכם לפגישה פרונטלית
          במשרד המכירות בהרצליה. בלי לחץ, בלי התחייבות, ועם תוכניות אמיתיות
          לדירה הספציפית שתעניין אתכם.
        </motion.p>

        <ol className="contact-steps" aria-label="מה קורה אחרי שתשאירו פרטים">
          <li>
            <span className="contact-steps-num">01</span>
            <span>שיחת היכרות קצרה (כעשר דקות) כדי להבין מה מתאים לכם.</span>
          </li>
          <li>
            <span className="contact-steps-num">02</span>
            <span>שליחת תמהיל דירות וזמינות עדכנית לפי מה שאתם מחפשים.</span>
          </li>
          <li>
            <span className="contact-steps-num">03</span>
            <span>תיאום פגישה פרונטלית במשרד המכירות בהרצליה — ללא התחייבות.</span>
          </li>
        </ol>

        {sent ? (
          <div className="contact-success" role="status">
            <h3>תודה — קיבלנו את הפרטים.</h3>
            <p>נציג מטעמנו יחזור אליכם בקרוב לתיאום שיחה אישית.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <label className="contact-field">
              <span>שם מלא</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="לדוגמה: יעל כהן"
              />
            </label>

            <label className="contact-field">
              <span>טלפון</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="050-0000000"
                dir="ltr"
              />
            </label>

            <label className="contact-field contact-field--full">
              <span>מה מעניין אותך?</span>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="contact-actions">
              <button type="submit" className="btn btn-primary">
                <span>שלחו לי פרטים</span>
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <a href="mailto:sales@g-park.life" className="btn btn-ghost" dir="ltr">
                <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>sales@g-park.life</span>
              </a>
            </div>

            <p className="contact-trust">
              הפרטים שלכם נשמרים אצלנו בלבד — לא מועברים לצד שלישי.
            </p>
            <p className="contact-fine">
              לחיצה על "שלחו לי פרטים" מהווה הסכמה לקבלת מענה מנציגי המכירות.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
