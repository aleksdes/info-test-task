import type { Dayjs } from 'dayjs'
import { ref } from 'vue'
import { dayjs } from '@/shared/lib/dayjs'

/**
 * Parse date string to Date object
 * @param dateStr
 * @param format
 * @returns {dayjs.Dayjs} Date object
 * @example
 * parseDate("17/02/2024 01:00")
 */
export function parseDate(dateStr: string, format = 'DD/MM/YYYY HH:mm'): Dayjs {
  return dayjs(dateStr, format)
}

export function wait(seconds: number) {
  const isLoading = ref(true)
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      isLoading.value = false
      resolve(true)
    }, seconds * 1000)
  })
  return {
    isLoading,
    promise,
  }
}
wait.random = (min?: number, max?: number) => {
  return wait(Math.random() * ((max || 5) - (min || 0)) + (min || 0))
}
