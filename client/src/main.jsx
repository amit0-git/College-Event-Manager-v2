import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserLogin from "./components/auth/userLogin.jsx"
import UserSignup from "./components/auth/userSignup.jsx"
import StudentRegister from "./components/user/studentRegister.jsx"

import SoloEvents from './components/user/individualEvent.jsx'
import UserProfile from './components/user/profile.jsx'

import TeamEvent from "./components/user/teamEvent.jsx"
import ParticipationSummary from './components/user/participationDash.jsx'
import Invitation from "./components/user/invitation.jsx"
import Developer from "./components/user/developer.jsx"
import Home from "./components/user/home.jsx"

import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  {
      path: '/',
      element: <App />, // Main App component
  
      children: [

        {
          path: '/',
          element: <Home />,
        },
         
        {
            path: '/login',
            element: <UserLogin />,
          },
          {
            path: '/signup',
            element: <UserSignup />,
          },
          {
            path: '/studentRegister',
            element: <StudentRegister />
          }
            ,
          {
            path: '/teamEvent',
            element: <TeamEvent />
          }
            ,
          {
            path: '/individualEvent',
            element: <SoloEvents />
          },
            , {
            path: "/profile",
            element: <UserProfile />
          }, {
            path: "/participation",
            element: <ParticipationSummary />
          }
            , {
            path: "/invitation",
            element: <Invitation />
          }
          , {
            path: "/developer",
            element: <Developer/>
          }
         
          
      ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>



    <RouterProvider router={router} />


  </StrictMode>,
)
