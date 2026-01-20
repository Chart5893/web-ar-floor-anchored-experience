# Platform Constraints & Mitigations

## Hardware Constraints
- Mobile GPUs with limited performance budgets
- Battery drain during prolonged AR sessions
- Sensor noise affecting tracking accuracy

### Mitigations
- Lightweight geometry and materials
- Minimal per-frame computation
- Transform freezing after placement

---

## Software Constraints
- Browser-based AR limitations
- Platform-specific SDK abstractions
- Variability across mobile devices and browsers

### Mitigations
- Avoid reliance on internal SDK behavior
- Abstract logic into reusable utilities
- Favor deterministic placement logic over continuous updates

---

## Tracking & Stability Constraints
- Plane updates can cause subtle object drift
- Continuous anchoring updates may introduce jitter

### Mitigations
- Floor height locked from the first valid hit
- Object re-parented to scene root after placement
- Position, rotation, and scale frozen post-placement

These choices prioritize stability over continuous adjustment once placement is confirmed.
