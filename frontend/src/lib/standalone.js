// Browser keys that can contain personal state from the old demo, a signed-in profile or the
// first standalone patch. Keep the list explicit so unrelated site storage is never touched.
export const LEGACY_PROFILE_KEYS = Object.freeze([
  'gym_demo_seeded_v1',
  'trax_plus_standalone_fresh_v1',
  'gym_dirty',
  'gym_guest',
  'gym_user',
  'gym_state_v1',
])

/**
 * Run the standalone clean-start migration exactly once.
 *
 * @param {Storage} storage browser localStorage (or the same interface in a test)
 * @param {string} marker marker unique to this final release
 * @param {() => void} writeEmptyState writes the app's current DEF state
 * @returns {boolean} whether the reset ran
 */
export function resetStandaloneStorage(storage, marker, writeEmptyState) {
  if (storage.getItem(marker)) return false
  LEGACY_PROFILE_KEYS.forEach(key => storage.removeItem(key))
  writeEmptyState()
  storage.setItem(marker, '1')
  return true
}
