import React from 'react'
// import Login from './components/Login.jsx'
import './App.css'


import {Routes, Route} from 'react-router-dom'
import MemDash from './components/member/MemDash.jsx'
import Admnavbar from './components/admin/AdmDashLayout.jsx'
import AdmDashLayout from './components/admin/AdmDashLayout.jsx'
import AdmDash from './components/admin/AdmDash.jsx'
import MemDashLayout from './components/member/MemDashLayout.jsx'
import Project from './components/admin/Project.jsx'
import Task from './components/admin/Task.jsx'
import Team from './components/admin/Team.jsx'
import Front from './components/Front.jsx'
import Login from './components/Login.jsx'


const App = () => {
  return (
    <div>
      
 <Routes>
  <Route path="/" element={<Front />} />
  <Route path="/login" element={<Login />} />

  {/* ADMIN DASHBOARD */}
  <Route path="/admdash" element={<AdmDashLayout />}>
    <Route index element={<AdmDash />} />
    <Route path="projects" element={<Project />} />
    <Route path="tasks" element={<Task />} />
    <Route path="team" element={<Team />} />
  </Route>

  {/* MEMBER DASHBOARD */}
  <Route path="/memdash" element={<MemDashLayout />}>
    <Route index element={<MemDash />} />
  </Route>
</Routes>


    </div>
  )
}

export default App