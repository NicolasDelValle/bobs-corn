import { config } from '@/config'

function HomeView() {


  return (
    <>
      <div className="card">
        Nose
      </div>

      <div className="info">
        <p>API URL: {config.api.baseUrl}</p>
        <p>Version: {config.app.version}</p>
        <p>✅ Path aliases working</p>
        <p>✅ TypeScript strict mode</p>
        <p>✅ Docker ready</p>
        <p>✅ Environment variables</p>
      </div>
    </>
  )
}

export default HomeView
