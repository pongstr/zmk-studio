import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { LayerPicker } from './LayerPicker'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Keyboard/LayerPicker',
  component: LayerPicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onLayerClicked: fn(),
  },
} satisfies Meta<typeof LayerPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Named: Story = {
  args: {
    setKeymap: () => {},
    keymap: {
      availableLayers: 1,
      maxLayerNameLength: 20,
      layers: [
        { id: 1, name: 'Base', bindings: [] },
        { id: 2, name: 'Num', bindings: [] },
        { id: 3, name: 'Nav', bindings: [] },
        { id: 4, name: 'Symbol', bindings: [] },
      ],
    },
    selectedLayerIndex: 2,
  },
}

export const NoNames: Story = {
  args: {
    setKeymap: () => {},
    selectedLayerIndex: 0,
    keymap: {
      availableLayers: 1,
      maxLayerNameLength: 20,
      layers: [
        { id: 1, bindings: [], name: '' },
        { id: 2, bindings: [], name: '' },
        { id: 3, bindings: [], name: '' },
      ],
    },
  },
}
