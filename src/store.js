import { useSyncExternalStore } from 'react'

// Piccolo store condiviso fra la scena 3D (che aggiorna il viaggio a ogni frame)
// e l'interfaccia (che si ridisegna solo quando qualcosa cambia davvero).
let state = { progress: 0, year: 1271, mode: 'sea', moving: false, arrivedAt: 'venezia' }
const listeners = new Set()

export const travelStore = {
  get: () => state,
  set(patch) {
    let changed = false
    for (const k in patch) {
      if (k === 'progress') {
        if (Math.abs(patch.progress - state.progress) > 0.0015) changed = true
      } else if (patch[k] !== state[k]) changed = true
    }
    if (!changed) return
    state = { ...state, ...patch }
    listeners.forEach((l) => l())
  },
  subscribe(l) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useTravel() {
  return useSyncExternalStore(travelStore.subscribe, travelStore.get)
}

// posizione istantanea del viaggio (frazione 0..1 della rotta), letta a ogni frame dalla scena
export const live = { u: 0 }
