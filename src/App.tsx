import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import Issues from './Pages/Issues/Issues'
import Phase from './Pages/Phases/Phase'
import Tasks from './Pages/Tasks/Tasks'
import Projects from './Pages/Projects/Projects'
import Dashboard from './Pages/Dashboard/Dashboard'
import Login from './Pages/Login/Login'
// import MaterialList from './Pages/Material/MaterialList/MaterialList'
import MaterialList from './Pages/Material/MaterialList/MaterialList'

import MaterialItem from './Pages/Material/MaterialItem/MaterialItem'
import LabourList from './Pages/Labour/LabourList/LabourList'
import LabourItem from './Pages/Labour/LabourItem/LabourItem'
import ProjectDetails from './Pages/Projects/ProjectDetails'
import ProjectLists from './Pages/Projects/ProjectLists'
import { useState } from 'react'
import Transportationlist from './Pages/Transportation/Transportationlist'
import NotFound from './Pages/Not Found/NotFound'
import Organization from './Pages/Organization/Organization'
import OrganizationDetails from './Pages/Organization/OrganizationDetails'
import StaffRegister from './Pages/Staff/StaffRegister'
import StaffLogin from './Pages/Staff/StaffLogin'
import Workers from './Pages/Workers/Workers'
import WorkerRegister from './Pages/Workers/WorkerRegister'
import WorkerLogin from './Pages/Workers/WorkerLogin'
import { useAuthCheck } from './Hooks/useAuthCheck'

function App() {

  const [projectId, setProjectId] = useState<string | null>(null)

  //it is used to check whether which user is now currently using the application
  useAuthCheck() 
  
  return (
    <>
      <Routes>

        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path='issues' element={<Issues />} />
          <Route path='phases' element={<Phase />} />
          <Route path='tasks' element={<Tasks />} />

          {/* <Route path="projects/:projectId/materiallist" element={<MaterialList />} />
          <Route path="projects/:projectId/materiallist/:materialListId" element={<MaterialItem />} />

          <Route path="projects/:projectId/labourlist/:labourListId" element={<LabourItem />} /> */}

        </Route>

        <Route path='/projects' element={<Projects projectId={projectId} setProjectId={setProjectId} />} >
          <Route index element={<ProjectLists />} />
        </Route>


        <Route path='/projectdetails' element={<ProjectDetails projectId={projectId} setProjectId={setProjectId} />} >
          <Route path=":projectId/labourlist" element={<LabourList />} />
          <Route path=":projectId/materiallist" element={<MaterialList />} />
          <Route path=":projectId/transportationlist" element={<Transportationlist />} />
          <Route path=":projectId/workers" element={<Workers />} />
        </Route>

        <Route path='/organization' element={<Organization />} />
        <Route path='/organization/:organizationId' element={<OrganizationDetails />} />

        <Route path='/stafflogin' element={<StaffLogin />} />
        <Route path='/staffregister' element={<StaffRegister />} />

        <Route path='/workerlogin' element={<WorkerLogin />} />
        <Route path='/workerregister' element={<WorkerRegister />} />



        <Route path="*" element={<NotFound />} />


      </Routes>


    </>
  )
}

export default App
