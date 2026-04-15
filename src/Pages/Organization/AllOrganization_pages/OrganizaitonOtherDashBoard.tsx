import OrganizationDetails from '../OrganizationDetails'
import { useParams } from 'react-router-dom'

const OrganizaitonOtherDashBoard = () => {
    const { organizationId } = useParams() as { organizationId: string }

    return (
        <div>
            <OrganizationDetails organizationId={organizationId} showSettings={false}  />
        </div>
    )
}

export default OrganizaitonOtherDashBoard