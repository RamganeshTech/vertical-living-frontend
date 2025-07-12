import React from 'react'
import SubscriptionPlans from './SubscriptionMain'
import { useOutletContext } from 'react-router-dom'
import type { OrganizationOutletTypeProps } from '../Organization/OrganizationChildren'

const SubscriptionParent:React.FC = () => {
 
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()


    return <SubscriptionPlans openMobileSidebar={openMobileSidebar} isMobile={isMobile} />
}

export default SubscriptionParent