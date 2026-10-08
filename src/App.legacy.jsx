import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import {
  ChefHat,
  Flower2,
  Dumbbell,
  Leaf,
  Users,
  Handshake,
  Laptop,
  Blocks,
  MapPin,
  ArrowLeft,
  Plus,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — Lenis
   ═══════════════════════════════════════════════ */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
}

/* ═══════════════════════════════════════════════
   REVEAL WRAPPER
   ═══════════════════════════════════════════════ */
const Reveal = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
)

/* ═══════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════ */
const Logo = ({ dark = false, className = '', height = 44 }) => (
  <img
    src="/logo.svg"
    alt="G Park Wellness Living"
    style={{ height, width: 'auto' }}
    className={`block transition-[filter] duration-700 ${
      dark ? '' : 'invert brightness-0'
    } ${className}`}
  />
)

/* ═══════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-[var(--color-paper)]/92 backdrop-blur-xl border-b border-[var(--color-stone)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-editorial flex items-center justify-between h-24">
        <a href="#top" className="flex items-center">
          <Logo dark={scrolled} height={44} />
        </a>

        <ul
          className={`hidden md:flex items-center gap-12 text-sm transition-colors duration-500 ${
            scrolled ? 'text-[var(--color-ink)]' : 'text-[var(--color-paper)]'
          }`}
        >
          {[
            ['#vision', 'החזון'],
            ['#location', 'המיקום'],
            ['#wellness', 'הלייף־סטייל'],
            ['#residences', 'הדירות'],
            ['#value', 'ההזדמנות'],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="relative py-2 hover:opacity-70 transition-opacity duration-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`hidden md:inline-flex items-center gap-3 h-11 px-7 text-[0.7rem] tracking-[0.18em] uppercase border transition-all duration-500 ${
            scrolled
              ? 'border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]'
              : 'border-[var(--color-paper)] text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]'
          }`}
        >
          תיאום פגישה
        </a>
      </div>
    </motion.nav>
  )
}

/* ═══════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════ */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden noise text-[var(--color-paper)]"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src="/images/render-aerial.jpg"
          alt="G Park Wellness Living"
          className="w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 hero-veil" />
      </motion.div>

      {/* Top-left micro meta */}
      <div className="absolute top-28 right-0 container-editorial flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col gap-3"
        >
          <span className="eyebrow !text-[var(--color-paper)] opacity-70">
            Ramat Ha‑Sharon · 2026
          </span>
          <span className="h-px w-16 bg-[var(--color-paper)] opacity-40" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex items-center gap-4 text-xs tracking-[0.2em] uppercase opacity-70"
        >
          <span>N 32.13°</span>
          <span className="w-4 h-px bg-current" />
          <span>E 34.82°</span>
        </motion.div>
      </div>

      {/* Headline */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center"
      >
        <div className="container-editorial w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="serif-display text-2xl md:text-3xl mb-6 opacity-90"
          >
            — Wellness Living
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl text-balance max-w-[14ch]"
          >
            חיים חכמים יותר.
            <br />
            <span className="opacity-85">חיים בריאים יותר.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-lg md:text-xl font-light opacity-85 leading-relaxed text-pretty"
          >
            קומפלקס מגורים אקסקלוסיבי, קו ראשון לפארק האקולוגי
            של צפון תל אביב — חוויית ריזורט שקטה, בלב העיר.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-wrap items-center gap-8"
          >
            <a href="#contact" className="btn btn-primary-on-dark">
              <span>לתיאום פגישה וקבלת מחירון</span>
              <ArrowLeft size={16} strokeWidth={1.25} />
            </a>
            <a href="#residences" className="btn-quiet">
              <span>קולקציית הדירות</span>
              <span className="rule" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="eyebrow !text-[var(--color-paper)]">גלול</span>
        <span className="h-12 w-px bg-[var(--color-paper)] opacity-40 animate-pulse" />
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   VISION / MANIFESTO
   ═══════════════════════════════════════════════ */
function Vision() {
  return (
    <section id="vision" className="section-rhythm bg-[var(--color-paper)]">
      <div className="container-narrow text-center">
        <Reveal>
          <p className="eyebrow mb-10">— 01 / החזון</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-md mb-14 text-balance">
            <span className="serif-display text-[var(--color-wood)]">The Wellness Living.</span>
            <br />
            קומפלקס של שישה בניינים,
            <br />
            מהלך אחד של שקט.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed text-[var(--color-mist)] text-pretty">
            G Park הוא לא עוד פרויקט מגורים. זו תפיסה הוליסטית של מרחב,
            שבו כל דירה נושמת ספורט, בריאות ורוגע — והקומפלקס כולו מציע
            חוויית ריזורט פרטית, זמינה אך ורק לדייריו.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-28 grid grid-cols-3 gap-10 md:gap-20 border-y border-[var(--color-stone)] py-16">
            {[
              { n: '6', l: 'בניינים' },
              { n: '282', l: 'דונם פארק' },
              { n: '38K', l: '₪ למ״ר' },
            ].map((item) => (
              <div key={item.l} className="text-center">
                <div className="numeric text-5xl md:text-7xl text-[var(--color-sage)] leading-none">
                  {item.n}
                </div>
                <div className="eyebrow mt-4">{item.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   LOCATION
   ═══════════════════════════════════════════════ */
function Location() {
  return (
    <section id="location" className="section-rhythm bg-[var(--color-cream)] overflow-hidden">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5 order-2 lg:order-1">
            <p className="eyebrow mb-6">— 02 / המיקום</p>
            <h2 className="display-md mb-8 text-balance">
              צמוד לפארק של 282 דונם.
              <br />
              <span className="serif-display text-[var(--color-wood)]">בלב הריאה הירוקה</span> של צפון תל אביב.
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--color-mist)] mb-8 text-pretty">
              מיקום אסטרטגי ויוקרתי בנווה גן שברמת השרון — גובל ישירות עם
              רמת אביב ג׳, אפקה, תל ברוך צפון ונווה גן. קו ראשון לריאה
              הירוקה הגדולה ביותר באזור.
            </p>

            <ul className="space-y-5">
              {[
                {
                  t: 'ריאה ירוקה עירונית',
                  d: 'פארק אקולוגי של 282 דונם מתחת לבית — פיתוח אקסטנסיבי, שבילי הליכה וספורט.',
                },
                {
                  t: 'נגישות מקסימלית',
                  d: 'חיבור מהיר לאיילון ולצירי התנועה המרכזיים — נמל ת״א, מרכז ודרום תוך דקות.',
                },
                {
                  t: 'שכונות וותיקות',
                  d: 'בין רמת אביב ג׳, אפקה, תל ברוך צפון ונווה גן — שקט, פרטיות ויוקרה שקטה.',
                },
              ].map((item) => (
                <li key={item.t} className="flex gap-5 border-t border-[var(--color-stone)] pt-5">
                  <Plus size={18} strokeWidth={1} className="text-[var(--color-wood)] shrink-0 mt-1" />
                  <div>
                    <h3 className="text-base font-normal mb-1">{item.t}</h3>
                    <p className="text-sm font-light text-[var(--color-mist)] leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-7 order-1 lg:order-2">
            <div className="image-art aspect-[4/5] lg:aspect-[5/6]">
              <img src="/images/render-aerial.jpg" alt="מיקום G Park על הפארק" />
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-[var(--color-mist)]">
              <span className="eyebrow">Ramat Ha‑Sharon</span>
              <span className="font-light">נווה גן · קו ראשון לפארק</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   WELLNESS CLUB — dark section
   ═══════════════════════════════════════════════ */
function Wellness() {
  const amenities = [
    { icon: ChefHat, title: 'אזור אירוח ומטבחי שף', desc: 'חלל מעוצב לאירוח, סדנאות שף וחוויות קולינריות פרטיות.' },
    { icon: Flower2, title: 'ספא וסאונה', desc: 'חלל מעוצב לרוגע מושלם — ניקוי רעלים, שחרור והתאוששות.' },
    { icon: Leaf, title: 'יוגה ופילאטיס', desc: 'סטודיו מואר וטבעי למדיטציה, יוגה ותנועה מודעת.' },
    { icon: Dumbbell, title: 'חדר כושר מתקדם', desc: 'מאובזר בציוד הקצה — אימוני כוח, קרדיו ופונקציונלי.' },
    { icon: Blocks, title: 'חדר פעילות ילדים', desc: 'חלל בטוח להתפתחות, השראה ומשחק מודרך.' },
    { icon: Users, title: 'מגרשי פאדל', desc: 'מגרשי פאדל מודרניים — משחק מקצועי או חברתי בתוך הבית.' },
    { icon: Laptop, title: 'חדר עבודה שיתופי', desc: 'מרחב co‑working פרודוקטיבי, מעוצב לעבודה מרחוק.' },
    { icon: Handshake, title: 'חדר פגישות', desc: 'חלל פרטי ומאובזר לאירוח פגישות עסקיות בסביבה יוקרתית.' },
  ]

  return (
    <section id="wellness" className="section-dark relative overflow-hidden">
      {/* Ambient image band */}
      <div className="absolute inset-y-0 left-0 w-1/2 opacity-20 pointer-events-none">
        <img src="/images/render-pool.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-forest)] via-[var(--color-forest)]/60 to-transparent" />
      </div>

      <div className="relative container-editorial section-rhythm">
        <div className="grid lg:grid-cols-12 gap-16 mb-28">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-6">— 03 / הלייף‑סטייל</p>
            <h2 className="display-md text-balance">
              <span className="serif-display text-[var(--color-sand)]">Body & Soul.</span>
              <br />
              קלאב של שמונה חללים.
              <br />
              שלכם בלבד.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-lg font-light leading-relaxed opacity-75 text-pretty">
              הקונספט ״שתי הסוויטות״: בכל דירה — מיני חדר כושר, חדר
              מיינדפולנס וחדר רחצה עם נוף. בכל קומפלקס — שמונה חללי
              ווולנס משותפים שזמינים אך ורק לדיירי הפרויקט.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/10 border border-[var(--color-paper)]/10">
          {amenities.map((a, i) => {
            const Icon = a.icon
            return (
              <Reveal key={a.title} delay={i * 0.06}>
                <div className="group bg-[var(--color-forest)] p-10 md:p-12 h-full flex flex-col gap-6 hover:bg-[var(--color-sage)] transition-colors duration-700 min-h-[300px]">
                  <Icon
                    size={36}
                    strokeWidth={1}
                    className="text-[var(--color-sand)] group-hover:text-[var(--color-paper)] transition-colors duration-700"
                  />
                  <h3 className="text-xl font-light">{a.title}</h3>
                  <p className="text-sm font-light opacity-70 leading-relaxed mt-auto">
                    {a.desc}
                  </p>
                  <span className="eyebrow opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                    0{i + 1}
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   INTERIOR VISION — full-bleed
   ═══════════════════════════════════════════════ */
function InteriorVision() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '12%'])

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[560px] overflow-hidden noise text-[var(--color-paper)]">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src="/images/render-interior.png"
          alt="חלל פנים G Park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/30 to-[var(--color-ink)]/60" />
      </motion.div>

      <div className="relative h-full container-editorial flex items-end pb-24 md:pb-32">
        <Reveal className="max-w-3xl">
          <p className="eyebrow !text-[var(--color-paper)] opacity-70 mb-6">
            — Interior Vision
          </p>
          <h2 className="display-lg text-balance">
            שילוב מושלם
            <br />
            <span className="serif-display">של פנים וחוץ.</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg font-light opacity-85 text-pretty">
            חלונות מסך עצומים ומרפסות מרווחות מכניסים את הפארק אל תוך
            המגורים — ויוצרים תחושת מרחב, אור ואינסופיות.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   RESIDENCES — interactive selector
   ═══════════════════════════════════════════════ */
function Residences() {
  const [active, setActive] = useState('tower')

  const data = {
    tower: {
      label: 'The Tower',
      he: 'מגדל המגורים',
      floors: '14 קומות',
      count: '38 דירות',
      image: '/images/render-aerial.jpg',
      blurb:
        'מגדל בוטיק ממותג של 14 קומות ו‑38 דירות, עם לובי של 360 מ״ר בקומת הקרקע, חזית מסחרית שקטה ופנטהאוז מרהיב עם גג של 65 מ״ר.',
      units: [
        { type: '3 חדרים', size: '78 מ״ר + 10 מרפסת' },
        { type: '4 חדרים', size: '106 מ״ר + 12 מרפסת' },
        { type: '5 חדרים', size: '134 מ״ר + 14 מרפסת' },
        { type: 'מיני פנטהאוז', size: '158 מ״ר + 14 מרפסת · קומות 12‑13' },
        { type: 'פנטהאוז יוקרתי', size: '250 מ״ר + 65 מ״ר גג מרוהט · קומה 14' },
      ],
    },
    boutique: {
      label: 'The Boutique',
      he: 'בנייני הבוטיק',
      floors: '6 קומות · 5 בניינים',
      count: '18 דירות לבניין',
      image: '/images/render-front.jpg',
      blurb:
        'חמישה בניינים אינטימיים בני שש קומות בלבד, עם לובי מפואר בכל בניין ודירות נדירות — כולל דירות גן פרטיות עם חצר וגישה לבריכת בוטיק.',
      units: [
        { type: 'דירת גן', size: '82 מ״ר + ~60 מ״ר גינה פרטית' },
        { type: '3 חדרים', size: '78 מ״ר + 10 מרפסת' },
        { type: '4 חדרים', size: '106 מ״ר + 12 מרפסת' },
        { type: '5 חדרים', size: '134 מ״ר + 14 מרפסת' },
        { type: 'פנטהאוז', size: '140 מ״ר + 35 מ״ר מרפסת · קומה 6' },
      ],
    },
  }
  const current = data[active]

  return (
    <section id="residences" className="section-rhythm bg-[var(--color-paper)]">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-6">— 04 / הדירות</p>
            <h2 className="display-md text-balance">
              <span className="serif-display text-[var(--color-wood)]">Choose your living.</span>
              <br />
              שתי דרכים לחיות את G Park.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-base font-light text-[var(--color-mist)] leading-relaxed">
              שני קונספטים משלימים תחת אותה שפה — מגדל מונומנטלי עם נוף פנורמי,
              או קומפלקס בוטיק אינטימי. שניהם חולקים את אותו Social Club.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-14 border-t border-b border-[var(--color-stone)]">
          {Object.entries(data).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`flex-1 py-8 md:py-10 text-start px-8 md:px-10 transition-all duration-500 border-r border-[var(--color-stone)] last:border-r-0 ${
                active === k
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                  : 'hover:bg-[var(--color-cream)]'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <span className={`eyebrow block mb-2 ${active === k ? '!text-[var(--color-sand)]' : ''}`}>
                    {active === k ? '— בחירה נוכחית' : '— לחצו לבחירה'}
                  </span>
                  <h3 className="serif-display text-2xl md:text-3xl">{v.label}</h3>
                  <p className="text-sm font-light opacity-70 mt-1">{v.he}</p>
                </div>
                <div className="text-end hidden md:block">
                  <p className="text-xs opacity-70">{v.floors}</p>
                  <p className="text-xs opacity-70">{v.count}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-12 gap-10 lg:gap-16"
          >
            <div className="lg:col-span-7 image-art aspect-[4/3]">
              <img src={current.image} alt={current.label} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <p className="text-lg font-light leading-relaxed text-[var(--color-mist)] text-pretty mb-8">
                {current.blurb}
              </p>
              <div className="flex-1">
                <p className="eyebrow mb-5">— תמהיל הדירות</p>
                <ul>
                  {current.units.map((u, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-4 border-t border-[var(--color-stone)] py-5 first:border-t-0"
                    >
                      <span className="text-lg font-normal">{u.type}</span>
                      <span className="text-sm font-light text-[var(--color-mist)] text-end">
                        {u.size}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 mt-12">
                <Link
                  to={`/catalog?building=${active}`}
                  className="btn btn-primary"
                >
                  <span>חקרו את הבניין</span>
                  <ArrowLeft size={16} strokeWidth={1.25} />
                </Link>
                <a href="#contact" className="btn btn-ghost on-light">
                  <span>צרו קשר</span>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   VALUE — comparison
   ═══════════════════════════════════════════════ */
function Value() {
  return (
    <section id="value" className="section-dark section-rhythm relative overflow-hidden">
      <div className="container-editorial">
        <div className="max-w-3xl mb-20">
          <Reveal>
            <p className="eyebrow mb-6">— 05 / ההזדמנות</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-md text-balance">
              <span className="serif-display text-[var(--color-sand)]">The Value Proposition.</span>
              <br />
              חיים ליד פארק צפון —
              <br />
              במחיר חכם יותר.
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-paper)]/10 border border-[var(--color-paper)]/10 mb-16">
          <Reveal>
            <div className="bg-[var(--color-forest)] p-10 md:p-16 h-full">
              <p className="eyebrow opacity-60 mb-6">פרויקטים סמוכים</p>
              <div className="numeric text-6xl md:text-8xl text-[var(--color-sand)] opacity-50 line-through decoration-1">
                53,000
              </div>
              <p className="mt-3 text-sm opacity-60">₪ למ״ר · אזור פארק צפון</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="bg-[var(--color-sage)] p-10 md:p-16 h-full">
              <p className="eyebrow !text-[var(--color-sand)] mb-6">G Park Wellness · מחיר השקה</p>
              <div className="numeric text-6xl md:text-8xl text-[var(--color-paper)]">
                38,000
              </div>
              <p className="mt-3 text-sm opacity-80">₪ למ״ר · החל מ־</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-12 border-t border-[var(--color-paper)]/15">
            <div>
              <p className="eyebrow mb-4">חיסכון של עד</p>
              <div className="numeric text-5xl md:text-7xl text-[var(--color-paper)]">
                ₪ 1,000,000
              </div>
              <p className="mt-3 text-sm opacity-70">לדירה, בהשוואה לפרויקטים סמוכים</p>
            </div>
            <div className="max-w-sm text-sm font-light opacity-75 leading-relaxed">
              תנאי תשלום נוחים: 10% בחתימה, היתרה במועד המסירה.
              מחיר השקה לתקופת הפריסייל בלבד, וכל עוד יש מלאי.
            </div>
            <a href="#contact" className="btn btn-primary-on-dark shrink-0">
              <span>שריינו מחיר השקה</span>
              <ArrowLeft size={16} strokeWidth={1.25} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="section-rhythm bg-[var(--color-cream)]">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-12 gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-6">— 06 / צור קשר</p>
            <h2 className="display-md mb-8 text-balance">
              <span className="serif-display text-[var(--color-wood)]">Let's meet.</span>
              <br />
              בואו נכיר אתכם
              <br />
              לדירת החלומות.
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--color-mist)] max-w-md mb-12 text-pretty">
              צוות המכירות שלנו ישמח לקבל אתכם לפגישה אישית במשרד המכירות,
              לסיור פרטי בפרויקט ולהצגת מחירון מלא.
            </p>

            <div className="space-y-6 text-base font-light">
              <div className="flex items-start gap-4 border-t border-[var(--color-stone)] pt-6">
                <MapPin size={20} strokeWidth={1} className="text-[var(--color-wood)] mt-1 shrink-0" />
                <div>
                  <p className="eyebrow mb-1">משרד המכירות</p>
                  <p>המנופים 11, הרצליה</p>
                  <p className="text-sm text-[var(--color-mist)]">מגדלי אקרשטיין · כניסה D</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="שם מלא" required className="input-line" />
              <input type="tel" placeholder="טלפון" required className="input-line" />
              <input type="email" placeholder="אימייל" className="input-line" />
              <select className="input-line appearance-none pb-5 cursor-pointer">
                <option>דירה מועדפת</option>
                <option>דירת גן</option>
                <option>3 חדרים</option>
                <option>4 חדרים</option>
                <option>5 חדרים</option>
                <option>מיני פנטהאוז</option>
                <option>פנטהאוז</option>
              </select>
              <textarea
                placeholder="מסר"
                rows={3}
                className="input-line resize-none"
              />
              <div className="pt-12">
                <button type="submit" className="btn btn-primary w-full md:w-auto">
                  <span>שליחת פרטים</span>
                  <ArrowLeft size={16} strokeWidth={1.25} />
                </button>
              </div>
              <p className="mt-8 text-xs font-light text-[var(--color-mist)] leading-relaxed max-w-lg">
                *ההדמיות, התכנים והתמונות המובאות בדף זה הינן להמחשה בלבד ואין
                מחייבות את החברה. ט.ל.ח.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-paper)] py-20">
      <div className="container-editorial">
        <div className="grid md:grid-cols-3 gap-14 pb-20 border-b border-[var(--color-paper)]/15">
          <div>
            <Logo dark={false} height={56} className="mb-5" />
            <p className="eyebrow opacity-70">Ramat Ha‑Sharon · 2026</p>
          </div>
          <div>
            <p className="eyebrow opacity-60 mb-4">ניווט</p>
            <ul className="space-y-2 text-sm font-light">
              <li><a href="#vision" className="opacity-80 hover:opacity-100">החזון</a></li>
              <li><a href="#location" className="opacity-80 hover:opacity-100">המיקום</a></li>
              <li><a href="#wellness" className="opacity-80 hover:opacity-100">הלייף‑סטייל</a></li>
              <li><a href="#residences" className="opacity-80 hover:opacity-100">הדירות</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100">צור קשר</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow opacity-60 mb-4">יצירת קשר</p>
            <p className="text-sm font-light opacity-80 mb-1">המנופים 11, הרצליה</p>
            <p className="text-sm font-light opacity-80 mb-1">מגדלי אקרשטיין · כניסה D</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs opacity-60 font-light">
          <p>© 2026 G Park Wellness Living. כל הזכויות שמורות.</p>
          <p>הדמיות להמחשה בלבד · ט.ל.ח.</p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════ */
export default function App() {
  useLenis()
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Vision />
        <Location />
        <Wellness />
        <InteriorVision />
        <Residences />
        <Value />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
