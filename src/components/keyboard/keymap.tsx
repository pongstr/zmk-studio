import {
  CSSProperties,
  FC,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useKeyboardContext } from '@/components/providers/keyboard/use-keyboard-context.ts'
import { useBehaviors } from '@/hooks/useBehaviors.ts'
import { useLayouts } from '@/hooks/useLayout.ts'
import { HidUsageLabel } from '@/keyboard/HidUsageLabel.tsx'
import { Key } from '@/keyboard/Key.tsx'

interface PhysicalLayoutPositionLocation {
  x: number
  y: number
  r?: number
  rx?: number
  ry?: number
}

function scalePosition(
  { x, y, r, rx, ry }: PhysicalLayoutPositionLocation,
  oneU: number,
): CSSProperties {
  const left = x * oneU
  const top = y * oneU
  let transformOrigin = undefined
  let transform = undefined

  if (r) {
    const transformX = ((rx || x) - x) * oneU
    const transformY = ((ry || y) - y) * oneU
    transformOrigin = `${transformX}px ${transformY}px`
    transform = `rotate(${r}deg)`
  }

  return {
    top,
    left,
    transformOrigin,
    transform,
  }
}

export const Keymap: FC = () => {
  const oneU = 48
  const [layouts, _, selectedPhysicalLayoutIndex] = useLayouts()
  const behaviors = useBehaviors()
  const { keymap, currentLayer } = useKeyboardContext()

  const [scale, setScale] = useState(1)
  const [selectedKeyPosition, setSelectedKeyPosition] = useState<
    number | undefined
  >(undefined)

  const positions = useMemo(() => {
    if (!keymap.layers.length || !layouts[selectedPhysicalLayoutIndex])
      return []
    const bindings = keymap.layers[currentLayer].bindings

    return layouts[selectedPhysicalLayoutIndex].keys.map((k, i) => {
      if (i >= bindings.length) {
        return {
          header: 'Unknown',
          x: k.x / 100.0,
          y: k.y / 100.0,
          width: k.width / 100,
          height: k.height / 100.0,
          children: <span></span>,
        }
      }
      return {
        header:
          behaviors[keymap.layers[currentLayer].bindings[i].behaviorId]
            ?.displayName || 'Unknown',
        x: k.x / 100.0,
        y: k.y / 100.0,
        width: k.width / 100,
        height: k.height / 100.0,
        r: (k.r || 0) / 100.0,
        rx: (k.rx || 0) / 100.0,
        ry: (k.ry || 0) / 100.0,
        children: (
          <HidUsageLabel
            hid_usage={keymap.layers[currentLayer].bindings[i].param1}
          />
        ),
      }
    })
  }, [keymap, currentLayer, behaviors, selectedPhysicalLayoutIndex])

  const inputRef = useRef<HTMLInputElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inputRef.current || !scaleRef.current) return

    const input = inputRef.current
    const target = scaleRef.current

    function onInputChange(e: Event) {
      const value = (e.currentTarget as HTMLInputElement).value
      target.style.setProperty('transform', `scale(${value})`)
    }

    input.addEventListener('change', onInputChange)

    return () => {
      input.removeEventListener('change', onInputChange)
    }
  }, [])

  // TODO: Add a bit of padding for rotation when supported
  const rightMost = positions
    .map((k) => k.x + k.width)
    .reduce((a, b) => Math.max(a, b), 0)

  const bottomMost = positions
    .map((k) => k.y + k.height)
    .reduce((a, b) => Math.max(a, b), 0)

  return (
    <>
      <div
        ref={scaleRef}
        className="relative flex size-full items-center justify-center"
        style={{
          height: bottomMost * oneU + 'px',
          width: rightMost * oneU + 'px',
        }}
      >
        {positions.length > 0 &&
          positions.map((p, idx) => (
            <div
              key={idx}
              onClick={() =>
                setSelectedKeyPosition((prev: number | undefined) =>
                  prev !== idx ? idx : undefined,
                )
              }
              className="absolute leading-[0] data-[zoomer=true]:hover:z-[1000]"
              data-zoomer={true}
              style={scalePosition(p, oneU)}
            >
              <Key
                hoverZoom={true}
                oneU={oneU}
                selected={idx === selectedKeyPosition}
                {...p}
              />
            </div>
          ))}
      </div>

      {/* eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value */}
      <div className="absolute bottom-[240px] left-[50%] ml-[-220px] w-[440px]">
        <input
          type="range"
          name="scale"
          min={0.75}
          max={2}
          step={0.02}
          ref={inputRef}
        />
      </div>
    </>
  )
}
