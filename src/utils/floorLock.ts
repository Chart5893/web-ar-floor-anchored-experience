/**
 * CUSTOM UTILS: Floor sampling & locking.
 * Purpose: take the first valid floor hit and keep it stable to reduce drift.
 */
export function isGoodFloorHit(hitY: number, cameraY: number): boolean {
  const dy = cameraY - hitY
  return dy > 0.05 && dy < 5.0
}

export function createFloorLock() {
  let floorY: number | null = null

  return {
    setFromHit(hitY: number) {
      if (floorY === null) floorY = hitY
    },
    get(fallbackY: number = 0) {
      return floorY != null ? floorY : fallbackY
    },
    isLocked() {
      return floorY !== null
    },
  }
}
