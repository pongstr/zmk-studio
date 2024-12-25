import { Pencil, Minus, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  DropIndicator,
  Label,
  ListBox,
  ListBoxItem,
  Selection,
  useDragAndDrop,
} from "react-aria-components";
import { Modal, ModalContent } from "../components/modal/Modal.tsx";

interface Layer {
  id: number;
  name?: string;
}

export type LayerClickCallback = (index: number) => void;
export type LayerMovedCallback = (index: number, destination: number) => void;

interface LayerPickerProps {
  layers: Array<Layer>;
  selectedLayerIndex: number;
  canAdd?: boolean;
  canRemove?: boolean;

  onLayerClicked?: LayerClickCallback;
  onLayerMoved?: LayerMovedCallback;
  onAddClicked?: () => void | Promise<void>;
  onRemoveClicked?: () => void | Promise<void>;
  onLayerNameChanged?: (
    id: number,
    oldName: string,
    newName: string,
  ) => void | Promise<void>;
}

interface EditLabelData {
  id: number;
  name: string;
}

const EditLabelModal = ({
  open,
  onClose,
  editLabelData,
  handleSaveNewLabel,
}: {
  open: boolean;
  onClose: () => void;
  editLabelData: EditLabelData | null;
  handleSaveNewLabel: (
    id: number,
    oldName: string,
    newName: string | null,
  ) => void;
}) => {
  const [newLabelName, setNewLabelName] = useState(editLabelData?.name ?? "");

  const handleSave = useCallback(() => {
    if (!editLabelData) return;

    handleSaveNewLabel(editLabelData.id, editLabelData.name, newLabelName);
    onClose();
  }, [editLabelData]);

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="min-w-min w-[30vw] flex flex-col">
        {editLabelData && (
          <>
            <span className="mb-3 text-lg">New Layer Name</span>
            <input
              className="p-1 border rounded border-base-content border-solid"
              type="text"
              defaultValue={editLabelData.name}
              autoFocus
              onChange={(e) => setNewLabelName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <div className="mt-4 flex justify-end">
              <button className="py-1.5 px-2" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="py-1.5 px-2 ml-4 rounded-md bg-gray-100 text-black hover:bg-gray-300"
                type="button"
                disabled={!!editLabelData}
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const LayerPicker = ({
  layers,
  selectedLayerIndex,
  canAdd,
  canRemove,
  onLayerClicked,
  onLayerMoved,
  onAddClicked,
  onRemoveClicked,
  onLayerNameChanged,
  ...props
}: LayerPickerProps) => {
  const [editLabelData, setEditLabelData] = useState<EditLabelData | null>(
    null,
  );

  const layer_items = useMemo(() => {
    return layers.map((l, i) => ({
      name: l.name || i.toLocaleString(),
      id: l.id,
      index: i,
      selected: i === selectedLayerIndex,
    }));
  }, [layers, selectedLayerIndex]);

  const selectionChanged = useCallback(
    (s: Selection) => {
      if (s === "all") {
        return;
      }

      onLayerClicked?.(layer_items.findIndex((l) => s.has(l.id)));
    },
    [onLayerClicked, layer_items],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator(target) {
      return (
        <DropIndicator
          target={target}
          className={"outline-1 outline-accent data-[drop-target]:outline"}
        />
      );
    },
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": key.toLocaleString() })),
    onReorder(e) {
      const startIndex = layer_items.findIndex((l) => e.keys.has(l.id));
      const endIndex = layer_items.findIndex((l) => l.id === e.target.key);
      onLayerMoved?.(startIndex, endIndex);
    },
  });

  const handleSaveNewLabel = useCallback(
    (id: number, oldName: string, newName: string | null) => {
      if (newName !== null) {
        onLayerNameChanged?.(id, oldName, newName);
      }
    },
    [onLayerNameChanged],
  );

  return (
    <div className="flex min-w-40 flex-col">
      <div className="grid grid-cols-[1fr_auto_auto] items-center">
        <Label className="text-sm after:content-[':']">Layers</Label>
        {onRemoveClicked && (
          <button
            type="button"
            className="rounded-sm hover:bg-primary hover:text-primary-content"
            disabled={!canRemove}
            onClick={onRemoveClicked}
          >
            <Minus className="size-4" />
          </button>
        )}
        {onAddClicked && (
          <button
            type="button"
            disabled={!canAdd}
            className="ml-1 rounded-sm hover:bg-primary hover:text-primary-content disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-base-300"
            onClick={onAddClicked}
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      <EditLabelModal
        open={!!editLabelData}
        onClose={() => setEditLabelData(null)}
        editLabelData={editLabelData}
        handleSaveNewLabel={handleSaveNewLabel}
      />

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
        className="ml-2 cursor-pointer items-center justify-center"
        onSelectionChange={selectionChanged}
        dragAndDropHooks={dragAndDropHooks}
        {...props}
      >
        {(layer_item) => (
          <ListBoxItem
            textValue={layer_item.name}
            className="group my-1 grid grid-cols-[1fr_auto] items-center rounded border border-solid border-transparent p-1 hover:bg-base-300 aria-selected:bg-primary aria-selected:text-primary-content"
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
  );
};
