import { describe, expect, it } from 'vitest'
import { cardioLabel, cleanCardioMetrics, cleanWorkoutStats, repeatableSet, workoutComparison } from './trax-plus.js'

describe('Trax+ helpers', () => {
  it('keeps legacy cardio labels while showing optional metrics', () => {
    expect(cardioLabel({ min: 20, speed: 9 })).toBe('20 min @ 9 km/h')
    expect(cardioLabel({ min: 20, distance: 3.2, pace: '6:15', speed: 8 })).toBe('20 min · 3.2 km · pace 6:15 · 8 km/h')
  })

  it('drops empty optional cardio and Watch fields', () => {
    expect(cleanCardioMetrics({ min: 20, distance: '', pace: 'bad', speed: 8 })).toEqual({ min: 20, speed: 8 })
    expect(cleanWorkoutStats({ activeCalories: 420, totalCalories: '', avgHeartRate: 151 })).toEqual({ activeCalories: 420, avgHeartRate: 151 })
  })

  it('copies only a completed earlier set', () => {
    expect(repeatableSet([{ w: 50, r: 10, done: true }, { w: 0, r: 0, done: false }], 1)).toEqual({ w: 50, r: 10, done: true })
    expect(repeatableSet([{ w: 0, r: 0, done: false }], 0)).toBeNull()
  })

  it('compares same-workout sets and volume', () => {
    const previous = { name: 'Push', vol: 1000, entries: [{ id: 'bench', target: { mode: 'reps' }, sets: [{ w: 50, r: 10, done: true }] }] }
    const current = { name: 'Push', vol: 1100, entries: [{ id: 'bench', target: { mode: 'reps' }, sets: [{ w: 55, r: 10, done: true }] }] }
    const result = workoutComparison(current, previous)
    expect(result.setDelta).toBe(0)
    expect(result.volumeDelta).toBe(100)
    expect(result.exercises[0].delta).toBe(5)
  })
})
