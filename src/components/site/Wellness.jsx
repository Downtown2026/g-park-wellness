import { motion } from 'framer-motion'

const CARDS = [
  {
    title: 'ספא דיירים',
    body: 'אזור ספא פרטי לדיירי הפרויקט: סאונה יבשה מאחורי קיר זכוכית, ג׳קוזי, שני חדרי טיפולים פרטיים ואזור הרפיה עם מיטות זן — שגרת ספא ביתית, צעד מהלובי.',
    image: '/images/render-spa.webp',
    alt: 'הדמיית ספא הדיירים של G Park — ג׳קוזי, סאונה מאחורי זכוכית ומיטות טיפולים בתוך טרוורטין בהיר',
  },
  {
    title: 'כושר ופילאטיס',
    body: 'אולם כושר עם ציוד פרימיום, סטודיו ייעודי לפילאטיס מכשירים ויוגה, רחבת מתיחות מול הירוק — אימון בבוקר או בערב, בלי לצאת מהבית.',
    image: '/images/render-pilates.webp',
    alt: 'הדמיית סטודיו פילאטיס ויוגה לדיירי G Park — מכשירי רפורמר, רצפת עץ וקיר מראה מול הגינה',
  },
  {
    title: 'לאונג׳ עבודה',
    body: 'לאונג׳ דיירים שקט עם בר קפה, פינות ישיבה רכות, עמדות עבודה בגובה שולחן ופינת ארוחות — כמו מועדון פרטי בלובי, פתוח רק לדיירי הפרויקט.',
    image: '/images/render-lounge.webp',
    alt: 'הדמיית לאונג׳ דיירים עם מטבחון, ספות רכות, שולחנות עבודה ונוף לחצר הפנימית הירוקה',
  },
  {
    title: 'ירוק ורוגע',
    body: 'חצר פנימית מטופחת בין הבניינים, שבילי הליכה, פינות ישיבה ועצים בוגרים — ומעבר לרחוב, הפארק האקולוגי של רמת השרון על 282 הדונם שלו.',
    image: '/images/render-courtyard.webp',
    alt: 'הדמיית החצר הפנימית של G Park בשעות הערב — פרגולה, שבילים מוארים ועצים בוגרים בין הבניינים',
  },
]

/**
 * Wellness — four lifestyle cards. In-house resident amenities only;
 * never framed as commercial retail.
 */
export default function Wellness() {
  return (
    <section className="wellness" id="wellness" aria-label="מתקני וולנס לדיירים">
      <div className="wellness-shell">
        <div className="wellness-head">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            — חוויית הוולנס
          </motion.span>
          <motion.h2
            className="wellness-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            החיים שלא צריך <em>לצאת מהבית</em> בשבילם.
          </motion.h2>
          <motion.p
            className="wellness-intro"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            אימון בוקר בסטודיו הפילאטיס, קפה בלאונג׳ הדיירים, עבודה שקטה
            מול הירוק, וסיום היום בספא — שגרת בריאות שלמה שמתחילה ונגמרת
            בתוך הבית, ושמורה רק לדיירי הפרויקט.
          </motion.p>
        </div>

        <ul className="wellness-grid">
          {CARDS.map((c, idx) => (
            <motion.li
              key={c.title}
              className="wellness-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
            >
              <div className="wellness-card-media">
                <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
              </div>
              <div className="wellness-card-body">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <p className="wellness-foot">
          מתקני וולנס לדיירים בלבד — חוויית ריזורט פרטית, בלעדית למתחם.
        </p>
      </div>
    </section>
  )
}
