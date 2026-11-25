# SYNAPSE – Healthcare Appointment Booking Platform

SYNAPSE is a healthcare appointment management platform that connects patients with healthcare providers. It allows patients to discover doctors, check their availability, book appointments, and manage their healthcare visits through a simple interface.

Providers can manage their profiles, define consultation availability, and view and manage patient appointments.

## Features

### Patient
- User registration and login
- Secure authentication
- Search healthcare providers
- Browse providers by specialization
- View provider profiles and consultation fees
- Check available appointment slots
- Book appointments
- View appointment history
- Track appointment status

### Healthcare Provider
- Provider profile management
- Provider specialization and qualification details
- Set weekly availability
- Configure appointment slot duration
- View patient appointments
- Manage appointment status

### Backend
- RESTful API architecture
- MongoDB database integration
- JWT-based authentication
- Password hashing
- Role-based authorization
- Appointment validation
- Automatic appointment slot generation
- Prevention of conflicting bookings

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application |
| Expo | React Native development |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcrypt | Password hashing |

## Project Structure

```text
SYNAPSE/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── Provider.js
│   │   ├── Appointment.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   ├── services/
│   │   └── appointmentService.js
│   │
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── App.js
│   └── package.json
│
└── README.md
```

*Adjust the structure to match the actual repository.*

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SYNAPSE
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start Expo:

```bash
npx expo start
```

Make sure the frontend API base URL points to the backend server. When testing on a physical device