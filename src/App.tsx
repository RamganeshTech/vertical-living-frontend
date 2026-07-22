import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { lazy, Suspense, useEffect, useState } from 'react';
import type { RootState } from './store/store';
import { useSelector } from 'react-redux';
import { useAuthCheck } from './Hooks/useAuthCheck';
import ProtectedRoutes from './lib/ProtectedRoutes';
import { socket } from './lib/socket';
import { useCurrentSupervisor } from './Hooks/useCurrentSupervisor';
import PrivacyPolicy from './Pages/Home/PrivacyPolicy';
import MetaReviewDemoDashboard from './Pages/Lead_pages/MetaLead_Pages/MetaReviewDemoDashboard';
const PremiseMain = lazy(() => import( './Pages/eb_pages/premises_pages/PremiseMain'));
const TariffMain = lazy(() => import( './Pages/eb_pages/tariff_pages/TariffMain'));
const EbLogMain = lazy(() => import( './Pages/eb_pages/EbLogMain'));
const EbDashboardMain = lazy(() => import( './Pages/eb_pages/dashboards/EbDashboardMain'));
// import InstagramLeadMainByMeta from './Pages/Lead_pages/InstragramLead_Pages/InstagramLeadByMeta_Pages/InstagramLeadMainByMeta';
// import InstagramLeadSingleByMeta from './Pages/Lead_pages/InstragramLead_Pages/InstagramLeadByMeta_Pages/InstagramLeadSingleByMeta';
// import { WhatsAppLeadMainByMeta } from './Pages/Lead_pages/InstragramLead_Pages/WhatsAppLeadMainByMeta';
const VerticalLivingPdfConfiguration = lazy(() => import('./Pages/Lead_pages/VerticalLiving_Pages/VerticalLivingPdfConfiguration'));
const MetaLeadMain = lazy(() => import('./Pages/Lead_pages/MetaLead_Pages/MetaLeadMain'));
const MetaLeadSingle = lazy(() => import('./Pages/Lead_pages/MetaLead_Pages/MetaLeadSingle'));
const WhatsAppLeadsPage = lazy(() => import('./Pages/Lead_pages/WhatsappLead_Pages/WhatsappLeadMain'));
const WhatsAppLeadSingle = lazy(() => import('./Pages/Lead_pages/WhatsappLead_Pages/WhatsappLeadSingle'));
const InstagramLeadsPage = lazy(() => import('./Pages/Lead_pages/InstragramLead_Pages/InstagramLeadMain'));
const InstagramLeadSingle = lazy(() => import('./Pages/Lead_pages/InstragramLead_Pages/InstagramLeadSingle'));
const DesignApprovalMain = lazy(() => import('./Pages/Stage Pages/DesignApproval/DesignApprovalMain'));
const DesignApprovalPublic = lazy(() => import('./Pages/Stage Pages/DesignApproval/DesignApprovalPublic'));
const ProjectConfiguration = lazy(() => import('./Pages/Projects/ProjectConfiguration'));
const ArchivedProjects = lazy(() => import('./Pages/Projects/ArchivedProjects'));
const ProjectOnboarding = lazy(() => import('./Pages/Stage Pages/Project_Onboarding/ProjectOnboarding'));
const InstantCostCalculation = lazy(() => import('./Pages/InstantCostCalculator/InstantCostCalculatorMain'));
const InstantCostCalculatorProductConfigMain = lazy(() => import('./Pages/InstantCostCalculator/InstantCostCalculatorProductConfigMain'));
const InstantCostCalculatorDimentionMain = lazy(() => import('./Pages/InstantCostCalculator/InstantCostCalculatorDimentionMain'));
const InstantCostCalculatorDimentionSingle = lazy(() => import('./Pages/InstantCostCalculator/InstantCostCalculatorDimentionSingle'));
const RateConfigBackupMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigBackupMain'));
const RateConfigBackupSingle = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigBackupSingle'));
const RateConfigVersionMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigVersionMain'));
const AllOrganizationMain = lazy(() => import('./Pages/Organization/AllOrganization_pages/AllOrganizationMain'));
const OrganizationDetailsMain = lazy(() => import('./Pages/Organization/OrganizationDetailsMain'));
const OrganizaitonOtherDashBoard = lazy(() => import('./Pages/Organization/AllOrganization_pages/OrganizaitonOtherDashBoard'));
const OrganizationAndUserRegistrationMain = lazy(() => import('./Pages/Organization/OrganizationRegistration_Page/OrganizationAndUserRegistrationMain'));
const ExpensePartnerAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Execution_Partner_Pages/ExecutionPartnerAccSingle'));
const CreateExpensePartnerAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Execution_Partner_Pages/CreateExecutionPartnerAcc'));
const ExecutionPartnerAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Execution_Partner_Pages/ExecutionPartnerMain'));
const MaterialAndLabourConfigDescription = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/MaterialWithLabourConfig/MaterialWithLabourConfigDescription'));
const PinCodeMain = lazy(() => import('./Pages/Pincode_Pages/PincodeMaster/PinCodeMain'));
const PincodeSingle = lazy(() => import('./Pages/Pincode_Pages/PincodeMaster/PincodeSingle'));
const CreatePincode = lazy(() => import('./Pages/Pincode_Pages/PincodeMaster/CreatePincode'));
// const PincodeVendorMappingMain = lazy(() => import('./Pages/Pincode_Pages/PincodeVendorMapping/PincodeVendorMappingMain'));
// const PincodeVendorMappingSingle = lazy(() => import('./Pages/Pincode_Pages/PincodeVendorMapping/PincodeVendorMappingSingle'));
// const CreatePincodeVendorMapping = lazy(() => import('./Pages/Pincode_Pages/PincodeVendorMapping/CreatePincodeVendorMapping'));
const PincodeVendorProjectAssignMain = lazy(() => import('./Pages/Pincode_Pages/PincodeVendor_ProjectAssign_pages/PincodeVendorProjectAssignMain'));
const SinglePincodeVendorProjectAssign = lazy(() => import('./Pages/Pincode_Pages/PincodeVendor_ProjectAssign_pages/SinglePincodeVendorProjectAssign'));
const CreatePincodeVendorProjectAssign = lazy(() => import('./Pages/Pincode_Pages/PincodeVendor_ProjectAssign_pages/CreatePincodeVendorProjectAssign'));
const PincodeVendorPublicAcknowledgement = lazy(() => import('./Pages/Pincode_Pages/PincodeVendor_ProjectAssign_pages/PincodeVendorPublicAcknowledgement'));
const AccountingRecordMain = lazy(() => import('./Pages/Department Pages/AccountingRecords/AccountingRecordMain'));
const AccountingRecordSingle = lazy(() => import('./Pages/Department Pages/AccountingRecords/AccountingRecordSingle'));
const RateConfigDescription = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigDescription'));
const PublicCostCalculationMain = lazy(() => import('./Pages/Lead_pages/PublicCostCalculation_Pages/PublicCostCalculationMain'));
const PublicCostCalculationSingle = lazy(() => import('./Pages/Lead_pages/PublicCostCalculation_Pages/PublicCostCalculationSingle'));
const PublicLeadCollectionMain = lazy(() => import('./Pages/Lead_pages/PublicLeadCollection_pages/PublicLeadCollectionMain'));
const PublicLeadCollectionSingle = lazy(() => import('./Pages/Lead_pages/PublicLeadCollection_pages/PublicLeadCollectionSingle'));
const LogisticsPublicSingle = lazy(() => import('./Pages/Department Pages/Logistics Pages/LogisticsPublicSingle'));
const PublicPaymentTransactionMain = lazy(() => import('./Pages/publicPaymentTransaction/PublicPaymentTransactionMain'));
const ShopMaterialDocumentMain = lazy(() => import('./Pages/ShopMaterialDocument_Pages/ShopMaterialDocumentMain'));
const ShopMaterialDocumentSingle = lazy(() => import('./Pages/ShopMaterialDocument_Pages/ShopMaterialDocumentSingle'));
const ShopMaterialDocumentCreate = lazy(() => import('./Pages/ShopMaterialDocument_Pages/ShopMaterialDocumentCreate'));
const CalculatorMain = lazy(() => import('./Pages/Calculator_Pages/CalculatorMain'));
const RateConfigPreSalesMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfig_PreSales_Pages/RateConfigPreSalesMain'));
const RateConfigPreSalesSub = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfig_PreSales_Pages/RateConfigPreSalesSub'));
const PublicQuoteGenerator = lazy(() => import('./Pages/PublicQuote_Generator/PublicQuoteGenerator'));
const PreSalesQuoteMain = lazy(() => import('./Pages/Quote Pages/PreSalesQuote_Pages/PreSalesQuoteMain'));
const PreSalesQuoteSingle = lazy(() => import('./Pages/Quote Pages/PreSalesQuote_Pages/PreSalesQuoteSingle'));
const CommonLogin = lazy(() => import('./Pages/Login/CommonLogin'));
const CommonForgotPassword = lazy(() => import('./Pages/Login/CommonForgotPassword'));
const CommonResetPassword = lazy(() => import('./Pages/Login/CommonResetPassword'));
const ProtectedSingleShopQuote = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/ProtectedSingleShopQuote'));
const CutlistMain = lazy(() => import('./Pages/Cutlist_Pages/CutlistMain'));
const CutlistSingle = lazy(() => import('./Pages/Cutlist_Pages/CutlistSingle'));
const CreateCutlist = lazy(() => import('./Pages/Cutlist_Pages/CreateCutlist'));
// import LabourList from './Pages/Labour/LabourList/LabourList';
// import MaterialList from './Pages/Material/MaterialList/MaterialList';
const MaterialWithLabourRateMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/MaterialWithLabourConfig/MaterialWithLabourConfigMain'));
const MaterialWithLabourSingle = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/MaterialWithLabourConfig/MaterialWithLabourConfigSingle'));
const CadUploadMain = lazy(() => import('./Pages/CAD_Pages/CadUploadMain'));
const CommonOrderItemSingle = lazy(() => import('./Pages/Stage Pages/CommonOrderHistory/CommonOrderItemSingle'));
const ToolMasterMain = lazy(() => import('./Pages/Tools_Pages/ToolMaster/ToolMasterMain'));
const ToolSingleMaster = lazy(() => import('./Pages/Tools_Pages/ToolMaster/ToolSingleMaster'));
const CreateToolMaster = lazy(() => import('./Pages/Tools_Pages/ToolMaster/CreateToolMaster'));
const ToolRoomMain = lazy(() => import('./Pages/Tools_Pages/ToolRoom/ToolRoomMain'));
const ToolRoomSingle = lazy(() => import('./Pages/Tools_Pages/ToolRoom/ToolRoomSingle'));
const WebDeletionInfo = lazy(() => import('./Pages/Home/WebDeletionInfo'));

