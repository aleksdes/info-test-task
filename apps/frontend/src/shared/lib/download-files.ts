import { downloadZip } from 'client-zip'

export interface DownloadFileOptions {
  /** Прямая ссылка на файл */
  url: string
  /** Желаемое имя файла с расширением */
  name?: string
}

/**
 * Скачивает один документ
 * @param file - Объект с данными файла
 * @param file.url - Прямая ссылка на файл
 * @param file.name - Имя файла с расширением (опционально). Если не указано — будет извлечено из URL.
 */
export function downloadFile(file: DownloadFileOptions): void {
  if (!file?.url) {
    console.error('URL файла не указан')
    return
  }

  const link = document.createElement('a')
  link.href = file.url

  let fileName = file.name

  // Если имя не передано — пытаемся извлечь из URL
  if (!fileName) {
    try {
      fileName = new URL(file.url).pathname.split('/').pop() || 'document'
    }
    catch {
      fileName = 'document'
    }
  }

  link.download = fileName
  link.target = '_blank' // помогает в некоторых браузерах

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Надёжное скачивание одного файла через Blob (более стабильный метод)
 * @param file - Объект с данными файла
 * @param file.url - Прямая ссылка на файл
 * @param file.name - Имя файла с расширением (опционально). Если не указано — будет извлечено из URL.
 */
export function downloadFileFromBlob(file: DownloadFileOptions): void {
  if (!file?.url) {
    console.error('URL файла не указан')
    return
  }

  fetch(file.url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      return response.blob()
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = file.name
        || new URL(file.url).pathname.split('/').pop()
        || 'document'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Освобождаем память
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    })
    .catch((err) => {
      console.error(`Ошибка при скачивании ${file.name || file.url}:`, err)
    })
}

/**
 * Скачивает все документы из массива
 * @param files - Массив файлов для скачивания
 * @param delay - Задержка между скачиваниями в миллисекундах (по умолчанию 600мс)
 *                Рекомендуется от 300 до 800 мс, чтобы браузер не блокировал скачивания.
 */
export async function downloadAllFilesFromBlob(
  files: DownloadFileOptions[],
  delay: number = 800,
): Promise<void> {
  if (!Array.isArray(files) || files.length === 0) {
    console.error('Передайте непустой массив файлов')
    return
  }

  console.log(`Начинаем скачивание ${files.length} файла(ов)...`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    console.log(`Скачиваем ${i + 1}/${files.length}: ${file.name || file.url}`)

    downloadFileFromBlob(file)

    // Увеличили задержку — это критично
    if (i < files.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  console.log('Все файлы обработаны (отправлены на скачивание)')
}

/**
 * Скачивает все файлы и упаковывает их в один ZIP-архив с помощью client-zip
 * @param files - массив файлов
 * @param zipFileName - имя итогового zip-файла
 */
export async function downloadAllAsZip(
  files: DownloadFileOptions[],
  zipFileName: string = 'documents.zip',
): Promise<void> {
  if (!Array.isArray(files) || files.length === 0) {
    console.error('Передайте непустой массив файлов')
    return
  }

  console.log(`Начинаем создание ZIP-архива (${files.length} файлов)...`)

  const zipEntries = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileIndex = `${i + 1}/${files.length}`

    console.log(`Загружаем ${fileIndex}: ${file.name || file.url}`)

    try {
      const response = await fetch(file.url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const fileName = file.name
        || new URL(file.url).pathname.split('/').pop()
        || `file_${i + 1}`

      // client-zip отлично работает с Response напрямую
      zipEntries.push({
        name: fileName,
        input: response, // можно передать Response напрямую
        lastModified: new Date(),
      })

      console.log(`✓ Добавлен: ${fileName}`)
    }
    catch (error) {
      console.error(`✗ Ошибка при загрузке ${file.name || file.url}:`, error)
      // Продолжаем обработку остальных файлов
    }
  }

  if (zipEntries.length === 0) {
    console.error('Не удалось загрузить ни одного файла')
    return
  }

  console.log('Генерируем ZIP-файл...')

  // Основная магия client-zip
  const zipResponse = downloadZip(zipEntries)

  // Преобразуем в Blob и скачиваем
  const zipBlob = await zipResponse.blob()

  const link = document.createElement('a')
  const url = URL.createObjectURL(zipBlob)

  link.href = url
  link.download = zipFileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Очистка памяти
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  console.log(`✅ ZIP-архив "${zipFileName}" успешно скачан!`)
}
