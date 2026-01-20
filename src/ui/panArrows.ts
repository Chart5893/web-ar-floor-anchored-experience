/**
 * CUSTOM UI: Pan-arrow chevrons shown during scanning / SLAM warmup.
 * Purpose: guide user to move phone so tracking can stabilize.
 */
let arrowContainer: HTMLDivElement | null = null

export function ensurePanArrows(): HTMLDivElement {
  if (arrowContainer && document.body.contains(arrowContainer)) return arrowContainer

  const container = document.createElement('div')
  container.id = 'pan-arrows'
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
    pointerEvents: 'none',
    opacity: '1',
    transition: 'opacity 0.4s ease',
  } as CSSStyleDeclaration)

  // CUSTOM: inline SVG chevrons for cleaner UI
  container.innerHTML = `
    <svg class="pan-arrow pan-arrow-left" width="32" height="32" viewBox="0 0 24 24">
      <polyline points="15 6 9 12 15 18" />
    </svg>
    <svg class="pan-arrow pan-arrow-right" width="32" height="32" viewBox="0 0 24 24">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  `

  document.body.appendChild(container)
  arrowContainer = container

  // CUSTOM: inject styles + animation once
  if (!document.getElementById('panArrowsStyles')) {
    const style = document.createElement('style')
    style.id = 'panArrowsStyles'
    style.innerHTML = `
      .pan-arrow { stroke: #ffffff; stroke-width: 2.2; fill: none; opacity: 0.7; }
      .pan-arrow-left  { animation: panLeft  1.3s ease-in-out infinite alternate; }
      .pan-arrow-right { animation: panRight 1.3s ease-in-out infinite alternate; }
      @keyframes panLeft  { 0% { transform: translateX(0px);  opacity: 0.4; } 100% { transform: translateX(-12px); opacity: 1; } }
      @keyframes panRight { 0% { transform: translateX(0px);  opacity: 0.4; } 100% { transform: translateX(12px);  opacity: 1; } }
    `
    document.head.appendChild(style)
  }

  return container
}

export function showPanArrows(): void {
  const el = ensurePanArrows()
  el.style.opacity = '1'
}

export function hidePanArrows(): void {
  if (!arrowContainer) return
  arrowContainer.style.opacity = '0'
}
