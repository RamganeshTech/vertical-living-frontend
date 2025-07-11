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
import SubscriptionPlans from './Pages/Subscription Payment/SubscriptionMain'
import LoginGroup from './Pages/LoginGroups/LoginGroup'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import AdminWallMainContainer from './Pages/Wall Painting/AdminWall/AdminWallMainContainer'
import AdminWallStepPage from './Pages/Wall Painting/AdminWall/AdminWallStepPage'
import WorkerWallMainContainer from './Pages/Wall Painting/WorkerWall/WorkerWallMainContainer'
import WorkerWallStepPage from './Pages/Wall Painting/WorkerWall/WorkerWallStepPage'
import SubscriptionParent from './Pages/Subscription Payment/SubscriptionParent'
import MaterialOverviewLoading from './Pages/Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading'

function App() {

  const [projectId, setProjectId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const { isauthenticated } = useSelector((state: RootState) => state.authStore)

  //it is used to check whether which user is now currently using the application
  const { loading } = useAuthCheck()

  if (loading) <MaterialOverviewLoading />;
  return (
    <>

      <Routes>

        {/* <Route path="/" element={<Navigate to="/organizations" replace />} /> */}
        <Route path="/" element={isauthenticated ? (<Navigate to="/organizations" replace />) : (<Home />)} />


        <Route path="/login" element={<LoginGroup />}>
          <Route index element={<Login />} /> {/* this is your default owner login */}
          <Route path="cto" element={<CTOLogin />} />
          <Route path="staff" element={<StaffLogin />} />
          <Route path="worker" element={<WorkerLogin />} />
          <Route path="client" element={<ClientLogin />} />
        </Route>

        <Route path="/home" element={<Home />} />
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

        <Route path="/subscription" element={<SubscriptionPlans />} />


        {/* commented organizaion route */}
        {/* <Route path="/organizations" element={<ProtectedRoutes allowedRoles={["owner"]} >
          <Organization />
        </ProtectedRoutes>} /> */}


        <Route path={`/:projectId/adminwall`} element={<AdminWallMainContainer />} >
          <Route path={`step/:stepId/:stepNumber`} element={<AdminWallStepPage />} />
        </Route>

        <Route path="/:projectId/workerwall" element={<WorkerWallMainContainer />} >
          <Route path='step/:stepId/:stepNumber' element={<WorkerWallStepPage />} />
        </Route>

        <Route path="/organizations" element={
          <Organization />
        } />

        <Route path="/organizations/:organizationId" element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
          <OrganizationChildrens />
        </ProtectedRoutes>} >

          <Route index
            element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
              <OrganizationDetails />
            </ProtectedRoutes>} />

          <Route path='invitestaff'
            element={<ProtectedRoutes allowedRoles={["CTO", "owner", "staff"]}>
              <InviteStaffs />
            </ProtectedRoutes>} />

          <Route path='invitecto'
            element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <InviteCTO />
            </ProtectedRoutes>} />

          <Route path='subscriptionplan'
            element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <SubscriptionParent />
            </ProtectedRoutes>} />

        </Route>


        <Route path='/organizations/:organizationId/projects' element={<Projects projectId={projectId} setProjectId={setProjectId} />} >
          <Route index element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
            <ProjectLists />
          </ProtectedRoutes>} />
        </Route>

        <Route path='/:organizationId/projectdetails/:projectId' element={<ProtectedRoutes allowedRoles={["owner", "client", "CTO", "worker", "staff"]}>
          <ProjectDetails projectId={projectId} setProjectId={setProjectId} setOrganizationId={setOrganizationId} organizationId={organizationId} />
        </ProtectedRoutes>}>

          {/* <Route path="labourlist" element={<LabourList />} />
          <Route path="materiallist" element={<MaterialList />} />
          <Route path="transportationlist" element={<Transportationlist />} /> */}
          <Route path="workers" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <Workers />
            </ProtectedRoutes>
          } />
          <Route path="inviteclient" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>

              <InviteClient />
            </ProtectedRoutes>
          } />

          <Route path="requirementform" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <RequriementForm />
            </ProtectedRoutes>
          } />

          <Route path="sitemeasurement" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>

              <SiteMeasurement />
            </ProtectedRoutes>
          } />

          <Route path="sampledesign" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>

              <SampleDesign />
            </ProtectedRoutes>
          } />

          <Route path="technicalconsultant" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>

              <TechnicalConsultant />
            </ProtectedRoutes>
          } />

          {/* <Route path="materialselection" element={<MaterialSelection />} >
            <Route path="materialroom" element={<MaterialSelectionRoom />} />

          </Route> */}

          <Route path="materialselection" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}>
              <MaterialRoomOverview />
            </ProtectedRoutes>} >

            <Route path="materialroom/:roomId" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}>
                <RoomDetailCard />
              </ProtectedRoutes>} />
          </Route>


          <Route path="costestimation" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
              <CostEstimationContainer />
            </ProtectedRoutes>
          } >
            <Route path="roomdetails/:roomId" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <CostEstimationRoomDetails />
              </ProtectedRoutes>
            } />
            <Route path="roomdetails/labour" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <LabourEstimateContainer />
              </ProtectedRoutes>
            } />
          </Route>


          <Route path="paymentconfirmation" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
              <PaymentConfirmationStage />
            </ProtectedRoutes>

          } >
            <Route path="consent" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <PaymentConsentSection />
              </ProtectedRoutes>

            } />
            <Route path="schedule" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <PaymentScheduleSection />
              </ProtectedRoutes>

            } />
            <Route path="transaction" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <PaymentTransaction />
              </ProtectedRoutes>

            } />

          </Route>


          <Route path="ordermaterial" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

              <OrderMaterialOverview />
            </ProtectedRoutes>

          } >
            <Route path="ordermaterialroom/:roomKey" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <OrderMaterialRoomDetails />
              </ProtectedRoutes>

            } />
          </Route>


          <Route path="materialarrival" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

              <MaterialArrivalOverview />
            </ProtectedRoutes>

          } >
            <Route path="materialarrivalroom/:roomKey" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <MaterialArrivalRoomDetail />
              </ProtectedRoutes>

            } />
          </Route>

          <Route path="workmainschedule" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
              <WorkMainOverview />
            </ProtectedRoutes>
          } >
            <Route path="workschedule/:sectionId" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                <WorkSchedulePage />
              </ProtectedRoutes>
            } />
            <Route path="dailyschedule/:sectionId" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                <DailySchedulePage />
              </ProtectedRoutes>
            } />
          </Route>

          <Route path="installation" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
              <InstallationOverview />
            </ProtectedRoutes>
          } >
            <Route path="installationroom/:roomkey" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                <InstallationRoomDetail />
              </ProtectedRoutes>

            } />
          </Route>

          <Route path="qualitycheck" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
              <QualityCheckOverview />
            </ProtectedRoutes>
          } >
            <Route path="qualitycheckroom/:roomkey" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
                <QualityCheckRoomDetails />
              </ProtectedRoutes>
            } />
          </Route>

          <Route path="cleaning" element={<CleaningOverview />} >
            <Route path="cleaningroom/:roomId" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
                <CleaningRoomOverview />
              </ProtectedRoutes>
            } />
          </Route>

          <Route path="projectdelivery" element={
            <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
              <ProjectDelivery />
            </ProtectedRoutes>
          } />
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


        <Route path="*" element={<NotFound />} />

      </Routes >

    </>
  )
}

export default App
