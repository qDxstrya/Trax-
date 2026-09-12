# Trax+ final standalone build

This is the complete Trax+ source project, not a patch.

The GitHub Pages workflow builds in standalone mode. On the first launch of this final release,
Trax+ replaces any old demo/profile state in the browser with the empty default state, then records
a versioned migration marker. That reset runs once only; workouts entered afterwards persist across
reloads and future deployments.

The clean state contains no workouts, routines, schedule, body-weight entries, target weight,
working weights, streak/history, active session, favourites, custom exercises, equipment profiles,
gym cards or account/guest session inherited from the previous build. Built-in app content remains:
the complete exercise catalogue, instructions/media links, and optional starter plans available from
Settings > Data > Load starter plan.

To deploy, put the contents of this project at the root of the GitHub repository and run the
`Deploy Trax+ to GitHub Pages` workflow. To test the same build locally, run `npm ci` and
`npm run build:standalone` inside `frontend`.

Because GitHub Pages is static hosting, account/cloud sync and server-hosted AI Coach features need
the included backend or a separate self-hosted deployment. All local workout-tracking, planning,
history, statistics, import/export, exercise-library and customisation features remain available.
