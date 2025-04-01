export function paintGray(text: string): string {
  return `\x1b[90m${text}\x1b[0m`;
}

export function paintGreen(text: string): string {
  return `\x1b[32m${text}\x1b[0m`;
}

export function paintRed(text: string): string {
  return `\x1b[31m${text}\x1b[0m`;
}

export function paintBlue(text: string): string {
  return `\x1b[34m${text}\x1b[0m`;
}

export function paintYellow(text: string): string {
  return `\x1b[33m${text}\x1b[0m`;
}

export function paintMagenta(text: string): string {
  return `\x1b[35m${text}\x1b[0m`;
}

export function paintCyan(text: string): string {
  return `\x1b[36m${text}\x1b[0m`;
}

export function paintWhite(text: string): string {
  return `\x1b[37m${text}\x1b[0m`;
}

export function paintBlack(text: string): string {
  return `\x1b[30m${text}\x1b[0m`;
}

export function paintBold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}

export function paintUnderline(text: string): string {
  return `\x1b[4m${text}\x1b[0m`;
}

export function paintBlink(text: string): string {
  return `\x1b[5m${text}\x1b[0m`;
}

export function paintReverse(text: string): string {
  return `\x1b[7m${text}\x1b[0m`;
}

export function paintHidden(text: string): string {
  return `\x1b[8m${text}\x1b[0m`;
}

export function paintStrikethrough(text: string): string {
  return `\x1b[9m${text}\x1b[0m`;
}
