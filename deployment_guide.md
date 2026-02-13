# Deployment Guide: InboxKit Real-Time Grid

To deploy this project for free with WebSocket support, follow these steps:

## 1. Database (Already Done)
You are using **Upstash Redis**, which is perfect for free deployments as it's serverless and has a generous free tier. Keep your `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` handy.

---

## 2. Backend (Deploy on Render)
Render is the best "truly free" option that supports WebSockets.

1.  Create an account on [Render.com](https://render.com).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    -   **Name**: `inboxkit-backend`
    -   **Environment**: `Node`
    -   **Root Directory**: `backend`
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`
    -   **Plan**: `Free`
5.  **Environment Variables**:
    -   `PORT`: `5000`
    -   `UPSTASH_REDIS_REST_URL`: (Your Upstash URL)
    -   `UPSTASH_REDIS_REST_TOKEN`: (Your Upstash Token)

> [!WARNING]
> Render's free tier "spins down" after 14 minutes of inactivity. The first request after a long break can take ~30 seconds to wake up.

---

## 3. Frontend (Deploy on Vercel)
Vercel is the gold standard for Vite/React deployments.

1.  Create an account on [Vercel.com](https://vercel.com).
2.  Click **Add New** > **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    -   **Framework Preset**: `Vite`
    -   **Root Directory**: `frontend`
5.  **Environment Variables**:
    -   `VITE_BACKEND_URL`: `https://inboxkit-backend.onrender.com` (Use your actual Render URL)
6.  Click **Deploy**.

---

## 🛠️ Critical Deployment Tips
-   **CORS**: In `backend/src/index.ts`, your `cors` is currently set to `origin: "*"`. This is fine for an assignment, but in production, you might want to restrict it to your Vercel URL.
-   **WebSocket URL**: Ensure your frontend Vercel deployment uses `https://` for the backend URL. Socket.io will automatically handle the `wss://` upgrade.
-   **Spin-up**: If the site doesn't work immediately, refresh after 30 seconds—the backend is likely just waking up.

---
**Alternative**: If you want a faster backend without "sleep" mode, **Railway.app** is excellent but requires a $5 trial credit or a small subscription after the trial ends.
