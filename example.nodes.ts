import { ConfigNodes } from './src/types/types.ts'

export default {
  // Example of a prefix node - this serves as a parent for other nodes
  ex: {
    type: 'prefix',
    name: 'Example Prefix',
  },

  // Example of a web action - opens a website
  exweb: {
    type: 'action',
    name: 'Open GitHub',
    action: {
      type: 'web',
      url: 'https://github.com',
    },
  },

  // Example of a filesystem action - opens a folder
  exfolder: {
    type: 'action',
    name: 'Open Documents Folder',
    action: {
      type: 'filesystem',
      subType: 'open in File Explorer',
      path: '/path/to/your/documents',
    },
  },
  // You can add more nodes based on your needs
} satisfies ConfigNodes
