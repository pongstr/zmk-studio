import { FC, PropsWithChildren, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils.ts'

type KeyboardViewportType = PropsWithChildren<{
  className?: string
}>

export const KeyboardViewport: FC<KeyboardViewportType> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const target = ref.current
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

  return (
    <div className={cn('size-full overflow-hidden p-0 touch-none', className)}>
      <div
        ref={ref}
        className="flex size-full origin-center items-center justify-center transition-transform"
      >
        {children}
      </div>
    </div>
  )
}
