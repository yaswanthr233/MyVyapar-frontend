import './App.css'
import Login from './pages/Login/index.jsx'
import Signup from './pages/Signup/index.jsx'
import { Routes, Route,useLocation } from 'react-router'
import Dashboard from './pages/Dashboard/dashboard.jsx'
import Sidebar from './components/Sidebar/sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute/index.jsx'

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Sidebar className="sidebar" />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </div>
    
  )
}

export default App
