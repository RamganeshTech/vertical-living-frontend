import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import {  lazy, Suspense, useEffect, useState } from 'react';
import type { RootState } from './store/store';
import { useSelector } from 'react-redux';
import { useAuthCheck } from './Hooks/useAuthCheck';
import ProtectedRoutes from './lib/ProtectedRoutes';
import { socket } from './lib/socket';
import QuotePdfMain from './Pages/Stage Pages/QuoteProjectPdfs/QuotePdfMain';
const QuoteGenerateVariantSub = lazy(() => import( './Pages/Quote Pages/Quote VariantGenerate Pages/QuoteGenerateVariantSub '));
const RateConfigAdminMain  = lazy(() => import(  './Pages/Quote Pages/RateConfig Pages/RateConfigAdminMain'));
const RateConfigSub  = lazy(() => import(  './Pages/Quote Pages/RateConfig Pages/RateConfigSub'));
const QuoteGenerateMain  = lazy(() => import(  './Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/QuoteGeenrateMain'));
const QuoteVariantGenerateMain = lazy(() => import( './Pages/Quote Pages/Quote VariantGenerate Pages/QuoteVariantGenerateMain'));
// const QuoteGenerateVariantSub = lazy(() => import( './Pages/Quote Pages/Quote VariantGenerate Pages/QuoteGenerateVariantSub'));
const LogisticsMain = lazy(() => import('./Pages/Department Pages/Logistics Pages/LogisticsMain'));
const LogisticsSingle = lazy(() => import('./Pages/Department Pages/Logistics Pages/LogisticsSingle'));
const ProcurementSub = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/ProcurementSub'));
const ProcurementNewMain = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/ProcurementNewMain'));
const AccountingMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/AccountingMain'));
const AccountingSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/AccountingSingle'));
// import LogisticsVehicle from './Pages/Department Pages/Logistics Pages/LogisticsVehicle';
const InventoryMain = lazy(() => import('./Pages/Stage Pages/Inventory Main/InventoryMain'));
const ExternalMain = lazy(() => import('./Pages/External Units/ExternalMain'));
const WardrobeExternal = lazy(() => import('./Pages/External Units/WardrobeExternal'));
const SelectedExternalUnits = lazy(() => import('./Pages/External Units/SelectedExternal Units/SelectedExternalUnits'));
// const ProcurementMain = lazy(() => import('./Pages/Department Pages/Procurement/ProcurementMain'));
const HrSingleEmployeeDetail = lazy(() => import('./Pages/Department Pages/Hr Pages/HrSingleEmployeeDetail'));
const RoomPage = lazy(() => import('./Pages/RequirementForm/RoomPage'));
const HRMainPage = lazy(() => import('./Pages/Department Pages/Hr Pages/HRMainPage'));
const CommonOrdersMain = lazy(() => import('./Pages/Stage Pages/CommonOrderHistory/CommonOrdersMain'));
const CommonOrderProject = lazy(() => import('./Pages/Stage Pages/CommonOrderHistory/CommonOrderProject'));
const RoomDetailCardNew = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/RoomDetailCardNew"));
// const RoomDetailCardNew = 

const ForgotPassword = lazy(() => import('./Pages/Forgot Password/ForgotPassword'));
const ResetPassword = lazy(() => import('./Pages/Forgot Password/ResetPassword'));
const ShortlistMain = lazy(() => import('./Pages/Stage Pages/Sample design/ShortList/ShortListMain'));
const MaterialArrivalOverviewNew = lazy(() => import('./Pages/Stage Pages/MaterialArrival/MaterialArrivalOverviewNew'));
// import ProjectStageRedirect from './Pages/Projects/ProjectStageRedirect';

