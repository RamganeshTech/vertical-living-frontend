// api/metaLead.api.ts
import { type AxiosInstance } from 'axios';

// Fetch all Meta Ads Leads
export const fetchMetaAdLeads = async ({ api, organizationId }: { api: AxiosInstance , organizationId:string}) => {
    // Matches: MetaRoutes.get('/all-leads')
    const { data } = await api.get('/v1/lead/meta/all-leads', {
        params: { organizationId } 
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Update Lead Status (Triggers Conversions API on backend)
export const updateMetaLeadStatusApi = async ({
    api,
    id,
    newStatus
}: {
    api: AxiosInstance;
    id: string;
    newStatus: string;
}) => {
    // Matches: MetaRoutes.put('/update-status')
    // Passes 'id' and 'newStatus' exactly as the backend expects
    const { data } = await api.put('/v1/lead/meta/update-status', { id, newStatus });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// hooks/useMetaLeads.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useGetRole from '../../../Hooks/useGetRole';
import { getApiForRole } from '../../../utils/roleCheck';

const allowedRoles = ["owner", "CTO", "staff"];

// Hook 1: Fetch Meta Leads for the Kanban/Table
export const useGetMetaAdLeads = ({
    organizationId,
}: { organizationId: string }) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["metaAdLeads"],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await fetchMetaAdLeads({ api, organizationId });
        },
        // Only run the query if the API and role are ready
        enabled: !!api && !!role && allowedRoles.includes(role),
    });
};

// Hook 2: Update Status (Drag and Drop in Kanban)
export const useUpdateMetaLeadStatus = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await updateMetaLeadStatusApi({ api, id, newStatus });
        },
        onSuccess: (_, variables) => {
            // Invalidate the main list to refresh the Kanban board
            queryClient.invalidateQueries({ queryKey: ["metaAdLeads"] });

            // Invalidate the specific lead if it's currently open in a modal
            queryClient.invalidateQueries({ queryKey: ["metaAdLead", variables.id] });
        }
    });
};