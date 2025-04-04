import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Medication from './pages/Medication';
import Orders from './pages/Orders';
import Promos from './pages/Promos';
import Banners from './pages/Banners';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const location = useLocation();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isAuthRoute = location.pathname === '/' || location.pathname === '/signup';

  useEffect(() => {
    if (!isAuthRoute) {
      setOpenSidebarToggle(true);
    }
  }, [location.pathname]);

  return (
    <div className='grid-container'>
      {!isAuthRoute && <Header OpenSidebar={OpenSidebar} />}
      {!isAuthRoute && <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />}
      <main className='main-container'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/medication' element={<Medication />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/products' element={<Products />} />
          <Route path='/promos' element={<Promos />} />
          <Route path='/banners' element={<Banners />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/header' element={<Header />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
