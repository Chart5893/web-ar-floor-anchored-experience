
# Architecture Overview

## Design Goals
- Keep AR logic modular and readable
- Minimize coupling to platform-specific SDK behavior
- Clearly separate UI, interaction logic, and world-state handling
- Prioritize stability and predictability in world placement

## High-Level Structure

### components/
Contains ECS components responsible for:
- Input handling (tap, drag)
- State transitions (scan → preview → placed)
- Coordination between UI and AR state

`tap-place.ts` acts as the central coordinator rather than a monolithic script.

---

### ui/
Contains user-facing guidance systems:
- **Pan arrows** to encourage device movement during SLAM warmup
- **Instruction overlay** to communicate placement state and next actions

These systems are decoupled from AR placement logic and can be reused or replaced.

---

### utils/
Reusable, platform-agnostic logic:
- **Floor locking** – captures and preserves the first valid floor height
- **Transform locking** – freezes position, rotation, and scale post-placement
- **Material handling** – safely clones materials for transparent previews
- **Debug cube** – replaces proprietary assets with a simple geometry

---

## Placement Flow
1. AR session initializes and begins environment scanning
2. User pans device to establish tracking
3. First tap spawns a preview object above detected floor
4. Preview can be dragged for adjustment
5. Second tap confirms placement
6. Object is re-parented, transforms locked, and preview state removed

This flow ensures a predictable and user-friendly AR experience.
