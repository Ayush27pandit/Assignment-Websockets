import { useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import Blocks from './components/Blocks'
import toast, { Toaster } from 'react-hot-toast';

const socket = io(import.meta.env.VITE_BACKEND_URL as string, {
  auth: {
    id: localStorage.getItem('inboxkit-user-id')
  }
})

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id)
    })

    socket.on("user-id", (userId) => {
      localStorage.setItem('inboxkit-user-id', userId);
      console.log("Received persistent user ID:", userId);
    })

    socket.on("user_joined", ({ id }) => {
      toast(`${id} joined`, { icon: '👋' })
    })

    socket.on("user_left", ({ id }) => {
      toast(`${id} left`, { icon: '🚪' })
    })


    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    return () => {
      socket.off('connect')
      socket.off('user-id')
      socket.off('user_joined')
      socket.off('user_left')
      socket.off('disconnect')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="py-8 text-center border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
          InboxKit Assignment
        </h1>
        <p className="mt-2 text-muted-foreground font-medium">
          Responsive Matrix of {300} Interactive Blocks
        </p>
      </header>
      <Toaster />
      <main className="container mx-auto pb-20">
        <Blocks socket={socket} />
      </main>
    </div>
  );
}

export default App

