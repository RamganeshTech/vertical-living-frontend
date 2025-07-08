import React, { memo, useEffect, useState } from 'react'
import { COMPANY_DETAILS, MAIN_PATH_ICON, MAIN_PATH_LABEL, } from '../constants/constants'
import useSidebarShortcut from '../Hooks/useSideBarShortcut'
import { Link } from 'react-router-dom'
import '../../src/App.css'
import SidebarIcons from '../components/SidebarIcons'


type SidebarProp = {
    labels: Record<string, string>,
    icons: Record<string, string>,
    projectId?: string | null,
    path: Record<string, string>,
}

const Sidebar: React.FC<SidebarProp> = ({ labels, icons, path }) => {
    const [showSideBar, setShowSideBar] = useState(true)

    const handleSideBarClose = () => {
        setShowSideBar(false)
    }

    const handleSideBarOpen = () => {
        setShowSideBar(true)
    }

    const [activeSidebar, setActiveSidebar] = useState<string>('');


    useEffect(() => {
        const pathArray = location.pathname.split('/')

        // console.log(pathArray, "path array")
        const mainPath = pathArray[4]
        console.log(mainPath, pathArray)
        if (showSideBar) {
            setActiveSidebar(() => MAIN_PATH_LABEL[mainPath] as any)
        } else {
            setActiveSidebar(() => MAIN_PATH_ICON[mainPath] as any)
        }
    }, [location.pathname, showSideBar])

    useSidebarShortcut(handleSideBarOpen, handleSideBarClose);
    return (
        <>
            {showSideBar ?
                <aside className="relative flex flex-col bg-[#2f303a] w-[17%] min-h-screen max-h-screen text-[#9ca3af] select-none transition-all duration-300">
                    <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar p-2">
                        <div className='flex justify-between items-center border-b-1 py-2'>
                            <span className='text-xl'>{COMPANY_DETAILS.COMPANY_NAME}</span>
                            <div className='w-[30px] h-[30px]' >
                                <img className='w-full h-full' src={COMPANY_DETAILS.COMPANY_LOGO} alt="LOGO" />
                            </div>
                        </div>

                        <section className="py-2 space-y-2"> {/*here is where the proejcts, lists, collaborations are rendered from the side bar*/}
                            {Object.entries(labels).map(([key, value]) =>
                                // <Link key={value} to={`/${value.toLowerCase()}`} className='outline-none'>
                                path[key] ? <Link key={value} to={path[key]} className='outline-none'>
                                    <div
                                        onClick={() => setActiveSidebar(value)}
                                        className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar === value ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                            } `}>
                                        <span className='text-lg'>{value}</span>
                                        <span><i className="fa-solid fa-chevron-right"></i></span>
                                    </div>
                                </Link>
                                    :
                                    <div
                                    key={value}
                                        className={`cursor-not-allowed flex justify-between max-w-[95%] py-4 px-4`}>
                                        <span className='text-lg'>{value}</span>
                                        <span><i className="fa-solid fa-chevron-right"></i></span>
                                    </div>
                            )}
                        </section>
                    </div>

                    <button
                        title=" Ctrl+] to close"
                        onClick={handleSideBarClose} className='absolute flex items-center justify-center outline-none bg-[#2f303a] right-[-5%] bottom-[0%] cursor-pointer w-[40px] h-[40px] border-2 border-blue-600'>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                </aside>
                :
                <aside className="flex flex-col relative justify-between bg-[#2f303a] w-[6%]  max-h-full  text-[#9ca3af] transition-all duration-300 ">
                    <div className='max-h-[95%] overflow-y-auto overflow-x-hidden custom-scrollbar'>
                        <div className='flex items-center flex-col justify-between w-full'>

                            {/* <SidebarIcons path icons={icons} activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} /> */}
                            {Object.entries(icons).map(([key, value]) =>
                                path[key] ?
                                    <Link to={path[key]} className={`${path[key] ? "" : "cursor-not-allowed"}`}>
                                        <div
                                            onClick={() => setActiveSidebar(key)}
                                            className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar?.toLowerCase() === key.toLowerCase() ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                                } `}>
                                            <i className={`${value} ${activeSidebar?.toLowerCase() === key.toLowerCase() ? 'text-[#4a86f7]' : 'text-[#9ca3af]'} `}></i>
                                        </div>
                                    </Link>
                                    :
                                    <div
                                        className={`cursor-not-allowed flex justify-between max-w-[95%] py-4 px-4`}>
                                        <i className={`${value}`}></i>
                                    </div>
                            )}

                        </div>

                    </div>
                    <button
                        title=" Ctrl+[ to open"
                        onClick={handleSideBarOpen} className='cursor-pointer outline-none border-[#9ca3af]  h-[5%] !w-[82%]'>
                        <i className={` fa-solid fa-chevron-right text-[#4a86f7]`}></i>
                    </button>
                </aside>
            }
        </>
    )
}

export default memo(Sidebar)