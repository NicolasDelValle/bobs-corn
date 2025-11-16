
function HomeScreen() {
  return (
    <div className="text-center space-y-8">

      <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Bob's Corn 🌽
      </h1>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl lg:text-2xl text-foreground/80">
          Modern React + TypeScript + Vite Application
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-background-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-primary mb-2">⚡ Vite</h3>
            <p className="text-sm text-foreground/70">Lightning fast build tool with HMR</p>
          </div>

          <div className="bg-background-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-primary mb-2">⚛️ React 19</h3>
            <p className="text-sm text-foreground/70">Latest React with modern features</p>
          </div>

          <div className="bg-background-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-primary mb-2">📘 TypeScript</h3>
            <p className="text-sm text-foreground/70">Type-safe development experience</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-background-secondary border border-border rounded-lg">
          <p className="text-sm text-foreground/80">
            Configuración completa con Tailwind CSS, Storybook, Vitest y Docker.
            <br />
            <span className="text-primary font-medium">¡Listo para desarrollo con las mejores prácticas 2025!</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
