# WhichKey for Deno (wkd)

A simple terminal-based key sequence launcher inspired by "whichkey" plugins found in text editors like Emacs and Neovim. `wkd` allows you to define and execute various actions through memorable key sequences.

## Overview

`wkd` provides a framework for creating your own keyboard shortcuts to perform common actions, such as:

- Opening URLs in various browsers
- Opening files or folders in different applications
- Executing shell commands
- More actions to come!

## Inspiration

This project draws inspiration from "whichkey" plugins in text editors like Emacs and Neovim. While those plugins help users remember and execute keybindings within the editor, `wkd` brings similar functionality to the terminal as a standalone application.

## Features

- Tree-like navigation for key sequences
- Support for different action types:
  - Web actions (opening URLs)
  - Filesystem actions (opening files/folders)
  - Shell actions (executing commands)
- Visual key sequence hints with colored output
- Customizable key bindings and actions

## Installation

1. Make sure you have [Deno](https://deno.land/) installed
2. Clone this repository
3. Run the application:

```bash
deno task start
```

For development with file watching:

```bash
deno task dev
```

## Usage

1. Start the application
2. Type key sequences to navigate through the menu
3. When you reach a defined action, it will be executed
4. Press ESC or 'q' to exit

### Example

If you've defined a key sequence "gh" to open GitHub, typing "g" followed by "h" will open GitHub in your browser.

## Configuration

The application comes with no predefined shortcuts. You'll need to define your own in `nodes.ts` and `config.ts` files:

1. Copy the example files to create your own configuration:
   ```bash
   cp example.nodes.ts nodes.ts
   cp example.config.ts config.ts
   ```

2. Edit these files according to your needs.

See the [Configuration Guide](CONFIGURATION.md) for detailed instructions and examples.

### Action Types

#### Web Actions

```typescript
{
  type: 'web',
  url: 'https://example.com',
  newWindow: true, // optional, default is true
  browser: 'chrome', // optional, default is 'chrome'
  profile: 'profile-name' // optional, for Chrome only
}
```

#### Filesystem Actions

```typescript
{
  type: 'filesystem',
  subType: 'Open in File Explorer' // or other supported options
}
```

#### Shell Actions

```typescript
{
  type: 'shell',
  shell: 'bash', // optional, depends on your OS
  command: 'echo "Hello, World!"'
}
```

## Roadmap

- [ ] Implementation of action execution
- [ ] Add a task for sorting nodes by keys
- [ ] Better handling of browser profiles
- [ ] Configuration via external file

## License

[MIT](LICENSE) 