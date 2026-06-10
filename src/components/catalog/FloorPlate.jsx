import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { apartmentByCode } from '../../data/apartments.js'

/**
 * Renders the floor-plate image with an SVG hotspot overlay.
 * Hotspot rectangles come from src/data/floors.js — normalized 0..1.
 *
 * The SVG uses preserveAspectRatio="none" so each <rect> in 0..1 space
 * stretches to match the rendered <img> regardless of its size.
 */
export default function FloorPlate({ floor, selectedCode, onSelect, buildingFilter }) {
  // Stable index map so we know which hotspot is currently active even when
  // multiple instances of the same code appear on a plate.
  const hotspots = useMemo(
    () =>
      floor.apartments.map((a, idx) => ({
        ...a,
        idx,
        apt: apartmentByCode(a.code),
        polygon: a.polygon,
      })),
    [floor]
  )

  return (
    <motion.div
      key={floor.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-[var(--color-cream)] border border-[var(--color-stone)]"
    >
      <img
        src={floor.plate}
        alt={floor.label}
        className="block w-full h-auto select-none"
        draggable={false}
        loading="lazy"
        decoding="async"
      />

      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-label={`מפת דירות בקומה ${floor.label}`}
      >
        {hotspots.map((h) => {
          if (!h.apt) return null
          const isActive = selectedCode === h.code
          const dimmed =
            buildingFilter &&
            !h.apt.buildings.includes(buildingFilter)
          const className = `hotspot ${isActive ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`
          const onActivate = () => onSelect(h.code)
          const handleKey = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(h.code)
            }
          }
          // Polygon hotspot — preferred when shape is irregular.
          if (Array.isArray(h.polygon) && h.polygon.length >= 3) {
            const pointsStr = h.polygon.map(([x, y]) => `${x},${y}`).join(' ')
            return (
              <polygon
                key={`${h.code}-${h.idx}`}
                points={pointsStr}
                className={className}
                tabIndex={0}
                role="button"
                aria-label={h.apt.title}
                aria-pressed={isActive}
                onClick={onActivate}
                onKeyDown={handleKey}
              >
                <title>{h.apt.title}</title>
              </polygon>
            )
          }
          // Rectangle fallback.
          if (!h.rect) return null
          return (
            <rect
              key={`${h.code}-${h.idx}`}
              x={h.rect.x}
              y={h.rect.y}
              width={h.rect.w}
              height={h.rect.h}
              className={className}
              tabIndex={0}
              role="button"
              aria-label={h.apt.title}
              aria-pressed={isActive}
              onClick={onActivate}
              onKeyDown={handleKey}
            >
              <title>{h.apt.title}</title>
            </rect>
          )
        })}
      </svg>
    </motion.div>
  )
}
