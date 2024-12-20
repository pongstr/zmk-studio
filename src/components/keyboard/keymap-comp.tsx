import { FC, useMemo, useState } from 'react'

import { useKeyboardContext } from '@/components/providers/keyboard/use-keyboard-context.ts'
import { useBehaviors } from '@/hooks/useBehaviors.ts'
import { useLayouts } from '@/hooks/useLayout.ts'
import { HidUsageLabel } from '@/keyboard/HidUsageLabel.tsx'

export const KeymapComp: FC = () => {
  const [layouts] = useLayouts()
  const behaviors = useBehaviors()
  const { keymap } = useKeyboardContext()
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0)

  const positions = useMemo(
    () =>
      layout.keys.map((k, i) => {
        if (i >= keymap.layers[selectedLayerIndex].bindings.length) {
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
            behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]
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
              hid_usage={keymap.layers[selectedLayerIndex].bindings[i].param1}
            />
          ),
        }
      }),

    [layouts, selectedLayerIndex],
  )

  return <div>Keymap Comp</div>
}
