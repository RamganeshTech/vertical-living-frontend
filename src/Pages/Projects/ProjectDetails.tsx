import React, { useEffect, useLayoutEffect } from 'react'

import { PROJECTS_ICONS, PROJECTS_LABELS, } from "../../constants/constants";

import Sidebar from '../../shared/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';


type ProjectType = {
  projectId: string | null,
  organizationId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
  setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>
}

const ProjectDetails: React.FC<ProjectType> = ({ projectId, setProjectId, organizationId, setOrganizationId }) => {

  const location = useLocation()

  useLayoutEffect(() => {
    const pathname = location.pathname.split('/')
    //  console.log(pathname)
    setProjectId(pathname[3])
    setOrganizationId(pathname[1])
  }, [location.pathname])

  const path = {
    LABOURS: projectId ? `/${organizationId}/projectdetails/${projectId}/labourlist` : "",
    MATERIALS: projectId ? `/${organizationId}/projectdetails/${projectId}/materiallist` : "",
    TRANSPORTATION: projectId ? `/${organizationId}/projectdetails/${projectId}/transportationlist` : "",
    WORKERS: projectId ? `/${organizationId}/projectdetails/${projectId}/workers` : "",
    INVITECLIENT: projectId ? `/${organizationId}/projectdetails/${projectId}/inviteclient` : "",
    REQUIREMENTFORM: projectId ? `/${organizationId}/projectdetails/${projectId}/requirementform` : "",
    SITEMEASUREMENT: projectId ? `/${organizationId}/projectdetails/${projectId}/sitemeasurement` : "",
    SAMPLEDESIGN: projectId ? `/${organizationId}/projectdetails/${projectId}/sampledesign` : "",
    TECHNICALCONSULTANT: projectId ? `/${organizationId}/projectdetails/${projectId}/technicalconsultant` : "",
    MATERIALSELECTION: projectId ? `/${organizationId}/projectdetails/${projectId}/materialselection` : "",
    COSTESTIMATION: projectId ? `/${organizationId}/projectdetails/${projectId}/costestimation` : "",
    PAYMENTCONFIRMATION: projectId ? `/${organizationId}/projectdetails/${projectId}/paymentconfirmation` : "",
    ORDERMATERIALS: projectId ? `/${organizationId}/projectdetails/${projectId}/ordermaterial` : "",
    MATERIALARRIVED: projectId ? `/${organizationId}/projectdetails/${projectId}/materialarrival` : "",
    WORKSCHEDULE: projectId ? `/${organizationId}/projectdetails/${projectId}/workmainschedule` : "",
    INSTALLATION: projectId ? `/${organizationId}/projectdetails/${projectId}/installation` : "",
    QUALITYCHECK: projectId ? `/${organizationId}/projectdetails/${projectId}/qualitycheck` : "",
    CLEANINGSANITATION: projectId ? `/${organizationId}/projectdetails/${projectId}/cleaning` : "",
    PROJECTDELIVERY: projectId ? `/${organizationId}/projectdetails/${projectId}/projectdelivery` : "",
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