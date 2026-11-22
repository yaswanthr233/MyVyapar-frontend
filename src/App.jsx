
import './App.css'
import Login from './pages/Login/index.jsx'
import Signup from './pages/Signup/index.jsx'
import { Routes, Route, useLocation } from 'react-router'
import Dashboard from './pages/Dashboard/dashboard.jsx'
import Sidebar from './components/Sidebar/sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute/index.jsx'
import Navbar from './components/Navbar/navbar.jsx'
import Footer from './components/Footer/footer.jsx'
import Inventory from './pages/Inventory/inventory.jsx'
import ProductContext from './context/productContext.jsx'
import { useState } from 'react'

function App() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [inStockProducts, setInStockProducts] = useState(0);
  const location = useLocation();
  const hideSidebar = ['/login', '/signup'].includes(location.pathname);
  const mainContentClass = hideSidebar ? 'main-content full-width' : 'main-content';
  const changeProducts = (data) => {
    setProducts(data.products);
    setTotalProducts(data.totalProducts);
    setLowStockProducts(data.lowStockProducts);
    setInStockProducts(data.inStockProducts);
  }

  return (

    <div className="App">
      {!hideSidebar && <Sidebar />}
      <main className={mainContentClass}>
        {!hideSidebar && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProductContext.Provider value={{ products, changeProducts, totalProducts, lowStockProducts, inStockProducts }}>
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              </ProductContext.Provider>
            }
          />
        </Routes>
        {!hideSidebar && <Footer className="footer" />}
      </main>
    </div>
  )
}

export default App
