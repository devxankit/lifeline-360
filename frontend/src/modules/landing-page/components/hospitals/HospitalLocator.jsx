import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import FloatingField from '@/components/forms/FloatingField'
import SelectField from '@/components/forms/SelectField'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import {
  cities,
  cityCentre,
  citiesInState,
  DEFAULT_LOCATION,
  hospitals,
  isSampleDirectory,
  PMJAY_HOSPITAL_SEARCH_URL,
  states,
} from '../../data/hospitals'
import { distanceKm } from '../../utils/geo'
import BookingDialog from './BookingDialog'
import HospitalCard from './HospitalCard'
import HospitalMap from './HospitalMap'

const ALL_CITIES = 'all'

const STATE_OPTIONS = states.map((state) => ({ value: state, label: state }))

const GEO_MESSAGES = {
  locating: 'Finding your location…',
  granted: 'Showing the nearest hospitals to you. Your location stays on this device.',
  denied: 'Location access was declined, so distances are measured from the city centre.',
  unavailable:
    'We couldn’t get your location, so distances are measured from the city centre.',
  unsupported:
    'This browser can’t share your location, so distances are measured from the city centre.',
}

/**
 * Ayushman Bharat PM-JAY hospital locator: filter private empanelled hospitals
 * by state, city and speciality, see straight-line distance from you (or the
 * city centre) and the contact number, and book an ambulance or request blood
 * for that hospital without leaving the page.
 */
