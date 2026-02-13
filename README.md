# InboxKit: Real-Time Collaborative Grid

A high-performance, real-time shared grid application where users can claim and toggle blocks in a massive shared board. Built with a focus on system atomicity, low-latency interactions, and clean modular architecture.

## 🚀 Live Demo Features
- **Real-Time Sync**: Every block claim is broadcasted to all connected users instantly using WebSockets.
- **Race Condition Protection**: Uses **Redis Lua scripts** to ensure that ownership claims are atomic across distributed instances.
- **Optimistic UI**: Zero-latency feedback on the frontend, with smart server-reconciliation and rollback logic.
- **Leaderboard**: Live-updating rankings based on block ownership.
- **Persistence**: Remembers your identity across browser refreshes via persistent User IDs.

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Socket.io-client |
| **Backend** | Node.js, Express, TypeScript, Socket.io |
| **Database** | Upstash Redis (Serverless) |
| **Utilities** | React Hot Toast, Focal Animations |

## 🏗️ Project Structure
```text
├── backend/            # Express & Socket.io server
│   └── src/index.ts    # Core logic & Redis Lua scripts
├── frontend/           # React + Vite application
│   ├── src/hooks/      # Real-time socket & state management
│   ├── src/components/ # Modular UI components
│   └── src/utils/      # Shared helper functions
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- An Upstash Redis account (or local Redis instance)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# UPSTASH_REDIS_REST_URL=your_url
# UPSTASH_REDIS_REST_TOKEN=your_token
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with:
# VITE_BACKEND_URL=http://localhost:5000
npm run dev
```

## 🧠 Technical Highlights

### Atomic Conflict Resolution
In a real-time collaborative environment, two users might click the same block at the exact same millisecond. To solve this without a database "race condition," we use a **Redis Lua script**:
```lua
local current = redis.call('HGET', KEYS[1], ARGV[1])
if not current then
    redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
    return 'SET'
-- ... toggle logic ...
```
This script runs as a single atomic operation inside Redis, making it physically impossible for two users to claim the same block.

### Optimistic Rendering
The frontend uses a "trust-but-verify" model. When you click a block, we update the local React state **instantly**. If the server rejects the claim (e.g., someone else beat you to it), the frontend catches the `selection-failed` event and rolls back the UI to the correct server state with an error toast.

---
Built as an assignment for InboxKit.
