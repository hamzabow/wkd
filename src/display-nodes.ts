import config from '../config.ts'
import { Word } from './config/words.ts'
import { paintBlue, paintGray, paintGreen, paintYellow } from './paint.ts'
import { Action, Node } from '../types/types.ts'
import { sleep } from './util.ts'

let seq = ''
const ndc = config.nodes

function displayPath() {
  if (seq.length === 0) {
    console.log()
  } else {
    let subStr = ''
    const pathStrParts: string[] = []
    for (const char of seq) {
      subStr += char
      if (subStr in ndc) {
        pathStrParts.push(ndc[subStr as Word].name)
      } else {
        pathStrParts.push('Prefix')
      }
    }
    const pathStr = paintGray(pathStrParts.join(' / '))
    console.log('  ' + paintGreen(seq) + ' - ' + pathStr)
  }
  console.log(paintGray('⸺'.repeat(30)))
}

function displaySubkeys() {
  const wordNodePairs = Object.entries(ndc).filter(([word]) =>
    word.startsWith(seq) && word.length !== seq.length
  )

  const uniqueCharactersToPrint = Array.from(
    new Set(
      wordNodePairs.map(([word]) => word.slice(seq.length, seq.length + 1)),
    ),
  )
  type El = { name: string; char: string; type: 'action' | 'prefix' }
  const els: El[] = []
  for (const char of uniqueCharactersToPrint) {
    let isNamedPrefixFound = false
    let nodeName: string | null = null
    for (const [word, node] of wordNodePairs) {
      if (
        node.type === 'prefix' &&
        word.length === seq.length + 1 &&
        word.slice(seq.length, seq.length + 1) === char
      ) {
        isNamedPrefixFound = true
        nodeName = node.name
        break
      }
    }
    if (isNamedPrefixFound) {
      els.push({ type: 'prefix', name: nodeName as string, char })
    } else {
      let isElForCharAdded = false
      for (const [word, node] of wordNodePairs) {
        if (isElForCharAdded) {
          break
        }
        if (
          word.slice(seq.length, seq.length + 1) === char
        ) {
          isElForCharAdded = true
          if (node.type === 'action' && word.length > (seq.length + 1)) { // implicit prefix
            els.push({ type: 'prefix', name: 'Prefix', char })
          } else if (node.type === 'action' && word.length === seq.length + 1) {
            els.push({ type: 'action', name: node.name, char })
          } else if (node.type === 'prefix') {
            els.push({ type: 'prefix', name: 'Prefix', char })
          }
        }
      }
    }
    isNamedPrefixFound = false
  }

  for (const el of els) {
    const paint = el.type === 'prefix' ? paintBlue : paintYellow
    console.log(
      `  ${paintGreen(el.char)} ➜  ${el.type === 'prefix' ? '+' : ''}${
        paint(el.name)
      }`,
    )
  }
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

    const otherAcceptedKeys = ['\x7f']

    if (otherAcceptedKeys.includes(key)) {
      return key
    } else {
      return '' // Ignore other keys
    }
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
  while (true) {
    console.clear()
    displayPath()
    displaySubkeys()

    const key = await handleKeyPress()
    if (key === '\x1b' || key === 'q') {
      // ESC or q key
      break
    }

    if (key === '\x7f') {
      // Backspace key
      if (seq.length !== 0) {
        seq = seq.slice(0, -1)
      }
      continue
    }

    if (!key) continue // Skip if no valid key was pressed

    const newSeq = seq + key
    if (newSeq in ndc) {
      if (ndc[newSeq as Word].type !== 'action') {
        seq = newSeq
        continue
      }
      console.log('executing action')
      return
    }
  }
}
