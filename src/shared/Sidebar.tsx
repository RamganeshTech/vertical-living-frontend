import React, { useState } from 'react'
import { COMPANY_DETAILS, SIDEBAR_ICONS, SIDEBAR_LABELS } from '../constants/constants'
import useSidebarShortcut from '../Hooks/useSideBarShortcut'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
    const [showSideBar, setShowSideBar] = useState(true)

    const handleSideBarClose = () => {
        setShowSideBar(false)
    }

    const handleSideBarOpen = () => {
        setShowSideBar(true)
    }

    const [activeSidebar, setActiveSidebar] = useState<string>('');

    useSidebarShortcut(handleSideBarOpen, handleSideBarClose);
    return (
        <>
            {showSideBar ?
                <aside className="relative flex flex-col bg-[#2f303a] w-[17%] min-h-screen max-h-screen text-[#9ca3af] select-none transition-all duration-300">
                    <div className="flex flex-col flex-grow overflow-y-auto p-2">
                        <div className='flex justify-between items-center border-b-1 py-2'>
                            <span className='text-xl'>{COMPANY_DETAILS.COMPANY_NAME}</span>
                            <div className='w-[30px] h-[30px]' >
                                <img className='w-full h-full' src={COMPANY_DETAILS.COMPANY_LOGO} alt="LOGO" />
                            </div>
                        </div>

                        <section className="py-2 space-y-2"> {/*here is where the proejcts, lists, collaborations are rendered from the side bar*/}
                            {Object.entries(SIDEBAR_LABELS).map(([_, value]) =>
                                <Link key={value} to={`/${value.toLowerCase()}`} className='outline-none'>
                                    <div
                                        onClick={() => setActiveSidebar(value)}
                                        className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar === value ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                            } `}>
                                        <span className='text-lg'>{value}</span>
                                        <span><i className="fa-solid fa-chevron-right"></i></span>
                                    </div>
                                </Link>
                            )}
                        </section>
                    </div>

                    <button
                        title=" Ctrl+] to close"
                        onClick={handleSideBarClose} className='absolute flex items-center justify-center outline-none bg-[#2f303a] right-[-5%] bottom-[0%] cursor-pointer w-[40px] h-[40px] border-2 border-blue-600'>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {/* <div className="flex justify-between items-center px-3 py-2 border-t border-[#3f4050] text-[#fbbf24] text-[12px]">
                        <button aria-label="User A" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbbf24] text-[#1f2937] font-bold">A</button>
                        <button aria-label="Calendar" className="hover:text-white"><i className="far fa-calendar-alt"></i></button>
                        <button aria-label="Users" className="hover:text-white"><i className="fas fa-users"></i></button>
                        <button aria-label="Tasks" className="hover:text-white"><i className="fas fa-tasks"></i></button>
                        <button aria-label="Notifications" className="hover:text-white"><i className="far fa-bell"></i></button>
                    </div> */}

                </aside>
                :
                <aside className="flex flex-col py-2 justify-between bg-[#2f303a] w-[4%] min-h-screen text-[#9ca3af] transition-all duration-300 ">
                    <div>
                        <div className='flex items-center flex-col justify-between w-full'>

                            {Object.entries(SIDEBAR_ICONS).map(([key, value]) =>
                                <Link to={`/${key.toLowerCase()}`}>
                                    <div
                                        onClick={() => setActiveSidebar(key)}
                                        className={`cursor-pointer flex justify-between max-w-[95%] py-4 px-4 ${activeSidebar.toLowerCase() === key.toLowerCase() ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
                                            } `}>
                                        <i 
                                        className={`${value} ${activeSidebar.toLowerCase() === key.toLowerCase() ? 'text-[#4a86f7]' : 'text-[#9ca3af]'} `}></i>
                                    </div>
                                </Link>
                            )}

                        </div>
                    </div>

                    <button
                        title=" Ctrl+[ to open"
                        onClick={handleSideBarOpen} className='cursor-pointer outline-none border-[#9ca3af]  h-[5%] w-full'>
                        <i className={` fa-solid fa-chevron-right text-[#4a86f7]`}></i>
                    </button>
                </aside>
            }
        </>
    )
}

export default Sidebar