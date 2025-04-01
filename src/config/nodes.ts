import { ConfigNodes } from '../types/types.ts'

export default {
  pi: {
    type: 'prefix',
    name: 'some name',
  },
  pid: {
    type: 'action',
    name: 'lsls',
    action: {
      name: 'Open Google',
      type: 'web',
      url: 'Hello World',
    },
  },
} satisfies ConfigNodes
