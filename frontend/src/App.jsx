import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CreateBook from './pages/CreateBook'
import Profile from './pages/Profile'
import BookStore from './pages/BookStore'
import BookDetail from './pages/BookDetail'
import AdminDashboard from './pages/AdminDashboard'

function App() {
const userData = JSON.parse(localStorage.getItem('data')) || {}; 
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/createbook' element={<ProtectedRoute>{(userData?.role === 'ADMIN')? <CreateBook/> : <Navigate to="/" />}</ProtectedRoute>}/>
      <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path='/find-book' element={<ProtectedRoute><BookStore/></ProtectedRoute>}/>
      <Route path='/book-detail/:bookId' element={<ProtectedRoute><BookDetail/></ProtectedRoute>}/>
      <Route  path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
    </Routes>
  )
}

export default App
