import { motion } from 'framer-motion'

const amenities = [
  { src: '/images/render-pool.webp',     title: 'הבריכה',    meta: 'פרגולה ים-תיכונית · בריכה מחוממת' },
  { src: '/images/render-fitness.webp',  title: 'הכושר',     meta: 'אולם אימונים · יוגה · פילאטיס' },
  { src: '/images/render-lobby.webp',    title: 'הלובי',     meta: 'קונסיירז׳ פרטי · ספרייה · קפה' },
  { src: '/images/render-interior.webp', title: 'דירה לדוגמה', meta: 'מטבח אסקלוסיבי · גימור עץ' },
]

/**
 * Amenities — asymmetric image grid with editorial overlays. Big tiles on
 * the corners, smaller in the middle. Re-uses the existing render-* assets
 * so we ship without waiting for additional CGI.
 */
export default function Amenities() {
  return (
    <section className="amenities" id="amenities" aria-label="השירותים">
      <div className="amenities-head">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          — השירותים
        </motion.span>
        <motion.h2
          className="amenities-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          חוויית <em>ריזורט</em> בתוך הבית.
        </motion.h2>
      </div>

      <div className="amenities-grid">
        {amenities.map((a, idx) => (
          <motion.figure
            key={a.title}
            className="amenity"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
          >
            <img src={a.src} alt={a.title} loading="lazy" decoding="async" />
            <figcaption className="amenity-overlay">
              <h3 className="amenity-title">{a.title}</h3>
              <span className="amenity-meta">{a.meta}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
