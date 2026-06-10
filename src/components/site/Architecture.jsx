import { motion } from 'framer-motion'

const CARDS = [
  {
    key: 'tower',
    eyebrow: 'מגדל הפארק',
    title: 'המגדל',
    body:
      'מגדל מדורג בן 15 קומות בתכנון משרד בר אוריין — מרפסות שקועות בקו הבניין, גוף שנסוג בקומה 8, דירות גג בקומה 14 ומגה־פנטהאוז יחיד בקומה 15 — דירה אחת בלבד, בגודל 185 מ״ר. נוף פתוח לפארק האקולוגי ולקו הים מהקומות הגבוהות.',
    image: '/images/illustrations/tower-card.svg',
    alt: 'איור אקסונומטרי מדויק של מגדל G Park מתוך תוכניות בר אוריין — גוף מדורג עם נסיגות בקומות 8, 14 ו-15 ומרפסות שקועות בקו הבניין',
  },
  {
    key: 'boutique',
    eyebrow: 'הבניינים המרקמיים',
    title: 'בנייני הבוטיק',
    body:
      'חמישה בנייני בוטיק — שניים בחזית המערבית ושלושה בחזית הצפונית — בני 7 קומות בלבד. קנה מידה אינטימי, חזיתות שטוחות וחיפוי אבן מקומית. בקומה העליונה של כל בניין יושב פנטהאוז של 155 מ״ר עם גג של 37 עד 80 מ״ר, לפי המיקום.',
    image: '/images/render-boutique-west.webp',
    alt: 'הדמיית בניין בוטיק מערבי של G Park — קומות נמוכות, חזית שטוחה עם מרפסות בקו הבניין, אור זהוב של שעת ערב',
  },
  {
    key: 'lobby',
    eyebrow: 'הלובי',
    title: 'הלובי',
    body:
      'לובי כפול־גובה במגדל, עם חזית זכוכית הנפתחת לחצר הפנימית הירוקה. חיפויי טרוורטין בהירים, מבטאי ברונזה ועץ אגוז, דלפק קבלה דיסקרטי וספות מעוגלות סביב פינת המתנה — כניסה ביתית במגע מלון בוטיק, לא חלל מסחרי.',
    image: '/images/render-lobby-tower.webp',
    alt: 'הדמיית לובי המגדל של G Park — חלל כפול גובה, טרוורטין, חזית זכוכית לחצר וספות מעוגלות סביב דלפק הקבלה',
  },
  {
    key: 'roofs',
    eyebrow: 'הגגות והמרפסות',
    title: 'מרפסות, גגות ופנטהאוזים',
    body:
      'מרפסות טיפוסיות של 12 מ״ר לכל דירה, גגות מורחבים של 40 ו־48 מ״ר בקומת הנסיגה (קומה 8 של המגדל), וגגות פנטהאוז מ־37 ועד 178 מ״ר. דירות הגן בקרקע נהנות מגינות פרטיות של 59 עד 128 מ״ר. כל קומה משתנה — לא רק "עוד דירה".',
    image: '/images/render-aerial-2.webp',
    alt: 'תצלום אווירי של מתחם G Park — גגות הפנטהאוז, מרפסות הקומות העליונות והחצר הפנימית הירוקה',
  },
]

/**
 * Architecture — three building-typology cards driven by BUILDINGS data.
 * No commercial / retail framing.
 */
export default function Architecture() {
  return (
    <section className="arch" id="architecture" aria-label="תמהיל הבניינים">
      <div className="arch-shell">
        <motion.span
          className="eyebrow arch-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          — האדריכלות
        </motion.span>
        <motion.h2
          className="arch-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          תמהיל בניינים שמייצר <em>חוויית מגורים שלמה.</em>
        </motion.h2>
        <motion.p
          className="arch-intro"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          מגדל בן 15 קומות, חמישה בנייני בוטיק של 7 קומות, לובי מלוני וגגות
          מרפסות — ארבע טיפולוגיות שמדברות שפה אדריכלית אחת, בתכנון משרד
          בר אוריין, על מגרש שמשקיף לפארק האקולוגי של רמת השרון.
        </motion.p>

        <ul className="arch-grid">
          {CARDS.map((c, idx) => (
            <motion.li
              key={c.key}
              className="arch-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
            >
              <div className="arch-card-media">
                <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
              </div>
              <div className="arch-card-body">
                <span className="arch-card-eyebrow">{c.eyebrow}</span>
                <h3 className="arch-card-title">{c.title}</h3>
                <p className="arch-card-desc">{c.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
