import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLogoutCTO } from '../apiList/CTOApi'
import { useLogoutClient } from '../apiList/clientApi'
import { useLogoutStaff } from '../apiList/staffApi'
import { useLogoutUser } from '../apiList/userApi'
import { useLogoutWorker } from '../apiList/workerApi'
import { Button } from '../components/ui/Button'
import { useDispatch, useSelector } from "react-redux";
import { resetOwnerProfile } from "../features/userSlices";
import { logout } from "../features/authSlice";
import { resetClientProfile } from "../features/clientSlice";
import { resetWorkerProfile } from "../features/workerSlice";
import { resetCTOProfile } from "../features/CTOSlice";
import { resetStaffProfile } from "../features/staffSlices";
import { COMPANY_DETAILS } from "../constants/constants";
import type { RootState } from "../store/store";
import { toast } from "../utils/toast";
import { useGetStageSelection } from "../apiList/Modular Unit Api/Stage Selection Api/stageSelectionApi";



type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  labels: Record<string, string>;
  path: Record<string, string>;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, labels, path }) => {

  const navigate = useNavigate()
  const { organizationId, projectId } = useParams() as { organizationId: string, projectId: string }
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.authStore)

  const { data: stageSelectionData, isLoading: selectStagePending } = useGetStageSelection(projectId)

  const { mutateAsync: CTOLogoutAsync, isPending: isCTOPending } = useLogoutCTO();
  const { mutateAsync: ClientLogoutAsync, isPending: isClientPending } = useLogoutClient();
  const { mutateAsync: StaffLogoutAsync, isPending: isStaffPending } = useLogoutStaff();
  const { mutateAsync: LogoutLogoutAsync, isPending: isUserPending } = useLogoutUser();
  const { mutateAsync: WorkerLogoutAsync, isPending: isWorkerPending } = useLogoutWorker();

  const handleLogout = async () => {
    try {
      if (role === "CTO") {
        await CTOLogoutAsync();
      } else if (role === "client") {
        await ClientLogoutAsync();
      } else if (role === "staff") {
        await StaffLogoutAsync();
      } else if (role === "owner") {
        await LogoutLogoutAsync();
      } else if (role === "worker") {
        await WorkerLogoutAsync();
      }

      // Clear all slices, just in case
      dispatch(resetOwnerProfile());
      dispatch(resetClientProfile());
      dispatch(resetWorkerProfile());
      dispatch(resetCTOProfile());
      dispatch(resetStaffProfile());
      dispatch(logout());
      toast({ title: "Success", description: "logout successfull", })
      if (!isCTOPending ||
        !isClientPending ||
        !isStaffPending ||
        !isUserPending ||
        !isWorkerPending) {
        navigate('/')
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to logout", variant: "destructive" })
    }
  };

  let labelEntries = Object.entries(labels);


  const pathArray = location.pathname.split('/')
  const isInStageNavBar = pathArray[2] === "projectdetails"
  const isInProjectDetails = pathArray.includes("projectdetails");


  if (isInProjectDetails && !selectStagePending) {
    const selection = stageSelectionData;

    labelEntries = labelEntries.filter(([key]) => {
      if (!selection) {
        // No selection made yet → only show SELECTSTAGE
        return (
          key !== "MODULARUNIT" &&
          key !== "MATERIALSELECTION" &&
          key !== "COSTESTIMATION"
        );
      } else if (selection === "Modular Units") {
        // Modular flow → hide MATERIAL_SELECTION and COST_ESTIMATION
        return (
          key !== "MATERIALSELECTION" &&
          key !== "COSTESTIMATION" &&
          key !== "SELECTSTAGE"
        );
      } else if (selection === "Manual Flow") {
        // Manual flow → hide modular unit stages
        return (
          key !== "MODULARUNIT" &&
          key !== "SELECTSTAGE"
        );
      }
      return true;
    });
  }


  const handleNav = () => {
    if (isInStageNavBar) {
      navigate(`/organizations/${organizationId}/projects`)
    }
  }


  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white w-[75%] flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* ✅ Top logo + company name */}
        <div className="flex items-center justify-between p-4 border-b">
          <div onClick={handleNav} className={`flex items-center gap-3 ${isInStageNavBar ? "cursor-pointer" : ""}`}>
            <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-lg font-semibold">{COMPANY_DETAILS.COMPANY_NAME}</span>
          </div>
          <button onClick={onClose} className="text-xl text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* ✅ Scrollable links with separators */}
        <nav className="flex flex-col flex-grow overflow-y-auto p-4">
          {labelEntries.map(([key, value], index) => (
            <React.Fragment key={key}>
              {path[key] ? (
                <Link
                  to={path[key]}
                  onClick={onClose}
                  className="text-gray-800 hover:bg-gray-100 p-3 rounded block"
                >
                  {value}
                </Link>
              ) : (
                <span className="text-gray-400 p-3 rounded cursor-not-allowed block">{value}</span>
              )}

              {/* ✅ Separator except after last */}
              {index < labelEntries.length - 1 && (
                <hr className="border-t border-gray-200 my-1" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* ✅ Static logout at the bottom */}
        <div className="border-t border-gray-200 p-4">
          {pathArray[1] !== "login" && <Button
            className="w-full flex items-center justify-center gap-2"
            isLoading={
              isCTOPending ||
              isClientPending ||
              isStaffPending ||
              isUserPending ||
              isWorkerPending
            }
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </Button>
          }
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
