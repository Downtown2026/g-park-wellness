import Logo from './Logo.jsx'

/**
 * Editorial footer. Two rows:
 *   1. Brand stack (project + developer attribution) + sales office + project nav.
 *   2. Base credit line with year, architect, and disclaimers.
 *
 * The G-Group developer mark (gold diamond G) sits as a quiet badge under
 * the Wellness Living wordmark — clear authorship without crowding the
 * project mark.
 */
export default function Footer() {
  return (
    <footer className="site-footer" id="site-footer" aria-label="פרטי קשר וצוות הפרויקט">
      <div className="site-footer-grid">
        <div className="site-footer-brand-col">
          <Logo height={44} variant="light" />

          <a
            href="https://www.g-group.estate/"
            target="_blank"
            rel="noopener"
            className="site-footer-developer"
            aria-label="By G-Group · יזם הפרויקט"
          >
            <span className="site-footer-developer-eyebrow">— יזם הפרויקט</span>
            <span className="site-footer-developer-row">
              <img
                src="/images/logo-g-group-mark.png?v=2"
                alt=""
                aria-hidden="true"
                width="44"
                height="44"
                decoding="async"
                loading="lazy"
              />
              <span className="site-footer-developer-name">G‑Group</span>
            </span>
          </a>

          <p className="site-footer-tag">
            קומפלקס מגורים בוטיק עם קומת ולנס פרטית, בקו ראשון לפארק האקולוגי
            של צפון תל אביב — 282 דונם של ריאה ירוקה צמוד לבית.
          </p>
        </div>

        <div className="site-footer-col">
          <h5>משרד מכירות</h5>
          <ul>
            <li>המנופים 11, הרצליה</li>
            <li>מגדלי אקרשטיין · בניין D · קומה 5</li>
            <li><a href="mailto:sales@g-park.life">sales@g-park.life</a></li>
            <li>פתוח לתיאום בלבד</li>
          </ul>
        </div>

        <div className="site-footer-col">
          <h5>הפרויקט</h5>
          <ul>
            <li><a href="#wellness">וולנס</a></li>
            <li><a href="#apts">תמהיל דירות</a></li>
            <li><a href="#architecture">אדריכלות</a></li>
            <li><a href="#location">מיקום</a></li>
            <li><a href="#gallery">גלריה</a></li>
            <li><a href="/catalog">קטלוג מלא</a></li>
          </ul>
        </div>
      </div>

      <div className="site-footer-base">
        <span>© G&nbsp;Park · Wellness Living · By G‑Group · {new Date().getFullYear()}</span>
        <span>שיווק ומכירות: City Square (G-Group) · עו״ד <a href="https://www.g-group.estate/niv-blushinsky.html" target="_blank" rel="noopener">ניב בלושינסקי</a> · אדריכלות: בר אוריין · כל ההדמיות והאיורים באתר הם להמחשה בלבד ואינם מחייבים. אין באמור באתר משום הצעה או התחייבות מצד היזם. ט.ל.ח</span>
      </div>
    </footer>
  )
}
