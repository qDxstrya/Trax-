// Build modes for browser-only deployments. The final Trax+ project intentionally has no
// activatable demo mode; the constant remains for shared Coach feature gates inherited from
// openGym. The GitHub Pages workflow explicitly enables standalone mode.
export const STANDALONE = import.meta.env.VITE_STANDALONE === '1'
export const DEMO = false
export const DEMO_SEEDED = 'gym_demo_seeded_v1'
// This final release deliberately uses a new marker. Even if an earlier patch was opened and
// wrote its v1 marker, the first launch of this build still performs the promised clean start.
export const STANDALONE_FRESH = 'trax_plus_standalone_fresh_v2'
