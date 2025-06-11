import React from 'react'
import Sidebar from '../../shared/Sidebar'
import { Outlet } from 'react-router-dom'
import { SIDEBAR_ICONS, SIDEBAR_LABELS } from '../../constants/constants'

const Dashboard:React.FC = () => {

  const path = {
     PROJECTS:"projects",
  ISSUES:"issues",
  COLLABORATION:"collaboration",
  TASKS:"tasks",
  PHASES:"phases",
  }

  return (
    <div className="flex w-full h-full">
        <Sidebar  path={path} labels={SIDEBAR_LABELS} icons={SIDEBAR_ICONS} />
      <main className="!w-[100%] h-full p-4">
        <Outlet /> {/* This will render Home, Issues, Tasks, etc. */}
      </main>
    </div>
  )
}

export default Dashboard