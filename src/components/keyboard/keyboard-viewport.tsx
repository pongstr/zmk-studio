import { FC, PropsWithChildren, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils.ts'

type KeyboardViewportType = PropsWithChildren<{
  className?: string
}>

const DEFAULT_SCALE = '1'

export const KeyboardViewport: FC<KeyboardViewportType> = ({
  children,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLInputElement>(null)

  const resetScale = () => {
    if (!targetRef.current || !scaleRef.current) return
    targetRef.current.style.setProperty('transform', `scale(${DEFAULT_SCALE})`)
    scaleRef.current.value = DEFAULT_SCALE
  }

  useEffect(() => {
    if (!targetRef.current) return

    const target = targetRef.current
    const offset = { x: 0, y: 0 }
    let isPanningActive = false

    function panStart(e: KeyboardEvent) {
      if (e.key !== ' ') return
      e.preventDefault()

      target.style.cursor = 'grab'
      isPanningActive = true
    }

    function panEnd(e: KeyboardEvent) {
      if (e.key !== ' ') return
      isPanningActive = false
      target.style.cursor = 'unset'
    }

    function panMove(e: PointerEvent) {
      if (!isPanningActive) return
      offset.x += e.movementX
      offset.y += e.movementY
      target.style.translate = `${offset.x}px ${offset.y}px`
    }

    document.addEventListener('keydown', panStart)
    document.addEventListener('keyup', panEnd)
    target.addEventListener('pointermove', panMove)

    return () => {
      document.removeEventListener('keydown', panStart)
      document.removeEventListener('keyup', panEnd)
      target.removeEventListener('pointermove', panMove)
    }
  }, [])

  useEffect(() => {
    if (!scaleRef.current || !targetRef.current) return

    const input = scaleRef.current
    const target = targetRef.current

    input.value = DEFAULT_SCALE
    target.style.setProperty('transform', `scale(${DEFAULT_SCALE})`)

    function onInputChange(e: Event) {
      const value = (e.currentTarget as HTMLInputElement).value
      target.style.setProperty('transform', `scale(${value})`)
    }

    input.addEventListener('change', onInputChange)

    return () => {
      input.removeEventListener('change', onInputChange)
    }
  }, [])

  return (
    <div className={cn('size-full overflow-hidden p-0 touch-none', className)}>
      <div
        ref={targetRef}
        className="flex size-full origin-center items-center justify-center transition-transform"
      >
        {children}
      </div>

      <div className="absolute bottom-[240px] left-1/2 ml-[-220px] flex w-[440px] flex-col gap-4 rounded-lg bg-muted p-2">
        <input
          type="range"
          name="scale"
          min={0.25}
          max={2}
          step={0.01}
          ref={scaleRef}
          defaultValue={DEFAULT_SCALE}
          className="mx-auto h-1 w-1/2 cursor-pointer appearance-none rounded-lg"
        />
        <button className="block w-60" onClick={resetScale}>
          Reset
        </button>
      </div>
    </div>
  )
}
