# SYNAPSE Backend

REST API for the SYNAPSE appointment management application.

## Requirements
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Postman (recommended)

## Setup
1. Open the `backend` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your MongoDB URI and a JWT secret (at least 32 characters).
5. Run `npm run dev`.
6. Open `http://localhost:5000/`.

## API routes

### Public
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/providers`
- `GET /api/providers/:id`
- `GET /api/providers/:id/slots?date=YYYY-MM-DD`

### Authenticated (send `Authorization: Bearer TOKEN`)
- `GET /api/auth/me`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`
- `PATCH /api/appointments/:id/reschedule`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Admin only
- `POST /api/providers`
- `PATCH /api/providers/:id`
- `DELETE /api/providers/:id`
- `GET /api/admin/stats`
- `GET /api/admin/appointments`
- `GET /api/admin/users`

## Register
POST `/api/auth/register`
```json
{
  "name": "Ayan",
  "email": "ayan@example.com",
  "password": "StrongPass123",
  "phone": "9876543210"
}
```

## Login
POST `/api/auth/login`
```json
{
  "email": "ayan@example.com",
  "password": "StrongPass123"
}
```

Copy the returned token into Postman's Bearer Token authorization field.

## Create a provider (admin token required)
POST `/api/providers`
```json
{
  "name": "Dr. Rahul",
  "specialization": "Cardiology",
  "description": "Consultant",
  "slotDuration": 30,
  "availability": [
    { "day": "Monday", "startTime": "09:00", "endTime": "12:00" },
    { "day": "Tuesday", "startTime": "09:00", "endTime": "12:00" }
  ]
}
```

## Check slots
GET `/api/providers/PROVIDER_ID/slots?date=2026-12-01`

## Book an appointment
POST `/api/appointments`
```json
{
  "providerId": "PROVIDER_ID",
  "date": "2026-12-01",
  "startTime": "09:00",
  "reason": "Consultation"
}
```

## Notes
- Appointment dates use `YYYY-MM-DD`; times use 24-hour `HH:mm`.
- The server uses the server's local timezone when checking whether a date/time is in the past. Configure the server timezone consistently for production.
- Unique MongoDB partial index prevents duplicate confirmed bookings for the same provider/date/start time.
- For production, add rate limiting, email verification, password reset, refresh-token rotation, audit logging, monitoring, stricter CORS and timezone-aware scheduling.
- Never commit `.env` or expose your MongoDB credentials.
