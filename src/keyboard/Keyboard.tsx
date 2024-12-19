import {
  BehaviorBinding,
  Keymap,
  Layer,
  SetLayerBindingResponse,
  SetLayerPropsResponse,
} from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { produce } from 'immer'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useBehaviors } from '@/components/keyboard/useBehaviors.ts'
import { useLayouts } from '@/components/keyboard/useLayout.ts'
import { useEditHistory } from '@/components/providers/edit-history/useEditHistory.ts'
import { ConnectionContext } from '@/components/providers/rpc-connect/ConnectionContext.tsx'
import { useConnectedDeviceData } from '@/components/providers/rpc-connect/useConnectedDeviceData.ts'

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
  const [
    layouts,
    _setLayouts,
    selectedPhysicalLayoutIndex,
    setSelectedPhysicalLayoutIndex,
  ] = useLayouts()
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

  const { conn } = useContext(ConnectionContext)
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

  const doSelectPhysicalLayout = useCallback(
    (i: number) => {
      const oldLayout = selectedPhysicalLayoutIndex
      undoRedo?.(async () => {
        setSelectedPhysicalLayoutIndex(i)

        return async () => {
          setSelectedPhysicalLayoutIndex(oldLayout)
        }
      })
    },
    [selectedPhysicalLayoutIndex, undoRedo, setSelectedPhysicalLayoutIndex],
  )

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

  const moveLayer = useCallback(
    (start: number, end: number) => {
      const doMove = async (startIndex: number, destIndex: number) => {
        if (!conn) {
          return
        }

        const resp = await call_rpc(conn, {
          keymap: { moveLayer: { startIndex, destIndex } },
        })

        if (resp.keymap?.moveLayer?.ok) {
          setKeymap(resp.keymap?.moveLayer?.ok)
          setSelectedLayerIndex(destIndex)
        } else {
          console.error('Error moving', resp)
        }
      }

      undoRedo?.(async () => {
        await doMove(start, end)
        return () => doMove(end, start)
      })
    },
    [conn, setKeymap, undoRedo],
  )

  const addLayer = useCallback(() => {
    async function doAdd(): Promise<number> {
      console.log(conn, keymap)

      if (!conn || !keymap) {
        throw new Error('Not connected')
      }

      const resp = await call_rpc(conn, { keymap: { addLayer: {} } })

      console.log(resp)

      if (resp.keymap?.addLayer?.ok) {
        const newSelection = keymap.layers.length
        setKeymap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          produce((draft: any) => {
            draft.layers.push(resp.keymap!.addLayer!.ok!.layer)
            draft.availableLayers--
          }),
        )

        setSelectedLayerIndex(newSelection)

        return resp.keymap.addLayer.ok.index
      } else {
        console.error('Add error', resp.keymap?.addLayer?.err)
        throw new Error('Failed to add layer:' + resp.keymap?.addLayer?.err)
      }
    }

    async function doRemove(layerIndex: number) {
      if (!conn) {
        throw new Error('Not connected')
      }

      const resp = await call_rpc(conn, {
        keymap: { removeLayer: { layerIndex } },
      })

      console.log(resp)
      if (resp.keymap?.removeLayer?.ok) {
        setKeymap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          produce((draft: any) => {
            draft.layers.splice(layerIndex, 1)
            draft.availableLayers++
          }),
        )
      } else {
        console.error('Remove error', resp.keymap?.removeLayer?.err)
        throw new Error(
          'Failed to remove layer:' + resp.keymap?.removeLayer?.err,
        )
      }
    }

    undoRedo?.(async () => {
      const index = await doAdd()
      return () => doRemove(index)
    })
  }, [undoRedo, conn, keymap, setKeymap])

  const removeLayer = useCallback(() => {
    async function doRemove(layerIndex: number): Promise<void> {
      if (!conn || !keymap) {
        throw new Error('Not connected')
      }

      const resp = await call_rpc(conn, {
        keymap: { removeLayer: { layerIndex } },
      })

      if (resp.keymap?.removeLayer?.ok) {
        if (layerIndex == keymap.layers.length - 1) {
          setSelectedLayerIndex(layerIndex - 1)
        }
        setKeymap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          produce((draft: any) => {
            draft.layers.splice(layerIndex, 1)
            draft.availableLayers++
          }),
        )
      } else {
        console.error('Remove error', resp.keymap?.removeLayer?.err)
        throw new Error(
          'Failed to remove layer:' + resp.keymap?.removeLayer?.err,
        )
      }
    }

    async function doRestore(layerId: number, atIndex: number) {
      if (!conn) {
        throw new Error('Not connected')
      }

      const resp = await call_rpc(conn, {
        keymap: { restoreLayer: { layerId, atIndex } },
      })

      console.log(resp)
      if (resp.keymap?.restoreLayer?.ok) {
        setKeymap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          produce((draft: any) => {
            draft.layers.splice(atIndex, 0, resp!.keymap!.restoreLayer!.ok)
            draft.availableLayers--
          }),
        )
        setSelectedLayerIndex(atIndex)
      } else {
        console.error('Remove error', resp.keymap?.restoreLayer?.err)
        throw new Error(
          'Failed to restore layer:' + resp.keymap?.restoreLayer?.err,
        )
      }
    }

    if (!keymap) {
      throw new Error('No keymap loaded')
    }

    const index = selectedLayerIndex
    const layerId = keymap.layers[index].id
    undoRedo?.(async () => {
      await doRemove(index)
      return () => doRestore(layerId, index)
    })
  }, [keymap, selectedLayerIndex, undoRedo, conn, setKeymap])

  const changeLayerName = useCallback(
    (id: number, oldName: string, newName: string) => {
      async function changeName(layerId: number, name: string) {
        if (!conn) {
          throw new Error('Not connected')
        }

        const resp = await call_rpc(conn, {
          keymap: { setLayerProps: { layerId, name } },
        })

        if (
          resp.keymap?.setLayerProps ==
          SetLayerPropsResponse.SET_LAYER_PROPS_RESP_OK
        ) {
          setKeymap(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            produce((draft: any) => {
              const layer_index = draft.layers.findIndex(
                (l: Layer) => l.id == layerId,
              )
              draft.layers[layer_index].name = name
            }),
          )
        } else {
          throw new Error(
            'Failed to change layer name:' + resp.keymap?.setLayerProps,
          )
        }
      }

      undoRedo?.(async () => {
        await changeName(id, newName)
        return async () => {
          await changeName(id, oldName)
        }
      })
    },
    [undoRedo, conn, setKeymap],
  )

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
        {layouts && (
          <div className="col-start-3 row-start-1 row-end-2">
            <PhysicalLayoutPicker
              layouts={layouts}
              selectedPhysicalLayoutIndex={selectedPhysicalLayoutIndex}
              onPhysicalLayoutClicked={doSelectPhysicalLayout}
            />
          </div>
        )}

        {keymap && (
          <div className="col-start-1 row-start-1 row-end-2">
            <LayerPicker
              layers={keymap.layers}
              selectedLayerIndex={selectedLayerIndex}
              onLayerClicked={setSelectedLayerIndex}
              onLayerMoved={moveLayer}
              canAdd={(keymap.availableLayers || 0) > 0}
              canRemove={(keymap.layers?.length || 0) > 1}
              onAddClicked={addLayer}
              onRemoveClicked={removeLayer}
              onLayerNameChanged={changeLayerName}
            />
          </div>
        )}
      </div>
      {layouts && keymap && behaviors && (
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
