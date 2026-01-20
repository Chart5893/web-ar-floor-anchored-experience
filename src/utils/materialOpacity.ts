/**
 * CUSTOM UTILS: Preview transparency via material cloning.
 * Purpose: avoid mutating shared materials and safely make preview semi-transparent.
 */
export function makePreviewTransparent(object3D: any, opacity: number = 0.4): void {
  if (!object3D) return

  object3D.traverse((node: any) => {
    if (!node?.isMesh || !node.material) return

    if (Array.isArray(node.material)) {
      node.material = node.material.map((mat: any) => {
        const clone = mat.clone()
        clone.transparent = true
        clone.opacity = opacity
        clone.needsUpdate = true
        return clone
      })
    } else {
      const clone = node.material.clone()
      clone.transparent = true
      clone.opacity = opacity
      clone.needsUpdate = true
      node.material = clone
    }
  })
}

export function makeOpaque(object3D: any): void {
  if (!object3D) return

  object3D.traverse((node: any) => {
    if (!node?.isMesh || !node.material) return

    if (Array.isArray(node.material)) {
      node.material.forEach((mat: any) => {
        mat.transparent = false
        mat.opacity = 1.0
        mat.needsUpdate = true
      })
    } else {
      node.material.transparent = false
      node.material.opacity = 1.0
      node.material.needsUpdate = true
    }
  })
}
