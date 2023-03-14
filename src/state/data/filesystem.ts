import { fileOpen, fileSave } from 'browser-fs-access'
import { FILE_DESCRIPTION, FILE_EXTENSIONS } from '../constants'

export async function openFileFromLocalSystem(): Promise<string | null> {
  const blob = await fileOpen({
    description: FILE_DESCRIPTION,
    extensions: FILE_EXTENSIONS,
    multiple: false,
  })
  if (!blob) return null

  const text: string = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        resolve(reader.result as string)
      }
    }
    reader.readAsText(blob, 'utf8')
  })

  return text
}

export async function saveFileToLocalSystem(text: string): Promise<any> {
  const blob = new Blob([text], { type: 'application/text' })

  const savedFile = await fileSave(blob, {
    fileName: 'New document',
    description: FILE_DESCRIPTION,
    extensions: FILE_EXTENSIONS,
  })

  return savedFile
}

export function fileToBase64(file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.onabort = (error) => reject(error)
    }
  })
}