const Home = lazy(() => import("./Pages/Home/Home"));
const Issues = lazy(() => import("./Pages/Issues/Issues"));
const Phase = lazy(() => import("./Pages/Phases/Phase"));
const Tasks = lazy(() => import("./Pages/Tasks/Tasks"));
const Projects = lazy(() => import("./Pages/Projects/Projects"));
const Login = lazy(() => import("./Pages/Login/Login"));
const ProjectDetails = lazy(() => import("./Pages/Projects/ProjectDetails"));
const ProjectLists = lazy(() => import("./Pages/Projects/ProjectLists"));
const NotFound = lazy(() => import("./Pages/Not Found/NotFound"));
const Organization = lazy(() => import("./Pages/Organization/Organization"));
const OrganizationDetails = lazy(() => import("./Pages/Organization/OrganizationDetails"));
const StaffRegister = lazy(() => import("./Pages/Staff/StaffRegister"));
const StaffLogin = lazy(() => import("./Pages/Staff/StaffLogin"));
const Workers = lazy(() => import("./Pages/Workers/Workers"));
const WorkerRegister = lazy(() => import("./Pages/Workers/WorkerRegister"));
const WorkerLogin = lazy(() => import("./Pages/Workers/WorkerLogin"));
const UnAuthorized = lazy(() => import("./Pages/UnAuthorized/UnAuthorized"));
const InviteStaffs = lazy(() => import("./Pages/Organization/InviteStaffs"));
const InviteCTO = lazy(() => import("./Pages/Organization/InviteCTO"));
const OrganizationChildrens = lazy(() => import("./Pages/Organization/OrganizationChildren"));
const CTORegister = lazy(() => import("./Pages/CTO/CTORegister"));
const CTOLogin = lazy(() => import("./Pages/CTO/CTOLogin"));
const ClientLogin = lazy(() => import("./Pages/Client/ClientLogin"));
const ClientRegister = lazy(() => import("./Pages/Client/ClientRegister"));
const InviteClient = lazy(() => import("./Pages/Organization/inviteClient"));
const RequirementFormPublic = lazy(() => import("./Pages/RequirementForm/components/RequirementFormPublic"));
const RequriementForm = lazy(() => import("./Pages/RequirementForm/RequriementForm"));
const SiteMeasurement = lazy(() => import("./Pages/Stage Pages/Site Measurement/SiteMeasurement"));
const SampleDesign = lazy(() => import("./Pages/Stage Pages/Sample design/SampleDesign"));
const TechnicalConsultant = lazy(() => import("./Pages/Stage Pages/Technical Consultant/TechnicalConsultant"));
const MaterialRoomOverview = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/MaterialOverview"));
// const RoomDetailCard = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/OldVersion/RoomDetailCard"));
const CostEstimationContainer = lazy(() => import("./Pages/Stage Pages/Cost Estimation/CostEstimationContainer"));
const CostEstimationRoomDetails = lazy(() => import("./Pages/Stage Pages/Cost Estimation/CostEstimationRoomDetails"));
const LabourEstimateContainer = lazy(() => import("./Pages/Stage Pages/Cost Estimation/LabourEstimate/LabourEstimateContainer"));
const OrderMaterialOverview = lazy(() => import("./Pages/Stage Pages/Ordering Materials/OrderMaterialOverview"));
// const OrderMaterialOverview = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/OrderMaterialOverview"));
// const OrderMaterialRoomDetails = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/OrderMaterialRoomDetails"));
// const MaterialArrivalOverview = lazy(() => import("./Pages/Stage Pages/MaterialArrival/MaterialArrivalOverview"));
// const MaterialArrivalRoomDetail = lazy(() => import("./Pages/Stage Pages/MaterialArrival/MaterialArrivalRoomDetail"));
const PublicMaterialArrival = lazy(() => import("./Pages/Stage Pages/MaterialArrival/PublicMaterialArrival"));
// const PublicOrderMaterial = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/PublicOrderMaterial"));
const PublicOrderHistoryDetails = lazy(() => import("./Pages/Stage Pages/Ordering Materials/PublicOrderHistory"))
const WorkMainOverview = lazy(() => import("./Pages/Stage Pages/Work Schedule/WorkMainOverView"));
// const WorkSchedulePage = lazy(() => import("./Pages/Stage Pages/Work Schedule/WorkSchedulePage"));
const DailySchedulePage = lazy(() => import("./Pages/Stage Pages/Work Schedule/DailySchedulePage"));
const InstallationOverview = lazy(() => import("./Pages/Stage Pages/Installation Stage/InstallationOverview"));
// const InstallationRoomDetail = lazy(() => import("./Pages/Stage Pages/Installation Stage/InstallationRoomDetail"));
const QualityCheckOverview = lazy(() => import("./Pages/Stage Pages/QualityCheck Stage/QualityCheckOverview"));
const QualityCheckRoomDetails = lazy(() => import("./Pages/Stage Pages/QualityCheck Stage/QualityCheckRoomDetails"));
const CleaningOverview = lazy(() => import("./Pages/Stage Pages/Cleaning Sanitation/CleaningOverview"));
const CleaningRoomOverview = lazy(() => import("./Pages/Stage Pages/Cleaning Sanitation/CleaningRoomOverview"));
const ProjectDelivery = lazy(() => import("./Pages/Stage Pages/Project Delivery/ProjectDelivery"));
const PaymentScheduleSection = lazy(() => import("./Pages/Stage Pages/PaymentConfirmation Pages/PaymentScheduleSection"));
const PaymentTransaction = lazy(() => import("./Pages/Stage Pages/PaymentConfirmation Pages/PaymentTransaction"));
const PaymentConfirmationStage = lazy(() => import("./Pages/Stage Pages/PaymentConfirmation Pages/PaymentMainPage"));
const PaymentConsentSection = lazy(() => import("./Pages/Stage Pages/PaymentConfirmation Pages/PayementConsentSection"));
const PublicClientConsentForm = lazy(() => import("./Pages/Stage Pages/PaymentConfirmation Pages/PublicClientConsentForm/PublicClientConsentForm"));
const SubscriptionPlans = lazy(() => import("./Pages/Subscription Payment/SubscriptionMain"));
const LoginGroup = lazy(() => import("./Pages/LoginGroups/LoginGroup"));
const AdminWallMainContainer = lazy(() => import("./Pages/Wall Painting/AdminWall/AdminWallMainContainer"));
const AdminWallStepPage = lazy(() => import("./Pages/Wall Painting/AdminWall/AdminWallStepPage"));
const WorkerWallMainContainer = lazy(() => import("./Pages/Wall Painting/WorkerWall/WorkerWallMainContainer"));
const WorkerWallStepPage = lazy(() => import("./Pages/Wall Painting/WorkerWall/WorkerWallStepPage"));
const SubscriptionParent = lazy(() => import("./Pages/Subscription Payment/SubscriptionParent"));
const MaterialOverviewLoading = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"));
const UserProfileDetails = lazy(() => import("./Pages/UserProfile/UserProfileDetails"));
const PrerequisitesPage = lazy(() => import("./Pages/PreRequireties Pages/PreRequiretiesMain"));
const ModularUnitMain = lazy(() => import("./Pages/Modular Units/ModularUnitMain"));
const AddModularUnit = lazy(() => import("./Pages/Modular Units/AddModularUnit"));
const ModularUnitCategoryPage = lazy(() => import("./Pages/Modular Units/ModularUnitCategoryPage"));
const SelectStage = lazy(() => import("./Pages/Stage Pages/SelectStage/SelectStage"));
const SelectedUnits = lazy(() => import("./Pages/Modular Units/Selected Units/SelectedUnits"));
const DocumentationMain = lazy(() => import("./Pages/Documentation/DocumentationMain"));
const SingleStageDocument = lazy(() => import("./Pages/Documentation/SingleStageDocument"));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MaterialOverviewLoading />}>{children}</Suspense>
);


