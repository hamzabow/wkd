import config from './config/config.ts'

function main() {
  console.log(config)
}

if (import.meta.main) {
  main()
}
