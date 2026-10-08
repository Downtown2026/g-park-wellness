import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'

/**
 * Visit — closing CTA. Editorial centered block, two actions: book a
 * private tour (primary) and call the sales line (secondary).
 */
export default function Visit() {
  return (
    <section className="visit" id="visit" aria-label="תיאום ביקור">
      <div className="visit-shell">
        <motion.span
          className="eyebrow visit-eyebrow"
          style={{ display: 'inline-flex', justifyContent: 'center' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          — תיאום ביקור פרטי
        </motion.span>

        <motion.h2
          className="visit-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          הצעד הבא <em>שלכם.</em>
        </motion.h2>

        <motion.p
          className="visit-body"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          משרד המכירות פתוח לסיורים פרטיים בתיאום מראש. נשמח להציג לכם את
          התוכניות, המעטפת, וחוויית הוולנס המלאה.
        </motion.p>

        <motion.div
          className="visit-actions"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <a href="#contact" className="btn btn-primary">
            <span>תיאום פגישה</span>
            <ArrowLeft size={16} strokeWidth={1.5} />
          </a>
          <a href="mailto:sales@g-park.life" className="btn btn-ghost" dir="ltr">
            <Mail size={16} strokeWidth={1.5} />
            <span>sales@g-park.life</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
