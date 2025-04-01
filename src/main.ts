import config from './config.ts'

function main() {
  console.log(config)
}

if (import.meta.main) {
  main()
}
