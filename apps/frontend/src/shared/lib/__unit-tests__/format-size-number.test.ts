import { describe, expect, it } from 'vitest'
import { getSizeInBinary, getSizeInDecimal } from '@/shared/lib/format-size-number.ts'

describe('shared/lib/format-size-number/getSizeInDecimal', () => {
  it('returns 0 B for zero and negative values', () => {
    expect(getSizeInDecimal(0)).toBe('0 B')
    expect(getSizeInDecimal(-1)).toBe('0 B')
  })

  it('formats bytes without conversion', () => {
    expect(getSizeInDecimal(1)).toBe('1 B')
    expect(getSizeInDecimal(500)).toBe('500 B')
    expect(getSizeInDecimal(999)).toBe('999 B')
  })

  it('formats kilobytes, megabytes and gigabytes', () => {
    expect(getSizeInDecimal(1000)).toBe('1 KB')
    expect(getSizeInDecimal(1500)).toBe('1.50 KB')
    expect(getSizeInDecimal(1_000_000)).toBe('1 MB')
    expect(getSizeInDecimal(1_500_000)).toBe('1.50 MB')
    expect(getSizeInDecimal(1_000_000_000)).toBe('1 GB')
    expect(getSizeInDecimal(1_500_000_000)).toBe('1.50 GB')
  })

  it('keeps two decimals for fractional sizes', () => {
    expect(getSizeInDecimal(1234)).toBe('1.23 KB')
  })
})

describe('shared/lib/format-size-number/getSizeInBinary', () => {
  it('returns 0 B for zero and negative values', () => {
    expect(getSizeInBinary(0)).toBe('0 B')
    expect(getSizeInBinary(-512)).toBe('0 B')
  })

  it('formats bytes without conversion', () => {
    expect(getSizeInBinary(1)).toBe('1 B')
    expect(getSizeInBinary(512)).toBe('512 B')
    expect(getSizeInBinary(1023)).toBe('1023 B')
  })

  it('formats kibibytes, mebibytes and gibibytes', () => {
    expect(getSizeInBinary(1024)).toBe('1 KiB')
    expect(getSizeInBinary(1536)).toBe('1.50 KiB')
    expect(getSizeInBinary(1_048_576)).toBe('1 MiB')
    expect(getSizeInBinary(1_572_864)).toBe('1.50 MiB')
    expect(getSizeInBinary(1_073_741_824)).toBe('1 GiB')
    expect(getSizeInBinary(1_610_612_736)).toBe('1.50 GiB')
  })

  it('keeps two decimals for fractional sizes', () => {
    expect(getSizeInBinary(1100)).toBe('1.07 KiB')
  })
})
