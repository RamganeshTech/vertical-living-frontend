import { type AxiosInstance } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useDispatch } from "react-redux";
import { updateOwnerGuideStatus } from "../../features/userSlices";
import { updateCTOGuideStatus } from "../../features/CTOSlice";
import { updateStaffGuideStatus } from "../../features/staffSlices";
import { updateWorkerGuideStatus } from "../../features/workerSlice";
import { updateClientGuideStatus } from "../../features/clientSlice";
import { updateAuthGuideStatus } from "../../features/authSlice";

// Types
interface FetchTipsParams {
    organizationId: string;
    stageName: string;
    api: AxiosInstance;
}

interface UpsertTipParams {
    organizationId: string;
    stageName: string;
    tipText: string;
    tipId?: string; // Optional: Only needed for updating
    api: AxiosInstance;
}

interface DeleteTipParams {
    organizationId: string;
    stageName: string;
    tipId: string;
    api: AxiosInstance;
}

// ✅ API: Get Tips
const fetchTipsFromApi = async ({ organizationId, stageName, api }: FetchTipsParams) => {
    // Route: GET /api/guideline/:organizationId/:stageName
    const { data } = await api.get(`/guideline/${organizationId}/${stageName}`);
    if (!data.ok) throw new Error(data.message);
    return data.data; // Returns the array of tips
};

// ✅ API: Create or Update Tip
const upsertTipToApi = async ({ organizationId, stageName, tipText, tipId, api }: UpsertTipParams) => {
    // Route: POST /api/guideline
    const payload = { organizationId, stageName, tipText, tipId };
    const { data } = await api.post(`/guideline`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ✅ API: Delete Tip
const deleteTipFromApi = async ({ organizationId, stageName, tipId, api }: DeleteTipParams) => {
    // Route: DELETE /api/guideline/delete
    // Note: Axios DELETE accepts body inside the 'data' config property
    const { data } = await api.delete(`/guideline/delete`, {
        data: { organizationId, stageName, tipId }
    });
    if (!data.ok) throw new Error(data.message);
    return data;
};

export const markStageViewedApi = async ({
    organizationId,
    stageName,
    api
}: {
    organizationId: string;
    stageName: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/guideline/viewed`, { organizationId, stageName });
    if (!data.ok) throw new Error(data.message);
    return data;
};

// API: Toggle User Preference
export const toggleUserGuidePrefApi = async ({
    isGuideRequired,
    organizationId,
    api
}: {
    isGuideRequired: boolean;
    organizationId: string;
    api: AxiosInstance;
}) => {
    // We don't need to send userId/role in body because the API extracts it from the Token (Auth Header)
    const { data } = await api.patch(`/guideline/preference/${organizationId}`, { isGuideRequired });
    if (!data.ok) throw new Error(data.message);
    return data;
};


// ✅ HOOK: Get Tips (No Role Check required as per instruction)
export const useGetTips = (organizationId: string, stageName: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!); // We still need the API instance

    return useQuery({
        queryKey: ["guidelines", organizationId, stageName],
        queryFn: async () => {
            if (!api) throw new Error("API instance not found");
            return await fetchTipsFromApi({ organizationId, stageName, api });
        },
        enabled: !!organizationId && !!stageName && !!api, // Only fetch if data exists
    });
};

// ✅ HOOK: Upsert Tip (Create or Update)
// Roles: "owner", "CTO"
export const useUpsertTip = () => {
    const allowedRoles = ["owner", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            organizationId,
            stageName,
            tipText,
            tipId
        }: {
            organizationId: string;
            stageName: string;
            tipText: string;
            tipId?: string;
        }) => {
            // Role Check
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("You are not authorized to add or update tips.");
            }
            if (!api) throw new Error("API instance not found");

            return await upsertTipToApi({ organizationId, stageName, tipText, tipId, api });
        },
        // Invalidate the specific stage query so the frontend updates immediately
        onSuccess: (_, { organizationId, stageName }) => {
            queryClient.invalidateQueries({
                queryKey: ["guidelines", organizationId, stageName]
            });
        }
    });
};

// ✅ HOOK: Delete Tip
// Roles: "owner" Only
export const useDeleteTip = () => {
    const allowedRoles = ["owner"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            organizationId,
            stageName,
            tipId
        }: {
            organizationId: string;
            stageName: string;
            tipId: string;
        }) => {
            // Role Check
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("You are not authorized to delete tips.");
            }
            if (!api) throw new Error("API instance not found");

            return await deleteTipFromApi({ organizationId, stageName, tipId, api });
        },
        // Invalidate query to remove the deleted tip from UI
        onSuccess: (_, { organizationId, stageName }) => {
            queryClient.invalidateQueries({
                queryKey: ["guidelines", organizationId, stageName]
            });
        }
    });
};





// ✅ HOOK: Toggle User Preference
export const useToggleUserGuidePref = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const dispatch = useDispatch(); // ✅ Need dispatch

    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ isGuideRequired, organizationId }: { isGuideRequired: boolean, organizationId: string }) => {
            if (!role) throw new Error("Role not found");
            if (!api) throw new Error("API not found");

            return await toggleUserGuidePrefApi({ isGuideRequired, organizationId, api });
        },
        onSuccess: (_, variables) => {
            // ✅ UPDATE REDUX STORE BASED ON ROLE
            const newValue = variables.isGuideRequired;

            switch (role) {
                case "owner":
                    dispatch(updateOwnerGuideStatus(newValue));
                    break;
                case "CTO":
                    dispatch(updateCTOGuideStatus(newValue));
                    break;
                case "staff":
                    dispatch(updateStaffGuideStatus(newValue));
                    break;
                case "worker":
                    dispatch(updateWorkerGuideStatus(newValue));
                    break;
                case "worker":
                    dispatch(updateClientGuideStatus(newValue));
                    break;
                default:
                    break;
            }

            dispatch(updateAuthGuideStatus(newValue));



        }
        // onSuccess: (data) => {
        //     // 1. Invalidate 'auth' or 'user' query so the global app state knows the user changed prefs
        //     queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Replace with your actual user query key

        //     // 2. Optionally update local cache manually if you want instant feedback without refetch
        //     // queryClient.setQueryData(["userProfile"], (old: any) => ({ ...old, isGuideRequired: data.data.isGuideRequired }));
        // }
    });
};