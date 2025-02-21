import { createContext, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Profile from './pages/Profile'
import {Route , createBrowserRouter , createRoutesFromElements, Outlet, RouterProvider, Navigate} from 'react-router-dom'
import Routelayout from './layout/Routelayout'
import Notfound from './components/Notfound'
import CreatePost from './pages/CreatePost'
import EditProfile from './pages/EditProfile'
import Chat from './pages/Chat'

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); 

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Routelayout />}>
        <Route index element={<Home/>} />
        <Route path='/profile/:id' element={<Profile/>}/>
        <Route path='*' element={<Notfound/>} />
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signin />}/>
        <Route path='/createPost/:id' element={<CreatePost />}/>
        <Route path='/editProfile/:id' element={<EditProfile />}/>
        <Route path='/chat/:id' element={<Chat/>} />
       
      </Route>
    )
  )

  return (
    <>
   <RouterProvider router={router} />
    </>
  )
}

export default App
