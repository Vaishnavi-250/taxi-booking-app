# Taxi Booking Application

Prototype app for:
- Instant ride booking
- Live driver tracking (simulated)
- Online payments (demo flow)
- Fare estimates
- Driver rating
- Local language support

## Run
1. `npm install`
2. `node server.js`
3. Open `http://localhost:3000`

## API
- `GET /drivers` (lists drivers)
- `GET /fare-estimate?pickup=...&dropoff=...`
- `POST /book` (ride booking)
- `POST /rate` (driver rating)