export default function HospitalLocator() {
  const prefersReducedMotion = useReducedMotion()
  const [stateName, setStateName] = useState(DEFAULT_LOCATION.state)
  const [city, setCity] = useState(DEFAULT_LOCATION.city)
  const [query, setQuery] = useState('')
  const [userCoords, setUserCoords] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle')
  const [activeId, setActiveId] = useState(null)
  const [view, setView] = useState('list')
  const [booking, setBooking] = useState(null)

  const cityOptions = useMemo(
    () => [
      { value: ALL_CITIES, label: 'All cities' },
      ...citiesInState(stateName).map((name) => ({ value: name, label: name })),
    ],
    [stateName]
  )

  const origin = useMemo(() => {
    if (userCoords) return { coords: userCoords, label: 'you' }
    const centre = city === ALL_CITIES ? null : cityCentre(city)
    return centre ? { coords: centre, label: `${city} centre` } : null
  }, [userCoords, city])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return hospitals
      .filter((hospital) => hospital.state === stateName)
      .filter((hospital) => city === ALL_CITIES || hospital.city === city)
      .filter(
        (hospital) =>
          !needle ||
          [hospital.name, hospital.area, hospital.city, ...hospital.specialities].some(
            (value) => value.toLowerCase().includes(needle)
          )
      )
      .map((hospital) => ({
        ...hospital,
        distance: origin ? distanceKm(origin.coords, hospital.coords) : null,
      }))
      .sort((a, b) => (origin ? a.distance - b.distance : a.name.localeCompare(b.name)))
  }, [stateName, city, query, origin])

  // Highlight the nearest result until the visitor points at another one.
  const highlightedId = results.some((hospital) => hospital.id === activeId)
    ? activeId
    : results[0]?.id
  const highlighted = results.find((hospital) => hospital.id === highlightedId)

  const changeState = (event) => {
    const next = event.target.value
    setStateName(next)
    setCity(citiesInState(next)[0] ?? ALL_CITIES)
  }

  const locateMe = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('unsupported')
      return
    }

    setGeoStatus('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = [coords.latitude, coords.longitude]
        const nearest = [...cities].sort(
          (a, b) => distanceKm(here, a.centre) - distanceKm(here, b.centre)
        )[0]
        setUserCoords(here)
        setStateName(nearest.state)
        setCity(nearest.city)
        setGeoStatus('granted')
      },
      (error) =>
        setGeoStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { timeout: 10000, maximumAge: 300000 }
    )
  }

  const clearLocation = () => {
    setUserCoords(null)
    setGeoStatus('idle')
  }

  // Clicking a pin brings its card into view in the list.
  const selectFromMap = (id) => {
    setActiveId(id)
    document.getElementById(`hospital-${id}`)?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const placeLabel = city === ALL_CITIES ? stateName : city

  return (
    <div className="overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-ink-200/70">
      <form
        role="search"
        aria-label="Find hospitals that accept the Ayushman card"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-3 border-b border-ink-100 bg-ink-50/70 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_1fr_1.35fr_auto]"
      >
        <SelectField
          name="pmjay-state"
          label="State"
          options={STATE_OPTIONS}
          value={stateName}
          onChange={changeState}
        />
        <SelectField
          name="pmjay-city"
          label="City"
          options={cityOptions}
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <FloatingField
          name="pmjay-query"
          type="search"
          label="Hospital name or speciality"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:col-span-2 lg:col-span-1"
        />
        <button
          type="button"
          onClick={locateMe}
          disabled={geoStatus === 'locating'}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 font-semibold whitespace-nowrap text-white shadow-glow transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-80 sm:col-span-2 lg:col-span-1"
        >
          <Icon
            name={geoStatus === 'locating' ? 'spinner' : 'locate'}
            size={19}
            className={geoStatus === 'locating' ? 'animate-spin' : undefined}
          />
          Near me
        </button>
      </form>

      <div aria-live="polite">
        {geoStatus !== 'idle' ? (
          <p
            className={cn(
              'flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-5 py-3 text-sm sm:px-6',
              geoStatus === 'granted'
                ? 'border-aqua-100 bg-aqua-50 text-aqua-800'
                : 'border-ink-100 bg-white text-ink-600'
            )}
          >
            <Icon name={geoStatus === 'granted' ? 'locate' : 'info'} size={16} />
            {GEO_MESSAGES[geoStatus]}
            {userCoords ? (
              <button
                type="button"
                onClick={clearLocation}
                className="font-semibold underline underline-offset-2 hover:no-underline"
              >
                Use city centre instead
              </button>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div
          className={cn('p-4 sm:p-6 lg:col-span-7', view === 'map' && 'hidden lg:block')}
        >
          <ResultsHeader
            count={results.length}
            placeLabel={placeLabel}
            sortedByDistance={Boolean(origin)}
            view={view}
            onViewChange={setView}
          />

          {results.length ? (
            <ul className="mt-4 flex flex-col gap-4">
              {results.map((hospital, index) => (
                <motion.li
                  key={`${hospital.id}-${stateName}-${city}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                >
                  <HospitalCard
                    hospital={hospital}
                    originLabel={origin?.label}
                    active={hospital.id === highlightedId}
                    onActivate={setActiveId}
                    onBook={(kind, chosen) => setBooking({ kind, hospital: chosen })}
                  />
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-3xl bg-ink-50 px-6 py-12 text-center ring-1 ring-ink-100 ring-inset">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-400 shadow-card">
                <Icon name="search" size={22} />
              </span>
              <p className="font-display text-lg font-bold text-ink-900">
                No hospitals match “{query.trim()}” in {placeLabel}
              </p>
              <p className="max-w-sm text-sm text-ink-500">
                Try another speciality, choose “All cities”, or clear the search.
              </p>
              <Button size="sm" variant="outline" onClick={() => setQuery('')}>
                Clear search
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            'border-t border-ink-100 p-4 sm:p-6 lg:col-span-5 lg:border-t-0 lg:border-l',
            view === 'list' && 'hidden lg:block'
          )}
        >
          <div className="mb-4 lg:hidden">
            <ResultsHeader
              count={results.length}
              placeLabel={placeLabel}
              sortedByDistance={Boolean(origin)}
              view={view}
              onViewChange={setView}
            />
          </div>

          <div className="lg:sticky lg:top-24">
            <HospitalMap
              results={results}
              origin={origin}
              activeId={highlightedId}
              onHover={setActiveId}
              onSelect={selectFromMap}
            />

            {/* On phones the map replaces the list, so show the chosen
                hospital beneath it. */}
            {highlighted ? (
              <div className="mt-4 lg:hidden">
                <HospitalCard
                  hospital={highlighted}
                  originLabel={origin?.label}
                  active
                  anchor={false}
                  onActivate={setActiveId}
                  onBook={(kind, chosen) => setBooking({ kind, hospital: chosen })}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-ink-100 bg-ink-50/70 px-5 py-4 text-xs leading-relaxed text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-start gap-2">
          <Icon name="info" size={15} className="mt-px shrink-0 text-brand-600" />
          <span>
            {isSampleDirectory
              ? 'Sample listings for preview. The live directory will use the official list of PM-JAY empanelled hospitals. '
              : ''}
            Always confirm eligibility with the hospital’s Ayushman help desk. Lifeline
            360 is not affiliated with the National Health Authority.
          </span>
        </p>
        <a
          href={PMJAY_HOSPITAL_SEARCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
        >
          Check on the official PM-JAY portal
          <Icon name="arrowUpRight" size={14} />
        </a>
      </div>

      <BookingDialog booking={booking} onClose={() => setBooking(null)} />
    </div>
  )
}

function ResultsHeader({ count, placeLabel, sortedByDistance, view, onViewChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-display text-lg font-bold text-ink-900">
          {count} {count === 1 ? 'hospital' : 'hospitals'} in {placeLabel}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <Icon name="arrowUpDown" size={14} />
          {sortedByDistance ? 'Nearest first' : 'Sorted A–Z'}
        </p>
      </div>

      <div
        role="group"
        aria-label="Show results as"
        className="flex rounded-full bg-ink-100 p-1 lg:hidden"
      >
        {[
          { id: 'list', label: 'List', icon: 'list' },
          { id: 'map', label: 'Map', icon: 'map' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={view === option.id}
            onClick={() => onViewChange(option.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
              view === option.id ? 'bg-white text-brand-700 shadow-card' : 'text-ink-500'
            )}
          >
            <Icon name={option.icon} size={15} />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
