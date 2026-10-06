# Money Muvz · FinStack IQ (demo)

A learn-by-doing financial-life game for grades 6–8, built on Next.js. Students make a Muv (avatar), earn UP$ on Hustle Block, make choices, live with the consequences (DOWN$), recover, change their neighborhood (RIPPLE), and learn to spot scams in Scamaland, USA. There are no quizzes.

This is a **demo build**. Everything runs in the browser with seeded and mock data. There are no real accounts, payments, or third-party financial integrations.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

Requires Node 20+.

## What's in the demo

| Route | What it is |
| --- | --- |
| `/` | Welcome: START MUVMENT, I HAVE A JOIN CODE |
| `/create` | Create Your Muv: hair, color, outfit, shoes, accessory, name, animation preview |
| `/join` | 6-character class code (demo class: `MUVZ7A`) |
| `/block` | My Block: HUD (UP$, STACK, RIPPLE, PROGRESS, STREAK), the street, the city map with locked zones, the Scamaland bus stop |
| `/hustle` | Hustle Block: 4 missions, 3 mini-jobs (+ a 4th unlocked by the court), consequence engine, DOWN$, recovery, world transformation |
| `/scamaland` | Scamaland, USA: Too Good to Be True, The Shark Bank, Get Out, plus the Scam Radar |
| `/collection` | Muvz Collection: earned sneakers, headphones, backpacks, neighborhood items, badges; equip earned gear |
| `/insights` | Behavioral data: event stream, derived behavior signals, rule-based preview of future personalization |
| `/teacher` | Teacher mode: create a class, get a join code, class progress cards, student roster (seeded mock class + any student who joins on this browser) |
| `/demo` | Investor demo: one click loads a populated mid-game save |

Global mute is in the HUD (or press `M`).

## How it's built

- `src/game/types.ts`: player, Hustle, and Scamaland state enums, mirroring the build brief's state list.
- `src/game/store.ts`: the mission engine (Zustand). Every scene maps to an explicit `HustleState`/`ScamalandState` + `PlayerState`. All money, STACK, RIPPLE, DOWN$, unlocks, and missions go through helpers that also emit events.
- `src/game/content.ts`: missions, jobs, prices, zones, red flags, items, avatar options, cast.
- `src/game/signals.ts`: behavior signals derived from the event log, plus the adaptation rules preview. No AI runs in the beta.
- `src/game/demo.ts`: the investor demo save. `src/game/classroom.ts`: teacher classes and the seeded mock class.
- `src/game/sound.ts`: synthesized Web Audio cues (no audio files).
- `src/components/Avatar.tsx`: one SVG renderer for the player and every NPC, with CSS animation states (idle, walk, run, celebrate, disappointed, thinking, interact, recovery, unlock).
- `src/features/hustle/*`, `src/features/scamaland/*`: scene components.

### Persistence

Player state is saved to `localStorage` (`money-muvz:v1`), so leaving and coming back keeps avatar, UP$, STACK, RIPPLE, missions, items, zones, neighborhood changes, streak, Scam Radar, and the current mission scene. Teacher classes are saved under `money-muvz:teacher`. For a real classroom pilot, swap the Zustand `persist` storage for an API-backed store; the state shape and event log are already serializable.

### Events

Every meaningful action emits one of the brief's core events (`session_started`, `job_completed`, `down_triggered`, `recovery_completed`, `red_flag_collected`, …) with a session id, mission, and payload. `/insights` can export them as JSON.

## Deploying

It's a standard Next.js app with only static routes, so it deploys as-is to Vercel (import the repo, no env vars needed) or any Node host via `npm run build && npm start`.
