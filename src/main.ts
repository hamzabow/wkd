import { displayNodes } from './display-nodes.ts'

async function main() {
  await displayNodes()
}

if (import.meta.main) {
  await main()
}
