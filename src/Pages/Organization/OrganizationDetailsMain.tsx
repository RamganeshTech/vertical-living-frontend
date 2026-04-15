import OrganizationDetails from './OrganizationDetails'
import { useParams } from 'react-router-dom';

const OrganizationDetailsMain = () => {
      const { organizationId } = useParams() as { organizationId: string }
    
  return (
    <div>
        <OrganizationDetails organizationId={organizationId} showSettings={true} />
    </div>
  )
}

export default OrganizationDetailsMain