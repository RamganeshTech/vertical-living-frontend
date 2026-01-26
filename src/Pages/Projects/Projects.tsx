// import { Outlet, useParams } from "react-router-dom";
// import Sidebar from "../../shared/Sidebar";
// import { SIDEBAR_ICONS, SIDEBAR_LABELS } from "../../constants/constants";
// import MobileSidebar from "../../shared/MobileSidebar";
// import { useEffect, useState } from "react";
// import { useAuthCheck } from "../../Hooks/useAuthCheck";

// type ProjectType = {
//   projectId: string | null,
//   setProjectId: React.Dispatch<React.SetStateAction<string | null>>
// }

// const PERMISSION_MAPPING: Record<string, string> = {
//     HR: "hr",
//     LOGISTICS: "logistics",
//     PROCUREMENT: "procurement",
//     // ACCOUNTING: "accounts",       // 'ACCOUNTING' in sidebar -> 'accounts' in DB
//     DESIGNLAB: "design",          // 'DESIGNLAB' in sidebar -> 'design' in DB
// };



// const Projects: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

//   const { organizationId } = useParams()
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
//   const { role, permission } = useAuthCheck();

//   const path: Record<string, string> = {
//     PROJECTS: `/organizations/${organizationId}/projects`,
//     ORGANIZATION: `/organizations/${organizationId}/invitecto`,
//     SHORTLIST: `/organizations/${organizationId}/projects/shortlistdesign`,
//     // SHORTLISTMICA: `/organizations/${organizationId}/projects/shortlistmicadesign`,
//     COMMONORDER: `/organizations/${organizationId}/projects/commonorder`,
//     SUBCONTRACT: `/organizations/${organizationId}/projects/subcontractmain`,
//     HR: `/organizations/${organizationId}/projects/hr`,
//     LOGISTICS: `/organizations/${organizationId}/projects/logistics`,
//     PROCUREMENT: `/organizations/${organizationId}/projects/procurement`,
//     ACCOUNTING: `/organizations/${organizationId}/projects/accounting`,

//     DESIGNLAB: `/organizations/${organizationId}/projects/designlabmain`,
//     RATECONIG: `/organizations/${organizationId}/projects/rateconfig`,
//     RATECONIGSTAFF: `/organizations/${organizationId}/projects/labourrateconfig`,
//     INTERNALQUOTE: `/organizations/${organizationId}/projects/internalquote`,
//     QUOTEVARIENT: `/organizations/${organizationId}/projects/quotevariant`,
//     "QUOTES (CLIENT)": `/organizations/${organizationId}/projects/clientquotes`,
//     WORKLIBRARY: `/organizations/${organizationId}/projects/worklibrary`,
//     STAFFTASK: `/organizations/${organizationId}/projects/stafftask`,
//     SINGLESTAFFTASK: `/organizations/${organizationId}/projects/associatedstafftask`,
//     MATERIALINVENTORY: `/organizations/${organizationId}/projects/materialinventory`,
//     // NOTIFICATION: `/organizations/${organizationId}/projects/notification`,
//     // PROCUREMENT: `/organizations/${organizationId}/procurement`
//     // ISSUES: "/issues",
//     // COLLABORATION: "/collaboration",
//     // TASKS: "/tasks",
//     // PHASES: "/phases",
//   }





//   // Clone originals so you don’t mutate the constants
//   let sidebarLabels = { ...SIDEBAR_LABELS }
//   let sidebarIcons = { ...SIDEBAR_ICONS }
//   let sidebarPath = { ...path }

//   // Remove both first
//   delete sidebarLabels.STAFFTASK;
//   delete sidebarIcons.STAFFTASK
//   delete sidebarPath.STAFFTASK

//   delete sidebarLabels.SINGLESTAFFTASK
//   delete sidebarIcons.SINGLESTAFFTASK
//   delete sidebarPath.SINGLESTAFFTASK

//   // Now add only the correct one based on role
//   if (role?.toLowerCase() === "owner" || role?.toLowerCase() === "cto") {
//     sidebarLabels.STAFFTASK = SIDEBAR_LABELS.STAFFTASK
//     sidebarIcons.STAFFTASK = SIDEBAR_ICONS.STAFFTASK
//     sidebarPath.STAFFTASK = path.STAFFTASK
//   } else if (role?.toLowerCase() === "staff") {
//     sidebarLabels.SINGLESTAFFTASK = SIDEBAR_LABELS.SINGLESTAFFTASK
//     sidebarIcons.SINGLESTAFFTASK = SIDEBAR_ICONS.SINGLESTAFFTASK
//     sidebarPath.SINGLESTAFFTASK = path.SINGLESTAFFTASK
//   }



//   const lowerRole = role?.toLowerCase();

//   // 5. ⭐ PERMISSION FILTER LOGIC ⭐
//   // Only run this if NOT owner (Owner sees everything)
//   if (lowerRole !== "owner") {

