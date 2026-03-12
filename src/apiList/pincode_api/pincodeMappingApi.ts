import { type AxiosInstance } from "axios";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

const allowedRoles = ["owner", "staff", "CTO"];


// GET ALL Mappings (with Pagination & Filters) [cite: 362, 366]
export const getAllMappingsApi = async ({
    organizationId,
    vendorId,
    pincodeId,
    vendorRole,
    serviceMode,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
    api
}: {
    organizationId: string;
    vendorId?: string;
    pincodeId?: string;
    vendorRole?: string;
    serviceMode?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page: number;
    limit: number;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/pincode/mapping/get-all-mappings`, {
        // params: { vendorId, pincodeId, page, limit }
        params: {
            organizationId,
            vendorId,
            pincodeId,
            vendorRole,
            serviceMode,
            startDate,
            endDate,
            search,
            page,
            limit
        }
    });
    if (!data.ok) throw new Error(data.message);
    return data;
};

// CREATE Mapping [cite: 276, 285]
export const createMappingApi = async ({
    mappingData,
    api
}: {
    mappingData: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/pincode/mapping/create-mapping`, mappingData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// GET SINGLE Mapping Detail [cite: 408]
export const getSingleMappingApi = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance
}) => {
    // Calling the specific route you provided
    const { data } = await api.get(`/pincode/mapping/get-single/${id}`);

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// UPDATE Mapping (SLA, Rates, Priority) [cite: 292, 296, 490]
export const updateMappingApi = async ({
    id,
    mappingData,
    api
}: {
    id: string;
    mappingData: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/pincode/mapping/update-mapping/${id}`, mappingData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// DELETE Mapping [cite: 490]
export const deleteMappingApi = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`/pincode/mapping/delete-mapping/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


// Hook: GET ALL Mappings (Infinite Scroll / Pagination) [cite: 657, 671]
export const useGetAllMappings = ({
    organizationId,
    vendorId,
    pincodeId,
    vendorRole,
    serviceMode,
    startDate,
    search,
    endDate,
    limit = 10
}: {
    organizationId?: string;
    vendorId?: string;
    pincodeId?: string;
    vendorRole?: string;
    serviceMode?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["vendor-mappings", vendorId, pincodeId, limit],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

         

            return await getAllMappingsApi({
                organizationId: organizationId!,
                vendorId,
                pincodeId,
                vendorRole,
                serviceMode,
                startDate,
                endDate,
                search,
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
        enabled: !!role && allowedRoles.includes(role)
    });
};

// Hook: GET SINGLE Mapping 
export const useGetSingleMapping = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["vendor-mapping", id],
        queryFn: async () => {
            // Mandatory Role and API Instance Check
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }

            return await getSingleMappingApi({ id, api });
        },
        // Only run if the role is valid and an ID exists
        enabled: !!role && allowedRoles.includes(role) && !!id
    });
};

// Hook: CREATE Mapping [cite: 484, 488]
export const useCreateMapping = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (mappingData: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await createMappingApi({ mappingData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-mappings"] });
        },
    });
};

// Hook: UPDATE Mapping [cite: 293, 296, 490]
export const useUpdateMapping = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, mappingData }: { id: string; mappingData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await updateMappingApi({ id, mappingData, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["vendor-mappings"] });
            queryClient.invalidateQueries({ queryKey: ["vendor-mapping", variables.id] });
        },
    });
};

// Hook: DELETE Mapping [cite: 490, 625]
export const useDeleteMapping = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteMappingApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-mappings"] });
        },
    });
};