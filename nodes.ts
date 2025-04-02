import { ConfigNodes } from './src/types/types.ts'

export default {
  p: {
    type: 'prefix',
    name: 'Just P Dir',
  },
  pi: {
    type: 'prefix',
    name: 'Prefix X',
  },
  pid: {
    type: 'action',
    name: 'Open Google',
    action: {
      type: 'web',
      url: 'https://google.com',
    },
  },
  dow: {
    type: 'action',
    name: 'Open Downloads',
    action: {
      type: 'filesystem',
      subType: 'open in File Explorer',
      path: '/mnt/c/Users/hamza/Downloads',
    },
  },
  doc: {
    type: 'action',
    name: 'Open Documents',
    action: {
      type: 'filesystem',
      subType: 'open in File Explorer',
      path: '/mnt/c/Users/hamza/Documents',
    },
  },
} satisfies ConfigNodes