//       // Iterate over the keys we want to check
//       Object.keys(PERMISSION_MAPPING).forEach((sidebarKey) => {

//           const backendKey = PERMISSION_MAPPING[sidebarKey];
//           const deptPermissions = permission?.[backendKey];

//           // Check if user has ANY 'true' permission in this department
//           // Logic: 
//           // 1. deptPermissions exists?
//           // 2. Are there any keys inside it that are true?
//           const hasAccess = deptPermissions && Object.values(deptPermissions).some(val => val === true);

//           // If NO ACCESS, delete from sidebar
//           if (!hasAccess) {
//               delete sidebarLabels[sidebarKey];
//               delete sidebarIcons[sidebarKey];
//               delete sidebarPath[sidebarKey];
//           }
//       });
//   }

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 470);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);




//   return (
//     <>
//       <div className="flex w-full h-full">
//         {/* <Sidebar path={path} labels={SIDEBAR_LABELS} icons={SIDEBAR_ICONS} /> */}

//         {isMobile ? (
//           <MobileSidebar
//             labels={SIDEBAR_LABELS}
//             path={path}
//             isOpen={isMobileSidebarOpen}
//             onClose={() => setIsMobileSidebarOpen(false)}
//           />
//         ) : (


//           <Sidebar
//             path={sidebarPath}
//             labels={sidebarLabels}
//             icons={sidebarIcons}
//           />
//         )}

//         <main className="!w-[100%] h-full p-4">
//           <Outlet context={{
//             projectId, setProjectId, organizationId,
//             isMobile,
//             isMobileSidebarOpen,
//             openMobileSidebar: () => setIsMobileSidebarOpen(true),
//             closeMobileSidebar: () => setIsMobileSidebarOpen(false),
//           }} />
//         </main>
//       </div>
//     </>

//   );
// };

// export default Projects;





import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import { SIDEBAR_ICONS, SIDEBAR_LABELS } from "../../constants/constants";
import MobileSidebar from "../../shared/MobileSidebar";
import { useEffect, useState } from "react";
import { useAuthCheck } from "../../Hooks/useAuthCheck";

type ProjectType = {
  projectId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
}

// 1. Mapping Sidebar Keys to Backend Permission Keys
const PERMISSION_MAPPING: Record<string, string | string[]> = {
  HR: "hr",
  LOGISTICS: "logistics",
  PROCUREMENT: "procurement",
  SHORTLIST: "referencedesign",
  DESIGNLAB: "design",
  CAD: "cad",

  COMMONORDER: "commonorder",
  TOOLMANAGEMENT: "toolhardware",

  // ACCOUNTING: "accounts" || "billing" || "payments",
  ACCOUNTING: ["accounts", "billing", "payments", "vendor", "customer", "invoice",
    "expense", "billtemplate", "purchaseorder",
    "vendorpayment", "salesorder", "retailinvoice"],

  CUTLIST: "cutlist",

  RATECONIG: "materialrateconfig",
  RATECONIGSTAFF: "labourratequote",
  RATECONIGMATERIALWITHSTAFF: "materialwithlabourratequote",
  WORKTEMPLATE: "materialquote",
  INTERNALQUOTE: "internalquote",
  QUOTEVARIENT: "quotevariant",
  "QUOTES (CLIENT)": "clientquote",

  SUBCONTRACT: "subcontract",


  STAFFTASK: "stafftask",
  SINGLESTAFFTASK: "stafftask",
  WORKLIBRARY: "stafftask",

  MATERIALINVENTORY: "productinventory"
  // Add "payments" if it exists in constants
};