const StaffPermissionDashboard = lazy(() => import('./Pages/Organization/Staffs_And_Roles_Pages/StaffPermissionDashboardMain'));
const StaffPermissionsSingle = lazy(() => import('./Pages/Organization/Staffs_And_Roles_Pages/StaffPermissionsSingle'));
const CreateProcurementPage = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/CreateProcurementPage'));
const SingleOrderViewPage = lazy(() => import('./Pages/Stage Pages/Ordering Materials/SingleOrderViewPage'));
const PublicProcurementRatePage = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/PublicProcurementNew'));

const CreateDesignLab = lazy(() => import('./Pages/DesignLab_Pages/CreateDesignLab'));
const DesignLabSingle = lazy(() => import('./Pages/DesignLab_Pages/DesignLabSingle'));
const DesignLabMain = lazy(() => import('./Pages/DesignLab_Pages/DesignLabMain'));
const PaymentAccMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/PaymentAcc_Main_Pages/PaymentAccMain'));
const PaymentAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/PaymentAcc_Main_Pages/PaymentAccSingle'));

const TemplateBillMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/BillNewAccountant_Pages/TemplateBillMain'));
const TemplateBillSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/BillNewAccountant_Pages/TemplateBillSingle'));
const BillNewMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/BillNewAccountant_Pages/BillNewMain'));
const BillNewSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/BillNewAccountant_Pages/BillNewSingle'));

