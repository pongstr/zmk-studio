import { FC, useState } from 'react'

import { KeyboardViewport } from '@/components/keyboard/keyboard-viewport.tsx'
import { useKeyboardContext } from '@/components/providers/keyboard/use-keyboard-context.ts'
import { useBehaviors } from '@/hooks/useBehaviors.ts'
import { useLayouts } from '@/hooks/useLayout.ts'
import { Keymap as KeymapComp } from '@/keyboard/Keymap.tsx'
import { LayerPicker } from '@/keyboard/LayerPicker.tsx'
import { LayoutZoom } from '@/keyboard/PhysicalLayout.tsx'
import { PhysicalLayoutPicker } from '@/keyboard/PhysicalLayoutPicker.tsx'
import { useLocalStorageState } from '@/misc/useLocalStorageState.ts'

function deserializeLayoutZoom(value: string): LayoutZoom {
  return value === 'auto' ? 'auto' : parseFloat(value) || 'auto'
}

export const Keyboard: FC = () => {
  const behaviors = useBehaviors()
  const [layouts, _setLayouts, selectedPhysicalLayoutIndex] = useLayouts()

  const { keymap, setKeymap } = useKeyboardContext()

  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0)
  const [selectedKeyPosition, setSelectedKeyPosition] = useState<
    number | undefined
  >(undefined)

  const [keymapScale, setKeymapScale] = useLocalStorageState<LayoutZoom>(
    'keymapScale',
    'auto',
    {
      deserialize: deserializeLayoutZoom,
    },
  )
  return (
    <div className="relative size-full">
      <div className="absolute bottom-8 left-1/2 z-50 ml-[-25%] flex w-6/12 items-center justify-between rounded-lg border bg-background">
        <PhysicalLayoutPicker />
        <LayerPicker
          keymap={keymap}
          setKeymap={setKeymap}
          selectedLayerIndex={selectedLayerIndex}
          setSelectedLayerIndex={setSelectedLayerIndex}
        />
      </div>

      {Boolean(layouts.length) && keymap && behaviors ? (
        <>
          <select
            className="absolute right-2 top-2 z-50 h-8 rounded px-2"
            value={keymapScale}
            onChange={(e) => {
              const value = deserializeLayoutZoom(e.target.value)
              setKeymapScale(value)
            }}
          >
            <option value="auto">Auto</option>
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
            <option value={1.25}>125%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
          </select>

          <KeyboardViewport className="absolute left-0 top-0 z-0">
            <KeymapComp
              keymap={keymap}
              layout={layouts[selectedPhysicalLayoutIndex]}
              behaviors={behaviors}
              scale={keymapScale}
              selectedLayerIndex={selectedLayerIndex}
              selectedKeyPosition={selectedKeyPosition}
              onKeyPositionClicked={setSelectedKeyPosition}
            />
          </KeyboardViewport>
        </>
      ) : (
        <div className="relative left-0 top-0 flex size-full items-center justify-center">
          <div>Woops</div>
        </div>
      )}
    </div>
  )
}
