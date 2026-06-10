import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { APARTMENTS, BUILDINGS } from '../../data/apartments.js'
import { FLOORS } from '../../data/floors.js'

/**
 * Off-canvas directory listing every apartment, grouped by building.
 *
 * Mobile entry-point: hamburger in the catalog topbar.
 * Desktop entry-point: "כל הדירות בבניין" button.
 *
 * Selecting an apartment closes the drawer and opens the inspector for it.
 */
export default function BuildingDirectory({
  open,
  onClose,
  building,
  onSelectBuilding,
  onSelectApartment,
}) {
  // Map every apartment code → index of the LOWEST floor it appears on.
  // FLOORS is exported in low→high order, so the first match per code is the
  // ground-most occurrence. Codes missing from every plate (none today)
  // would fall to the bottom.
  const floorRankByCode = useMemo(() => {
    const rank = new Map()
    FLOORS.forEach((floor, floorIdx) => {
      floor.apartments.forEach((a) => {
        if (!rank.has(a.code)) rank.set(a.code, floorIdx)
      })
    })
    return rank
  }, [])

  // Group apartments by building. An apartment can appear in multiple
  // buildings (e.g. type "A") — we list it under each building it serves.
  // Within each group, sort by lowest-floor rank so the reading order is
  // ground → penthouse (Hebrew "start low, ascend").
  const grouped = useMemo(() => {
    const order = ['tower', 'boutique-w', 'boutique-n']
    const FALLBACK = Number.MAX_SAFE_INTEGER
    return order.map((bid) => ({
      id: bid,
      label: BUILDINGS[bid]?.he ?? bid,
      apartments: APARTMENTS
        .filter((a) => a.buildings.includes(bid))
        .slice()
        .sort((x, y) => {
          const rx = floorRankByCode.get(x.code) ?? FALLBACK
          const ry = floorRankByCode.get(y.code) ?? FALLBACK
          if (rx !== ry) return rx - ry
          // Tie-breaker: smaller built area first within the same floor.
          return (x.builtSqm ?? 0) - (y.builtSqm ?? 0)
        }),
    }))
  }, [floorRankByCode])

  // When a building filter is active, only show that building's section.
  const visibleGroups = building
    ? grouped.filter((g) => g.id === building)
    : grouped

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="dir-backdrop"
            type="button"
            aria-label="סגירת התפריט"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="catalog-directory-backdrop"
          />

          <motion.aside
            key="dir-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="catalog-directory"
            aria-label="כל הדירות במתחם"
          >
            <header className="catalog-directory-head">
              <div>
                <p className="eyebrow mb-1">— G PARK</p>
                <h2 className="display-sm">כל הדירות בבניין</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="סגירה"
                className="catalog-icon-btn"
              >
                <X size={20} strokeWidth={1.25} />
              </button>
            </header>

            {/* Building filter chips */}
            <div className="catalog-directory-filters" role="tablist" aria-label="סינון לפי בניין">
              <FilterChip
                active={building === null}
                onClick={() => onSelectBuilding(null)}
              >
                הצג הכל
              </FilterChip>
              {Object.values(BUILDINGS).map((b) => (
                <FilterChip
                  key={b.id}
                  active={building === b.id}
                  onClick={() => onSelectBuilding(b.id)}
                >
                  {b.he}
                </FilterChip>
              ))}
            </div>

            {/* Grouped apartment list */}
            <div className="catalog-directory-body">
              {visibleGroups.map((g) => {
                const meta = BUILDINGS[g.id]
                return (
                  <section key={g.id} className="catalog-directory-group">
                    <header className="catalog-directory-group-head">
                      <p className="eyebrow">— בניין</p>
                      <h3 className="catalog-directory-group-title">{g.label}</h3>
                      <p className="catalog-directory-group-floors">
                        {meta?.floorsLabel}
                      </p>
                      {meta?.description && (
                        <p className="catalog-directory-group-desc">
                          {meta.description}
                        </p>
                      )}
                      <span className="catalog-directory-count">
                        {g.apartments.length} דירות
                      </span>
                    </header>

                    <ul className="catalog-directory-list">
                      {g.apartments.map((a) => (
                        <li key={`${g.id}-${a.code}`}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectApartment(a.code)
                              onClose()
                            }}
                            className="catalog-directory-item"
                          >
                            <span className="catalog-directory-code">{a.code}</span>
                            <span className="catalog-directory-info">
                              <span className="catalog-directory-title">{a.title}</span>
                              <span className="catalog-directory-meta">
                                {a.rooms} חדרים · {a.builtSqm} מ״ר · {a.outdoorKind} {a.outdoorSqm} מ״ר
                              </span>
                              {a.description && (
                                <span className="catalog-directory-desc">
                                  {a.description}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`catalog-directory-chip ${active ? 'is-active' : ''}`}
    >
      {children}
    </button>
  )
}