const SubContractMain = lazy(() => import('./Pages/SubContract Pages/SubContractNew Pages/SubContractMain'));
const CreateSubContract = lazy(() => import('./Pages/SubContract Pages/SubContractNew Pages/CreateSubContract'));
const SingleSubContract = lazy(() => import('./Pages/SubContract Pages/SubContractNew Pages/SingleSubContract'));
const PublicSubContract = lazy(() => import('./Pages/SubContract Pages/SubContractNew Pages/PublicSubContract'));
const TicketOperationMain = lazy(() => import('./Pages/Stage Pages/Ticekt_Operation_Pages/TicketOperationMain'));
const VendorPaymentAccMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Payment Pages/VendorPaymentAccMain'));
const VendorPaymentSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Payment Pages/VendorPaymentSingle'));
const CreateVendorPaymentAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Payment Pages/CreateVendorPaymentAcc'));
const BillAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Bill Pages/BillAccountMain'));
const BillAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Bill Pages/BillAccSingle'));
const CreateBillAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Bill Pages/CreateBillAcc'));
const PurchaseAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Purchase Pages/PurchaseAccountMain'));
const PurchasesAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Purchase Pages/PurchaseAccSingle'));
const CreatePurchaseAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Purchase Pages/CreatePurchaseAcc'));
const ExpenseAccountSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Expense Accounts Page/ExpenseAccountsSingle'));
const ExpenseAccountMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Expense Accounts Page/ExpenseAccountsMain'));
const CreateExpense = lazy(() => import('./Pages/Department Pages/Accounting Pages/Expense Accounts Page/CreateExpense'));
const VendorAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Account/VendorAccountsMain'));
const VendorAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Account/VendorAccSingle'));
const CreateVendorAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Vendor Account/CreateVendorAcc'));
const ShopDetailSingle = lazy(() => import('./Pages/Stage Pages/Ordering Materials/ShopLib Details Pages/ShopLibDetailSingle'));
const ShopLibDetailsMain = lazy(() => import('./Pages/Stage Pages/Ordering Materials/ShopLib Details Pages/ShopLibDetailsMain'));
const PublicOrgOrderMaterialSetup = lazy(() => import('./Pages/Stage Pages/Ordering Materials/Public OrderMaterial Page/PublicOrgOrderMaterialSetup'));
const PublicOrderMaterialMain = lazy(() => import('./Pages/Stage Pages/Ordering Materials/Public OrderMaterial Page/PublicOrderMaterialMain'));
const PublicOrderMatStaffView = lazy(() => import('./Pages/Stage Pages/Ordering Materials/Public OrderMaterial Page/PublicOrderMatStaffView'));
const SalesOrderAccountMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Sales Account/SalesOrderAccountMain'));
const SalesOrderAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Sales Account/SalesOrderAccSingle'));
const CreateSalesOrderAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Sales Account/CreateSalerOrderAcc'));
const SelectedModularUnitsNew = lazy(() => import('./Pages/Modular Units/Selected Units New/SelectedModularUnitNew'));
const ModularUnitMainNew = lazy(() => import('./Pages/Modular Units/Modular Units New/ModularUnitMainNew'));
const CreateModularUnitNew = lazy(() => import('./Pages/Modular Units/Modular Units New/CreateModularUnitNew'));
const ModularUnitSingleNew = lazy(() => import('./Pages/Modular Units/Modular Units New/ModularUnitSingleNew'));
const RetailInvoiceAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Retail Invoice Account/RetailInvoiceAccountMain'));
const RetailCreateInvoiceAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Retail Invoice Account/CreateRetailInvoiceAcc'));
const RetailInvoiceAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Retail Invoice Account/RetailInvoiceAccSingle'));
const InvoiceAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Invoice Account/InvoiceAccountMain'));
const InvoiceAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Invoice Account/InvoiceAccSingle'));
const CreateInvoiceAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Invoice Account/CreateInvoiceAcc'));
const CustomerAccountsMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/Customer Account/CustomerAccountsMain'));
const CustomerAccSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/Customer Account/CustomerAccSingle'));
const CreateCustomerAcc = lazy(() => import('./Pages/Department Pages/Accounting Pages/Customer Account/CreateCustomerAcc'));
const NotificationMain = lazy(() => import('./Pages/Notificaition Page/NotificationMain'));
const MaterialInventoryMain = lazy(() => import('./Pages/Material Inventory Pages/MaterialInventoryMain'));
const MaterialInventorySingle = lazy(() => import('./Pages/Material Inventory Pages/Material Inventory Single/MaterialInventorySingle'));
const MaterialInventoryCartMain = lazy(() => import('./Pages/Material Inventory Pages/Material Inventory Cart/MaterialInventoryCartMain'));
const WorkLibraryMain = lazy(() => import('./Pages/Work Library Pages/WorkLibraryMain'));
const WorkLibrarySingle = lazy(() => import('./Pages/Work Library Pages/WorkLibrarySingle'));
// const ShortlistMicaMain = lazy(() => import('./Pages/Stage Pages/Sample design/ShortList/ShortListMicaMain'));
// const ShortListMicaReferenceDesignMain = lazy(() => import('./Pages/Stage Pages/Sample design/ShortListReference Pages/ShortlListMicaDesignMain'));
const StaffAssignTaskMain = lazy(() => import('./Pages/Staff Tasks Pages/Create Task Pages/StaffAssignTaskMain'));
const SingleStaffList = lazy(() => import('./Pages/Staff Tasks Pages/SingleStaffs Task Pages/SingleStaffList'));
const LabourRateConfigMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/Labour RateConfig Pages/LabourRateConfigMain'));
const ClientQuoteMain = lazy(() => import('./Pages/Quote Pages/ClientQuote Pages/ClientQuoteMain'));
const ClientQuoteSingle = lazy(() => import('./Pages/Quote Pages/ClientQuote Pages/ClientSingle Pages/ClientQuoteSingle'));
const QuotePaymentMain = lazy(() => import('./Pages/Stage Pages/PaymentConfirmation Pages/QuotePayment pages/QuotePaymentMain'));
const QuotePaymentChild = lazy(() => import('./Pages/Stage Pages/PaymentConfirmation Pages/QuotePayment pages/QuotePaymentChild'));
// import LabourRateConfigSingle from './Pages/Quote Pages/RateConfig Pages/Labour RateConfig Pages/LabourRateConfigSingle';
const QuotePdfMain = lazy(() => import('./Pages/Stage Pages/QuoteProjectPdfs/QuotePdfMain'));
const ShortListReferenceDesignMain = lazy(() => import('./Pages/Stage Pages/Sample design/ShortListReference Pages/ShortListReferenceDesignMain'));
const WorkReportMain = lazy(() => import('./Pages/Stage Pages/WorkReport Pages/WorkReportMain'));
const StaffTasksListMain = lazy(() => import('./Pages/Staff Tasks Pages/StaffTasksListMain'));
const TaskViewMain = lazy(() => import('./Pages/Staff Tasks Pages/TaskViewMain'));
const QuoteGenerateVariantSub = lazy(() => import('./Pages/Quote Pages/Quote VariantGenerate Pages/QuoteGenerateVariantSub'));
const RateConfigAdminMain = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigAdminMain'));
const RateConfigSub = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/RateConfigSub'));
const InternalQuoteEntryMain = lazy(() => import('./Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/InternalQuoteEntry'));
const InternalQuoteEntrySingle = lazy(() => import('./Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/InternalQuoteEntrySingle'));
const QuoteVariantGenerateMain = lazy(() => import('./Pages/Quote Pages/Quote VariantGenerate Pages/QuoteVariantGenerateMain'));
const LogisticsMain = lazy(() => import('./Pages/Department Pages/Logistics Pages/LogisticsMain'));
const LogisticsSingle = lazy(() => import('./Pages/Department Pages/Logistics Pages/LogisticsSingle'));
const ProcurementSub = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/ProcurementSub'));
const ProcurementNewMain = lazy(() => import('./Pages/Department Pages/ProcurementNew Pages/ProcurementNewMain'));
const AccountingMain = lazy(() => import('./Pages/Department Pages/Accounting Pages/AccountingMain'));
// const AccountingSingle = lazy(() => import('./Pages/Department Pages/Accounting Pages/AccountingSingle'));
// import LogisticsVehicle from './Pages/Department Pages/Logistics Pages/LogisticsVehicle';
const InventoryMain = lazy(() => import('./Pages/Stage Pages/Inventory Main/InventoryMain'));
// const ExternalMain = lazy(() => import('./Pages/External Units/ExternalMain'));
// const WardrobeExternal = lazy(() => import('./Pages/External Units/WardrobeExternal'));
// const SelectedExternalUnits = lazy(() => import('./Pages/External Units/SelectedExternal Units/SelectedExternalUnits'));
// const ProcurementMain = lazy(() => import('./Pages/Department Pages/Procurement/ProcurementMain'));
const HrSingleEmployeeDetail = lazy(() => import('./Pages/Department Pages/Hr Pages/HrSingleEmployeeDetail'));
const RoomPage = lazy(() => import('./Pages/RequirementForm/RoomPage'));
const HRMainPage = lazy(() => import('./Pages/Department Pages/Hr Pages/HRMainPage'));
const CommonOrdersMain = lazy(() => import('./Pages/Stage Pages/CommonOrderHistory/CommonOrdersMain'));
const CommonOrderProject = lazy(() => import('./Pages/Stage Pages/CommonOrderHistory/CommonOrderProject'));
// const RoomDetailCardNew = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/RoomDetailCardNew"));
// const ForgotPassword = lazy(() => import('./Pages/Forgot Password/ForgotPassword'));
// const ResetPassword = lazy(() => import('./Pages/Forgot Password/ResetPassword'));
const ShortlistMain = lazy(() => import('./Pages/Stage Pages/Sample design/ShortList/ShortListMain'));
const MaterialArrivalOverviewNew = lazy(() => import('./Pages/Stage Pages/MaterialArrival/MaterialArrivalOverviewNew'));
// import ProjectStageRedirect from './Pages/Projects/ProjectStageRedirect';

