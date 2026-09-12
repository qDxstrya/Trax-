# Trax+

Trax+ is a separate openGym-based gym tracker combining openGym's routines,
progression, exercise library, PWA/mobile support and analytics with selected
Trax features:

- Expanded cardio logging: duration, distance, reps, pace and speed.
- Optional workout-level Apple Watch totals: active calories, total calories and average heart rate.
- Completed-workout editing, including cardio values and Watch totals.
- Finish-screen comparison with the previous workout of the same name.
- One-tap repeat-last-set entry during a workout.

## Run locally

### Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Open `http://localhost:8080`.

For native Android update checks, set `VITE_RELEASES_URL` to your own release API before
building. It is intentionally unset by default, so Trax+ never points at openGym releases.

### Frontend development

```bash
cd frontend
npm install
npm run dev
```

The frontend remains compatible with the original openGym backend and mobile
build flow. See `docs/SELF_HOSTING.md` and `docs/MOBILE.md` for deployment and
Capacitor instructions.

## Data compatibility

Trax+ keeps the openGym state format. The new fields are optional, so existing
openGym profiles, routines, workouts and backups remain readable. Existing
cardio entries continue to display correctly; the extra cardio fields appear
only when entered.

Apple Watch values are entered manually in this build. No HealthKit data is uploaded to a
server; automatic HealthKit integration remains a separate native-platform task.

## Important

This project retains openGym's AGPL-3.0 license and upstream media notices.
Review `LICENSE` and `NOTICE.md` before redistributing a public build.
