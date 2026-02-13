import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Blocks from './components/Blocks'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { useSocket } from './hooks/useSocket'

function App() {
  const { socket, myId, uniqueUsers, leaderboard } = useSocket()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          leaderboard={leaderboard}
          uniqueUsers={uniqueUsers}
          myId={myId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto pb-20 pt-10">
          <Toaster />
          <div className="max-w-5xl mx-auto px-6">
            <Blocks socket={socket} myId={myId} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
