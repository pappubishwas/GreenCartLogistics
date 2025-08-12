

# GreenCart Logistics – Delivery Simulation & KPI Dashboard

## 📌 Project Overview

GreenCart Logistics is an internal tool for simulating delivery operations and calculating KPIs based on proprietary company rules.
Managers can experiment with staffing levels, delivery schedules, and route allocations to assess their effect on profits and efficiency.

**Core Features:**

* Run delivery simulations with adjustable parameters.
* Dashboard with KPIs:

  * Total Profit
  * Efficiency Score
  * On-time vs Late Deliveries (chart)
  * Fuel Cost Breakdown (chart)
* CRUD management for Drivers, Routes, and Orders.
* JWT-based authentication for managers.
* Responsive UI with Tailwind CSS and charts.

---

## 🛠 Tech Stack

### Frontend

* React.js (Hooks)
* Tailwind CSS
* React Router
* Chart.js (via react-chartjs-2)
* Axios

### Backend

* Node.js + Express
* MongoDB (Cloud-hosted via MongoDB Atlas)
* Mongoose
* JWT Authentication
* bcrypt (Password hashing)
* csv-parse (CSV seeding)

### Testing

* Jest
* Supertest

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo_url>
cd <repo_folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env to set MONGO_URI, JWT_SECRET, and optional MANAGER credentials
npm run seed   # Seed DB with provided CSV data
npm run dev    # Start backend server on localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
# Optional: create .env with VITE_API_URL=http://localhost:5000/api
npm run start  # Starts Vite dev server (default: http://localhost:5173)
```

---

## 🔑 Environment Variables

**Backend (`.env`):**

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
MANAGER_EMAIL=manager@greencart.local
MANAGER_PASSWORD=securepassword
```

**Frontend (`.env`):**

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment Instructions

### Backend

* Deploy to Render / Railway / Heroku / AWS
* Set environment variables in the hosting platform.
* Ensure CORS is configured for the frontend domain.

### Frontend

* Deploy to Vercel / Netlify
* Set `VITE_API_URL` in environment variables to point to the deployed backend API.

### Database

* Use MongoDB Atlas (free tier) for a cloud-hosted database.

---

## 📡 API Documentation

### Auth

* **POST** `/api/auth/login`
  Body: `{ "email": "manager@greencart.local", "password": "password123" }`
  Response: `{ "token": "<jwt>" }`

### Drivers

* **GET** `/api/drivers` (auth required)
* **POST** `/api/drivers` (auth required)
* **PUT** `/api/drivers/:id` (auth required)
* **DELETE** `/api/drivers/:id` (auth required)

### Routes

* **GET** `/api/routes`
* **POST** `/api/routes`
* **PUT** `/api/routes/:id`
* **DELETE** `/api/routes/:id`

### Orders

* **GET** `/api/orders`
* **POST** `/api/orders`
* **PUT** `/api/orders/:id`
* **DELETE** `/api/orders/:id`

### Simulation

* **POST** `/api/simulation/run`
  Body:

  ```json
  {
    "availableDrivers": 3,
    "route_start_time": "09:00",
    "max_hours_per_driver": 8
  }
  ```

  Response: `{ "kpis": { ... } }`

* **GET** `/api/simulation/history`

---

## 📹 Walkthrough Video

\[Video Link Placeholder]

