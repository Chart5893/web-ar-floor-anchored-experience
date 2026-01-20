import * as ecs from '@8thwall/ecs'
import { showPanArrows, hidePanArrows } from '../ui/panArrows'
import { setInstruction } from '../ui/instructionOverlay'
import { createFloorLock, isGoodFloorHit } from '../utils/floorLock'
import { makePreviewTransparent, makeOpaque } from '../utils/materialOpacity'
import { lockTransform, applyLockedTransform } from '../utils/transformLock'
import { attachCubeMesh } from '../utils/debugCube'

/**
 * Based on an 8th Wall ECS tap-to-place template.
 * Customizations by Christian Hart:
 * - Two-phase placement (preview on first tap, confirm on second tap)
 * - Floor locking / transform freezing to reduce drift after placement
 * - Pan-arrow + instruction UI overlays (scan → place → inspect)
 * - Preview transparency + material cloning
 * - Scale/rotation normalization and quaternion syncing
 */

ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    prefabToSpawn: ecs.eid,
    hoverHeight: ecs.f32,
    previewDistance: ecs.f32,      // template compatibility
    minPlacementDelaySec: ecs.f32, // CUSTOM: SLAM warmup delay
  },
  schemaDefaults: {
    hoverHeight: 0.05,
    previewDistance: 2.0,
    minPlacementDelaySec: 6.0,
  },
  data: {},
  stateMachine: ({ world, eid, schemaAttribute }) => {
    const toCooldown = ecs.defineTrigger()
    const { THREE } = (window as any)

    // CUSTOM: model transform overrides (scale/orientation normalization)
    const TARGET_SCALE = 0.7
    const ROT_X_RAD = 0
    const ROT_Z_RAD = 0

    // CUSTOM: floor sampling/locking to stabilize placement
    const floorLock = createFloorLock()

    let previewEid: bigint | null = null
    let previewMaterialReady = false
    let hasPlaced = false
    let hasPreview = false

    // CUSTOM: transform freezing fields
    let placedObject: any | null = null
    let lockedTransform: { position: any; quaternion: any; scale: any } | null = null

    const sessionStart = performance.now()
    let placedMessageStart: number | null = null

    ecs.defineState('default')
      .initial()
      .onTick(() => {
        const { minPlacementDelaySec } = schemaAttribute.get(eid)
        const elapsed = (performance.now() - sessionStart) / 1000.0

        // CUSTOM: instruction + arrows state machine
        if (!hasPlaced) {
          if (elapsed < minPlacementDelaySec) {
            showPanArrows()
            setInstruction('scanning', 'Move your phone to scan the floor')
          } else {
            hidePanArrows()
            setInstruction('ready', !hasPreview ? 'Tap the floor to place the welder' : 'Drag to adjust, then tap again to place')
          }
        } else {
          if (!placedMessageStart) {
            hidePanArrows()
            placedMessageStart = performance.now()
            setInstruction('placed', 'Walk around to inspect the welder')
          } else if ((performance.now() - placedMessageStart) / 1000.0 > 4) {
            setInstruction('hidden', '')
          }
        }

        // CUSTOM: preview transparency (material cloning)
        if (!hasPlaced && previewEid) {
          const previewObj = world.three.entityToObject.get(previewEid)
          if (previewObj && !previewMaterialReady) {
            makePreviewTransparent(previewObj, 0.4)
            previewMaterialReady = true
          }
        }

        // CUSTOM: hard-lock transform post-placement
        if (hasPlaced && placedObject && lockedTransform) {
          applyLockedTransform(placedObject, lockedTransform)
        }
      })

      // CUSTOM: two-phase placement flow (preview first tap → confirm second tap)
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        const { prefabToSpawn, minPlacementDelaySec, hoverHeight } = schemaAttribute.get(eid)
        if (!prefabToSpawn) return

        // CUSTOM: SLAM warmup delay before accepting taps
        const elapsed = (performance.now() - sessionStart) / 1000.0
        if (elapsed < minPlacementDelaySec || hasPlaced) return

        const { worldPosition } = e.data as any
        const activeCamera = world.three.activeCamera
        const camPos = new THREE.Vector3()
        activeCamera?.getWorldPosition?.(camPos)

        // FIRST TAP: create preview
        if (!hasPreview || previewEid == null) {
          if (!worldPosition) return

          // CUSTOM: validate & lock initial floor sample
          if (!floorLock.isLocked()) {
            if (!isGoodFloorHit(worldPosition.y, camPos.y)) return
            floorLock.setFromHit(worldPosition.y)
          }

          const previewInstance = world.createEntity(prefabToSpawn)
          previewEid = previewInstance
          hasPreview = true

          ecs.Position.set(world, previewEid, {
            x: worldPosition.x,
            y: floorLock.get(worldPosition.y) + hoverHeight,
            z: worldPosition.z,
          })

          // CUSTOM: apply scale + rotation normalization; sync ECS quaternion
          ecs.Scale.set(world, previewEid, { x: TARGET_SCALE, y: TARGET_SCALE, z: TARGET_SCALE })

          const obj = world.three.entityToObject.get(previewEid)
          if (obj) {
            // Custom: showcase uses cube mesh instead of proprietary GLB
            attachCubeMesh(THREE, obj)

            // Apply scale and rotation normalization
            obj.scale.set(TARGET_SCALE, TARGET_SCALE, TARGET_SCALE)
            const euler = new THREE.Euler(ROT_X_RAD, 0, ROT_Z_RAD, 'XYZ')
            obj.setRotationFromEuler(euler)

            // Sync Ecs quaterniobn after rotation
            const q = obj.quaternion
            ecs.Quaternion.set(world, previewEid, { x: q.x, y: q.y, z: q.z, w: q.w })
          }

          return
        }

        // SECOND TAP: confirm placement at preview position
        if (hasPreview && previewEid != null) {
          const previewPos = ecs.Position.get(world, previewEid)
          ecs.Position.set(world, previewEid, {
            x: previewPos?.x ?? 0,
            y: floorLock.get(),
            z: previewPos?.z ?? 0,
          })

          const finalObj = world.three.entityToObject.get(previewEid)
          if (finalObj) {
            // CUSTOM: re-parent to scene root to avoid inheriting plane transform updates
            world.three.scene?.attach?.(finalObj)
            attachCubeMesh(THREE, finalObj)

            // CUSTOM: re-apply scale + rotation and lock transform
            finalObj.scale.set(TARGET_SCALE, TARGET_SCALE, TARGET_SCALE)
            const euler = new THREE.Euler(ROT_X_RAD, 0, ROT_Z_RAD, 'XYZ')
            finalObj.setRotationFromEuler(euler)

            lockedTransform = lockTransform(finalObj)
            placedObject = finalObj

            // Sync quaternion after rotation
            const q = finalObj.quaternion
            ecs.Quaternion.set(world, previewEid, { x: q.x, y: q.y, z: q.z, w: q.w })

            // CUSTOM: make opaque after final placement
            makeOpaque(finalObj)
          }

          hasPlaced = true
          hasPreview = false
          previewMaterialReady = false
          previewEid = null
          toCooldown.trigger()
        }
      })

      // Drag: move preview around on the locked floor
      .listen(eid, ecs.input.SCREEN_TOUCH_MOVE, (e) => {
        if (!hasPreview || hasPlaced || !previewEid) return
        const { worldPosition } = e.data as any
        if (!worldPosition) return

        const { hoverHeight } = schemaAttribute.get(eid)
        ecs.Position.set(world, previewEid, {
          x: worldPosition.x,
          y: floorLock.get(worldPosition.y) + hoverHeight,
          z: worldPosition.z,
        })
      })

      .onTrigger(toCooldown, 'cooldown')

    ecs.defineState('cooldown').wait(500, 'default')
  },
})
