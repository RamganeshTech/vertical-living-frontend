import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

// --- GET ALL Backups (Paginated) ---
export const getRateConfigBackupsApi = async ({
    organizationId,
    page = 1,
    limit = 10,
    api
}: {
    organizationId: string;
    page: number;
    limit: number;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/quote/rateconfig/backup/get-all`, {
        params: {
            organizationId,
            page,
            limit
        }
    });
    if (!data.ok) throw new Error(data.message || "Failed to fetch backups");
    return data.data; // Returning { backups, pagination }
};

// --- RESTORE Backup ---
export const restoreRateConfigBackupApi = async ({
    organizationId,
    backupId,
    api
}: {
    organizationId: string;
    backupId: string;
    api: AxiosInstance;
}) => {
    // Note: Using GET to match your current Express route definition
    const { data } = await api.put(`/quote/rateconfig/backup/restore/${organizationId}/${backupId}`);
    if (!data.ok) throw new Error(data.message || "Failed to restore backup");
    return data;
};

// --- API Function ---
export const getSingleRateConfigBackupApi = async ({
    backupId,
    api
}: {
    backupId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/quote/rateconfig/backup/single/${backupId}`);
    if (!data.ok) throw new Error(data.message || "Failed to fetch backup details");
    return data.data; // Returns the single backup object
};



const allowedRoles = ["owner", "staff", "CTO"];

// --- Hook: GET ALL Backups (Infinite Query) ---
export const useGetRateConfigBackups = ({
    organizationId,
    limit = 10,
}: {
    organizationId?: string;
    limit?: number;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["rateConfigBackups", organizationId, limit],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await getRateConfigBackupsApi({
                organizationId: organizationId!,
                page: pageParam,
                limit,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role) && !!organizationId
    });
};

// --- Hook: RESTORE Backup (Mutation) ---
export const useRestoreRateConfigBackup = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ 
            organizationId, 
            backupId 
        }: { 
            organizationId: string; 
            backupId: string; 
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await restoreRateConfigBackupApi({
                organizationId,
                backupId,
                api
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate the backups list so the restored item disappears from the "Recycle Bin"
            queryClient.invalidateQueries({
                queryKey: ["rateConfigBackups", variables.organizationId]
            });
            // You may also want to invalidate your main rate config queries here
            // to refresh the active data in the UI
            // queryClient.invalidateQueries({ queryKey: ["rateConfigs"] });
        }
    });
};

// --- React Query Hook ---
export const useGetSingleRateConfigBackup = ({
    backupId,
}: {
    backupId?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["rateConfigBackup", backupId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await getSingleRateConfigBackupApi({
                backupId: backupId!,
                api
            });
        },
        // Only run the query if we have both IDs
        enabled: !!role && allowedRoles.includes(role) && !!backupId
    });
};