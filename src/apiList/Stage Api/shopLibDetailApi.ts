import axios, { type AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

// ✅ Create Shop
export const createShopLibApi = async ({
    organizationId,
    shopData,
    api,
}: {
    organizationId: string;
    shopData: {
        shopName: string;
        address?: string;
        contactPerson?: string;
        phoneNumber?: string;
    };
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/shoplibdetails/${organizationId}/create`, shopData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ✅ Update Shop
export const updateShopLibApi = async ({
    id,
    shopData,
    api,
}: {
    id: string;
    shopData: {
        shopName: string;
        address?: string;
        contactPerson?: string;
        phoneNumber?: string;
    };
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/shoplibdetails/${id}/update`, shopData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ✅ Get Shops (for organization) without auth
export const getShopLibApi = async ({
    organizationId,
}: {
    organizationId: string;
}) => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/shoplibdetails/${organizationId}/get`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ✅ Delete Shop
export const deleteShopLibApi = async ({
    id,
    api,
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/shoplibdetails/${id}/delete`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// ✅ Create Shop Hook
export const useCreateShopLib = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            organizationId,
            shopData,
        }: {
            organizationId: string;
            shopData: {
                shopName: string;
                address: string;
                contactPerson: string;
                phoneNumber: string;
            };
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createShopLibApi({ organizationId, shopData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shoplibdetails"] });
        },
    });
};

// ✅ Update Shop Hook
export const useUpdateShopLib = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            shopData,
        }: {
            id: string;
            shopData: {
                shopName: string;
                address?: string;
                contactPerson?: string;
                phoneNumber?: string;
            };
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateShopLibApi({ id, shopData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shoplibdetails"] });
        },
    });
};

// ✅ Get Shops Hook
export const useGetShopLib = (organizationId: string) => {
    

    return useQuery({
        queryKey: ["shoplibdetails"],
        queryFn: async () => {
           
            return await getShopLibApi({ organizationId });
        },
        enabled: !!organizationId ,
    });
};

// ✅ Delete Shop Hook
export const useDeleteShopLib = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
        }: {
            id: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteShopLibApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shoplibdetails"] });
        },
    });
};
