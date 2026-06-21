export function getSizeInDecimal(value: number): string {
  if (value <= 0)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log10(value) / 3), units.length - 1)
  const size = value / 1000 ** i
  const formatted = size % 1 === 0 ? size.toString() : size.toFixed(2)

  return `${formatted} ${units[i]}`
}

export function getSizeInBinary(value: number): string {
  if (value <= 0)
    return '0 B'

  const units = ['B', 'KiB', 'MiB', 'GiB']
  const i = Math.min(Math.floor(Math.log2(value) / 10), units.length - 1)
  const size = value / 1024 ** i
  const formatted = size % 1 === 0 ? size.toString() : size.toFixed(2)

  return `${formatted} ${units[i]}`
}
