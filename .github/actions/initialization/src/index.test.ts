import { beforeEach, describe, expect, test, vi } from 'vitest'

const runMock = vi.fn()

vi.mock('./main.js', () => ({
  run: runMock,
}))

describe('index', () => {
  beforeEach(() => {
    vi.resetModules()
    runMock.mockClear()
  })

  test('calls run when imported', async () => {
    await import('./index.js')

    expect(runMock).toHaveBeenCalledTimes(1)
  })
})
