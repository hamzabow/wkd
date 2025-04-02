import config from '../config.ts'
import { Word } from './words.ts'
import { paintBlue, paintGray, paintGreen, paintYellow } from './paint.ts'
import { Action, Node, NodeAction } from './types/types.ts'
import { sleep } from './util.ts'

let seq = ''
const ndc = config.nodes

// Define specific action types based on the Action union type
type WebAction = Extract<Action, { type: 'web' }>
type FileSystemAction = Extract<Action, { type: 'filesystem' }>
type ShellAction = Extract<Action, { type: 'shell' }>

function displayPath() {
  console.log()
  if (seq.length === 0) {
    console.log(paintGray('  <ROOT>'))
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

async function executeWebAction(action: WebAction): Promise<void> {
  const urlToOpen = action.url.startsWith('http')
    ? action.url
    : `https://${action.url}`
  const browser = action.browser || 'chrome'
  let browserPath = ''

  // Default to new window unless explicitly set to false
  const openInNewWindow = action.newWindow !== false
  let newWindowFlag = ''

  if (browser === 'chrome') {
    browserPath = '/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe'
    newWindowFlag = openInNewWindow ? ' --new-window' : ''
    // Check if profile property exists (only applicable for Chrome)
    const profileArg = 'profile' in action && action.profile
      ? ` --profile-directory="${action.profile}"`
      : ''
    browserPath += profileArg + newWindowFlag
  } else if (browser === 'firefox') {
    browserPath = '/mnt/c/Program\\ Files/Mozilla\\ Firefox/firefox.exe'
    newWindowFlag = openInNewWindow ? ' -new-window' : ''
    browserPath += newWindowFlag
  } else if (browser === 'edge') {
    browserPath =
      '/mnt/c/Program\\ Files\\ \\(x86\\)/Microsoft/Edge/Application/msedge.exe'
    newWindowFlag = openInNewWindow ? ' --new-window' : ''
    browserPath += newWindowFlag
  }

  if (browserPath) {
    try {
      const command = new Deno.Command('bash', {
        args: ['-c', `${browserPath} "${urlToOpen}"`],
      })
      await command.output()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to open URL: ${error.message}`)
      } else {
        console.error(`Failed to open URL: ${String(error)}`)
      }
    }
  }
}

async function executeFileSystemAction(
  action: FileSystemAction,
): Promise<void> {
  console.log('Executing filesystem action:', action.subType, action.path)
  try {
    let fsCommand = ''
    switch (action.subType) {
      case 'open in File Explorer':
        fsCommand = `explorer.exe "$(wslpath -w "${action.path}")"`
        break
      case 'open in yazi':
        fsCommand = `yazi "${action.path}"`
        break
      case 'open in neovim oil plugin':
        fsCommand = `nvim "${action.path}"`
        break
      case 'open in fish shell':
        fsCommand = `fish -c "cd \\"${action.path}\\" && exec fish"`
        break
      case 'open in pwsh':
        fsCommand = `pwsh -NoExit -Command "cd \\"${action.path}\\""`
        break
    }

    if (fsCommand) {
      const command = new Deno.Command('bash', {
        args: ['-c', fsCommand],
      })
      await command.output()
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to execute filesystem action: ${error.message}`)
    } else {
      console.error(`Failed to execute filesystem action: ${String(error)}`)
    }
  }
}

async function executeShellAction(action: ShellAction): Promise<void> {
  console.log('Executing shell action:', action.command)
  try {
    const shell = action.shell || 'wsl'
    let shellCommand

    if (shell === 'wsl') {
      shellCommand = new Deno.Command('bash', {
        args: ['-c', action.command],
      })
    } else if (shell === 'cmd') {
      shellCommand = new Deno.Command('cmd.exe', {
        args: ['/c', action.command],
      })
    } else if (shell === 'pwsh') {
      shellCommand = new Deno.Command('powershell.exe', {
        args: ['-Command', action.command],
      })
    }

    if (shellCommand) {
      const { stdout, stderr } = await shellCommand.output()
      console.log('Command output:')
      console.log(new TextDecoder().decode(stdout))
      if (stderr.length > 0) {
        console.error(new TextDecoder().decode(stderr))
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to execute shell command: ${error.message}`)
    } else {
      console.error(`Failed to execute shell command: ${String(error)}`)
    }
  }
}

async function executeAction(nodeAction: NodeAction) {
  const action = nodeAction.action
  switch (action.type) {
    case 'web':
      await executeWebAction(action as WebAction)
      break
    case 'filesystem':
      await executeFileSystemAction(action as FileSystemAction)
      break
    case 'shell':
      await executeShellAction(action as ShellAction)
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
    if (newSeq in ndc && ndc[newSeq as Word].type === 'action') {
      console.log(`Executing action: ${ndc[newSeq as Word].name}`)
      await executeAction(ndc[newSeq as Word] as NodeAction)
      return
    }
    if (Object.keys(ndc).filter((word) => word.startsWith(newSeq)).length > 0) {
      seq = newSeq
    }
    continue
  }
}
