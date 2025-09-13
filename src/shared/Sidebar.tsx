import React, { memo, useEffect, useState } from 'react'
import { COMPANY_DETAILS, MAIN_PATH_ICON, MAIN_PATH_LABEL, } from '../constants/constants'
import useSidebarShortcut from '../Hooks/useSideBarShortcut'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import '../../src/App.css'
import { useLogoutCTO } from '../apiList/CTOApi'
import { useLogoutClient } from '../apiList/clientApi'
import { useLogoutStaff } from '../apiList/staffApi'
import { useLogoutUser } from '../apiList/userApi'
import { useLogoutWorker } from '../apiList/workerApi'
import { Button } from '../components/ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import { resetOwnerProfile } from '../features/userSlices'
import { resetClientProfile } from '../features/clientSlice'
import { resetWorkerProfile } from '../features/workerSlice'
import { resetCTOProfile } from '../features/CTOSlice'
import { resetStaffProfile } from '../features/staffSlices'
import { logout } from '../features/authSlice'
import type { RootState } from '../store/store'
import { toast } from '../utils/toast'
import { useGetStageSelection } from '../apiList/Modular Unit Api/Stage Selection Api/stageSelectionApi'


type SidebarProp = {
    labels: Record<string, string>,
    icons: Record<string, string>,
    projectId?: string | null,
    path: Record<string, string>,
    setProjectName?: React.Dispatch<React.SetStateAction<string>>,
    projectName?: string
}




export const getSidebarConfig = (
    stageType: string | undefined | null,
    labels: Record<string, string>,
    path: Record<string, string>,
    pathArray: string[],
    icons?: Record<string, any>,
) => {
    const isProjectDetailRoute = pathArray?.some(
        (segment) => segment.toLowerCase() === "projectdetails"
    );

    let filteredLabels: Record<string, string> = {};
    let filteredIcons: Record<string, any> = {};
    let filteredPaths: Record<string, string> = {};

    if (isProjectDetailRoute) {
        // Base ordered stage keys
        let orderedKeys: string[] = [
            "DOCUMENTATION",
            "INVENTORY",
            "WORKERS",
            "INVITECLIENT",
            "PREREQUISTIES",
            "REQUIREMENTFORM",
            "SITEMEASUREMENT",
            "SAMPLEDESIGN",
            "WORKSCHEDULE",
            "TECHNICALCONSULTANT", // Insert after this
            "SELECTSTAGE", // Remove this later if needed
            "PAYMENTCONFIRMATION",
            "QUOTEPDF",
            "ORDERMATERIALS",
            "MATERIALARRIVED",
            "INSTALLATION",
            "QUALITYCHECK",
            "CLEANINGSANITATION",
            "PROJECTDELIVERY"
        ];

        const insertAfter = "TECHNICALCONSULTANT";
        const insertIndex = orderedKeys.indexOf(insertAfter) + 1;

        // Insert based on stage type
        if (stageType === "Manual Flow") {
            orderedKeys.splice(insertIndex, 0, "MATERIALSELECTION", "COSTESTIMATION");
        } else if (stageType === "Modular Units") {
            orderedKeys.splice(insertIndex, 0, "MODULARUNIT", "EXTERNAL");
        }

        // Remove SELECTSTAGE if a type is chosen
        if (stageType !== null && stageType !== undefined) {
            orderedKeys = orderedKeys.filter((key) => key !== "SELECTSTAGE");
        }

        // Filter the labels, icons, and paths based on ordered keys
        for (const key of orderedKeys) {
            if (labels[key] && icons![key] && path[key]) {
                filteredLabels[key] = labels[key];
                filteredIcons[key] = icons![key];
                filteredPaths[key] = path[key];
            }
        }
    } else {
        // For non-projectdetails routes, just return everything as-is
        filteredLabels = labels;
        filteredIcons = icons!;
        filteredPaths = path;
    }

    let stageCounter = 1;
    let startNumbering = false;

    const numberedLabels: Record<string, string> = {};

    for (const key of Object.keys(filteredLabels)) {
        if (key === "REQUIREMENTFORM") {
            startNumbering = true;
        }

        if (startNumbering) {
            numberedLabels[key] = `${stageCounter} ${filteredLabels[key]}`;
            stageCounter++;
        } else {
            // Don't number stages before REQUIREMENTFORM
            numberedLabels[key] = filteredLabels[key];
        }
    }

    // Use numberedLabels in the return
    return {
        filteredLabels: numberedLabels,
        filteredIcons,
        filteredPaths
    };
};





