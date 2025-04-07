import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import Landing from './pages/Landing'
import Playquiz from './pages/Playquiz'
import Leaderboard from './pages/Leaderboard'
import Assignquiz from './pages/Assignquiz'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/playquiz" element={<Playquiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/assign-quiz" element={<Assignquiz />} />
      </Routes>
    </BrowserRouter>
    {/* <Home /> */}
    {/* <Dashboard /> */}
    {/* <Quiz /> */}
    </>
  )
}

export default App
