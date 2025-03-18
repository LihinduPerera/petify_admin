import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Medication from './pages/Medication'
import Orders from './pages/Orders'
import Promos from './pages/Promos'
import Banners from './pages/Banners'
import Categories from './pages/Categories'
import Products from './pages/Products'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <Router>
      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <main className='main-container'>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path='/medication' element={<Medication/>} />
            <Route path='/orders' element={<Orders/>} />
            <Route path='/products' element={<Products/>} />
            <Route path='/promos' element={<Promos/>} />
            <Route path='/banners' element={<Banners/>} />
            <Route path='/categories' element={<Categories/>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
