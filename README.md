# web-ar-floor-anchored-experience# Web-Based Augmented Reality Floor-Anchored Experience

## Overview
This repository is a **code showcase** for a mobile WebAR prototype originally built
using the 8th Wall platform and WebXR concepts.

The project demonstrates real-world surface detection, floor-anchored object placement,
and interaction workflows in a mobile browser environment. This public repository focuses
on **application logic, architecture, and engineering decisions**, rather than providing
a fully runnable application.

## Key Features
- Two-phase placement workflow (preview → confirm)
- Real-world floor detection with height locking
- Drag-to-adjust placement interaction
- Transform freezing to reduce post-placement drift
- User guidance via on-screen instructions and pan-arrow UI
- Asset-agnostic rendering using a programmatic cube mesh

## Technologies & Concepts
- TypeScript / JavaScript (ES6+)
- WebXR concepts
- 8th Wall AR platform (logic only; SDK excluded)
- Three.js
- Entity-Component-System (ECS) architecture

## Architecture
The system is organized into modular components to separate concerns:

- **components/** – high-level ECS coordination and input handling
- **ui/** – user guidance overlays and spatial UX helpers
- **utils/** – reusable logic for floor locking, transform freezing, and material handling

Additional details are documented in:
- `docs/architecture.md`
- `docs/constraints.md`

## Assets
The original prototype used a client-owned 3D model.  
For this public showcase, all proprietary assets have been removed and replaced with
a **programmatic cube mesh** to demonstrate placement, anchoring, and interaction logic
without using external or licensed content.

## Demo
A short demonstration video is available in the `demo/` directory and shows:
- Environment scanning
- Preview placement
- Drag-to-adjust interaction
- Final placement confirmation
- Post-placement stability during movement

## Notes
This repository intentionally excludes:
- Licensed SDK files
- Account-specific configuration
- Proprietary or client-owned assets

It is intended as a **code and architecture showcase** rather than a standalone build.
