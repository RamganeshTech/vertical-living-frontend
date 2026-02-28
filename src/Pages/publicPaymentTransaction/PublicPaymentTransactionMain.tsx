import { useParams } from 'react-router-dom'
import TransactionDashboard from './TransactionDashboard'

const PublicPaymentTransactionMain = () => {

    const { organizationId } = useParams() as { organizationId: string }
   
    return (
        <main>
            <TransactionDashboard organizationId={organizationId}/>
        </main>
    )
}

export default PublicPaymentTransactionMain