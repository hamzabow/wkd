import { Satisfies } from './ts-utils.ts'

const nodeTypes = ['prefix', 'action'] as const
type NodeType = typeof nodeTypes[number]

const browsers = ['chrome', 'firefox', 'brave', 'edge'] as const
type Browser = typeof browsers[number]

const actionTypes = ['web', 'filesystem', 'shell'] as const

type ActionType = typeof actionTypes[number]

// TODO: port the golang code that generates json for chrome profiles info
// and replace json with a typescript file with profile info type, then import
// that type and here is here below (replace `string`).
type ChromeProfileCustomName = string

type WebAction =
  & {
    type: Satisfies<ActionType, 'web'>
    url: string // TODO: 'https://' should be optional
    newWindow?: boolean // true by default
  }
  & ({
    browser?: Satisfies<Browser, 'chrome'> // Default is Chrome (when not specified)
    profile?: ChromeProfileCustomName
  } | {
    browser: Exclude<Browser, 'chrome'>
  })

type FileSystemAction = {
  type: Satisfies<ActionType, 'filesystem'>
  subType:
    | 'Open in File Explorer'
    | 'open in yazi'
    | 'open in neovim oil'
    | 'open in fish shell'
    | 'open in pwsh'
}

const environmentCommandTypes = {
  windows: ['wsl', 'cmd', 'pwsh'], // ¹
  linux: ['bash', 'fish', 'nu'],
} as const

type ShellAction = {
  type: Satisfies<ActionType, 'shell'>
  shell?: typeof environmentCommandTypes['windows'][number] // Default is WSL
  command: string
}

type ActionBase = {
  closeAfterAction?: boolean // TODO: should be true by default
}
type Action = ActionBase & (WebAction | FileSystemAction | ShellAction)

type NodePrefix = {
  type: Satisfies<NodeType, 'prefix'>
}

type NodeAction = { type: Satisfies<NodeType, 'action'>; action: Action }

type NodeBase = {
  name: string
  description?: string
}

type Node = NodeBase & (NodePrefix | NodeAction)

export type ConfigNodes = Record<string, Node>

export type Config = {
  settings: any
  nodes: ConfigNodes
}

// ---
// ¹ maybe we could have added 'powershell', which is Windows Powershell,
//   which is different than 'pwsh' -powershell v7), but I don't use it much,
//   and since this is only for me, I'll keep it like this.
