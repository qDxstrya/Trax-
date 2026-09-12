// Trax+ additions shared by the workout, history and summary surfaces.
// Optional values are intentionally omitted when empty so old openGym data keeps
// the same shape and existing readers continue to work.

export const WATCH_STAT_FIELDS = ['activeCalories', 'totalCalories', 'avgHeartRate']

export function cleanWorkoutStats(input = {}) {
  const out = {}
  for (const field of WATCH_STAT_FIELDS) {
    const n = Number(input[field])
    if (Number.isFinite(n) && n > 0) out[field] = Math.round(n * 10) / 10
  }
  return out
}

export function hasWorkoutStats(stats) {
  return !!stats && WATCH_STAT_FIELDS.some(field => Number(stats[field]) > 0)
}

export function cleanCardioMetrics(input = {}) {
  const out = {}
  for (const field of ['min', 'speed', 'distance', 'cardioReps']) {
    const n = Number(input[field])
    if (Number.isFinite(n) && n > 0) out[field] = Math.round(n * 100) / 100
  }
  const pace = String(input.pace || '').trim()
  if (/^\d{1,3}:[0-5]\d$/.test(pace)) out.pace = pace
  return out
}

export function cardioLabel(set = {}) {
  const hasExtras = Number(set.distance) > 0 || Number(set.cardioReps) > 0 || !!set.pace
  if (!hasExtras) return `${Number(set.min) || 0} min @ ${Number(set.speed) || 0} km/h`
  const parts = []
  if (Number(set.min) > 0) parts.push(`${Number(set.min)} min`)
  if (Number(set.distance) > 0) parts.push(`${Number(set.distance)} km`)
  if (Number(set.cardioReps) > 0) parts.push(`${Math.round(Number(set.cardioReps))} reps`)
  if (set.pace) parts.push(`pace ${set.pace}`)
  if (Number(set.speed) > 0) parts.push(`${Number(set.speed)} km/h`)
  return parts.join(' · ')
}

export function repeatableSet(sets = [], targetIndex = 0) {
  const before = sets.slice(0, targetIndex).reverse().find(set => set.done)
  return before || null
}

export function workoutComparison(current, previous) {
  if (!current || !previous) return null
  const currentEntries = current.entries || []
  const previousEntries = previous.entries || []
  const previousById = new Map(previousEntries.map(entry => [entry.id, entry]))
  const exercises = currentEntries.map(entry => {
    const old = previousById.get(entry.id)
    if (!old) return { id: entry.id, current: entry, previous: null, delta: null }
    const mode = entry.target?.mode || old.target?.mode || 'reps'
    const metric = rows => {
      const done = (rows?.sets || []).filter(set => set.done && !set.warmup)
      if (mode === 'cardio') return Math.max(0, ...done.map(set => Number(set.speed) || 0))
      if (mode === 'time') return Math.max(0, ...done.map(set => Number(set.sec) || 0))
      return Math.max(0, ...done.map(set => Number(set.w) || 0))
    }
    const now = metric(entry)
    const then = metric(old)
    return { id: entry.id, current: entry, previous: old, currentMetric: now, previousMetric: then, delta: now - then, mode }
  })
  const currentSets = currentEntries.reduce((n, entry) => n + (entry.sets || []).filter(set => set.done && !set.warmup).length, 0)
  const previousSets = previousEntries.reduce((n, entry) => n + (entry.sets || []).filter(set => set.done && !set.warmup).length, 0)
  return {
    current,
    previous,
    currentSets,
    previousSets,
    setDelta: currentSets - previousSets,
    currentVolume: Number(current.vol) || 0,
    previousVolume: Number(previous.vol) || 0,
    volumeDelta: (Number(current.vol) || 0) - (Number(previous.vol) || 0),
    exercises,
  }
}
