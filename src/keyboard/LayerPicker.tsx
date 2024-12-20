import {
  Keymap,
  SetLayerPropsResponse,
} from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { produce } from 'immer'
import { Minus, Pencil, Plus } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import {
  DropIndicator,
  ListBox,
  ListBoxItem,
  Selection,
  useDragAndDrop,
} from 'react-aria-components'

import { useEditHistory } from '@/components/providers/edit-history/useEditHistory.ts'
import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import { GenericModal } from '@/GenericModal'
import { call_rpc } from '@/lib/logging.ts'
import { useModalRef } from '@/misc/useModalRef'

interface Layer {
  id: number
  name?: string
}

type LayerPickerProps = {
  keymap: Keymap
  setKeymap: Dispatch<SetStateAction<Keymap | undefined>>
  setSelectedLayerIndex: Dispatch<SetStateAction<number>>
  selectedLayerIndex: number
  onLayerNameChanged?: (
    id: number,
    oldName: string,
    newName: string,
  ) => void | Promise<void>
}

interface EditLabelData {
  id: number
  name: string
}

const EditLabelModal = ({
  open,
  onClose,
  editLabelData,
  handleSaveNewLabel,
}: {
  open: boolean
  onClose: () => void
  editLabelData: EditLabelData
  handleSaveNewLabel: (
    id: number,
    oldName: string,
    newName: string | null,
  ) => void
}) => {
  const ref = useModalRef(open)
  const [newLabelName, setNewLabelName] = useState(editLabelData.name)

  const handleSave = () => {
    handleSaveNewLabel(editLabelData.id, editLabelData.name, newLabelName)
    onClose()
  }

  return (
    <GenericModal
      ref={ref}
      onClose={onClose}
      className="flex w-[30vw] min-w-min flex-col"
    >
      <span className="mb-3 text-lg">New Layer Name</span>
      <input
        className="rounded border border-solid border-base-content p-1"
        type="text"
        defaultValue={editLabelData.name}
        autoFocus
        onChange={(e) => setNewLabelName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
        }}
      />
      <div className="mt-4 flex justify-end">
        <button className="px-2 py-1.5" type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="ml-4 rounded-md bg-gray-100 px-2 py-1.5 text-black hover:bg-gray-300"
          type="button"
          onClick={() => {
            handleSave()
          }}
        >
          Save
        </button>
      </div>
    </GenericModal>
  )
}

export const LayerPicker = ({
  keymap,
  setKeymap,
  selectedLayerIndex,
  setSelectedLayerIndex,
}: LayerPickerProps) => {
  const [editLabelData, setEditLabelData] = useState<EditLabelData | null>(null)

  const allowAction = useMemo(
    () => ({
      add: keymap.availableLayers > 0,
      remove: keymap.layers.length > 1,
    }),
    [keymap.availableLayers, keymap.layers],
  )

  const { conn } = useConnectionContext()
  const { doIt: undoRedo } = useEditHistory()

  const onLayerMoved = useCallback(
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

  const onAddClicked = useCallback(() => {
    async function doAdd(): Promise<number> {
      console.log(conn, keymap.layers)

      if (!conn || !keymap.layers) {
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
  }, [undoRedo, conn, keymap.layers, setKeymap])

  const onRemoveClicked = useCallback(() => {
    async function doRemove(layerIndex: number): Promise<void> {
      if (!conn || !keymap.layers) {
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

    if (!keymap.layers) {
      throw new Error('No keymap loaded')
    }

    const index = selectedLayerIndex
    const layerId = keymap.layers[index].id
    undoRedo?.(async () => {
      await doRemove(index)
      return () => doRestore(layerId, index)
    })
  }, [keymap.layers, selectedLayerIndex, undoRedo, conn, setKeymap])

  const onLayerNameChanged = useCallback(
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

  const layer_items = useMemo(() => {
    return keymap.layers.map((l, i) => ({
      name: l.name || i.toLocaleString(),
      id: l.id,
      index: i,
      selected: i === selectedLayerIndex,
    }))
  }, [keymap.layers, selectedLayerIndex])

  const selectionChanged = useCallback(
    (s: Selection) => {
      if (s === 'all') {
        return
      }

      setSelectedLayerIndex?.(layer_items.findIndex((l) => s.has(l.id)))
    },
    [setSelectedLayerIndex, layer_items],
  )

  const { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator(target) {
      return (
        <DropIndicator
          target={target}
          className={'outline-1 outline-accent data-[drop-target]:outline'}
        />
      )
    },
    getItems: (keys) =>
      [...keys].map((key) => ({ 'text/plain': key.toLocaleString() })),
    onReorder(e) {
      const startIndex = layer_items.findIndex((l) => e.keys.has(l.id))
      const endIndex = layer_items.findIndex((l) => l.id === e.target.key)
      onLayerMoved?.(startIndex, endIndex)
    },
  })

  const handleSaveNewLabel = useCallback(
    (id: number, oldName: string, newName: string | null) => {
      if (newName !== null) {
        onLayerNameChanged?.(id, oldName, newName)
      }
    },
    [onLayerNameChanged],
  )

  return (
    <div className="flex min-w-40 flex-col">
      <div className="flex items-center justify-center gap-2">
        {onRemoveClicked && (
          <button
            type="button"
            className="rounded-sm hover:bg-primary hover:text-primary-content disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-primary-content"
            disabled={!allowAction.remove}
            onClick={onRemoveClicked}
          >
            <Minus className="size-4" />
          </button>
        )}
        {onAddClicked && (
          <button
            type="button"
            disabled={!allowAction.add}
            className="rounded-sm hover:bg-primary hover:text-primary-content disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-primary-content"
            onClick={onAddClicked}
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      {editLabelData !== null && (
        <EditLabelModal
          open={Boolean(editLabelData)}
          onClose={() => setEditLabelData(null)}
          editLabelData={editLabelData}
          handleSaveNewLabel={handleSaveNewLabel}
        />
      )}
      <ListBox
        aria-label="Keymap Layer"
        selectionMode="single"
        items={layer_items}
        disallowEmptySelection={true}
        selectedKeys={
          layer_items[selectedLayerIndex]
            ? [layer_items[selectedLayerIndex].id]
            : []
        }
        className="flex items-center justify-center gap-2"
        onSelectionChange={selectionChanged}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(layer_item) => (
          <ListBoxItem
            textValue={layer_item.name}
            className="b-1 group my-1 grid grid-cols-[1fr_auto] items-center rounded border border-solid border-transparent p-1 hover:bg-base-300 aria-selected:bg-primary aria-selected:text-primary-content"
          >
            <span>{layer_item.name}</span>
            <Pencil
              className="invisible mx-1 size-4 group-hover:visible"
              onClick={() =>
                setEditLabelData({ id: layer_item.id, name: layer_item.name })
              }
            />
          </ListBoxItem>
        )}
      </ListBox>
    </div>
  )
}
