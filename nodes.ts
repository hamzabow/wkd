import { ConfigNodes } from './types/types.ts'

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
      subType: 'Open in File Explorer',
    },
  },
  doc: {
    type: 'action',
    name: 'Open Documents',
    action: {
      type: 'filesystem',
      subType: 'Open in File Explorer',
    },
  },
} satisfies ConfigNodes
