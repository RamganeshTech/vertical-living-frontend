import { useQuery, useMutation } from '@tanstack/react-query';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { queryClient } from '../../QueryClient/queryClient';

// ============================
// TYPE DEFINITIONS
// ============================

export interface ITariffSlab {
    upto: number;
    ratePerUnit: number;
}

export interface ITariff {
    _id: string;
    organizationId: string;
    tariffName: string;
    fixedChargePerKw: number;
    slabs: ITariffSlab[];
    isActive: boolean;
    isTelescopic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TariffPayload {
    tariffName?: string;
    fixedChargePerKw?: number;
    slabs?: ITariffSlab[];
    isActive?: boolean;
}


export interface BaseResponse<T = any> {
    ok: boolean;
    data?: T;
    message?: string
}
// Separate role arrays for Read and Modify operations
// const READ_ROLES:UserRole[] = ["correspondent", "administrator", "principal", "viceprincipal", "accountant"];
// const MODIFY_ROLES:UserRole[] = ["correspondent", "administrator", "principal", "accountant"];

const allowedRoles = ["owner", "staff", "cto"]


// ============================
// GET ALL TARIFFS
// ============================
export const useGetTariffs = (organizationId?: string) => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useQuery({
        queryKey: ['tariffs', organizationId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, READ_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");



                const { data } = await api.get<BaseResponse<ITariff[]>>(`/eb/tariff/get-all/${organizationId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to fetch tariffs');
                return data.data as ITariff[];
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId,
    });
};

// ============================
// GET TARIFF BY ID
// ============================
export const useGetTariffById = (organizationId?: string, tariffId?: string) => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useQuery({
        queryKey: ['tariff', organizationId, tariffId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, READ_ROLES);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");



                const { data } = await api.get<BaseResponse<ITariff>>(`/eb/tariff/get/${organizationId}/${tariffId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to fetch tariff details');
                return data.data as ITariff;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId && !!tariffId,
    });
};

// ============================
// CREATE TARIFF
// ============================
export const useCreateTariff = () => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useMutation({
        mutationFn: async ({ organizationId, payload }: { organizationId: string; payload: TariffPayload }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);


                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");



                const { data } = await api.post<BaseResponse<ITariff>>(`/eb/tariff/create/${organizationId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to create tariff');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tariffs', variables.organizationId] });
        },
    });
};

// ============================
// UPDATE TARIFF
// ============================
export const useUpdateTariff = () => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useMutation({
        mutationFn: async ({
            organizationId,
            tariffId,
            payload
        }: {
            organizationId: string;
            tariffId: string;
            payload: TariffPayload
        }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);

                if (!api) throw new Error("API instance not found for role");

                const { data } = await api.put<BaseResponse<ITariff>>(`/eb/tariff/update/${organizationId}/${tariffId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to update tariff');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tariffs', variables.organizationId] });
            queryClient.invalidateQueries({ queryKey: ['tariff', variables.organizationId, variables.tariffId] });
        },
    });
};

// ============================
// DELETE TARIFF
// ============================
export const useDeleteTariff = () => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useMutation({
        mutationFn: async ({ organizationId, tariffId }: { organizationId: string; tariffId: string }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);
                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");




                const { data } = await api.delete<BaseResponse<null>>(`/eb/tariff/delete/${organizationId}/${tariffId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to delete tariff');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tariffs', variables.organizationId] });
            queryClient.removeQueries({ queryKey: ['tariff', variables.organizationId, variables.tariffId] });
        },
    });
};