/**
 * CUSTOM UTILS: Transform freezing.
 * Purpose: once placed, keep object transform stable even if plane tracking updates.
 */
export function lockTransform(obj: any) {
  return {
    position: obj?.position?.clone?.() ?? null,
    quaternion: obj?.quaternion?.clone?.() ?? null,
    scale: obj?.scale?.clone?.() ?? null,
  }
}

export function applyLockedTransform(obj: any, locked: { position: any; quaternion: any; scale: any }) {
  if (!obj || !locked) return
  if (locked.position) obj.position.copy(locked.position)
  if (locked.quaternion) obj.quaternion.copy(locked.quaternion)
  if (locked.scale) obj.scale.copy(locked.scale)
}
