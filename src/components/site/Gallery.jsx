import { motion } from 'framer-motion'

const FEATURED = [
  {
    title: 'המתחם ממעוף הציפור',
    meta: 'מגדל + 5 בנייני בוטיק',
    caption: 'מגדל, חמישה בנייני בוטיק וחצר ירוקה פנימית — אדריכלות בר אוריין שמסתכלת קדימה.',
    image: '/images/render-aerial-1.webp',
    alt: 'הדמיה אווירית של מתחם G Park — המגדל, בנייני הבוטיק והחצר הפנימית הירוקה',
  },
  {
    title: 'הבניינים המרקמיים',
    meta: 'בוטיק · 7 קומות',
    caption: 'בנייני בוטיק של 7 קומות בלבד — קנה מידה אנושי ופרטיות גבוהה.',
    image: '/images/render-boutique-west.webp',
    alt: 'הדמיית בניין בוטיק של G Park — 7 קומות, חזית שטוחה ומרפסות בקו הבניין',
  },
  {
    title: 'מתחמי הוולנס',
    meta: 'ספא · כושר · לאונג׳',
    caption: 'ספא, כושר, פילאטיס ולאונג׳ דיירים — שגרת בריאות שלמה, מהבית.',
    image: '/images/render-lounge.webp',
    alt: 'הדמיית לאונג׳ הדיירים של G Park — חלל ישיבה רך באור חם',
  },
]

/**
 * Gallery — three featured editorial cards.
 */
export default function Gallery() {
  return (
    <section className="gallery" id="gallery" aria-label="גלריית הדמיות">
      <div className="gallery-shell">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          — גלריה
        </motion.span>
        <motion.h2
          className="gallery-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          המגדל, הבוטיק והוולנס — <em>בעיניים שלכם.</em>
        </motion.h2>

        <motion.p
          className="gallery-intro"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          שלוש סצנות מרכזיות מתוך הפרויקט: מגדל בן 15 קומות מול הפארק
          האקולוגי, חמישה בנייני בוטיק שמקיפים את החצר הירוקה, ומתחמי
          הוולנס הפרטיים של הדיירים — ספא, כושר, פילאטיס ולאונג׳.
        </motion.p>

        <ul className="gallery-featured">
          {FEATURED.map((f, idx) => (
            <motion.li
              key={f.title}
              className="gallery-feature"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
            >
              <img src={f.image} alt={f.alt} loading="lazy" decoding="async" />
              <div className="gallery-feature-overlay">
                <h3>{f.title}</h3>
                <span>{f.meta}</span>
                <p className="gallery-feature-caption">{f.caption}</p>
              </div>
            </motion.li>
          ))}
        </ul>

      </div>
    </section>
  )
}
