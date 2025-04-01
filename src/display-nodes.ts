import config from './config/config.ts'
import { paintGray, paintGreen } from './paint.ts'
import { Action, Node } from './types/types.ts'

interface State {
  currentSequence: string
  availableNodes: [string, Node][]
  path: [string, Node][]
}

function displayPath(path: [string, Node][], currentSequence: string) {
  if (path.length === 0) {
    console.log()
    console.log(paintGray('⸺'.repeat(30)))
    return
  }

  const keyChain = path.map(([key]) => key[0]).join('')
  const pathParts = path.map(([_, node]) => paintGray(node.name))
  const pathStr = pathParts.join(' / ')

  console.log('  ' + paintGreen(keyChain) + ' - ' + pathStr)
  console.log(paintGray('⸺'.repeat(30)))
}

function displaySubkeys(nodes: [string, Node][], currentSequence: string) {
  for (const [key, node] of nodes) {
    const remainingChars = key.slice(currentSequence.length)
    const prefix = key.slice(0, currentSequence.length)
    const nextChar = remainingChars ? `[${remainingChars[0]}]` : ''
    const rest = remainingChars ? remainingChars.slice(1) : ''

    console.log(`  ${prefix}${nextChar}${rest} - ${node.name}`)
  }
}

function filterNodesBySequence(
  nodes: [string, Node][],
  sequence: string,
): [string, Node][] {
  return nodes.filter(([key]) => key.startsWith(sequence))
}

async function handleKeyPress(): Promise<string> {
  // Enable raw mode on stdin to capture key presses immediately
  Deno.stdin.setRaw(true)

  try {
    // Allocate a buffer for a single byte
    const buffer = new Uint8Array(1)

    // Wait for one byte (key press) from stdin
    const n = await Deno.stdin.read(buffer)
    if (n === null) {
      return ''
    }

    // Decode the captured byte to a string
    const key = new TextDecoder().decode(buffer)

    // Handle special keys
    if (key === '\x1b') {
      // ESC
      return key
    }

    // Handle Ctrl+C
    if (key === '\x03') {
      console.log('Exiting...')
      Deno.exit(130) // 128 + SIGINT = 130
    }

    // Only return printable characters
    if (key.match(/^[a-zA-Z0-9]$/)) {
      return key
    }

    return '' // Ignore other keys
  } finally {
    // Always reset stdin to normal mode
    Deno.stdin.setRaw(false)
  }
}

async function executeAction(action: Action) {
  switch (action.type) {
    case 'web':
      // TODO: Implement web action execution
      console.log('Executing web action:', action)
      break
    case 'filesystem':
      // TODO: Implement filesystem action execution
      console.log('Executing filesystem action:', action)
      break
    case 'shell':
      // TODO: Implement shell action execution
      console.log('Executing shell action:', action)
      break
  }
}

export async function displayNodes() {
  const state: State = {
    currentSequence: '',
    availableNodes: Object.entries(config.nodes),
    path: [],
  }

  while (true) {
    console.clear()
    displayPath(state.path, state.currentSequence)
    displaySubkeys(state.availableNodes, state.currentSequence)

    const key = await handleKeyPress()
    if (key === '\x1b' || key === 'q') {
      // ESC or q key
      break
    }

    if (!key) continue // Skip if no valid key was pressed

    const newSequence = state.currentSequence + key
    const filteredNodes = filterNodesBySequence(
      state.availableNodes,
      newSequence,
    )

    if (filteredNodes.length === 0) {
      // No matches found, reset sequence
      state.currentSequence = ''
      state.availableNodes = Object.entries(config.nodes)
      state.path = []
      continue
    }

    // Check if we have an exact match for an action
    const exactMatch = filteredNodes.find(([key]) => key === newSequence)
    if (exactMatch && exactMatch[1].type === 'action') {
      await executeAction(exactMatch[1].action)
      break
    }

    // Update state for next iteration
    state.currentSequence = newSequence
    state.availableNodes = filteredNodes
    state.path = [...state.path, exactMatch || filteredNodes[0]]
  }
}
