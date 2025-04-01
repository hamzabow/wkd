import { ConfigNodes } from '../types/types.ts'

export default {
  pi: {
    type: 'prefix',
    name: 'Prefix X',
  },
  pid: {
    type: 'action',
    name: 'lsls',
    action: {
      name: 'Open Google',
      type: 'web',
      url: 'https://google.com',
    },
  },
} satisfies ConfigNodes
