import { useQuery, useMutation } from '@tanstack/react-query';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { queryClient } from '../../QueryClient/queryClient';


// Replace with your actual interface
export interface IPremises {
    _id: string;
    premisesName: string;
    premisesAddress?: string;
    meterLocation?: string;
    consumerNumber?: string;
    tariffId?: any;
    sanctionedLoad?: number;
    billingCycleStartDate?: Date;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


// 2. Create a payload type for reusability in Create and Update hooks
export interface PremisesPayload {
    premisesName?: string; // Required for create, optional for update
    premisesAddress?: string;
    meterLocation?: string;
    consumerNumber?: string;
    tariffId?: string;
    sanctionedLoad?: number;
    billingCycleStartDate?: string;
    isActive?: boolean; // Usually only passed during updates
}

export interface BaseResponse<T = any> {
    ok: boolean;
    data?: T;
    message?: string
}



// const MODIFY_ROLES: UserRole[] = ["accountant", "correspondent", "administrator", "principal", "viceprincipal", "teacher"];
// const GET_ROLES: UserRole[] = ["administrator", "correspondent", "principal"];

const allowedRoles = ["owner", "staff", "cto"]


// ============================
// GET ALL PREMISES
// ============================
export const useGetPremises = (organizationId?: string) => {
    // const { currentRole } = useAuthData();


     const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ['premises', organizationId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, GET_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.get<BaseResponse<IPremises[]>>(`/premises/get/${organizationId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to fetch premises');
                return data.data as IPremises[];
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId, // Only run the query if organizationId is provided
    });
};

// ============================
// CREATE PREMISES
// ============================
export const useCreatePremises = () => {
    // const { currentRole } = useAuthData();


     const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, payload }: { organizationId: string; payload: PremisesPayload }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.post<BaseResponse<IPremises>>(`/premises/create/${organizationId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to create premises');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['premises', variables.organizationId] });
        },
    });
};

// ============================
// UPDATE PREMISES
// ============================
export const useUpdatePremises = () => {
    // const { currentRole } = useAuthData();


     const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, premisesId, payload }: { organizationId: string; premisesId: string; payload: PremisesPayload }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.put<BaseResponse<IPremises>>(`/premises/update/${organizationId}/${premisesId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to update premises');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['premises', variables.organizationId] });
        },
    });
};

// ============================
// DELETE PREMISES
// ============================
export const useDeletePremises = () => {
    // const { currentRole } = useAuthData();


     const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, premisesId }: { organizationId: string; premisesId: string }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.delete<BaseResponse<null>>(`/premises/delete/${organizationId}/${premisesId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to delete premises');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['premises', variables.organizationId] });
        },
    });
};