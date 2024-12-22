import { CSSProperties, FC, FormEvent, useMemo, useState } from 'react'

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

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
    setScale(Number(e.currentTarget.value))
  }

  const onSliderEnd = (e: FormEvent<HTMLInputElement>) => {
    setScale(Number(e.currentTarget.value))
  }

  if (!positions.length) {
    return <div>Loading</div>
  }

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
        className="relative flex size-full items-center justify-center"
        style={{
          height: bottomMost * oneU + 'px',
          width: rightMost * oneU + 'px',
          transform: `scale(${scale})`,
        }}
      >
        {positions.map((p, idx) => (
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
          min={0.75}
          max={2}
          step={0.1}
          value={scale}
          onChange={onChange}
          onMouseUp={onSliderEnd}
        />
      </div>
    </>
  )
}
