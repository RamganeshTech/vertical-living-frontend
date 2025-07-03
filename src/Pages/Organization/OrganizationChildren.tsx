import React from 'react'
import { ORGANIZATION_ICONS, ORGANIZATION_LABELS } from '../../constants/constants'
import Sidebar from '../../shared/Sidebar'
import { Outlet, useParams } from 'react-router-dom'

const OrganizationChildrens:React.FC = () => {

    const { organizationId } = useParams<{ organizationId: string }>()

    const path = {
        PROJECTS: `/organizations/${organizationId}/projects`,
        DETAILS: `/organizations/${organizationId}`,
        INVITECTO: `/organizations/${organizationId}/invitecto`,
        INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
    }

    return (
        <div className="flex w-full h-full">
            <Sidebar path={path} labels={ORGANIZATION_LABELS} icons={ORGANIZATION_ICONS} />
              <main className="!w-[100%] h-full">
            <Outlet />
            </main>
        </div>
    )
}

export default OrganizationChildrens