// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest'
import { LEGACY_PROFILE_KEYS, resetStandaloneStorage } from './standalone.js'
import { CATALOGUE } from './exercises.js'
import { DEF } from '../store/useStore.js'

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key),
    snapshot: () => Object.fromEntries(data),
  }
}

describe('resetStandaloneStorage', () => {
  it('ships an empty personal profile while keeping the built-in exercise catalogue', () => {
    expect(DEF).toMatchObject({
      targetW: null,
      bodyweight: [],
      routines: [],
      week: {},
      dayPlan: {},
      exWeights: {},
      workouts: [],
      active: null,
      customEx: [],
      favEx: [],
      equipProfiles: [],
      gymCards: [],
    })
    expect(CATALOGUE).toHaveLength(1324)
  })

  it('clears every old personal-data key but preserves unrelated app content', () => {
    const old = Object.fromEntries(LEGACY_PROFILE_KEYS.map(key => [key, 'old data']))
    const storage = memoryStorage({ ...old, unrelated: 'keep me' })
    const writeEmptyState = vi.fn(() => storage.setItem('gym_state_v1', JSON.stringify({ workouts: [], routines: [] })))

    expect(resetStandaloneStorage(storage, 'trax_plus_standalone_fresh_v2', writeEmptyState)).toBe(true)
    expect(writeEmptyState).toHaveBeenCalledOnce()
    expect(storage.snapshot()).toEqual({
      unrelated: 'keep me',
      gym_state_v1: JSON.stringify({ workouts: [], routines: [] }),
      trax_plus_standalone_fresh_v2: '1',
    })
  })

  it('never wipes real data created after the migration', () => {
    const storage = memoryStorage({
      trax_plus_standalone_fresh_v2: '1',
      gym_state_v1: JSON.stringify({ workouts: [{ id: 'mine' }] }),
    })
    const writeEmptyState = vi.fn()

    expect(resetStandaloneStorage(storage, 'trax_plus_standalone_fresh_v2', writeEmptyState)).toBe(false)
    expect(writeEmptyState).not.toHaveBeenCalled()
    expect(JSON.parse(storage.getItem('gym_state_v1')).workouts).toEqual([{ id: 'mine' }])
  })
})
