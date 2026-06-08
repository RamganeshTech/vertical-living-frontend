import axios from 'axios';

import { useQuery, useMutation } from '@tanstack/react-query';
import useGetRole from '../../../Hooks/useGetRole';
import { queryClient } from '../../../QueryClient/queryClient';
// Import your role hook and queryClient
// import { useGetRole } from '...'; 
// import { queryClient } from '...'; 


// The external base URL for the main website
const PORD_WEBSITE_API_BASE_URL = 'https://theverticalliving.com/api/v1';
// const DEV_WEBSITE_API_BASE_URL = 'http://localhost:5000/api/v1';

const WEBSITE_API_BASE_URL =  PORD_WEBSITE_API_BASE_URL 
// const WEBSITE_API_BASE_URL =  DEV_WEBSITE_API_BASE_URL

export interface MarketingTextItem {
    text: string;
}

// 1. Get Global Config
export const getWebsiteAppConfig = async () => {
    const { data } = await axios.get(`${WEBSITE_API_BASE_URL}/app-config/get`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Update Marketing Text
export const updateWebsiteMarketingText = async (marketingText: MarketingTextItem[]) => {
    const { data } = await axios.put(`${WEBSITE_API_BASE_URL}/app-config/marketing-text`, { 
        marketingText 
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const allowedRoles = ['staff', 'owner', 'cto'];

// Hook 1: Fetch the App Config
export const useGetAppConfig = () => {
    const { role } = useGetRole();

    return useQuery({
        queryKey: ["websiteAppConfig"],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            return await getWebsiteAppConfig();
        },
        // Only run the query if the user has a valid role
        enabled: !!role && allowedRoles.includes(role),
    });
};

// Hook 2: Mutation to Update Marketing Text
export const useUpdateMarketingText = () => {
    const { role } = useGetRole();

    return useMutation({
        mutationFn: async (marketingText: MarketingTextItem[]) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            return await updateWebsiteMarketingText(marketingText);
        },
        onSuccess: () => {
            // Invalidate the config query so the UI instantly refreshes with the new text
            queryClient.invalidateQueries({ queryKey: ["websiteAppConfig"] });
        }
    });
};

