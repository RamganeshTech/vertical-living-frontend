import React from 'react'
import Sidebar from '../../shared/Sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="flex w-full">
        <Sidebar />
      <main className="!w-[83%] p-4">
        <Outlet /> {/* This will render Home, Issues, Tasks, etc. */}
      </main>
    </div>
  )
}

export default Dashboard