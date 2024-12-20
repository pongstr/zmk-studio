import { FC, useState } from 'react'

import { KeyboardViewport } from '@/components/keyboard/keyboard-viewport.tsx'
import { KeymapComp } from '@/components/keyboard/keymap-comp.tsx'
import { useKeyboardContext } from '@/components/providers/keyboard/use-keyboard-context.ts'
import { useBehaviors } from '@/hooks/useBehaviors.ts'
import { useLayouts } from '@/hooks/useLayout.ts'
import { LayerPicker } from '@/keyboard/LayerPicker.tsx'
import { PhysicalLayoutPicker } from '@/keyboard/PhysicalLayoutPicker.tsx'

export const Keyboard: FC = () => {
  const behaviors = useBehaviors()
  const [layouts] = useLayouts()
  const { keymap, setKeymap } = useKeyboardContext()

  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0)

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
          <KeyboardViewport className="absolute left-0 top-0 z-0">
            <KeymapComp />
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
