import './App.css'
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from "./components/navbar.jsx"

function App() {



  const location = useLocation();

  const routesWithNavbar = ['/login','/teamEvent', '/individualEvent', '/profile', '/participation', '/invitation', '/developer',"/studentRegister"];


  const showNavbar = routesWithNavbar.includes(location.pathname);
  return (
    <>
      {showNavbar && <NavigationBar />}
      <Outlet />
    </>
  )
}

export default App
