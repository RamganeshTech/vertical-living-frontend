import { useQuery } from "@tanstack/react-query";
import useGetRole from "../Hooks/useGetRole";
import { getApiForRole } from "../utils/roleCheck";
// import { useGetRole } from "../../Hooks/useGetRole"; // Adjust path
// import { getApiForRole } from "../../utils/getApiForRole"; // Adjust path

/**
 * Hook to fetch all leads with advanced filters
 */
export const useGetAllPublicLeads = (organizationId: string, filters: any) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useQuery({
        queryKey: ['publicLeads', organizationId, filters],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized Access");
            if (!api) throw new Error("API configuration missing");

            const params = new URLSearchParams({
                organizationId,
                search: filters.search || '',
                projectCategory: filters.projectCategory || '',
                startDate: filters.startDate || '',
                endDate: filters.endDate || '',
            });

            const { data } = await api.get(`/v1/public/leadcollection/getall?${params.toString()}`);

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch leads");
            }

            return data.data; // Returns array of leads
        },
        enabled: !!organizationId && !!role,
    });
};

/**
 * Hook to fetch a single lead by ID
 */
export const useGetSinglePublicLead = (id: string, organizationId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useQuery({
        queryKey: ['publicLeadDetail', id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized Access");
            if (!api) throw new Error("API configuration missing");

            const { data } = await api.get(`/v1/public/leadcollection/get/${id}?organizationId=${organizationId}`);

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch lead details");
            }

            return data.data; // Returns single lead object
        },
        enabled: !!id && !!organizationId && !!role,
    });
};