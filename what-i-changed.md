# Template Customization Notes

This project began from an 8th Wall ECS tap-to-place template.
The following changes were implemented to adapt it for real-world use
and to improve stability, clarity, and user experience.

## Major Changes

### Two-Phase Placement
- First tap creates a preview
- Second tap confirms placement
- Prevents accidental placement and improves user control

---

### Floor Height Locking
- The first valid floor hit is captured and reused
- Prevents vertical jitter caused by tracking updates
- Ensures consistent object grounding

---

### Transform Freezing
- After placement, position, rotation, and scale are locked
- Object is re-parented to the scene root
- Reduces drift caused by plane transform changes

---

### Preview Transparency
- Preview objects use cloned materials
- Avoids mutating shared materials
- Clearly communicates preview vs placed state

---

### User Guidance UI
- Pan-arrow indicators during scanning
- Instruction overlay for placement steps
- Improves usability and reduces confusion

---

### Asset Replacement
- Proprietary GLB assets removed
- Replaced with a programmatic cube mesh
- Keeps repository public, clean, and license-safe
