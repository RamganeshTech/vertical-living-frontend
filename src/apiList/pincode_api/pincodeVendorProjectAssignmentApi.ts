import axios, { type AxiosInstance } from "axios";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

// --- API FUNCTIONS ---

// GET ALL Assignments
export const getAllAssignmentsApi = async ({
    organizationId,
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    api,
    status,
    projectId,
    vendorId
}: {
    organizationId: string;
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    projectId?: string;
    vendorId?: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/pincode/project-assignment/get-all`, {
        params: {
            organizationId, page, limit, search,
            startDate,
            endDate, status,
              projectId,
vendorId
        }
    });
    if (!data.ok) throw new Error(data.message);
    return data;
};

// CREATE Assignment
export const createAssignmentApi = async ({
    assignmentData,
    api
}: {
    assignmentData: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/pincode/project-assignment/assign-project`, assignmentData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// GET SINGLE Assignment
export const getSingleAssignmentApi = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.get(`/pincode/project-assignment/get-assignment/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// UPDATE Assignment Status (E-Signature/Acknowledgement)
export const updateAssignmentStatusApi = async ({
    id,
    updateData,
    api
}: {
    id: string;
    updateData: { status: string; vendorNote?: string };
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/pincode/project-assignment/update/${id}`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// DELETE Assignment
export const deleteAssignmentApi = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`/pincode/project-assignment/delete-assignment/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

// --- REACT QUERY HOOKS ---

const allowedRoles = ["owner", "staff", "CTO"];

// Hook: GET ALL Assignments (Infinite)
export const useGetAllAssignments = ({
    organizationId,
    limit = 20,
    search,
    startDate,
    endDate,
    status,
    projectId,
    vendorId
}: {
    organizationId?: string;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    projectId?: string;
    vendorId?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["project-assignments", organizationId, limit, search,
            startDate,
            endDate, status, vendorId, projectId],
        queryFn: async ({ pageParam = 1 }) => {
            // Mandatory Checks
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getAllAssignmentsApi({
                organizationId: organizationId!,
                page: pageParam as number,
                limit,
                search,
                startDate,
                endDate, status,
                projectId,
                vendorId,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination && lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role) && !!organizationId
    });
};

// Hook: CREATE Assignment
export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (assignmentData: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await createAssignmentApi({ assignmentData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-assignments"] });
        },
    });
};

// Hook: GET SINGLE Assignment
export const useGetSingleAssignment = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["project-assignment", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleAssignmentApi({ id, api });
        },
        enabled: !!role && allowedRoles.includes(role) && !!id
    });
};

// Hook: UPDATE Assignment Status
export const useUpdatePartnerPincodeAssignment = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, updateData }: { id: string; updateData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await updateAssignmentStatusApi({ id, updateData, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["project-assignments"] });
            queryClient.invalidateQueries({ queryKey: ["project-assignment", variables.id] });
        },
    });
};

// Hook: DELETE Assignment
export const useDeleteAssignment = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteAssignmentApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-assignments"] });
        },
    });
};



//  PUBLIC API 

const BASE_URL = import.meta.env.VITE_API_URL;

// Hook: Get Public Details
export const useGetPublicAssignment = (id: string) => {
    return useQuery({
        queryKey: ["public-assignment", id],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/api/pincode/project-assignment/public/${id}`);
            if (!data.ok) throw new Error(data.message);
            return data.data;
        },
        enabled: !!id
    });
};

// Hook: Accept Assignment
export const useAcceptAssignment = () => {
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { data } = await axios.patch(`${BASE_URL}/api/pincode/project-assignment/public-accept/${id}`);
            if (!data.ok) throw new Error(data.message);
            return data.data;
        }
    });
};