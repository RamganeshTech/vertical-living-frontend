import React, { memo } from 'react'
import { Link } from 'react-router-dom'


type SidebarLabelsProp = {
    labels: Record<string, string>,
    activeSidebar: string,
    setActiveSidebar: React.Dispatch<React.SetStateAction<string>>
}

const SidebarLabels:React.FC<SidebarLabelsProp> = ({ labels, setActiveSidebar, activeSidebar }) => {
    return (
        <>
            {Object.entries(labels).map(([key, value]) =>
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
        </>
    )
}

export default memo(SidebarLabels)