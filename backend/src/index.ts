import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Redis } from '@upstash/redis';

dotenv.config();

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());


const httpServer = createServer(app);

app.get('/', (req: Request, res: Response) => {
    res.type('text/plain').send('Hello from InboxKit Server \n');
});

declare module "socket.io" {
    interface Socket {
        userId: any;
    }
}

const io = new Server(httpServer, {
    cors: { origin: "*" }
});

io.on("connection", async (socket) => {
    console.log("a user connected", socket.id);
    let userId = socket.handshake.auth.id;
    if (!userId) {
        userId = String(await redis.incr("user:id"));
    } else {
        userId = String(userId);
    }
    socket.userId = userId;

    await redis.hset("active_users", { [socket.id]: userId });
    socket.emit("user-id", userId);

    // Send the current grid state to the newly connected user
    try {
        const gridState = await redis.hgetall('grid-state');
        if (gridState) {
            socket.emit('initial-state', gridState);
        }
    } catch (error) {
        console.error("Error fetching initial state from Redis:", error);
    }



    // Broadcast updated user list to everyone
    const users = await redis.hgetall("active_users");
    io.emit("users-list", users || {});

    socket.broadcast.emit("user_joined", {
        id: userId,
        socketId: socket.id
    })

    socket.on('cell-clicked', async ({ index }) => {
        try {
            const indexStr = String(index);

            // ATOMIC OPERATION using Lua Script
            // Logic: 
            // 1. Get current owner
            // 2. If current owner is me -> Delete (toggle off)
            // 3. If current owner is null -> Set to me (toggle on)
            // 4. If current owner is someone else -> Return owner to signal failure
            const luaScript = `
                local current = redis.call('HGET', KEYS[1], ARGV[1])
                if not current then
                    redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
                    return 'SET'
                elseif current == ARGV[2] then
                    redis.call('HDEL', KEYS[1], ARGV[1])
                    return 'DEL'
                else
                    return current
                end
            `;

            const result = await redis.eval(luaScript, ['grid-state'], [indexStr, socket.userId]);

            if (result === 'SET') {
                io.emit('cell-updated', { index, owner: socket.userId });
            } else if (result === 'DEL') {
                io.emit('cell-updated', { index, owner: null });
            } else {
                // Someone else beat us to it (Race Condition handled!)
                socket.emit('selection-failed', {
                    index,
                    owner: result, // Include actual owner
                    message: `Cell ${Number(index) + 1} is already owned by User #${result}`
                });
            }
        } catch (error) {
            console.error("Error updating cell-clicked with Lua in Redis:", error);
        }
    });

    socket.on("disconnect", async () => {
        console.log("user disconnected", socket.id);
        await redis.hdel("active_users", socket.id);

        // Broadcast updated list
        const users = await redis.hgetall("active_users");
        io.emit("users-list", users || {});

        socket.broadcast.emit("user_left", {
            id: socket.userId,
            socketId: socket.id
        });
    });
});



httpServer.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});