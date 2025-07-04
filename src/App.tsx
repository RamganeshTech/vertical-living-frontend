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
import RequirementFormPublic from './Pages/RequirementForm/components/RequirementFormPublic'
import RequriementForm from './Pages/RequirementForm/RequriementForm'
import SiteMeasurement from './Pages/Stage Pages/Site Measurement/SiteMeasurement'
import SampleDesign from './Pages/Stage Pages/Sample design/SampleDesign'
import TechnicalConsultant from './Pages/Stage Pages/Technical Consultant/TechnicalConsultant'
import MaterialRoomOverview from './Pages/Stage Pages/MaterialSelectionRoom/MaterialOverview'
import RoomDetailCard from './Pages/Stage Pages/MaterialSelectionRoom/RoomDetailCard'
import { CostEstimationContainer } from './Pages/Stage Pages/Cost Estimation/CostEstimationContainer'
import CostEstimationRoomDetails from './Pages/Stage Pages/Cost Estimation/CostEstimationRoomDetails'
import LabourEstimateContainer from './Pages/Stage Pages/Cost Estimation/LabourEstimate/LabourEstimateContainer'
import OrderMaterialOverview from './Pages/Stage Pages/Ordering Materials/OrderMaterialOverview'
import OrderMaterialRoomDetails from './Pages/Stage Pages/Ordering Materials/OrderMaterialRoomDetails'
import FormOrderMaterial from './Pages/Stage Pages/Ordering Materials/FormOrderMaterial'
import MaterialArrivalOverview from './Pages/Stage Pages/MaterialArrival/MaterialArrivalOverview'
import MaterialArrivalRoomDetail from './Pages/Stage Pages/MaterialArrival/MaterialArrivalRoomDetail'
import PublicMaterialArrival from './Pages/Stage Pages/MaterialArrival/PublicMaterialArrival'
import PublicOrderMaterial from './Pages/Stage Pages/Ordering Materials/PublicOrderMaterial'
import WorkMainOverview from './Pages/Stage Pages/Work Schedule/WorkMainOverView'
import WorkSchedulePage from './Pages/Stage Pages/Work Schedule/WorkSchedulePage'
import DailySchedulePage from './Pages/Stage Pages/Work Schedule/DailySchedulePage'
import InstallationOverview from './Pages/Stage Pages/Installation Stage/InstallationOverview'
import InstallationRoomDetail from './Pages/Stage Pages/Installation Stage/InstallationRoomDetail'
import QualityCheckOverview from './Pages/Stage Pages/QualityCheck Stage/QualityCheckOverview'
import QualityCheckRoomDetails from './Pages/Stage Pages/QualityCheck Stage/QualityCheckRoomDetails'
import CleaningOverview from './Pages/Stage Pages/Cleaning Sanitation/CleaningOverview'
import CleaningRoomOverview from './Pages/Stage Pages/Cleaning Sanitation/CleaningRoomOverview'
import ProjectDelivery from './Pages/Stage Pages/Project Delivery/ProjectDelivery'
import PaymentScheduleSection from './Pages/Stage Pages/PaymentConfirmation Pages/PaymentScheduleSection'
import PaymentTransaction from './Pages/Stage Pages/PaymentConfirmation Pages/PaymentTransaction'
import PaymentConfirmationStage from './Pages/Stage Pages/PaymentConfirmation Pages/PaymentMainPage'
import PaymentConsentSection from './Pages/Stage Pages/PaymentConfirmation Pages/PayementConsentSection'
import PublicClientConsentForm from './Pages/Stage Pages/PaymentConfirmation Pages/PublicClientConsentForm/PublicClientConsentForm'

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
          <Route path="sampledesign" element={<SampleDesign />} />
          <Route path="technicalconsultant" element={<TechnicalConsultant />} />
          {/* <Route path="materialselection" element={<MaterialSelection />} >
            <Route path="materialroom" element={<MaterialSelectionRoom />} />

          </Route> */}

          <Route path="materialselection" element={<MaterialRoomOverview />} >
            <Route path="materialroom/:roomId" element={<RoomDetailCard />} />

          </Route>


          <Route path="costestimation" element={<CostEstimationContainer />} >
            <Route path="roomdetails/:roomId" element={<CostEstimationRoomDetails />} />
            <Route path="roomdetails/labour" element={<LabourEstimateContainer />} />
          </Route>


           <Route path="paymentconfirmation" element={<PaymentConfirmationStage />} >
            <Route path="consent" element={<PaymentConsentSection />} />
            <Route path="schedule" element={<PaymentScheduleSection />} />
            <Route path="transaction" element={<PaymentTransaction/>} />

          </Route>


          <Route path="ordermaterial" element={<OrderMaterialOverview />} >
            <Route path="ordermaterialroom/:roomKey" element={<OrderMaterialRoomDetails />} />
          </Route>


          <Route path="materialarrival" element={<MaterialArrivalOverview />} >
            <Route path="materialarrivalroom/:roomKey" element={<MaterialArrivalRoomDetail />} />
          </Route>

          <Route path="workmainschedule" element={<WorkMainOverview />} >
            <Route path="workschedule/:sectionId" element={<WorkSchedulePage />} />
            <Route path="dailyschedule/:sectionId" element={<DailySchedulePage />} />
          </Route>

          <Route path="installation" element={<InstallationOverview />} >
            <Route path="installationroom/:roomkey" element={<InstallationRoomDetail />} />
          </Route>

          <Route path="qualitycheck" element={<QualityCheckOverview />} >
            <Route path="qualitycheckroom/:roomkey" element={<QualityCheckRoomDetails />} />
          </Route>

          <Route path="cleaning" element={<CleaningOverview />} >
            <Route path="cleaningroom/:roomId" element={<CleaningRoomOverview />} />
          </Route>

          <Route path="projectdelivery" element={<ProjectDelivery />} />
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
        <Route path='/ordermaterial/public/:projectId/:token' element={<PublicOrderMaterial />} />
        <Route path='/materialarrival/public/:projectId/:token' element={<PublicMaterialArrival />} />
        <Route path='/clientconsent/public/:projectId/:token' element={<PublicClientConsentForm />} />


      </Routes>

    </>
  )
}

export default App
