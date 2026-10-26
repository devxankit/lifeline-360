const EARTH_RADIUS_KM = 6371

const toRadians = (degrees) => (degrees * Math.PI) / 180

/**
 * Straight-line distance between two [latitude, longitude] points in km
 * (haversine). Road distance is longer; the locator says "away", not "drive".
 */
export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/** 0.84 → "840 m", 3.27 → "3.3 km", 142.6 → "143 km". */
export function formatDistance(km) {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`
  if (km < 20) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

/**
 * Projects [latitude, longitude] points into a width × height box, padded so
 * pins never touch the edge. Longitude is scaled by cos(latitude) so a
 * city's layout keeps its real proportions.
 *
 * @returns {(coords: [number, number]) => {x: number, y: number}}
 */
export function createProjection(points, width, height, padding = 0.14) {
  const lats = points.map(([lat]) => lat)
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const squash = Math.cos(toRadians(midLat))
  const xs = points.map(([, lng]) => lng * squash)
  const ys = lats

  const spanX = Math.max(Math.max(...xs) - Math.min(...xs), 0.01)
  const spanY = Math.max(Math.max(...ys) - Math.min(...ys), 0.01)
  const usableW = width * (1 - padding * 2)
  const usableH = height * (1 - padding * 2)
  const scale = Math.min(usableW / spanX, usableH / spanY)
  const offsetX = (width - spanX * scale) / 2
  const offsetY = (height - spanY * scale) / 2
  const minX = Math.min(...xs)
  const maxY = Math.max(...ys)

  return ([lat, lng]) => ({
    x: offsetX + (lng * squash - minX) * scale,
    y: offsetY + (maxY - lat) * scale,
  })
}
