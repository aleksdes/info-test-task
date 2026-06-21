import { formatFileSize } from './format-file-size'

function pluralizeFilesRu(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11)
    return 'файл'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return 'файла'
  return 'файлов'
}

/** Части строки «N файлов, X …» (B / KB / MB) — префикс жирный, размер серым в UI */
export function formatFilesSummaryPartsRu(count: number, totalBytes: number): { lead: string, sizeLabel: string } {
  const word = pluralizeFilesRu(count)
  return {
    lead: `${count} ${word}, `,
    sizeLabel: formatFileSize(totalBytes),
  }
}
