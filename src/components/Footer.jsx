import { MapPin, Mail } from 'lucide-react'
import { Link } from 'react-scroll'

const links = [
  { label: 'הפרויקט', to: 'about' },
  { label: 'חווית הריזורט', to: 'wellness' },
  { label: 'הדירות', to: 'apartments' },
  { label: 'המחיר', to: 'pricing' },
  { label: 'צור קשר', to: 'contact' },
]

export default function Footer() {
  return (
    <footer className="bg-olive">
      <div className="h-px bg-white/5" />
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/images/logo.png"
              alt="G Park Wellness Living"
              className="h-10 brightness-0 invert mb-5"
            />
            <p className="font-body text-[12px] font-[200] text-white/40 leading-[1.8]">
              חיים בריאים יותר. חיים חכמים יותר.
              <br />חוויית Wellness Resort בתוך העיר.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[10px] font-[300] tracking-[0.3em] uppercase text-copper/50 mb-5">
              משרד מכירות
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={13} strokeWidth={1.5} className="text-copper/50 mt-0.5 flex-shrink-0" />
                <span className="font-body text-[12px] font-[200] text-white/50 leading-[1.6]">
                  המנופים 11, הרצליה<br />מגדלי אקרשטיין כניסה D
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={13} strokeWidth={1.5} className="text-copper/50 flex-shrink-0" />
                <span className="font-body text-[12px] font-[200] text-white/50">office@g-group1.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-body text-[10px] font-[300] tracking-[0.3em] uppercase text-copper/50 mb-5">
              ניווט מהיר
            </p>
            <div className="space-y-2.5">
              {links.map((link) => (
                <Link key={link.to} to={link.to} smooth duration={800} offset={-80}
                  className="block font-body text-[12px] font-[200] text-white/50 hover:text-copper transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-[10px] font-[200] text-white/30">
            G Park Wellness Living. כל הזכויות שמורות.
          </p>
          <p className="font-body text-[9px] font-[200] text-white/20 max-w-lg text-center md:text-start">
            ההדמיות להמחשה בלבד. ט.ל.ח. המידע באתר אינו מהווה הצעה או התחייבות.
          </p>
        </div>
      </div>
    </footer>
  )
}
