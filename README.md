# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Setup and Running the Application

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MySQL Server**

### 1. Backend Setup (FastAPI + MySQL)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # On macOS/Linux:
    python3 -m venv venv
    source venv/bin/activate

    # On Windows:
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    *   Create a `.env` file in the `backend/` directory (if it doesn't exist).
    *   Add your MySQL credentials and a secret key:
        ```env
        DATABASE_URL=mysql+mysqlconnector://user:password@localhost/blood_donor_db
        SECRET_KEY=your_super_secret_key_here
        ALGORITHM=HS256
        ACCESS_TOKEN_EXPIRE_MINUTES=30
        ```

5.  **Initialize the Database:**
    *   Using your preferred MySQL client (e.g., MySQL Workbench, phpMyAdmin) or the command line, run the script provided in `backend/sql/schema.sql`.
    *   **Command Line Example:**
        ```bash
        mysql -u your_username -p < sql/schema.sql
        ```
    *   *Note: Ensure you have created the `blood_donor_db` database if the script doesn't handle it, though the provided script includes `CREATE DATABASE IF NOT EXISTS blood_donor_db;`.*

6.  **Run the Backend Server:**
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

### 2. Frontend Setup (React)

1.  **Navigate to the project root directory:**
    ```bash
    cd ..
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

4.  **Access the Application:**
    Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite proxy is configured to automatically forward `/api` requests to the backend at `http://localhost:8000`.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
