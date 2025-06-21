import React from 'react'
import Login from './components/Login.jsx'
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

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admdash" element={<AdmDashLayout><AdmDash /> </AdmDashLayout>} />
        <Route path="/projects" element={<AdmDashLayout />}>
          <Route index element={<Project />} />
        </Route>
        <Route path="/tasks" element={<AdmDashLayout />}>
          <Route index element={<Task />} />
        </Route>
        <Route path="/team" element={<AdmDashLayout />}>
          <Route index element={<Team />} />
        </Route>
       
        <Route path="/login" element={<Login />} />
        <Route path="/memdash" element={<MemDashLayout> <MemDash /></MemDashLayout>} />
        
    </Routes>
    </div>
  )
}

export default App