/**
 * CUSTOM: Replace proprietary GLB with a programmatic cube mesh for showcasing.
 * This keeps placement + anchoring logic intact without using external assets.
 */
export function attachCubeMesh(THREE: any, obj: any) {
  if (!THREE || !obj) return
  
  if (obj.userData?.__cubeAttached) return
obj.userData = obj.userData || {}
obj.userData.__cubeAttached = true


  // Remove existing children (often where the GLB is attached)
  while (obj.children && obj.children.length) {
    obj.remove(obj.children[0])
  }

  
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.1,
    roughness: 0.7,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.5, 0) // lift so it sits on the floor (1m cube)
  obj.add(cube)
}
