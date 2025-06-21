import React from 'react'
// import Login from './components/Login.jsx'
import './App.css'
import Admnavbar from './components/admin/Admnavbar.jsx'
import Project from './components/admin/Project.jsx'
import AdmDash from './components/admin/AdmDash.jsx'
import Task from './components/admin/Task';
import Team from './components/admin/Team.jsx'
const App = () => {
  return (
    <div>
      {/* <Login /> */}
      <Admnavbar/>
      {/* <AdmDash/> */}
      {/* <Project/> */}
      {/* <Task/> */}
      <Team/>
    </div>
  )
}

export default App