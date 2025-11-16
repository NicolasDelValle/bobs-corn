import './App.css'
import ThemeToggle from './components/ThemeSwitch/ThemeToggle'
import HomeScreen from './views/Home'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <ThemeToggle />
      <main className="container mx-auto px-4 py-8">
        <HomeScreen />
      </main>
    </div>
  )
}

export default App
