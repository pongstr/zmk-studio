import { useCallback } from 'react'
import {
  Button,
  Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
} from 'react-aria-components'

import { useEditHistory } from '@/components/providers/edit-history/useEditHistory.ts'
import { useLayouts } from '@/hooks/useLayout.ts'

import { type KeyPosition, PhysicalLayout } from './PhysicalLayout'

export interface PhysicalLayoutItem {
  name: string
  keys: Array<KeyPosition>
}

export const PhysicalLayoutPicker = () => {
  const [
    layouts,
    _setLayouts,
    selectedPhysicalLayoutIndex,
    setSelectedPhysicalLayoutIndex,
  ] = useLayouts()

  const { doIt: undoRedo } = useEditHistory()

  const onPhysicalLayoutClicked = useCallback(
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

  const selectionChanged = useCallback(
    (e: Key) => {
      if (!layouts) return
      onPhysicalLayoutClicked?.(layouts.findIndex((l) => l.name === e))
    },
    [layouts, onPhysicalLayoutClicked],
  )

  console.log(layouts, selectedPhysicalLayoutIndex)
  if (!layouts.length || !layouts[selectedPhysicalLayoutIndex]) return null

  return (
    <Select
      onSelectionChange={selectionChanged}
      className="flex flex-col"
      selectedKey={layouts[selectedPhysicalLayoutIndex].name}
    >
      <Label className="hidden">Layout</Label>
      <Button className="ml-2 min-w-24 rounded p-1 text-left hover:bg-base-300">
        <SelectValue<PhysicalLayoutItem>>
          {(v) => {
            return <span>{v.selectedItem?.name}</span>
          }}
        </SelectValue>
      </Button>
      <Popover className="max-h-4 min-w-[var(--trigger-width)] rounded border-base-content bg-base-100 text-base-content shadow-md">
        <ListBox items={layouts}>
          {(l) => (
            <ListBoxItem
              id={l.name}
              textValue={l.name}
              className="cursor-pointer p-1 first:rounded-t last:rounded-b aria-selected:bg-primary aria-selected:text-primary-content"
            >
              <Text slot="label">{l.name}</Text>
              <div className="flex justify-center p-1">
                <PhysicalLayout
                  oneU={15}
                  hoverZoom={false}
                  positions={l.keys.map(
                    ({ x, y, width, height, r, rx, ry }) => ({
                      x: x / 100.0,
                      y: y / 100.0,
                      width: width / 100.0,
                      height: height / 100.0,
                      r: (r || 0) / 100.0,
                      rx: (rx || 0) / 100.0,
                      ry: (ry || 0) / 100.0,
                    }),
                  )}
                />
              </div>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  )
}
