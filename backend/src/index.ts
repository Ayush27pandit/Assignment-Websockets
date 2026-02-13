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



    socket.broadcast.emit("user_joined", {
        id: userId


    })

    socket.on('cell-clicked', async ({ index }) => {
        try {
            // Get current owner of this cell
            const currentOwner = await redis.hget('grid-state', String(index));

            let newOwner = null;
            if (currentOwner === socket.userId) {
                // Toggle off if already owned by this user
                await redis.hdel('grid-state', String(index));
            } else {
                // Toggle on cant overwrite other owner
                newOwner = socket.userId;
                await redis.hset('grid-state', { [String(index)]: newOwner });
            }

            // Broadcast to EVERYONE (including sender to confirm)
            io.emit('cell-updated', { index, owner: newOwner });
        } catch (error) {
            console.error("Error updating cell-clicked in Redis:", error);
        }
    });

    socket.on("disconnect", async () => {
        console.log("user disconnected", socket.id);
        await redis.hdel("active_users", socket.id);
        socket.broadcast.emit("user_left", {
            id: socket.userId
        });
    });
});



httpServer.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});