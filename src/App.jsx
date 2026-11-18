import './App.css'
import Login from './pages/Login/index.jsx'
import Signup from './pages/Signup/index.jsx'
import { Routes, Route } from 'react-router'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </div>
    
  )
}

export default App
