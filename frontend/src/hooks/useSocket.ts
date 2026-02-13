import { useState, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket: Socket = io(import.meta.env.VITE_BACKEND_URL as string, {
    auth: {
        id: localStorage.getItem('inboxkit-user-id')
    }
});

export const useSocket = () => {
    const [activeUsers, setActiveUsers] = useState<{ [socketId: string]: string }>({});
    const [myId, setMyId] = useState<string | null>(localStorage.getItem('inboxkit-user-id'));
    const [gridState, setGridState] = useState<{ [key: string]: string | null }>({});
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server with ID:', socket.id);
        });

        socket.on("user-id", (userId) => {
            localStorage.setItem('inboxkit-user-id', userId);
            setMyId(userId);
            console.log("Received persistent user ID:", userId);
        });

        socket.on("users-list", (users) => {
            setActiveUsers(users);
        });

        socket.on('initial-state', (state) => {
            setGridState(state || {});
        });

        socket.on('cell-updated', ({ index, owner }) => {
            setGridState(prev => ({
                ...prev,
                [index]: owner
            }));
        });

        socket.on("user_joined", ({ id }) => {
            toast(`${id} joined`, { icon: '👋' });
        });

        socket.on("user_left", ({ id }) => {
            toast(`${id} left`, { icon: '🚪' });
        });

        socket.on("selection-failed", ({ message, index, owner }) => {
            toast.error(message);
            if (index !== undefined) {
                setGridState(prev => ({
                    ...prev,
                    [index]: owner
                }));
            }
        });

        socket.on("rate-limit-exceeded", ({ message }) => {
            toast.error(message, { id: 'rate-limit' });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('User disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('user-id');
            socket.off('users-list');
            socket.off('initial-state');
            socket.off('cell-updated');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('rate-limit-exceeded');
            socket.off('selection-failed');
            socket.off('disconnect');
        };
    }, []);

    const uniqueUsers = useMemo(() => {
        if (!activeUsers) return [];
        const ids = Object.values(activeUsers || {});
        return Array.from(new Set(ids.filter(Boolean)));
    }, [activeUsers]);

    const leaderboard = useMemo(() => {
        if (!gridState) return [];
        const counts: { [userId: string]: number } = {};
        Object.values(gridState).forEach(owner => {
            if (owner) {
                const ownerStr = String(owner);
                counts[ownerStr] = (counts[ownerStr] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([userId, count]) => ({ userId, count }))
            .sort((a, b) => b.count - a.count);
    }, [gridState]);

    return {
        socket,
        myId,
        uniqueUsers,
        leaderboard,
        gridState,
        isConnected
    };
};
