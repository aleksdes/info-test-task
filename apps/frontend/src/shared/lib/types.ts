export type MimeType
  // Документы
  = | 'application/pdf'
    | 'application/msword' // .doc
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    | 'application/vnd.ms-excel' // .xls
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    | 'application/vnd.ms-powerpoint' // .ppt
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    | 'text/plain' // .txt
    | 'text/csv' // .csv
  // Изображения
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/svg+xml'
    | 'image/webp'
  // Аудио / Видео
    | 'audio/mpeg' // .mp3
    | 'audio/ogg'
    | 'video/mp4'
    | 'video/mpeg'
  // Архивы
    | 'application/zip'
    | 'application/x-rar-compressed'
  // Код и данные
    | 'application/json'
    | 'application/xml'
    | 'text/html'
    | 'text/css'
    | 'application/javascript'
    | undefined

export const extensionToMime: Record<string, MimeType> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
}
