
import './App.css'
import Blocks from './components/Blocks'

function App() {


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

      <main className="container mx-auto pb-20">
        <Blocks />
      </main>
    </div>
  );
}

export default App
