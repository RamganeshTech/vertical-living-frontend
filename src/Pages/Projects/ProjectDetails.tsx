import React, { useEffect, useLayoutEffect } from 'react'

import { PROJECTS_ICONS, PROJECTS_LABELS, } from "../../constants/constants";

import Sidebar from '../../shared/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';


type ProjectType = {
  projectId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
}

const ProjectDetails: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

  const location = useLocation()

  useLayoutEffect(() => {
    const pathname = location.pathname.split('/')
    //  console.log(pathname)
    setProjectId(pathname[2])
  }, [location.pathname])

  const path = {
    LABOURS: projectId ? `/projectdetails/${projectId}/labourlist` : "",
    MATERIALS: projectId ? `/projectdetails/${projectId}/materiallist` : "",
    TRANSPORTATION: projectId ? `/projectdetails/${projectId}/transportationlist` : "",
    WORKERS: projectId ? `/projectdetails/${projectId}/workers` : "",
    INVITECLIENT: projectId ? `/projectdetails/${projectId}/inviteclient` : "",
    REQUIREMENTFORM: projectId ? `/projectdetails/${projectId}/requirementform` : "",
    SITEMEASUREMENT: projectId ? `/projectdetails/${projectId}/sitemeasurement` : "",
    SAMPLEDESIGN: projectId ? `/projectdetails/${projectId}/sampledesign` : "",
    TECHNICALCONSULTANT: projectId ? `/projectdetails/${projectId}/technicalconsultant` : "",
    MATERIALSELECTION: projectId ? `/projectdetails/${projectId}/materialselection` : "",
    COSTESTIMATION: projectId ? `/projectdetails/${projectId}/costestimation` : "",
    ORDERMATERIALS: projectId ? `/projectdetails/${projectId}/ordermaterial` : "",
    MATERIALARRIVED: projectId ? `/projectdetails/${projectId}/materialarrival` : "",
    WORKSCHEDULE: projectId ? `/projectdetails/${projectId}/workmainschedule` : "",
  };

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar path={path} labels={PROJECTS_LABELS} icons={PROJECTS_ICONS} />
        <main className="!w-[100%] h-full p-4">
          <Outlet context={{ projectId, setProjectId }} />
        </main>
      </div>
    </>
  )
}

export default ProjectDetails