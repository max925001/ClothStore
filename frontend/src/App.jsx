import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import CreateClothing from './pages/CreateClothing'
import ClothStore from './pages/ClothStore'
import ClothDetail from './pages/ClothDetail'

function App() {


  const userData = JSON.parse(localStorage.getItem('data')) || {}; 

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/createcloth' element={<ProtectedRoute>{(userData?.role === 'ADMIN')? <CreateClothing/> : <Navigate to="/" />}</ProtectedRoute>}/>
      <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path='/find-clothing' element={<ProtectedRoute><ClothStore/></ProtectedRoute>}/>
      <Route path='/cloth-detail/:clothingId' element={<ProtectedRoute><ClothDetail/></ProtectedRoute>}/>
      <Route  path='/admin/dashboard' element={<ProtectedRoute>{(userData?.role === 'ADMIN')? <AdminDashboard/> : <Navigate to="/" />}</ProtectedRoute>}/>
    </Routes>
  )
}

export default App
