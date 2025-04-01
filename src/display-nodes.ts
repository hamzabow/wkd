import config from './config/config.ts'

export function displayNodes() {
  for (const key of Object.keys(config.nodes)) {
    console.log(key)
  }
}
