# Blood Donor Emergency Finder - Project Context

Welcome to the **Blood Donor Emergency Finder** project. This document serves as a guide for understanding the project's architecture, technologies, and development workflows.

## Project Overview

A modern React-based web application designed to connect blood donors with emergency blood requests in real-time.

### Core Technologies
- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **State Management:** React Context API (`src/context/AppContext.jsx`)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Toasts:** [React Hot Toast](https://react-hot-toast.com/)

## Backend & Database Architecture

The project features a decoupled architecture with a FastAPI backend and a MySQL database.

### Technologies
- **Backend:** FastAPI (Python 3.10+)
- **Database:** MySQL
- **SQL Interaction:** Raw SQL queries (using `mysql-connector-python`)
- **Authentication:** JWT (JSON Web Tokens) with `python-jose` and `passlib`

### Directory Structure
- `backend/`: Root for backend services.
    - `app/`: FastAPI application code.
        - `routers/`: API route definitions (auth, donors, requests, notifications).
        - `schemas/`: Pydantic models for request/response validation.
        - `utils/`: Utility functions (security, hashing).
        - `database.py`: MySQL connection pooling and raw SQL execution helpers.
    - `sql/`: SQL scripts (schema, seeds).
    - `.env`: Environment variables (DB credentials, secret keys).

## Building and Running

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Server

### Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your MySQL credentials

# Run database schema
# Use your preferred MySQL client to run backend/sql/schema.sql

# Start backend server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
# In the project root
npm install

# Start development server
npm run dev
```
The frontend is configured via `vite.config.js` to proxy `/api` requests to `http://localhost:8000`.

## Development Conventions

- **Database:** Always use parameterized raw SQL queries to prevent SQL injection.
- **API:** Use Pydantic schemas for all request and response bodies.
- **Frontend State:** `AppContext.jsx` manages the global authentication state and fetches user profiles on mount.
- **Authentication:** Attach the JWT as a Bearer token in the `Authorization` header for protected routes.

## Key Files for Reference
- `src/routes/AppRouter.jsx`: Entry point for all navigation.
- `src/context/AppContext.jsx`: Central hub for global state.
- `src/data/mockData.js`: Contains static lists like `BLOOD_GROUPS` and `CITIES`.
- `tailwind.config.js` (or inline in Vite config): Styling configuration.