const Projects: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

  const { organizationId } = useParams()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 470);

  const { role, permission } = useAuthCheck();
  const lowerRole = role?.toLowerCase() || "";

  // 2. Define All Paths
  const path: Record<string, string> = {
    PROJECTS: `/organizations/${organizationId}/projects`,
    ORGANIZATION: `/organizations/${organizationId}`,
    SHORTLIST: `/organizations/${organizationId}/projects/shortlistdesign`,
    COMMONORDER: `/organizations/${organizationId}/projects/commonorder`,
    SUBCONTRACT: `/organizations/${organizationId}/projects/subcontractmain`,
    TOOLMANAGEMENT: `/organizations/${organizationId}/projects/toolhub`,
    CAD: `/organizations/${organizationId}/projects/cadmain`,
    HR: `/organizations/${organizationId}/projects/hr`,
    LOGISTICS: `/organizations/${organizationId}/projects/logistics`,
    PROCUREMENT: `/organizations/${organizationId}/projects/procurement`,
    ACCOUNTING: `/organizations/${organizationId}/projects/accounting`,
    DESIGNLAB: `/organizations/${organizationId}/projects/designlabmain`,
    CUTLIST: `/organizations/${organizationId}/projects/cutlistmain`,
    RATECONIG: `/organizations/${organizationId}/projects/rateconfig`,
    RATECONIGSTAFF: `/organizations/${organizationId}/projects/labourrateconfig`,
    RATECONIGMATERIALWITHSTAFF: `/organizations/${organizationId}/projects/materialwithlabourrate`,
    WORKTEMPLATE: `/organizations/${organizationId}/projects/worktemplates`,
    INTERNALQUOTE: `/organizations/${organizationId}/projects/internalquote`,
    QUOTEVARIENT: `/organizations/${organizationId}/projects/quotevariant`,
    "QUOTES (CLIENT)": `/organizations/${organizationId}/projects/clientquotes`,
    WORKLIBRARY: `/organizations/${organizationId}/projects/worklibrary`,
    STAFFTASK: `/organizations/${organizationId}/projects/stafftask`,
    SINGLESTAFFTASK: `/organizations/${organizationId}/projects/associatedstafftask`,
    MATERIALINVENTORY: `/organizations/${organizationId}/projects/materialinventory`,
  }

  // =========================================================
  // 3. ROLE-BASED FILTERING (The Whitelist Logic)
  // =========================================================

  // Start with all available keys from your constants
  const allKeys = Object.keys(SIDEBAR_LABELS);
  let allowedKeys: string[] = [];

  if (lowerRole === "owner" || lowerRole === "cto") {
    // Owner/CTO: Everything EXCEPT SingleStaffTask
    allowedKeys = allKeys.filter(key => key !== "SINGLESTAFFTASK");
  }
  else if (lowerRole === "staff") {
    // Staff: Everything EXCEPT StaffTask (Manager View)
    allowedKeys = allKeys.filter(key => key !== "STAFFTASK" && key !== "WORKLIBRARY");
  }
  else if (lowerRole === "worker") {
    // Worker: Strict Whitelist
    allowedKeys = allKeys.filter(key => key !== "STAFFTASK" && key !== "WORKLIBRARY");
  }
  else if (lowerRole === "client") {
    // Client: Strict Whitelist
    allowedKeys = allKeys.filter(key => key !== "STAFFTASK" && key !== "WORKLIBRARY");
  }
  else {
    // Default / No Role: Show nothing or just Projects
    allowedKeys = ["PROJECTS", "ORGANIZATION"];
  }

  // =========================================================
  // 4. CONSTRUCT INITIAL SIDEBAR OBJECTS
  // =========================================================

  let finalLabels: any = {};
  let finalIcons: any = {};
  let finalPaths: any = {};

  allowedKeys.forEach(key => {
    if (SIDEBAR_LABELS[key] && path[key]) {
      finalLabels[key] = SIDEBAR_LABELS[key];
      finalIcons[key] = SIDEBAR_ICONS[key];
      finalPaths[key] = path[key];
    }
  });

  // =========================================================
  // 5. PERMISSION-BASED HIDING
  // =========================================================

  // If NOT owner, remove items if they lack specific permissions
  if (lowerRole !== "owner") {

    // Check every key currently in our allowed list
    Object.keys(finalLabels).forEach((sidebarKey) => {

      const backendKey = PERMISSION_MAPPING[sidebarKey];

      // if (sidebarKey === "CAD" || sidebarKey === "TOOLMANAGEMENT"  || sidebarKey === "WORKTEMPLATES") return;

      // If this sidebar item maps to a permission module (e.g. HR, LOGISTICS)
      if (backendKey) {
        // const deptPermissions = permission?.[backendKey];

        // // Check if user has AT LEAST ONE permission set to true
        // const hasAccess = deptPermissions && Object.values(deptPermissions).some(val => val === true);

        const keysToCheck = Array.isArray(backendKey) ? backendKey : [backendKey];

        const hasAccess = keysToCheck.some(key => {
          const deptPermissions = permission?.[key];
          return deptPermissions && Object.values(deptPermissions).some(val => val === true);
        });


        // If no access, remove it from the final objects
        if (!hasAccess) {
          delete finalLabels[sidebarKey];
          delete finalIcons[sidebarKey];
          delete finalPaths[sidebarKey];
        }
      }
    });
  }


  // =========================================================
  // 6. RESPONSIVE LOGIC
  // =========================================================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 470);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      <div className="flex w-full h-full">
        {isMobile ? (
          <MobileSidebar
            labels={finalLabels}
            path={finalPaths}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        ) : (
          <Sidebar
            path={finalPaths}
            labels={finalLabels}
            icons={finalIcons}
          />
        )}

        <main className="!w-[100%] h-full p-4">
          <Outlet context={{
            projectId, setProjectId, organizationId,
            isMobile,
            isMobileSidebarOpen,
            openMobileSidebar: () => setIsMobileSidebarOpen(true),
            closeMobileSidebar: () => setIsMobileSidebarOpen(false),
          }} />
        </main>
      </div>
    </>

  );
};

export default Projects;