const Sidebar: React.FC<SidebarProp> = ({ labels, icons, path, setProjectName, projectName }) => {
    const [showSideBar, setShowSideBar] = useState(false)
    const { projectId } = useParams() as { projectId: string }
    const navigate = useNavigate()
    const location = useLocation()
    const pathArray = location.pathname.split('/')
    const { organizationId } = useParams() as { organizationId: string }

    const dispatch = useDispatch()
    const { role } = useSelector((state: RootState) => state.authStore)
    const [activeSidebar, setActiveSidebar] = useState<string>('');

    const { data: stageSelectionData, isLoading: selectStagePending } = useGetStageSelection(projectId)
    // console.log("stageSelectinDate", stageSelectionData)
    const { mutateAsync: CTOLogoutAsync, isPending: isCTOPending, } = useLogoutCTO()
    const { mutateAsync: ClientLogoutAsync, isPending: isClientPending, } = useLogoutClient()
    const { mutateAsync: StaffLogoutAsync, isPending: isStaffPending, } = useLogoutStaff()
    const { mutateAsync: LogoutLogoutAsync, isPending: isUserPending, } = useLogoutUser()
    const { mutateAsync: WorkerLogoutAsync, isPending: isWorkerPending, } = useLogoutWorker()

    useEffect(() => {
        if (setProjectName) {
            if (stageSelectionData && stageSelectionData.projectName) {
                setProjectName(stageSelectionData.projectName || "Project")
            }
        }
    }, [stageSelectionData])


    const handleSideBarClose = () => {
        setShowSideBar(false)
    }

    const handleSideBarOpen = () => {
        setShowSideBar(true)
    }

       
        const isProjectDetailRoute = pathArray[2] === "projectdetails"

    useEffect(() => {
        const pathArray = location.pathname.split('/')

        const mainPath = pathArray[4]
        if (showSideBar) {
            setActiveSidebar(() => MAIN_PATH_LABEL[mainPath] as any)
        } else {
            setActiveSidebar(() => MAIN_PATH_ICON[mainPath] as any)
        }
    }, [location.pathname, showSideBar])

    useSidebarShortcut(handleSideBarOpen, handleSideBarClose);

    const stageType = !selectStagePending && stageSelectionData?.mode; // "Manual Flow" | "Modular Units" | null

    let { filteredLabels, filteredIcons, filteredPaths } = getSidebarConfig(stageType, labels, path, pathArray, icons);




    //  to make the navbar navigate to project list page because there is no navigation for back 
    const isInStageNavBar = pathArray[2] === "projectdetails"
    const isLoginNavBar = pathArray[1] === "login"
    const handleNav = () => {
        if (isInStageNavBar) {
            navigate(`/organizations/${organizationId}/projects`)
        }

        if (isLoginNavBar) {
            navigate(`/organizations`)
        }
    }


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
            toast({ title: "Success", description: "logout successfull" })
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


    return (
        <>
            {showSideBar ?
                <aside onMouseLeave={() => setShowSideBar(false)} className="relative flex flex-col bg-[#2f303a] w-[17%] min-h-screen max-h-screen text-[#9ca3af] select-none transition-all duration-300">
                    <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar p-2 large-scrollbar">
                        <div onClick={handleNav} className={`flex ${isInStageNavBar ? "cursor-pointer" : ""} justify-between items-center border-b-1 py-2`}>
                            <span className='text-xl'>{isProjectDetailRoute ? (projectName || "Project") : COMPANY_DETAILS.COMPANY_NAME}</span>
                            <div className='w-[30px] h-[30px]' >
                                <img className='w-full h-full' src={COMPANY_DETAILS.COMPANY_LOGO} alt="LOGO" />
                            </div>
                        </div>

                        <section className="py-2 space-y-2"> {/*here is where the proejcts, lists, collaborations are rendered from the side bar*/}
                            {Object.entries(filteredLabels).map(([key, value]) => {
                                const isActive = activeSidebar === value;

                                // <Link key={value} to={`/${value.toLowerCase()}`} className='outline-none'>
                                return (filteredPaths[key] && <Link key={value as string} to={filteredPaths[key]} className='outline-none'>
                                    <div
                                        onClick={() => setActiveSidebar(value as string)}
                                        className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar === value ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                            } `}
                                        ref={el => {
                                            if (isActive && el) {
                                                el.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "center"   // 👈 ensures it's centered
                                                });
                                            }
                                        }}
                                    >
                                        <span className='text-lg'>{value as string}</span>
                                        <span><i className="fa-solid fa-chevron-right"></i></span>
                                    </div>
                                </Link>
                                )
                            }
                            )}



                        </section>

                    </div>

                    <div className="flex flex-col p-2 border-t border-[#3a3b45]">
                        {pathArray[1] !== "login" && <Button
                            isLoading={
                                isCTOPending ||
                                isClientPending ||
                                isStaffPending ||
                                isUserPending ||
                                isWorkerPending
                            }
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg !bg-[#3a3b45] !text-[#9ca3af] hover:!bg-[#464751] hover:!text-white transition">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </Button>
                        }

                        <button
                            title="Ctrl+] to close"
                            onClick={handleSideBarClose}
                            className="mt-2 flex items-center justify-center outline-none border border-blue-600 text-blue-500 hover:bg-[#3a3b45] rounded-lg w-full py-2">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    </div>


                </aside>
                :
                <aside onMouseEnter={() => setShowSideBar(true)} className="flex flex-col relative justify-between bg-[#2f303a] w-[6%]  max-h-full  text-[#9ca3af] transition-all duration-300 ">
                    <div className='max-h-[95%] overflow-y-auto overflow-x-hidden custom-scrollbar '>
                        <div className='flex items-center flex-col justify-between w-full'>

                            {/* <SidebarIcons path icons={icons} activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} /> */}
                            {Object.entries(filteredIcons).map(([key, value]) => {
                                const isActive = activeSidebar?.toLowerCase() === key.toLowerCase();

                                return (filteredPaths[key] ?
                                    <Link key={key} to={filteredPaths[key]} className={`${filteredPaths[key] ? "" : "cursor-not-allowed"}`}>
                                        <div
                                            onClick={() => setActiveSidebar(key)}
                                            className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar?.toLowerCase() === key.toLowerCase() ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                                } `}
                                            ref={el => {
                                                if (isActive && el) {
                                                    el.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "center"
                                                    });
                                                }
                                            }}
                                        >
                                            <i className={`${value} ${activeSidebar?.toLowerCase() === key.toLowerCase() ? 'text-[#4a86f7]' : 'text-[#9ca3af]'} `}></i>
                                        </div>
                                    </Link>
                                    :
                                    <div
                                        className={`cursor-not-allowed flex justify-between max-w-[95%] py-4 px-4`}>
                                        <i className={`${value}`}></i>
                                    </div>
                                )
                            }
                            )}

                        </div>

                    </div>


                    {/* original sidebar close */}
                    {/* <button
                        title=" Ctrl+[ to open"
                        onClick={handleSideBarOpen} className='cursor-pointer outline-none border-[#9ca3af]  h-[5%] !w-[82%]'>
                        <i className={` fa-solid fa-chevron-right text-[#4a86f7]`}></i>
                    </button> */}


                    <div className="flex flex-col items-center p-2 border-t border-[#3a3b45]">
                        {pathArray[1] !== "login" &&
                            <Button
                                isLoading={
                                    isCTOPending ||
                                    isClientPending ||
                                    isStaffPending ||
                                    isUserPending ||
                                    isWorkerPending
                                }
                                title='logout'
                                onClick={handleLogout}
                                className="w-[40px] h-[40px] flex items-center justify-center !bg-[#3a3b45] !text-[#9ca3af] hover:!text-red-500 transition">
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </Button>


                        }

                        <button
                            title="Ctrl+[ to open"
                            onClick={handleSideBarOpen}
                            className="mt-2 cursor-pointer outline-none border-[#9ca3af] h-[40px] w-[40px] flex items-center justify-center border rounded-lg">
                            <i className="fa-solid fa-chevron-right text-[#4a86f7]"></i>
                        </button>
                    </div>
                </aside>
            }
        </>
    )
}

export default memo(Sidebar)