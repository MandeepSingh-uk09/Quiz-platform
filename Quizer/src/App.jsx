import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import Landing from './pages/Landing'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
    {/* <Home /> */}
    {/* <Dashboard /> */}
    {/* <Quiz /> */}
    </>
  )
}

export default App
