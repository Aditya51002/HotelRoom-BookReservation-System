# Hotel Room Reservation System

Production-style monorepo for a hotel room reservation console. The backend is a Node.js + Express + TypeScript REST API, and the frontend is a React + TypeScript + Vite app with Tailwind CSS, Zustand, Axios, and lucide-react icons.

Live URL: `TODO`

## Setup

```bash
npm install
npm run dev
```

The API runs on `http://localhost:4000`. The frontend runs on `http://localhost:5173`.

Copy `.env.example` to `.env` if you want to override local configuration.

## Scripts

```bash
npm run dev
npm run dev:backend
npm run dev:frontend
npm run build
npm run test
```

## Architecture

```text
hotel-reservation
|-- backend
|   |-- src
|   |   |-- engine
|   |   |   |-- hotelConfig.ts
|   |   |   |-- bookingAlgorithm.ts
|   |   |   `-- travelTime.ts
|   |   |-- middleware
|   |   |   `-- validate.ts
|   |   |-- routes
|   |   |   `-- booking.routes.ts
|   |   |-- types
|   |   |   `-- hotel.ts
|   |   `-- server.ts
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- hooks
|   |   |-- store
|   |   |-- types
|   |   `-- App.tsx
|   `-- package.json
`-- package.json
```

## Domain Rules

The hotel has 97 rooms across 10 floors. Floors 1 through 9 have rooms `101-110` through `901-910`. Floor 10 has `1001-1007`. Position 1 is closest to the lift.

Travel time between two rooms:

```text
horizontal = abs(positionA - positionB) * 1 minute
vertical   = abs(floorA - floorB) * 2 minutes
total      = horizontal + vertical
```

## Booking Algorithm

Step 1: Same floor search

For each floor with enough available rooms, the backend enumerates all `N`-room combinations and calculates total travel time. It chooses the lowest travel time, with lower floors winning ties.

Step 2: Cross-floor search

If no single floor can satisfy the request, the backend sorts all available rooms by floor and position, takes the first 30 candidates, enumerates `N`-room combinations, and chooses the combination with the lowest total travel time.

The algorithm is implemented as pure functions in `backend/src/engine/bookingAlgorithm.ts`.

## API

### `GET /api/hotel/state`

Returns the current in-memory hotel state.

```json
{
  "rooms": []
}
```

### `POST /api/hotel/book`

Books 1 to 5 rooms.

Request:

```json
{
  "count": 3
}
```

Success response:

```json
{
  "bookedRooms": [],
  "travelTime": 2,
  "floorsSpanned": [1],
  "message": "Booked 3 rooms"
}
```

Errors:

```json
{ "error": "body: Required", "code": "VALIDATION_ERROR" }
{ "error": "Not enough rooms available", "code": "NOT_ENOUGH_ROOMS" }
```

### `POST /api/hotel/random`

Randomly marks about 45% of available rooms as occupied. Booked rooms are preserved.

### `POST /api/hotel/reset`

Restores all 97 rooms to available and clears the in-memory state.

## Deployment

Backend: deploy the `backend` workspace to Railway or Render and set `PORT` plus `FRONTEND_URL`.

Frontend: deploy the `frontend` workspace to Vercel and set `VITE_API_URL` to the deployed backend URL ending in `/api/hotel`.
