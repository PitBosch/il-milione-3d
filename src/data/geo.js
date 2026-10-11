// Proiezione equirettangolare della porzione di mondo percorsa dai Polo.
// 1 unità di scena = 1 grado di longitudine; la latitudine è leggermente allungata
// per avvicinare le proporzioni a quelle di una carta nautica.
export const EXTENT = { lonMin: -10, lonMax: 140, latMin: -12, latMax: 58 }
export const LON0 = (EXTENT.lonMin + EXTENT.lonMax) / 2
export const LAT0 = (EXTENT.latMin + EXTENT.latMax) / 2
export const LAT_K = 1.15
export const MAP_W = EXTENT.lonMax - EXTENT.lonMin
export const MAP_H = (EXTENT.latMax - EXTENT.latMin) * LAT_K
export const HEIGHT_SCALE = 1.6

export function project(lon, lat) {
  return [lon - LON0, -(lat - LAT0) * LAT_K]
}

export function unproject(x, z) {
  return [x + LON0, -z / LAT_K + LAT0]
}
