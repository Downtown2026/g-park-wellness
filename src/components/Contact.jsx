import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, ArrowLeft, MapPin, Check } from 'lucide-react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [submitted, setSubmitted] = useState(false)

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
    }),
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contact" ref={ref} className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        
        {/* Header - Centered */}
        <motion.div
          custom={0} variants={fadeUp}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-body text-[11px] font-[300] tracking-[0.35em] uppercase text-copper mb-5">
            Contact Us
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-[300] text-charcoal leading-[1.2] mb-3">
            השאירו פרטים ונחזור אליכם
          </h2>
          <div className="divider-luxury-center mt-6" />
        </motion.div>

        {/* Content Block */}
        <div className="max-w-[800px] mx-auto">
          <motion.div
            custom={1} variants={fadeUp}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="bg-white card-luxury p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Form Info */}
              <div className="order-2 md:order-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-[400] text-charcoal mb-4">
                    פגישת היכרות
                  </h3>
                  <p className="font-body text-[14px] font-[300] text-charcoal-light leading-[1.8] mb-8">
                    מלאו את הפרטים ואחד מנציגי המכירות שלנו ייצור עמכם קשר בהקדם לתיאום פגישת היכרות עם הפרויקט.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin size={20} strokeWidth={1.5} className="text-copper mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-body text-[11px] font-[500] tracking-[0.1em] text-charcoal mb-1">משרד מכירות</p>
                      <p className="font-body text-[13px] font-[300] text-charcoal-light leading-[1.6]">
                        המנופים 11, הרצליה<br />מגדלי אקרשטיין כניסה D
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="order-1 md:order-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center h-full py-10"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-20 h-20 rounded-full bg-copper/10 flex items-center justify-center mb-6"
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                      >
                        <Check size={32} strokeWidth={2} className="text-copper" />
                      </motion.div>
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="font-heading text-2xl font-[400] text-charcoal mb-2"
                    >
                      תודה רבה!
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="font-body text-[14px] font-[300] text-charcoal-light text-center"
                    >
                      הפרטים נשלחו בהצלחה.<br/>נציג מכירות ייצור עמכם קשר.
                    </motion.p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Floating Label Input - Name */}
                    <div className="relative">
                      <input 
                        type="text" 
                        id="contact-name" 
                        placeholder=" " 
                        required 
                        className="peer input-clean bg-cream px-4 py-4 rounded-lg border border-charcoal/10 w-full focus:outline-none focus:border-copper transition-all duration-300 pt-6 text-right" 
                      />
                      <label 
                        htmlFor="contact-name" 
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-[14px] text-charcoal-light/70 pointer-events-none transition-all duration-300 peer-focus:text-xs peer-focus:top-3 peer-focus:text-copper peer-focus:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-copper"
                      >
                        שם מלא
                      </label>
                    </div>

                    {/* Floating Label Input - Phone */}
                    <div className="relative">
                      <input 
                        type="tel" 
                        id="contact-phone" 
                        placeholder=" " 
                        required 
                        className="peer input-clean bg-cream px-4 py-4 rounded-lg border border-charcoal/10 w-full focus:outline-none focus:border-copper transition-all duration-300 pt-6 text-right" 
                      />
                      <label 
                        htmlFor="contact-phone" 
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-[14px] text-charcoal-light/70 pointer-events-none transition-all duration-300 peer-focus:text-xs peer-focus:top-3 peer-focus:text-copper peer-focus:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-copper"
                      >
                        טלפון
                      </label>
                    </div>

                    {/* Floating Label Input - Email */}
                    <div className="relative">
                      <input 
                        type="email" 
                        id="contact-email" 
                        placeholder=" " 
                        className="peer input-clean bg-cream px-4 py-4 rounded-lg border border-charcoal/10 w-full focus:outline-none focus:border-copper transition-all duration-300 pt-6 text-right" 
                      />
                      <label 
                        htmlFor="contact-email" 
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-[14px] text-charcoal-light/70 pointer-events-none transition-all duration-300 peer-focus:text-xs peer-focus:top-3 peer-focus:text-copper peer-focus:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-copper"
                      >
                        אימייל
                      </label>
                    </div>

                    {/* Submit Button - 48px height */}
                    <div className="pt-4">
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn-accent-luxury w-full flex items-center justify-center gap-3 h-12 shadow-lg rounded-lg font-body text-[15px] font-[500] tracking-[0.05em]"
                      >
                        <span>שלחו פרטים</span>
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowLeft size={18} strokeWidth={1.5} />
                        </motion.span>
                      </motion.button>
                    </div>

                    <p className="font-body text-[11px] font-[300] text-charcoal-light/50 text-center leading-relaxed">
                      בלחיצה על "שלחו פרטים" אני מסכים/ה לקבלת מידע שיווקי
                    </p>
                  </form>
                )}
              </div>
              
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}