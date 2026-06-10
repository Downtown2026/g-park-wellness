import { useEffect } from 'react'
import Lenis from 'lenis'
import './site.css'

import Nav from './components/site/Nav.jsx'
import Hero from './components/site/Hero.jsx'
import Positioning from './components/site/Positioning.jsx'
import Wellness from './components/site/Wellness.jsx'
import ApartmentFinder from './components/site/ApartmentFinder.jsx'
import Architecture from './components/site/Architecture.jsx'
import BuildingForm from './components/site/BuildingForm.jsx'
import Location from './components/site/Location.jsx'
import Gallery from './components/site/Gallery.jsx'
import Contact from './components/site/Contact.jsx'
import StickyCTA from './components/site/StickyCTA.jsx'
import Footer from './components/site/Footer.jsx'

/**
 * G Park · Wellness Living — homepage shell.
 *
 * Loads Lenis for buttery smooth scroll, mounts the new editorial section
 * order, respects prefers-reduced-motion. The /catalog route is mounted
 * by main.jsx and bypasses this shell entirely.
 */
export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="site">
      <Nav />

      <main>
        <Hero />
        <Positioning />
        <Wellness />
        <ApartmentFinder />
        <Architecture />
        <BuildingForm />
        <Location />
        <Gallery />
        <Contact />
      </main>

      <Footer />
      <StickyCTA />
    </div>
  )
}