function App() {

  const [projectId, setProjectId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const { isauthenticated } = useSelector((state: RootState) => state.authStore)

  //it is used to check whether which user is now currently using the application
  const { loading } = useAuthCheck()


  useEffect(() => {
    if (!organizationId) return;

    console.log("📡 Sending 'join_project' for project:", organizationId);

    // ✅ Join organization room once on load
    socket.emit("join_organization", { organizationId: organizationId });
    return () => {
      console.log("left 'leav_organizaiton' for project:", organizationId);

      socket.emit("leave_organization", { organizationId: organizationId });
    };
  }, [organizationId]);


  
// interface ErrorBoundaryProps {
//   children: React.ReactNode;
// }
// interface ErrorBoundaryState {
//   hasError: boolean;
// }
// class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
//     console.log(error)
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, info: React.ErrorInfo) {
//     console.error("Error boundary caught an error:", error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong from error boudary.</h1>;
//     }
//     return this.props.children;
//   }
// }


  if (loading) <MaterialOverviewLoading />;
  return (
    <>
      <LazyWrapper>
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
          <Route path="/unauthorized" element={<UnAuthorized />} />

          <Route path='/stafflogin' element={<StaffLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path='/workerlogin' element={<WorkerLogin />} />
          <Route path='/ctologin' element={<CTOLogin />} />
          <Route path='/clientlogin' element={<ClientLogin />} />

          <Route path='/staffregister' element={<StaffRegister />} />
          <Route path='/workerregister' element={<WorkerRegister />} />
          <Route path='/ctoregister' element={<CTORegister />} />
          <Route path='/clientregister' element={<ClientRegister />} />
          <Route path='/reset-password/:role' element={<ResetPassword />} />
          <Route path='/forgotpassword/:role' element={<ForgotPassword />} />

          <Route path="/subscription" element={<SubscriptionPlans />} />


          {/* commented organizaion route */}
          {/* <Route path="/organizations" element={<ProtectedRoutes allowedRoles={["owner"]} >
          <Organization />
        </ProtectedRoutes>} /> */}




          <Route path="/organizations" element={
            <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
              <Organization />
            </ProtectedRoutes>
          } />

          <Route path="/organizations/:organizationId" element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
            <OrganizationChildrens setOrganizationId={setOrganizationId} />
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


            <Route path="userprofile" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <UserProfileDetails />
              </ProtectedRoutes>
            } />




            <Route path="modularunits" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <ModularUnitMain />
              </ProtectedRoutes>
            } >

              <Route path="add" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                  <AddModularUnit />
                </ProtectedRoutes>} />

              <Route path="category/:unitType" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                  <ModularUnitCategoryPage />
                </ProtectedRoutes>} />
            </Route>


            <Route path="externalunits" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                <ExternalMain />
              </ProtectedRoutes>}>

              <Route path='wardrobe' element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                <WardrobeExternal />
              </ProtectedRoutes>} />

            </Route>


            {/* <Route path="procurement" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <ProcurementMain />
              </ProtectedRoutes>
            } /> */}


          </Route>


          <Route path='/organizations/:organizationId/projects' element={<Projects projectId={projectId} setProjectId={setProjectId} />} >
            <Route index element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <ProjectLists />
            </ProtectedRoutes>} />

            <Route path="hr" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <HRMainPage />
            </ProtectedRoutes>} >


              <Route path=":id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <HrSingleEmployeeDetail />
              </ProtectedRoutes>} />


            </Route>


            <Route path="logistics" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <LogisticsMain />
            </ProtectedRoutes>} >


              {/* <Route path="vehicle" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <LogisticsVehicle />
              </ProtectedRoutes>} /> */}


              <Route path="sub/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <LogisticsSingle />
              </ProtectedRoutes>} />


            </Route>

            <Route path="procurement" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <ProcurementNewMain />
            </ProtectedRoutes>} >

              <Route path="sub/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <ProcurementSub />
              </ProtectedRoutes>} />
            </Route>


            <Route path="accounting" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <AccountingMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <AccountingSingle />
              </ProtectedRoutes>} />


            </Route>


            <Route path="commonorder" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <CommonOrdersMain />
            </ProtectedRoutes>} >


              <Route path=":id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <CommonOrderProject />
              </ProtectedRoutes>} />

            </Route>


            <Route path="rateconfig" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <RateConfigAdminMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO",  "staff"]}>
                <RateConfigSub />
              </ProtectedRoutes>} />
            </Route>

            <Route path="internalquote" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <QuoteGenerateMain />
            </ProtectedRoutes>} >
            </Route>


            <Route path="quotevariant" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <QuoteVariantGenerateMain />
            </ProtectedRoutes>} >


              <Route
                path="single/:quoteId"
                element={<QuoteGenerateVariantSub />}
              />

            </Route>

          </Route>

          <Route path='/:organizationId/projectdetails/:projectId' element={<ProtectedRoutes allowedRoles={["owner", "client", "CTO", "worker", "staff"]}>
            <ProjectDetails projectId={projectId} setProjectId={setProjectId} setOrganizationId={setOrganizationId} organizationId={organizationId} />
          </ProtectedRoutes>}>


            {/* <Route index element={<ProjectStageRedirect />} /> */}

            {/* <Route path="labourlist" element={<LabourList />} />
          <Route path="materiallist" element={<MaterialList />} />
          <Route path="transportationlist" element={<Transportationlist />} /> */}

            <Route path="prerequisites" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <PrerequisitesPage />
              </ProtectedRoutes>
            } />



            <Route path="inventory" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
                <InventoryMain />
              </ProtectedRoutes>
            } />



            <Route path="document" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                <DocumentationMain />
              </ProtectedRoutes>
            } >

              <Route path=":stageNumber" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client"]}>
                  <SingleStageDocument />
                </ProtectedRoutes>
              } ></Route>

            </Route>

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
            } >

              <Route path="roompage/:roomId" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                  <RoomPage />
                </ProtectedRoutes>} />

            </Route>

            <Route path="sitemeasurement" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>

                <SiteMeasurement />
              </ProtectedRoutes>
            } />

            <Route path="sampledesign" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <SampleDesign />
              </ProtectedRoutes>
            } >


              <Route path="shortlist" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                  <ShortlistMain />
                </ProtectedRoutes>} />

            </Route>

            <Route path="technicalconsultant" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>

                <TechnicalConsultant />
              </ProtectedRoutes>
            } />



            <Route path="selectstage" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>

                <SelectStage />
              </ProtectedRoutes>
            } />

            <Route path="externalunits" element={
              <ExternalMain />
            } >

              <Route path='wardrobe' element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                  <WardrobeExternal />
                </ProtectedRoutes>} />
            </Route>

            <Route path='selectedexternalunits' element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                <SelectedExternalUnits />
              </ProtectedRoutes>} />


            <Route path="modularunits" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <ModularUnitMain />
              </ProtectedRoutes>
            } >

              <Route path="selectedunits" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                  <SelectedUnits />
                </ProtectedRoutes>} />

              <Route path="category/:unitType" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                  <ModularUnitCategoryPage />
                </ProtectedRoutes>} />

            </Route>

            <Route path="materialselection" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}>
                <MaterialRoomOverview />
              </ProtectedRoutes>} >

              <Route path="materialroom/:roomId/:roomType/:packageId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}>
                  <RoomDetailCardNew />
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


             <Route path="quotepdf" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <QuotePdfMain  />
              </ProtectedRoutes>

            } ></Route>


            <Route path="ordermaterial" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <OrderMaterialOverview />
              </ProtectedRoutes>

            } >
              {/* <Route path="ordermaterialroom/:roomKey" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                  <OrderMaterialRoomDetails />
                </ProtectedRoutes>

              } /> */}
            </Route>


            <Route path="materialarrival" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                <MaterialArrivalOverviewNew />
              </ProtectedRoutes>

            } >
              {/* <Route path="materialarrivalroom/:roomKey" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                  <MaterialArrivalRoomDetail />
                </ProtectedRoutes>

              } /> */}
            </Route>

            <Route path="workmainschedule" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                <WorkMainOverview />
              </ProtectedRoutes>
            } >
              {/* <Route path="workschedule/:sectionId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                  <WorkSchedulePage />
                </ProtectedRoutes>
              } /> */}
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
              {/* <Route path="installationroom/:roomkey" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                  <InstallationRoomDetail />
                </ProtectedRoutes>
              } />*/}
            </Route>

            <Route path="qualitycheck" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff",]}>
                <QualityCheckOverview />
              </ProtectedRoutes>
            } >
              <Route path="qualitycheckroom/:roomkey" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
                  <QualityCheckRoomDetails />
                </ProtectedRoutes>
              } />

              <Route path={`qualitycheckroom/adminwall`} element={<AdminWallMainContainer />} >
                <Route path={`step/:stepId/:stepNumber`} element={<AdminWallStepPage />} />
              </Route>

              <Route path="qualitycheckroom/workerwall" element={<WorkerWallMainContainer />} >
                <Route path='step/:stepId/:stepNumber' element={<WorkerWallStepPage />} />
              </Route>

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
          <Route path='/ordermaterial/public/:projectId/:token' element={<PublicOrderHistoryDetails />} />
          <Route path='/materialarrival/public/:projectId/:token' element={<PublicMaterialArrival />} />
          <Route path='/clientconsent/public/:projectId/:token' element={<PublicClientConsentForm />} />


          <Route path="*" element={<NotFound />} />

        </Routes >
      </LazyWrapper>
    </>
  )
}

export default App
