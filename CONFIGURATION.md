# Configuration Guide

## Getting Started

WhichKey for Deno (wkd) requires two main configuration files for customization:

1. `nodes.ts` - Defines your key sequences and associated actions
2. `config.ts` - Contains global settings and imports your nodes

## Setup Instructions

1. Create a copy of the example config files:
   ```bash
   cp example.nodes.ts nodes.ts
   cp example.config.ts config.ts
   ```

2. Edit these files according to your needs. Both files will be ignored by git, allowing you to maintain your personal configuration without affecting the repository.

## Nodes Configuration (nodes.ts)

The `nodes.ts` file defines your key sequences and what actions they trigger. Each node has a key that represents a keyboard key and a configuration.

### Node Types

#### Prefix Nodes
Prefix nodes act as containers for other nodes, creating a tree-like structure:

```typescript
ex: {
  type: 'prefix',
  name: 'Example Prefix', // Shows in the UI when you press 'e' + 'x'
}
```

#### Action Nodes
Action nodes execute specific actions when their key sequence is typed:

```typescript
// Web action example (opens GitHub in a browser)
gh: {
  type: 'action',
  name: 'Open GitHub',
  action: {
    type: 'web',
    url: 'https://github.com',
  },
}

// Filesystem action example (opens a folder)
docs: {
  type: 'action',
  name: 'Open Documents',
  action: {
    type: 'filesystem',
    subType: 'open in File Explorer',
    path: '/path/to/your/documents',
  },
}
```

### Key Naming

Keys in the configuration represent the actual keys you'll press. For example, if you define:

```typescript
gh: { ... }
```

You would press 'g' followed by 'h' to trigger this action.

## Global Configuration (config.ts)

The `config.ts` file imports your nodes and defines global settings:

```typescript
import { Config } from './src/types/types.ts'
import nodes from './nodes.ts'

export default {
  settings: {
    // Global settings go here
  },
  nodes,
} satisfies Config
```

## Advanced Configuration

For more complex setups, you can organize your nodes into multiple files and import them as needed.

## Examples

See the `example.nodes.ts` and `example.config.ts` files for practical examples of how to configure the application. 