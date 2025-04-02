import { Config } from './src/types/types.ts'
import nodes from './nodes.ts'

export default {
  // Add your global settings here
  settings: {
    // Examples of possible settings:
    // theme: 'dark',
    // defaultBrowser: 'chrome',
    // defaultFileExplorer: 'explorer'
  },

  // Import your nodes configuration
  nodes,
} satisfies Config
