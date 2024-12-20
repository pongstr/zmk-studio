import {
  BehaviorBinding,
  Keymap,
  SetLayerBindingResponse,
} from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { produce } from 'immer'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useEditHistory } from '@/components/providers/edit-history/useEditHistory.ts'
import { useConnectedDeviceData } from '@/components/providers/rpc-connect/useConnectedDeviceData.ts'
import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import { useBehaviors } from '@/hooks/useBehaviors.ts'
import { useLayouts } from '@/hooks/useLayout.ts'

import { BehaviorBindingPicker } from '../behaviors/BehaviorBindingPicker'
import { call_rpc } from '../lib/logging.ts'
import { useLocalStorageState } from '../misc/useLocalStorageState'
import { Keymap as KeymapComp } from './Keymap'
import { LayerPicker } from './LayerPicker'
import { LayoutZoom } from './PhysicalLayout'
import { PhysicalLayoutPicker } from './PhysicalLayoutPicker'

function deserializeLayoutZoom(value: string): LayoutZoom {
  return value === 'auto' ? 'auto' : parseFloat(value) || 'auto'
}

export default function Keyboard() {
  // TODO: maybe add to keyboard provider
  const [layouts, _setLayouts, selectedPhysicalLayoutIndex] = useLayouts()

  console.log(layouts)

  // TODO: potentially add to keyboard provider
  const [keymap, setKeymap] = useConnectedDeviceData<Keymap>(
    { keymap: { getKeymap: true } },
    (keymap) => {
      console.log('Got the keymap!')
      return keymap?.keymap?.getKeymap
    },
    true,
  )

  const [keymapScale, setKeymapScale] = useLocalStorageState<LayoutZoom>(
    'keymapScale',
    'auto',
    {
      deserialize: deserializeLayoutZoom,
    },
  )

  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0)
  const [selectedKeyPosition, setSelectedKeyPosition] = useState<
    number | undefined
  >(undefined)
  const behaviors = useBehaviors()

  const { conn } = useConnectionContext()
  const { doIt: undoRedo } = useEditHistory()

  useEffect(() => {
    setSelectedLayerIndex(0)
    setSelectedKeyPosition(undefined)
  }, [conn])

  useEffect(() => {
    async function performSetRequest() {
      if (!conn || !layouts) {
        return
      }

      const resp = await call_rpc(conn, {
        keymap: { setActivePhysicalLayout: selectedPhysicalLayoutIndex },
      })

      const new_keymap = resp?.keymap?.setActivePhysicalLayout?.ok
      if (new_keymap) {
        setKeymap(new_keymap)
      } else {
        console.error(
          'Failed to set the active physical layout err:',
          resp?.keymap?.setActivePhysicalLayout?.err,
        )
      }
    }

    performSetRequest().then(console.info).catch(console.error)
  }, [conn, layouts, selectedPhysicalLayoutIndex, setKeymap])

  const doUpdateBinding = useCallback(
    (binding: BehaviorBinding) => {
      if (!keymap || selectedKeyPosition === undefined) {
        console.error(
          "Can't update binding without a selected key position and loaded keymap",
        )
        return
      }

      const layer = selectedLayerIndex
      const layerId = keymap.layers[layer].id
      const keyPosition = selectedKeyPosition
      const oldBinding = keymap.layers[layer].bindings[keyPosition]
      undoRedo?.(async () => {
        if (!conn) {
          throw new Error('Not connected')
        }

        const resp = await call_rpc(conn, {
          keymap: { setLayerBinding: { layerId, keyPosition, binding } },
        })

        if (
          resp.keymap?.setLayerBinding ===
          SetLayerBindingResponse.SET_LAYER_BINDING_RESP_OK
        ) {
          setKeymap(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            produce((draft: any) => {
              draft.layers[layer].bindings[keyPosition] = binding
            }),
          )
        } else {
          console.error('Failed to set binding', resp.keymap?.setLayerBinding)
        }

        return async () => {
          if (!conn) {
            return
          }

          const resp = await call_rpc(conn, {
            keymap: {
              setLayerBinding: { layerId, keyPosition, binding: oldBinding },
            },
          })
          if (
            resp.keymap?.setLayerBinding ===
            SetLayerBindingResponse.SET_LAYER_BINDING_RESP_OK
          ) {
            setKeymap(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              produce((draft: any) => {
                draft.layers[layer].bindings[keyPosition] = oldBinding
              }),
            )
          }
        }
      })
    },
    [
      keymap,
      selectedKeyPosition,
      selectedLayerIndex,
      undoRedo,
      conn,
      setKeymap,
    ],
  )

  const selectedBinding = useMemo(() => {
    if (
      keymap == null ||
      selectedKeyPosition == null ||
      !keymap.layers[selectedLayerIndex]
    ) {
      return null
    }

    return keymap.layers[selectedLayerIndex].bindings[selectedKeyPosition]
  }, [keymap, selectedLayerIndex, selectedKeyPosition])

  useEffect(() => {
    if (!keymap?.layers) return

    const layers = keymap.layers.length - 1

    if (selectedLayerIndex > layers) {
      setSelectedLayerIndex(layers)
    }
  }, [keymap, selectedLayerIndex])

  return (
    <div className="grid min-h-0 min-w-0 max-w-full grid-cols-[auto_1fr] grid-rows-[1fr_minmax(10em,auto)] bg-base-300">
      <div className="row-span-2 flex flex-col gap-2 bg-base-200 p-2">
        <div className="col-start-3 row-start-1 row-end-2">
          {Boolean(layouts.length) && <PhysicalLayoutPicker />}
        </div>

        {keymap && (
          <div className="col-start-1 row-start-1 row-end-2">
            <LayerPicker
              keymap={keymap}
              setKeymap={setKeymap}
              selectedLayerIndex={selectedLayerIndex}
              setSelectedLayerIndex={setSelectedLayerIndex}
            />
          </div>
        )}
      </div>

      {Boolean(layouts.length) && keymap && behaviors && (
        <div className="relative col-start-2 row-start-1 grid min-w-0 items-center justify-center p-2">
          <KeymapComp
            keymap={keymap}
            layout={layouts[selectedPhysicalLayoutIndex]}
            behaviors={behaviors}
            scale={keymapScale}
            selectedLayerIndex={selectedLayerIndex}
            selectedKeyPosition={selectedKeyPosition}
            onKeyPositionClicked={setSelectedKeyPosition}
          />
          <select
            className="absolute right-2 top-2 h-8 rounded px-2"
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
        </div>
      )}
      {keymap && selectedBinding && (
        <div className="col-start-2 row-start-2 bg-base-200 p-2">
          <BehaviorBindingPicker
            binding={selectedBinding}
            behaviors={Object.values(behaviors)}
            layers={keymap.layers.map(({ id, name }, li) => ({
              id,
              name: name || li.toLocaleString(),
            }))}
            onBindingChanged={doUpdateBinding}
          />
        </div>
      )}
    </div>
  )
}
