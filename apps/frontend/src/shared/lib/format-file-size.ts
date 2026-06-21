const BYTES_IN_KB = 1024
const BYTES_IN_MB = BYTES_IN_KB * BYTES_IN_KB

function formatTenth(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return rounded.toFixed(1)
}

/**
 * Человекочитаемый размер: меньше 1024 B → «N B»;
 * от 1024 B до меньше 1024×1024 B → «N.N KB»;
 * от 1 MiB → «N.N MB».
 * Для KB и MB — округление до десятых; для байт — целое число.
 */
export function formatFileSize(bytes: number): string {
  const n = Number.isFinite(bytes) && bytes > 0 ? bytes : 0

  if (n < BYTES_IN_KB)
    return `${Math.round(n)} B`

  if (n < BYTES_IN_MB)
    return `${formatTenth(n / BYTES_IN_KB)} KB`

  return `${formatTenth(n / BYTES_IN_MB)} MB`
}
