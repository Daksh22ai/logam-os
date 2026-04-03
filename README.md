# Logam OS

Logam OS is an agency command centre — a unified operating system for performance marketing agencies managing 15–50 clients.

It consists of two parts:
1. **Frontend:** A Next.js 16.2 web application using React 19, TailwindCSS v4, and Zustand.
2. **Backend:** A FastAPI python application for AI generation powered by LangChain and Groq API.

## Project Structure

```
logam-os/
├── frontend/           # The Next.js Next 16 Application
└── backend/            # The FastAPI Python Server
```

---

## 1. Setup the Backend

The backend requires Python 3.10+ and uses LangChain with the Groq API to serve the AI Chatbot.

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your environment variables (especially your Groq API Key):
   ```bash
   cp .env.example .env
   # Edit .env with your actual GROQ_API_KEY
   ```

### Running the Server

Start the API server on `http://localhost:8000`:
```bash
uvicorn app.main:app --reload
```

*Endpoints available:*
- `GET /health`
- `POST /api/chat`
- `POST /api/chat/stream`

---

## 2. Setup the Frontend

The frontend uses Next.js 16.2 App Router.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Database (Prisma)

The application uses Prisma acting on a PostgreSQL database.

1. Create a `.env` file in the `frontend` folder with your `DATABASE_URL`. If you don't have one, the dummy fallback URL will be used to generate the client but database queries will fail.
2. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

### Running the App

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The frontend will communicate with the backend API automatically.

---

## UI / UX Architecture

We are using a **Discord-inspired** layout with dark, minimal colors:
- Base background: `#07070a`
- Secondary backgrounds: `#0e0e12`, `#141418`
- Text: Off-white and muteds
- Accent: Logam Gold (`#f5c518`)
*(No gradients or purple/blue accents are implemented in the base layout to maintain structural cleanliness)*
