import { useQuery } from "@tanstack/react-query";
import useGetRole from "../Hooks/useGetRole";
import { getApiForRole } from "../utils/roleCheck";

/**
 * Custom Hook to get all Cost Calculator submissions with filters
 * Route: GET /api/v1/public/costcalculation/getall
 */
export const useGetAllPublicCostCalculations = (organizationId: string, filters: any) => {

    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useQuery({
        queryKey: ['publicCostCalculations', organizationId, filters],
        queryFn: async () => {
            // Build query string dynamically matching your controller logic
            const params = new URLSearchParams({
                organizationId,
                search: filters.search || '',
                finish: filters.finish || '', // Matches the Standard/Premium/Luxury filter
                startDate: filters.startDate || '',
                endDate: filters.endDate || '',
                minAmount: filters.minAmount || '',
                maxAmount: filters.maxAmount || '',
            });


            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");


            const { data } = await api.get(`/v1/public/costcalculation/getall?${params.toString()}`);

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch records");
            }

            return data.data; // Returns the array of records
        },
        enabled: !!organizationId, // Only run if organizationId is available
        // staleTime: 5 * 60 * 1000, // Optional: Cache for 5 minutes
    });
};

/**
 * Custom Hook to get a single Cost Calculator record by ID
 * Route: GET /api/v1/public/costcalculation/get/:id
 */
export const useGetSinglePublicCostCalculation = (id: string, organizationId: string) => {

    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useQuery({
        queryKey: ['publicCostCalculation', id],
        queryFn: async () => {


            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");


            // Pass organizationId as a query param for the findOne security logic in controller
            const { data } = await api.get(`/v1/public/costcalculation/get/${id}?organizationId=${organizationId}`);

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch calculation details");
            }

            return data.data; // Returns the single record object (including config)
        },
        enabled: !!id && !!organizationId, // Only run if both IDs exist
    });
};