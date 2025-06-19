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
import ProtectedRoutes from './lib/ProtectedRoutes'
import UnAuthorized from './Pages/UnAuthorized/UnAuthorized'
import InviteStaffs from './Pages/Organization/InviteStaffs'
import InviteCTO from './Pages/Organization/InviteCTO'
import OrganizationChildrens from './Pages/Organization/OrganizationChildren'
import CTORegister from './Pages/CTO/CTORegister'
import CTOLogin from './Pages/CTO/CTOLogin'
import ClientLogin from './Pages/Client/ClientLogin'
import ClientRegister from './Pages/Client/ClientRegister'
import InviteClient from './Pages/Organization/inviteClient'
import RequirementFormPublic from './Pages/RequirementForm/RequirementFormPublic'
import RequriementForm from './Pages/RequirementForm/RequriementForm'
import SiteMeasurement from './Pages/Stage Pages/Site Measurement/SiteMeasurement'

function App() {

  const [projectId, setProjectId] = useState<string | null>(null)

  //it is used to check whether which user is now currently using the application
  useAuthCheck()

  return (
    <>

      <Routes>

        <Route path="/" element={<Navigate to="/organizations" replace />} />


        <Route path="/" element={<Home />} />
        <Route path="/select-model" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />

        <Route path='/stafflogin' element={<StaffLogin />} />
        <Route path='/staffregister' element={<StaffRegister />} />

        <Route path='/workerlogin' element={<WorkerLogin />} />
        <Route path='/workerregister' element={<WorkerRegister />} />

        <Route path='/ctologin' element={<CTOLogin />} />
        <Route path='/ctoregister' element={<CTORegister />} />

         <Route path='/clientlogin' element={<ClientLogin />} />
        <Route path='/clientregister' element={<ClientRegister />} />



        {/* commented organizaion route */}
        {/* <Route path="/organizations" element={<ProtectedRoutes allowedRoles={["owner"]} >
          <Organization />
        </ProtectedRoutes>} /> */}

        <Route path="/organizations" element={
          <Organization />
        } />

        <Route path="/organizations/:organizationId" element={<ProtectedRoutes allowedRoles={["owner"]}>
          <OrganizationChildrens />
        </ProtectedRoutes>} >

          <Route index
            element={<ProtectedRoutes allowedRoles={["CTO", "owner"]}>
              <OrganizationDetails />
            </ProtectedRoutes>} />

          <Route path='invitestaff'
            element={<ProtectedRoutes allowedRoles={["CTO", "owner"]}>
              <InviteStaffs />
            </ProtectedRoutes>} />

          <Route path='invitecto'
            element={<ProtectedRoutes allowedRoles={["owner"]}>
              <InviteCTO />
            </ProtectedRoutes>} />

        </Route>


        <Route path='/organizations/:organizationId/projects' element={<Projects projectId={projectId} setProjectId={setProjectId} />} >
          <Route index element={<ProjectLists />} />
        </Route>

        <Route path='/projectdetails/:projectId' element={<ProtectedRoutes allowedRoles={["owner", "client"]}>
          <ProjectDetails projectId={projectId} setProjectId={setProjectId} />
        </ProtectedRoutes>}>

          <Route path="labourlist" element={<LabourList />} />
          <Route path="materiallist" element={<MaterialList />} />
          <Route path="transportationlist" element={<Transportationlist />} />
          <Route path="workers" element={<Workers />} />
          <Route path="inviteclient" element={<InviteClient />} />
          <Route path="requirementform" element={<RequriementForm />} />
          <Route path="sitemeasurement" element={<SiteMeasurement />} />

        </Route>



{
  <>
        <Route path="/phase" element={<ProtectedRoutes allowedRoles={["owner"]}>
          <Phase />
        </ProtectedRoutes>} />

        <Route path="/issues" element={<ProtectedRoutes allowedRoles={["owner"]}>
          <Issues />
        </ProtectedRoutes>} />

        <Route path="/tasks" element={<ProtectedRoutes allowedRoles={["owner"]}>
          <Tasks />
        </ProtectedRoutes>} />
        </>
        }


        <Route path="/workers" element={<ProtectedRoutes allowedRoles={["staff"]} >
          <Workers />
        </ProtectedRoutes>} />


        {/* REQUIREMENT FORM LINK */}

        <Route path='/requirementform/:projectId/:token' element={<RequirementFormPublic />} />


      </Routes>

    </>
  )
}

export default App