const Home = lazy(() => import("./Pages/Home/Home"));
const Issues = lazy(() => import("./Pages/Issues/Issues"));
const Phase = lazy(() => import("./Pages/Phases/Phase"));
const Tasks = lazy(() => import("./Pages/Tasks/Tasks"));
const Projects = lazy(() => import("./Pages/Projects/Projects"));
// const Login = lazy(() => import("./Pages/Login/Login"));
const ProjectDetails = lazy(() => import("./Pages/Projects/ProjectDetails"));
const ProjectLists = lazy(() => import("./Pages/Projects/ProjectLists"));
const NotFound = lazy(() => import("./Pages/Not Found/NotFound"));
const Organization = lazy(() => import("./Pages/Organization/Organization"));
// const OrganizationDetails = lazy(() => import("./Pages/Organization/OrganizationDetails"));
const StaffRegister = lazy(() => import("./Pages/Staff/StaffRegister"));
// const StaffLogin = lazy(() => import("./Pages/Staff/StaffLogin"));
const Workers = lazy(() => import("./Pages/Workers/Workers"));
const WorkerRegister = lazy(() => import("./Pages/Workers/WorkerRegister"));
// const WorkerLogin = lazy(() => import("./Pages/Workers/WorkerLogin"));
const UnAuthorized = lazy(() => import("./Pages/UnAuthorized/UnAuthorized"));
const InviteStaffs = lazy(() => import("./Pages/Organization/InviteStaffs"));
const InviteCTO = lazy(() => import("./Pages/Organization/InviteCTO"));
const OrganizationChildrens = lazy(() => import("./Pages/Organization/OrganizationChildren"));
const CTORegister = lazy(() => import("./Pages/CTO/CTORegister"));
// const CTOLogin = lazy(() => import("./Pages/CTO/CTOLogin"));
// const ClientLogin = lazy(() => import("./Pages/Client/ClientLogin"));
const ClientRegister = lazy(() => import("./Pages/Client/ClientRegister"));
const InviteClient = lazy(() => import("./Pages/Organization/inviteClient"));
const RequirementFormPublic = lazy(() => import("./Pages/RequirementForm/components/RequirementFormPublic"));
const RequriementForm = lazy(() => import("./Pages/RequirementForm/RequriementForm"));
const SiteMeasurement = lazy(() => import("./Pages/Stage Pages/Site Measurement/SiteMeasurement"));
const SampleDesign = lazy(() => import("./Pages/Stage Pages/Sample design/SampleDesign"));
const TechnicalConsultant = lazy(() => import("./Pages/Stage Pages/Technical Consultant/TechnicalConsultant"));
// const MaterialRoomOverview = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/MaterialOverview"));
// // const RoomDetailCard = lazy(() => import("./Pages/Stage Pages/MaterialSelectionRoom/OldVersion/RoomDetailCard"));
// const CostEstimationContainer = lazy(() => import("./Pages/Stage Pages/Cost Estimation/CostEstimationContainer"));
// const CostEstimationRoomDetails = lazy(() => import("./Pages/Stage Pages/Cost Estimation/CostEstimationRoomDetails"));
// const LabourEstimateContainer = lazy(() => import("./Pages/Stage Pages/Cost Estimation/LabourEstimate/LabourEstimateContainer"));
const OrderMaterialOverview = lazy(() => import("./Pages/Stage Pages/Ordering Materials/OrderMaterialOverview"));
// const OrderMaterialOverview = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/OrderMaterialOverview"));
// const OrderMaterialRoomDetails = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/OrderMaterialRoomDetails"));
// const MaterialArrivalOverview = lazy(() => import("./Pages/Stage Pages/MaterialArrival/MaterialArrivalOverview"));
// const MaterialArrivalRoomDetail = lazy(() => import("./Pages/Stage Pages/MaterialArrival/MaterialArrivalRoomDetail"));
const PublicMaterialArrival = lazy(() => import("./Pages/Stage Pages/MaterialArrival/PublicMaterialArrival"));
// const PublicOrderMaterial = lazy(() => import("./Pages/Stage Pages/Ordering Materials/Old Version/PublicOrderMaterial"));
const PublicOrderHistory = lazy(() => import("./Pages/Stage Pages/Ordering Materials/PublicOrderHistory"))
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
// const ModularUnitMain = lazy(() => import("./Pages/Modular Units/ModularUnitMain"));
// const AddModularUnit = lazy(() => import("./Pages/Modular Units/AddModularUnit"));
// const ModularUnitCategoryPage = lazy(() => import("./Pages/Modular Units/ModularUnitCategoryPage"));
// const SelectStage = lazy(() => import("./Pages/Stage Pages/SelectStage/SelectStage"));
// const SelectedUnits = lazy(() => import("./Pages/Modular Units/Selected Units/SelectedUnits"));
const DocumentationMain = lazy(() => import("./Pages/Documentation/DocumentationMain"));
const SingleStageDocument = lazy(() => import("./Pages/Documentation/SingleStageDocument"));
const CreateToolRoom = lazy(() => import('./Pages/Tools_Pages/ToolRoom/CreateToolRoom'));
const ToolOtpIssueGenerateMain = lazy(() => import('./Pages/Tools_Pages/Tool_OTP/ToolOtpIssueGenerateMain'));
const ToolOtpVerifyMain = lazy(() => import('./Pages/Tools_Pages/Tool_OTP/ToolOtpVerifyMain'));
const ToolHistoryMain = lazy(() => import('./Pages/Tools_Pages/ToolHistory/ToolHistoryMain'));
const ToolHub = lazy(() => import('./Pages/Tools_Pages/Tool_Hub/ToolHub'));
const WorkDataTemplateMain = lazy(() => import('./Pages/Quote Pages/WorkData_Page/WorkDataTemplateMain'));
const WorkDataSingleTemplate = lazy(() => import('./Pages/Quote Pages/WorkData_Page/WorkDataSingleTemplate'));
const InternalQuoteMainNew = lazy(() => import('./Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/InternalQuote_New_Version/InternalQuoteMainNew'));
const CreateInternalQuoteNew = lazy(() => import('./Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/InternalQuote_New_Version/CreateInternalQuoteNew'));
const InternalQuoteSingleNew = lazy(() => import('./Pages/Quote Pages/Quote Generate Pages/QuoteGenerate Main/InternalQuote_New_Version/InternalQuoteSingleNew'));
const LabourRateConfigSingle = lazy(() => import('./Pages/Quote Pages/RateConfig Pages/Labour RateConfig Pages/LabourRateConfigSingle'));
const OrganizationSettings = lazy(() => import('./Pages/Organization/OrganizationSettings'));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MaterialOverviewLoading />}>{children}</Suspense>
);





