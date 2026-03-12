import { type AxiosInstance } from "axios";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";


// GET ALL Pincodes (with Pagination) [cite: 63, 669]
export const getAllPincodesApi = async ({
    organizationId,
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    urbanClassification,
    serviceStatus,
    api
}: {
    organizationId: string;
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    urbanClassification?: string;
    serviceStatus?: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/pincode/get-all-pincodes`, {
        params: {
            organizationId, page,
            limit,
            search,
            startDate,
            endDate,
            urbanClassification,
            serviceStatus
        }
    });
    if (!data.ok) throw new Error(data.message);
    return data;
};

// CREATE Pincode [cite: 754]
export const createPincodeApi = async ({
    pincodeData,
    api
}: {
    pincodeData: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/pincode/create-pincode`, pincodeData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// GET SINGLE Pincode [cite: 391, 396]
export const getSinglePincodeApi = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.get(`/pincode/get-pincode/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// UPDATE Pincode [cite: 760]
export const updatePincodeApi = async ({
    id,
    pincodeData,
    api
}: {
    id: string;
    pincodeData: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/pincode/update-pincode/${id}`, pincodeData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// DELETE Pincode
export const deletePincodeApi = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`/pincode/delete-pincode/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


const allowedRoles = ["owner", "staff", "CTO"];

// Hook: GET ALL Pincodes (Infinite Query)
export const useGetAllPincodes = ({
    organizationId,
    limit = 10,
    search,
    startDate,
    endDate,
    urbanClassification,
    serviceStatus
}: {
    organizationId?: string;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    urbanClassification?: string;
    serviceStatus?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["pincodes", organizationId, limit, search],
        queryFn: async ({ pageParam = 1 }) => {
            // Mandatory Role and API Instance Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            // return await getAllPincodesApi({
            //     organizationId: organizationId!,
            //     page: pageParam,
            //     limit,
            //     search,
            //     api
            // });
            return await getAllPincodesApi({
                organizationId: organizationId!,
                page: pageParam,
                limit,
                search,
                startDate,
                endDate,
                urbanClassification,
                serviceStatus,
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

// Hook: CREATE Pincode
export const useCreatePincode = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (pincodeData: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await createPincodeApi({ pincodeData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pincodes"] });
        },
    });
};

// Hook: GET SINGLE Pincode
export const useGetSinglePincode = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["pincode", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSinglePincodeApi({ id, api });
        },
        enabled: !!role && allowedRoles.includes(role) && !!id
    });
};

// Hook: UPDATE Pincode
export const useUpdatePincode = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, pincodeData }: { id: string; pincodeData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await updatePincodeApi({ id, pincodeData, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["pincodes"] });
            queryClient.invalidateQueries({ queryKey: ["pincode", variables.id] });
        },
    });
};

// Hook: DELETE Pincode
export const useDeletePincode = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deletePincodeApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pincodes"] });
        },
    });
};