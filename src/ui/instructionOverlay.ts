/**
 * CUSTOM UI: On-screen instruction pill.
 * Purpose: communicate scan → place → adjust → confirm → inspect flow.
 */
export type InstructionMode = 'scanning' | 'ready' | 'placed' | 'hidden'

let instructionEl: HTMLDivElement | null = null
let instructionMode: InstructionMode = 'hidden'

export function ensureInstructionEl(): HTMLDivElement {
  if (instructionEl && document.body.contains(instructionEl)) return instructionEl

  const el = document.createElement('div')
  el.id = 'tap-place-instruction'
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.7)',
    color: '#ffffff',
    borderRadius: '999px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '14px',
    zIndex: '9999',
    pointerEvents: 'none',
    textAlign: 'center',
    maxWidth: '90vw',
    opacity: '1',
    transition: 'opacity 0.3s ease',
  } as CSSStyleDeclaration)

  document.body.appendChild(el)
  instructionEl = el
  return el
}

export function setInstruction(mode: InstructionMode, text: string): void {
  if (instructionMode === mode && instructionEl && instructionEl.innerText === text) return
  instructionMode = mode

  const el = ensureInstructionEl()
  el.innerText = text

  el.style.opacity = mode === 'hidden' || !text ? '0' : '1'
}