function App() {

  const [projectId, setProjectId] = useState<string | null>(null)
  // const [organizationId, setOrganizationId] = useState<string | null>(null)
  const { isauthenticated, organizationId } = useSelector((state: RootState) => state.authStore)

  //it is used to check whether which user is now currently using the application
  const { loading } = useAuthCheck();


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


  const currentUser = useCurrentSupervisor()

  // useEffect(() => {
  //   const userId = currentUser?.id;
  //   if (!socket || !organizationId || !userId) return;

  //   socket.emit('join_ticket_discussion', { organizationId, userId });

  //   // No socket.on here! Only emit to join room
  // }, [organizationId, currentUser?.id]);




  useEffect(() => {
    console.log("not geting this into the currentUser", currentUser?.id)
    if (!organizationId || !currentUser?.id) return;

    const userId = currentUser.id;

    console.log("[Socket] Joining ticket discussion room for user:", userId);
    socket.emit('join_ticket_discussion', { organizationId, userId });

    // Rejoin on reconnect
    const handleReconnect = () => {
      console.log("[Socket] Rejoining ticket discussion room after reconnect");
      socket.emit('join_ticket_discussion', { organizationId, userId });
    };

    socket.on('connect', handleReconnect);

    return () => {
      socket.off('connect', handleReconnect);
      // Optionally: leave the room if user logs out
      // socket.emit('leave_ticket_discussion', { organizationId });
    };
  }, [organizationId, currentUser?.id]);



  if (loading) return <MaterialOverviewLoading />;
  return (
    <>
      <LazyWrapper>
        <Routes>

          {/* <Route path="/" element={<Navigate to="/organizations" replace />} /> */}
          <Route path="/" element={isauthenticated ? (<Navigate to={`/organizations/${organizationId}`} replace />) : (<Home />)} />


          <Route path="/login" element={<LoginGroup />}>
            {/* <Route index element={<Login />} /> //this is your default owner login */}
            {/* <Route path="cto" element={<CTOLogin />} />
            <Route path="staff" element={<StaffLogin />} />
            <Route path="worker" element={<WorkerLogin />} />
            <Route path="client" element={<ClientLogin />} /> */}
            <Route path="common" element={<CommonLogin />} />
          </Route>

          <Route path="/home" element={<Home />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />

          {/* <Route path='/stafflogin' element={<StaffLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path='/workerlogin' element={<WorkerLogin />} />
          <Route path='/ctologin' element={<CTOLogin />} />
          <Route path='/clientlogin' element={<ClientLogin />} /> */}
          <Route path="commonlogin" element={<CommonLogin />} />


          <Route path='/staffregister' element={<StaffRegister />} />
          <Route path='/workerregister' element={<WorkerRegister />} />
          <Route path='/ctoregister' element={<CTORegister />} />
          <Route path='/clientregister' element={<ClientRegister />} />




          {/* <Route path='/reset-password/:role' element={<ResetPassword />} />
          <Route path='/forgotpassword/:role' element={<ForgotPassword />} /> */}
          <Route path='/common/reset-password' element={<CommonResetPassword />} />
          <Route path='/common/forgotpassword' element={<CommonForgotPassword />} />

          <Route path="/subscription" element={<SubscriptionPlans />} />

          <Route path="/organizations" element={
            <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
              <Organization />
            </ProtectedRoutes>
          } />

          <Route path="/organizations-registration" element={
            <OrganizationAndUserRegistrationMain />
          } />

          <Route path="/organizations/:organizationId" element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
            <OrganizationChildrens
            //  setOrganizationId={setOrganizationId}
            />
          </ProtectedRoutes>} >



            <Route index
              element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <OrganizationDetailsMain />
              </ProtectedRoutes>} />



            <Route path='settings'
              element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO"]}>
                <OrganizationSettings />
              </ProtectedRoutes>} />


            <Route path='all-organizations'
              element={<ProtectedRoutes allowedRoles={["CTO", "owner", "staff"]}
                requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="allorgs"
              >
                <AllOrganizationMain />
              </ProtectedRoutes>} >

              <Route path='organization-dashboard/:organizationId'
                element={<ProtectedRoutes allowedRoles={["owner", "staff", "CTO"]}>
                  <OrganizaitonOtherDashBoard />
                </ProtectedRoutes>} />
            </Route>


            <Route path='invitestaff'
              element={<ProtectedRoutes allowedRoles={["CTO", "owner", "staff", "worker", "client"]}
                requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="invitestaff"

              >
                <InviteStaffs />
              </ProtectedRoutes>} />

            <Route path='invitecto'
              element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="invitecto"
              >
                <InviteCTO />
              </ProtectedRoutes>} />


            <Route path='dashboard'
              element={<ProtectedRoutes allowedRoles={["owner"]}>
                <StaffPermissionDashboard />
              </ProtectedRoutes>} >

              <Route path='roles/:userId'
                element={<ProtectedRoutes allowedRoles={["owner"]}>
                  <StaffPermissionsSingle />
                </ProtectedRoutes>} />


            </Route>



            <Route path='subscriptionplan'
              element={<ProtectedRoutes allowedRoles={["owner"]}>
                <SubscriptionParent />
              </ProtectedRoutes>} />


            <Route path="userprofile" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <UserProfileDetails />
              </ProtectedRoutes>
            } />




            {/* <Route path="modularunits" element={
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

            </Route> */}


            <Route path="modularunits" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client", "worker"]}
                requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="modularunit"
              >
                <ModularUnitMainNew />
              </ProtectedRoutes>
            } >

              <Route path="create" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker"]}
                  requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="modularunit"

                >
                  <CreateModularUnitNew />
                </ProtectedRoutes>} />

              <Route path="single/:unitId" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client", "worker"]}
                  requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="modularunit"

                >
                  <ModularUnitSingleNew />
                </ProtectedRoutes>} />
            </Route>



            {/* <Route path="procurement" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                <ProcurementMain />
              </ProtectedRoutes>
            } /> */}


          </Route>


          <Route path='/organizations/:organizationId/projects' element={<Projects projectId={projectId} setProjectId={setProjectId} />} >
            <Route index element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
              requiredDepartment={["inventory",
                "inviteworker",
                "inviteclient",
                "prerequisites",
                "clientrequirement",
                "sitemeasurement",
                "sampledesign",
                "workschedule",
                "technicalconsultant",
                "paymentconfirmation",
                "modularunit",
                "ordermaterial",
                "materialarrival",
                "installation",
                "qualitycheck",
                "cleaning",
                "projectdelivery"
              ]}
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <ProjectLists />
            </ProtectedRoutes>} />

            <Route path="projectconfiguration" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="project_configuration"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <ProjectConfiguration />
            </ProtectedRoutes>} />


            <Route path="archievedprojects" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="archive_projects"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <ArchivedProjects />
            </ProtectedRoutes>} />


            <Route path="hr" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="hr"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <HRMainPage />
            </ProtectedRoutes>} >


              <Route path=":id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="hr"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit',]}
              >
                <HrSingleEmployeeDetail />
              </ProtectedRoutes>} />


            </Route>
            {/* 
            <Route path="instantcostcalculation" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="instant_cost_calculation"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <InstantCostCalculation />
            </ProtectedRoutes>} >


              <Route path="products" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="instant_cost_calculation"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}
              >
                <InstantCostCalculatorProductConfigMain />
              </ProtectedRoutes>} ></Route>

              <Route path="instant-cost-calculator/dimention/:categoryId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="instant_cost_calculation"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}
              >
                <InstantCostCalculatorDimentionMain />
              </ProtectedRoutes>} >

                <Route path="single/:dimensionKey" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="instant_cost_calculation"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}
                >
                  <InstantCostCalculatorDimentionSingle />
                </ProtectedRoutes>} ></Route>



              </Route>


            </Route> */}


            {/* Parent wrapper for the base path. Note: No 'element' property here! */}
            <Route path="instantcostcalculation">

              {/* 1. The original calculator becomes the 'index' route (default page) */}
              <Route
                index
                element={
                  <ProtectedRoutes
                    allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="instant_cost_calculation"
                    requiredAction={['list', 'create', 'edit', 'delete']}
                  >
                    <InstantCostCalculation />
                  </ProtectedRoutes>
                }
              />

              {/* 2. Products Page */}
              <Route
                path="products"
                element={
                  <ProtectedRoutes
                    allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="instant_cost_calculation"
                    requiredAction={['list', 'create', 'edit', 'delete']}
                  >
                    <InstantCostCalculatorProductConfigMain />
                  </ProtectedRoutes>
                }
              />

              {/* 3. Dimension Main Page */}
              <Route
                path="instant-cost-calculator/dimention/:categoryId"
                element={
                  <ProtectedRoutes
                    allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="instant_cost_calculation"
                    requiredAction={['list', 'create', 'edit', 'delete']}
                  >
                    <InstantCostCalculatorDimentionMain />
                  </ProtectedRoutes>
                }
              />

              {/* 4. Single Dimension Config Page (Flattened) */}
              <Route
                path="instant-cost-calculator/dimention/:categoryId/single/:dimensionKey"
                element={
                  <ProtectedRoutes
                    allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="instant_cost_calculation"
                    requiredAction={['list', 'create', 'edit', 'delete']}
                  >
                    <InstantCostCalculatorDimentionSingle />
                  </ProtectedRoutes>
                }
              />

            </Route>



            <Route path="logistics" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="logistics"

            >
              <LogisticsMain />
            </ProtectedRoutes>} >


              {/* <Route path="vehicle" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
                <LogisticsVehicle />
              </ProtectedRoutes>} /> */}


              <Route path="sub/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="logistics"

              >
                <LogisticsSingle />
              </ProtectedRoutes>} />


            </Route>

            <Route path="procurement" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredAction={["create", "delete", "edit", "list"]} requiredDepartment="procurement"
            >
              <ProcurementNewMain />
            </ProtectedRoutes>} >

              <Route path="sub/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredAction={["edit", "list"]} requiredDepartment="procurement"

              >
                <ProcurementSub />
              </ProtectedRoutes>} >


                <Route path="shopquote/:shopquoteid" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredAction={["edit", "list"]} requiredDepartment="procurement"

                >
                  <ProtectedSingleShopQuote />
                </ProtectedRoutes>} />



              </Route>

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredAction={["create"]} requiredDepartment="procurement"
              >
                <CreateProcurementPage />
              </ProtectedRoutes>} />

            </Route>

            <Route path="shortlistdesign" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="referencedesign"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ShortListReferenceDesignMain />
            </ProtectedRoutes>} >
            </Route>

            {/* <Route path="shortlistmicadesign" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="design"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit']}
            >
              <ShortListMicaReferenceDesignMain />
            </ProtectedRoutes>} >
            </Route> */}


            <Route path="accounting" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              // requiredDepartment={"accounts" || "billing"}
              requiredDepartment={["accounts", "records", "billing", "payments", "vendor", "customer", "invoice",
                "expense", "billtemplate", "purchaseorder",
                "vendorpayment", "salesorder", "retailinvoice",]}
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <AccountingMain />
            </ProtectedRoutes>} >

              {/* <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="accounts"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list"]}
              >
                <AccountingSingle />
              </ProtectedRoutes>} /> */}


            </Route>

            <Route path="accountingrecords" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              // requiredDepartment={"accounts" || "billing"}
              requiredDepartment="records"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <AccountingRecordMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="records"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list"]}
              >
                <AccountingRecordSingle />
              </ProtectedRoutes>} />


            </Route>

            <Route path="customermain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="customer"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <CustomerAccountsMain />
            </ProtectedRoutes>} >

              <Route path="customersingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="customer"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit", "delete"]}
              >
                <CustomerAccSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="customer"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <CreateCustomerAcc />
              </ProtectedRoutes>} />
            </Route>

            <Route path="invoicemain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="invoice"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <InvoiceAccountsMain />
            </ProtectedRoutes>} >

              <Route path="invoicesingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="invoice"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit",]}
              >
                <InvoiceAccSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="invoice"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create',]}
              >
                <CreateInvoiceAcc />
              </ProtectedRoutes>} />


            </Route>

            <Route path="retailinvoicemain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="retailinvoice"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <RetailInvoiceAccountsMain />
            </ProtectedRoutes>} >

              <Route path="retailinvoicesingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="retailinvoice"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit",]}
              >
                <RetailInvoiceAccSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="retailinvoice"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <RetailCreateInvoiceAcc />
              </ProtectedRoutes>} />


            </Route>

            <Route path="salesordermain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="salesorder"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <SalesOrderAccountMain />
            </ProtectedRoutes>} >

              <Route path="salessingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="salesorder"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit",]}
              >
                <SalesOrderAccSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="salesorder"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create',]}
              >
                <CreateSalesOrderAcc />
              </ProtectedRoutes>} />


            </Route>


            <Route path="vendormain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="vendor"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <VendorAccountsMain />
            </ProtectedRoutes>} >

              <Route path="vendorsingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="vendor"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit", "delete"]}
              >
                <VendorAccSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="vendor"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <CreateVendorAcc />
              </ProtectedRoutes>} />
            </Route>



            <Route path="expensemain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="expense"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <ExpenseAccountMain />
            </ProtectedRoutes>} >

              <Route path="expensesingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="expense"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit"]}
              >
                <ExpenseAccountSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="expense"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list"]}
              >
                <CreateExpense />
              </ProtectedRoutes>} />
            </Route>

            <Route path="paymentmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="payments"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <PaymentAccMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="payments"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list", "edit", "create"]}
              >
                <PaymentAccSingle />
              </ProtectedRoutes>} />

              <Route path="publicpayment" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="payments"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list"]}
              >
                <PublicPaymentTransactionMain />
              </ProtectedRoutes>} />



            </Route>






            <Route path="billmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="billing"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={["list", "edit", "create", "delete"]}
            >
              <BillAccountsMain />
            </ProtectedRoutes>} >

              <Route path="billsingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment={"billing"}
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list", "edit"]}
              >
                <BillAccSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="billing"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["create"]}
              >
                <CreateBillAcc />
              </ProtectedRoutes>} />


            </Route>

            <Route path="billnew" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="billtemplate"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <BillNewMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="billtemplate"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit"]}
              >
                <BillNewSingle mode="edit" />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="billtemplate"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list",]}
              >
                <BillNewSingle mode="create" />
              </ProtectedRoutes>} />


              <Route path="billtemplate" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="billtemplate"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit", "delete"]}
              >
                <TemplateBillMain />
              </ProtectedRoutes>} >

                <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="billtemplate"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['create', "list", "edit",]}
                >
                  <TemplateBillSingle mode="edit" />
                </ProtectedRoutes>} />


                <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="billtemplate"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['create', "list",]}
                >
                  <TemplateBillSingle mode="create" />
                </ProtectedRoutes>} />
              </Route>


            </Route>

            <Route path="purchasemain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="purchaseorder"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <PurchaseAccountsMain />
            </ProtectedRoutes>} >

              <Route path="purchasesingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="purchaseorder"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit",]}
              >
                <PurchasesAccSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="purchaseorder"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list",]}
              >
                <CreatePurchaseAcc />
              </ProtectedRoutes>} />


            </Route>

            <Route path="vendorpaymentmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="vendorpayment"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <VendorPaymentAccMain />
            </ProtectedRoutes>} >

              <Route path="vendorpaymentsingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="vendorpayment"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit",]}
              >
                <VendorPaymentSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="vendorpayment"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list",]}
              >
                <CreateVendorPaymentAcc />
              </ProtectedRoutes>} />
            </Route>


            <Route path="pincodemain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              // requiredDepartment={"accounts" || "billing"}
              requiredDepartment="pincode"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <PinCodeMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment={"pincode"}
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list", "edit"]}
              >
                <PincodeSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="pincode"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["create"]}
              >
                <CreatePincode />
              </ProtectedRoutes>} />


            </Route>

            {/* <Route path="pincodemappingmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              // requiredDepartment={"accounts" || "billing"}
              requiredDepartment="pincodeMapping"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <PincodeVendorMappingMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment={"pincodeMapping"}
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list", "edit"]}
              >
                <PincodeVendorMappingSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="pincodeMapping"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["create"]}
              >
                <CreatePincodeVendorMapping />
              </ProtectedRoutes>} />


            </Route> */}

            <Route path="pincodeprojectmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              // requiredDepartment={"accounts" || "billing"}
              requiredDepartment="pincodeproject"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <PincodeVendorProjectAssignMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment={"pincodeproject"}
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["list", "edit"]}
              >
                <SinglePincodeVendorProjectAssign />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="pincodeproject"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["create"]}
              >
                <CreatePincodeVendorProjectAssign />
              </ProtectedRoutes>} />
            </Route>

            <Route path="executionpartnermain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="executionpartner"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['create', "list", "edit", "delete"]}
            >
              <ExecutionPartnerAccountsMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="executionpartner"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create', "list", "edit", "delete"]}
              >
                <ExpensePartnerAccSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="executionpartner"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <CreateExpensePartnerAcc />
              </ProtectedRoutes>} />
            </Route>


            <Route path="subcontractmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="subcontract"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <SubContractMain

              />
            </ProtectedRoutes>} >


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="subcontract"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <CreateSubContract />
              </ProtectedRoutes>} />

              <Route path="single/:subContractId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="subcontract"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit',]}
              >
                <SingleSubContract />
              </ProtectedRoutes>} />

            </Route>

            <Route path="designlabmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="design"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <DesignLabMain />
            </ProtectedRoutes>} >


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="design"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['create']}
              >
                <CreateDesignLab />
              </ProtectedRoutes>} />

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="design"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit']}
              >
                <DesignLabSingle />
              </ProtectedRoutes>} />

            </Route>



            <Route path="commonorder" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="commonorder"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <CommonOrdersMain />
            </ProtectedRoutes>} >


              <Route path=":id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="commonorder"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <CommonOrderProject />
              </ProtectedRoutes>} >

                <Route path="singleorder/:orderItemId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="commonorder"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <CommonOrderItemSingle />
                </ProtectedRoutes>} />


              </Route>

            </Route>


            <Route path="cutlistmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="cutlist"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <CutlistMain />
            </ProtectedRoutes>} >

              <Route path="cutlistsingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="cutlist"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create",]}
              >
                <CutlistSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="cutlist"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['edit', "create"]}
              >
                <CreateCutlist />
              </ProtectedRoutes>} />
            </Route>



            <Route path="calculator" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="calculator"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <CalculatorMain />
            </ProtectedRoutes>} >
              {/* 
              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="presalesmaterialrateconfig"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <RateConfigPreSalesSub />
              </ProtectedRoutes>} /> */}
            </Route>


            <Route path="shopmaterialdoc" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="shopmaterialdoc"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ShopMaterialDocumentMain />
            </ProtectedRoutes>} >

              <Route path="single/:catalogueId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="shopmaterialdoc"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <ShopMaterialDocumentSingle />
              </ProtectedRoutes>} />


              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="shopmaterialdoc"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <ShopMaterialDocumentCreate />
              </ProtectedRoutes>} />
            </Route>


            <Route path="publiccostcalculation" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <PublicCostCalculationMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="leadmodule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <PublicCostCalculationSingle />
              </ProtectedRoutes>} />

            </Route>


            <Route path="publicleadcollection" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <PublicLeadCollectionMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="leadmodule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <PublicLeadCollectionSingle />
              </ProtectedRoutes>} />

            </Route>


            <Route path="instagram-leads" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <InstagramLeadsPage />
              {/* <InstagramLeadMainByMeta />  */}
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="leadmodule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <InstagramLeadSingle />
                {/* <InstagramLeadSingleByMeta /> */}
              </ProtectedRoutes>} />

            </Route>


            {/* <Route path="whatsapp" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
               <InstagramLeadsPage /> 
            </ProtectedRoutes>} /> */}
            {/* <WhatsAppLeadMainByMeta />  */}



            <Route path="meta-leads" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <MetaLeadMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="leadmodule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <MetaLeadSingle />
              </ProtectedRoutes>} />

            </Route>

            <Route path="meta-leads-main" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <MetaReviewDemoDashboard />
            </ProtectedRoutes>} >

            </Route>




            <Route path="vertical-living-configuration" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <VerticalLivingPdfConfiguration />
            </ProtectedRoutes>} >



            </Route>



            <Route path="whatsapp-leads" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="leadmodule"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <WhatsAppLeadsPage />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="leadmodule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <WhatsAppLeadSingle />
              </ProtectedRoutes>} />

            </Route>


             <Route path="premises" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="premises"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <PremiseMain />
            </ProtectedRoutes>} />


            <Route path="eb-dashboard" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="eb"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <EbDashboardMain />
            </ProtectedRoutes>} />

            <Route path="eb-log" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="eb"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <EbLogMain />
            </ProtectedRoutes>} />

            <Route path="tariff" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="tariff"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <TariffMain />
            </ProtectedRoutes>} />


            




            <Route path="rateconfigpresales" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="presalesmaterialrateconfig"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <RateConfigPreSalesMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="presalesmaterialrateconfig"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <RateConfigPreSalesSub />
              </ProtectedRoutes>} >

                <Route path="description" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="materialrateconfig"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <RateConfigDescription />
                </ProtectedRoutes>} />

              </Route>

            </Route>

            <Route path="rateconfig" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="materialrateconfig"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <RateConfigAdminMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="materialrateconfig"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <RateConfigSub />
              </ProtectedRoutes>} >


                {/* <Route path="catalogue/:catalogueId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]} */}
                <Route path="catalogue" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="materialrateconfig"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <ShopMaterialDocumentSingle />
                </ProtectedRoutes>} ></Route>

                <Route path="description" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="materialrateconfig"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <RateConfigDescription />
                </ProtectedRoutes>} ></Route>



                <Route path="history" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="materialrateconfig"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <RateConfigVersionMain />
                </ProtectedRoutes>} ></Route>


              </Route>


              <Route path="backup" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="materialrateconfig"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <RateConfigBackupMain />
              </ProtectedRoutes>} >

                <Route path="single/:backupId" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="materialrateconfig"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <RateConfigBackupSingle />
                </ProtectedRoutes>} ></Route>


              </Route>
            </Route>



            <Route path="labourrateconfig" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="labourratequote"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <LabourRateConfigMain />
            </ProtectedRoutes>} >

              <Route path="laboursingle/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}

                requiredDepartment="labourratequote"
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <LabourRateConfigSingle />
              </ProtectedRoutes>} />
            </Route>

            <Route path="materialwithlabourrate" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="materialwithlabourratequote"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <MaterialWithLabourRateMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}

                requiredDepartment="materialwithlabourratequote"
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <MaterialWithLabourSingle />
              </ProtectedRoutes>} >
              </Route>

              <Route path=":id/description" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="materialwithlabourratequote"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <MaterialAndLabourConfigDescription />
              </ProtectedRoutes>} />

            </Route>

            <Route path="worktemplates" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="worktemplates"
              // // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <WorkDataTemplateMain />
            </ProtectedRoutes>} >


              <Route path="single/:workType" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="worktemplates"
                // // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <WorkDataSingleTemplate />
              </ProtectedRoutes>} />




            </Route>



            <Route path="presalesquote" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="presales"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <PreSalesQuoteMain />
            </ProtectedRoutes>} >

              {/* <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="presales"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={["create",]}
              >
                <PreSalesQuoteSingle />
              </ProtectedRoutes>} /> */}

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="presales"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "delete"]}
              >
                <PreSalesQuoteSingle />
              </ProtectedRoutes>} />
            </Route>




            <Route path="internalquote" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="internalquote"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <InternalQuoteEntryMain />
            </ProtectedRoutes>} >

              <Route path="single/:id/:quoteType" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="internalquote"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <InternalQuoteEntrySingle />
              </ProtectedRoutes>} />





              <Route path="internalquotenew" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                requiredDepartment="internalquote"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create", "delete"]}
              >
                <InternalQuoteMainNew />
              </ProtectedRoutes>} >

                <Route path="create/:id/:quoteType" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="internalquote"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <CreateInternalQuoteNew />
                </ProtectedRoutes>} />

                <Route path="single/:id/:quoteType" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="internalquote"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'edit', "create", "delete"]}
                >
                  <InternalQuoteSingleNew />
                </ProtectedRoutes>} />


              </Route>


            </Route>


            <Route path="quotevariant" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="quotevariant"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <QuoteVariantGenerateMain />
            </ProtectedRoutes>} >


              <Route
                path="single/:quoteId"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="quotevariant"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit', "create",]}
                  >
                    <QuoteGenerateVariantSub />
                  </ProtectedRoutes>

                }
              />

            </Route>


            <Route path="clientquotes" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="clientquote"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ClientQuoteMain />
            </ProtectedRoutes>} >


              <Route
                path="single/:quoteId/:quoteType"
                element={

                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="clientquote"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit', "create",]}
                  >
                    <ClientQuoteSingle />
                  </ProtectedRoutes>
                }
              />

            </Route>

            <Route path="cadmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="cad"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <CadUploadMain />
            </ProtectedRoutes>} />

            <Route path="toolmain" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ToolMasterMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="toolhardware"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create",]}
              >
                <ToolSingleMaster />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="toolhardware"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', "create",]}
              >
                <CreateToolMaster />
              </ProtectedRoutes>} />

            </Route>


            <Route path="toolroom" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ToolRoomMain />
            </ProtectedRoutes>} >

              <Route path="single/:id" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="toolhardware"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create"]}
              >
                <ToolRoomSingle />
              </ProtectedRoutes>} />

              <Route path="create" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                requiredDepartment="toolhardware"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'edit', "create"]}
              >
                <CreateToolRoom />

              </ProtectedRoutes>} />

            </Route>



            <Route path="issueotp" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['edit', "create", "list"]}
            >
              <ToolOtpIssueGenerateMain />
            </ProtectedRoutes>} >

            </Route>


            <Route path="enterotp" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['edit', "create", "list"]}
            >
              <ToolOtpVerifyMain />
            </ProtectedRoutes>} >

            </Route>


            <Route path="toolhistory" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list']}
            >
              <ToolHistoryMain />
            </ProtectedRoutes>} >

            </Route>

            <Route path="toolhub" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
              requiredDepartment="toolhardware"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'edit', "create", "delete"]}
            >
              <ToolHub />
            </ProtectedRoutes>} >

            </Route>













            <Route path="worklibrary" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="stafftask"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}
            >
              <WorkLibraryMain />
            </ProtectedRoutes>} >


              <Route
                path="single/:id"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="stafftask"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit']}

                  >
                    <WorkLibrarySingle />
                  </ProtectedRoutes>



                }
              />

            </Route>


            <Route path="stafftask" element={<ProtectedRoutes allowedRoles={["owner", "CTO"]}
              requiredDepartment="stafftask"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}

            >
              <StaffTasksListMain />
            </ProtectedRoutes>} >


              <Route
                path="single/:id"
                element={

                  <ProtectedRoutes allowedRoles={["owner", "CTO"]}
                    requiredDepartment="stafftask"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit', 'delete']}

                  >
                    <TaskViewMain />
                  </ProtectedRoutes>

                }
              />


              <Route
                path="addtask"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO"]}
                    requiredDepartment="stafftask"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['create', 'edit',]}

                  >
                    <StaffAssignTaskMain />
                  </ProtectedRoutes>

                }
              />

            </Route>

            <Route path="associatedstafftask" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="stafftask"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit',]}

            >
              <SingleStaffList />
            </ProtectedRoutes>} >

              <Route
                path="single/:id"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="stafftask"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit', 'delete']}

                  >
                    {/* <SingleStaffList /> */}
                    <TaskViewMain />
                  </ProtectedRoutes>



                }
              />

            </Route>


            <Route path="materialinventory" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
              requiredDepartment="productinventory"
              // ⭐ Allow entry if they can do ANY of these things
              requiredAction={['list', 'create', 'edit', 'delete']}

            >
              <MaterialInventoryMain />
            </ProtectedRoutes>} >

              <Route
                path="single/:id"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="productinventory"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >

                    <MaterialInventorySingle />
                  </ProtectedRoutes>
                }
              />


              <Route
                path="cart"
                element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="productinventory"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'edit', 'delete']}

                  >

                    <MaterialInventoryCartMain />
                  </ProtectedRoutes>
                }
              />

            </Route>

            {/* <Route path="notification" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
              <NotificationMain />
            </ProtectedRoutes>} /> */}

          </Route>

          <Route path='/:organizationId/projectdetails/:projectId' element={<ProtectedRoutes allowedRoles={["owner", "client", "CTO", "worker", "staff"]}>
            <ProjectDetails projectId={projectId} setProjectId={setProjectId}
              //  setOrganizationId={setOrganizationId} 
              organizationId={organizationId} />
          </ProtectedRoutes>}>



            {/* <Route path="labourlist" element={<LabourList />} />
          <Route path="materiallist" element={<MaterialList />} /> */}
            {/* <Route path="transportationlist" element={<Transportationlist />} /> */}

            <Route path="prerequisites" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff",
                "client", "worker"
              ]}
                requiredDepartment="prerequisites"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <PrerequisitesPage />
              </ProtectedRoutes>
            } />



            <Route path="inventory" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="inventory"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
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
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="inviteworker"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <Workers />
              </ProtectedRoutes>
            } />
            <Route path="inviteclient" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="inviteclient"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

                <InviteClient />
              </ProtectedRoutes>
            } />

            <Route path="onboarding" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="onboarding"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <ProjectOnboarding />
              </ProtectedRoutes>
            } />

            <Route path="requirementform" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="clientrequirement"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <RequriementForm />
              </ProtectedRoutes>
            } >

              <Route path="roompage/:roomId" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}
                  requiredDepartment="clientrequirement"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <RoomPage />
                </ProtectedRoutes>} />

            </Route>

            <Route path="sitemeasurement" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="sitemeasurement"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

                <SiteMeasurement />
              </ProtectedRoutes>
            } />



            <Route path="sampledesign" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="sampledesign"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

                <SampleDesign />
              </ProtectedRoutes>
            } >


              <Route path="shortlist" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}
                  requiredDepartment="sampledesign"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <ShortlistMain />
                </ProtectedRoutes>} />

              {/* <Route path="shortlistmica" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "worker", "client"]}>
                  <ShortlistMicaMain />
                </ProtectedRoutes>} /> */}

            </Route>


            <Route path="designapproval" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="designapproval"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <DesignApprovalMain />
              </ProtectedRoutes>
            } />

            <Route path="technicalconsultant" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="technicalconsultant"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}


              >

                <TechnicalConsultant />
              </ProtectedRoutes>
            } />



            {/* <Route path="selectstage" element={
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
            </Route> */}


            <Route path="modularunitsnew" element={
              <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client", "worker"]}

                requiredDepartment="modularunit"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <ModularUnitMainNew />
              </ProtectedRoutes>
            } >


              <Route path="selectedunitsnew" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client", "worker"]}
                  requiredDepartment="modularunit"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <SelectedModularUnitsNew />
                </ProtectedRoutes>} />

              {/* <Route path="category/:unitType" element={
                <ProtectedRoutes allowedRoles={["owner", "staff", "CTO", "client"]}>
                  <ModularUnitCategoryPage />
                </ProtectedRoutes>} /> */}

            </Route>


            <Route path="paymentconfirmation" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="paymentconfirmation"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <PaymentConfirmationStage />
              </ProtectedRoutes>

            } >
              <Route path="consent" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                  requiredDepartment="paymentconfirmation"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <PaymentConsentSection />
                </ProtectedRoutes>

              } />
              <Route path="schedule" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                  requiredDepartment="paymentconfirmation"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <PaymentScheduleSection />
                </ProtectedRoutes>

              } />
              <Route path="transaction" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client",]}
                  requiredDepartment="paymentconfirmation"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <PaymentTransaction />
                </ProtectedRoutes>

              } />

              <Route path="quotes" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                  requiredDepartment="paymentconfirmation"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <QuotePaymentMain />
                </ProtectedRoutes>

              } >

                <Route path="single/:id" element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                    requiredDepartment="paymentconfirmation"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >
                    <QuotePaymentChild />
                  </ProtectedRoutes>

                } />
              </Route>

            </Route>


            <Route path="quotepdf" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client", "worker"]}
                requiredDepartment="paymentconfirmation"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

                <QuotePdfMain />
              </ProtectedRoutes>

            } ></Route>


            <Route path="ordermaterial" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="ordermaterial"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

                <OrderMaterialOverview />
              </ProtectedRoutes>

            } >
              {/* <Route path="ordermaterialroom/:roomKey" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>

                  <OrderMaterialRoomDetails />
                </ProtectedRoutes>

              } /> */}

              <Route path="siteorders" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                  requiredDepartment="ordermaterial"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >

                  <PublicOrderMatStaffView />
                </ProtectedRoutes>

              } />


              <Route path="singleorder/:orderItemId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                  requiredDepartment="ordermaterial"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >

                  <SingleOrderViewPage />
                </ProtectedRoutes>

              } />


              <Route path="shoplib" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="ordermaterial"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >

                  <ShopLibDetailsMain />
                </ProtectedRoutes>

              }>

                <Route path="single/:shopId" element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="ordermaterial"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >

                    <ShopDetailSingle />
                  </ProtectedRoutes>

                } />

              </Route>


            </Route>


            <Route path="materialarrival" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="materialarrival"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >

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
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="workschedule"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <WorkMainOverview />
              </ProtectedRoutes>
            } >
              {/* <Route path="workschedule/:sectionId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}>
                  <WorkSchedulePage />
                </ProtectedRoutes>
              } /> */}

              <Route path="dailyschedule/:sectionId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                  requiredDepartment="workschedule"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <DailySchedulePage />
                </ProtectedRoutes>
              } >

                <Route path="workreport" element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                    requiredDepartment="workschedule"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >
                    <WorkReportMain />
                  </ProtectedRoutes>
                } />

              </Route>


            </Route>

            <Route path="installation" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="installation"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
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
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="qualitycheck"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <QualityCheckOverview />
              </ProtectedRoutes>
            } >
              <Route path="qualitycheckroom/:roomName" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                  requiredDepartment="qualitycheck"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <QualityCheckRoomDetails />
                </ProtectedRoutes>
              } />

              <Route path={`qualitycheckroom/adminwall`} element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                  requiredDepartment="qualitycheck"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <AdminWallMainContainer />
                </ProtectedRoutes>
              } >
                <Route path={`step/:stepId/:stepNumber`} element={


                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}
                    requiredDepartment="qualitycheck"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >
                    {/* <AdminWallMainContainer /> */}
                    <AdminWallStepPage />
                  </ProtectedRoutes>

                } />
              </Route>

              <Route path="qualitycheckroom/workerwall" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                  requiredDepartment="qualitycheck"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <WorkerWallMainContainer />
                </ProtectedRoutes>
              } >
                <Route path='step/:stepId/:stepNumber' element={
                  <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}
                    requiredDepartment="qualitycheck"
                    // ⭐ Allow entry if they can do ANY of these things
                    requiredAction={['list', 'create', 'edit', 'delete']}

                  >
                    <WorkerWallStepPage />
                  </ProtectedRoutes>

                } />
              </Route>

            </Route>

            <Route path="cleaning" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                requiredDepartment="cleaning"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
                <CleaningOverview />
              </ProtectedRoutes>
            } >
              <Route path="cleaningroom/:roomId" element={
                <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker", "client"]}
                  requiredDepartment="cleaning"
                  // ⭐ Allow entry if they can do ANY of these things
                  requiredAction={['list', 'create', 'edit', 'delete']}

                >
                  <CleaningRoomOverview />
                </ProtectedRoutes>
              } />
            </Route>

            <Route path="projectdelivery" element={
              <ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "client", "worker"]}
                requiredDepartment="projectdelivery"
                // ⭐ Allow entry if they can do ANY of these things
                requiredAction={['list', 'create', 'edit', 'delete']}

              >
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



          {/*NOTIFICAITON navigation  */}
          <Route path="/:organizationId/notification" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff", "worker"]}>
            <NotificationMain />
          </ProtectedRoutes>} />

          <Route path="/:organizationId/ticket" element={<ProtectedRoutes allowedRoles={["owner", "CTO", "staff"]}>
            <TicketOperationMain />
          </ProtectedRoutes>} />


          {/* REQUIREMENT FORM LINK */}

          <Route path='/quotecalculator' element={<PublicQuoteGenerator />} />
          <Route path='/requirementform/:projectId/:token' element={<RequirementFormPublic />} />
          <Route path='/ordermaterial/public/:projectId/:token' element={<PublicOrderHistory />} />
          <Route path='/materialarrival/public/:projectId/:token' element={<PublicMaterialArrival />} />
          <Route path='/clientconsent/public/:projectId/:token' element={<PublicClientConsentForm />} />
          <Route path='/ordermaterial/setup' element={<PublicOrgOrderMaterialSetup />} />
          <Route path='/:organizationId/ordermaterial' element={<PublicOrderMaterialMain />} />
          <Route path='/:organizationId/procurement/public' element={<PublicProcurementRatePage />} />
          <Route path='/:organizationId/logistics/public/:id' element={<LogisticsPublicSingle />} />
          <Route path='/:organizationId/pincode/acknowledgement/public/:id' element={<PincodeVendorPublicAcknowledgement />} />
          <Route path='/:organizationId/design-approval/public/:projectId' element={<DesignApprovalPublic />} />

          <Route path='/subcontract/share/:subContractId' element={<PublicSubContract />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/account-deletion' element={<WebDeletionInfo />} />

          <Route path="*" element={<NotFound />} />

        </Routes >
      </LazyWrapper>
    </>
  )
}

export default App
