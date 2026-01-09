import { type AxiosInstance } from "axios";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// 1. Create Tool Room
export const createToolRoomApi = async (roomData: any, api: AxiosInstance) => {
    const { data } = await api.post(`/toolroom/create`, roomData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Update Tool Room
export const updateToolRoomApi = async ({ id, updateData, api }: { id: string; updateData: any; api: AxiosInstance }) => {
    const { data } = await api.patch(`/toolroom/update/${id}`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 3. Get All Tool Rooms (Paginated)
export const getAllToolRoomsApi = async ({ params, api }: { params: any; api: AxiosInstance }) => {
    const { data } = await api.get(`/toolroom/getall`, { params });
    if (!data.ok) throw new Error(data.message);
    return data; // Returns { ok, total, data }
};

// 4. Get Tool Room By ID
export const getToolRoomByIdApi = async (id: string, api: AxiosInstance) => {
    const { data } = await api.get(`/toolroom/get/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 5. Delete Tool Room
export const deleteToolRoomApi = async (id: string, api: AxiosInstance) => {
    const { data } = await api.delete(`/toolroom/delete/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


const allowedRoles = ["owner", "staff", "CTO"];

// 1. Hook: Create Tool Room
export const useCreateToolRoom = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (roomData: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await createToolRoomApi(roomData, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolroom"] });
        }
    });
};

// 2. Hook: Update Tool Room
export const useUpdateToolRoom = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, updateData }: { id: string; updateData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await updateToolRoomApi({ id, updateData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolroom"] });
        }
    });
};


// 3. Hook: Get All Tool Rooms (Infinite Scrolling)
export const useGetAllToolRoomsInfinite = (filters: any) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["toolroom", "all", filters],
        queryFn: async ({ pageParam = 1 }) => {
            // Requirement: Two separate if conditions
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }

            return await getAllToolRoomsApi({ 
                params: { ...filters, page: pageParam, limit: 10 }, 
                api 
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            // Assuming your backend returns current page and total pages
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        enabled: !!role && !!api
    });
};


// 4. Hook: Get Tool Room By ID
export const useGetToolRoomById = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["toolroom", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await getToolRoomByIdApi(id, api);
        },
        enabled: !!id && !!role && !!api
    });
};

// 5. Hook: Delete Tool Room
export const useDeleteToolRoom = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await deleteToolRoomApi(id, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolroom"] });
        }
    });
};