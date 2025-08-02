// apis/externalUnits/createWardrobeUnitApi.ts
import { type AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useInfiniteQuery, useMutation, type InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";


type WardrobeUnit = {
    _id: string;
    unitName: string;
    unitCode: string;
    price: number;
    category: string;
    image: { url: string, type:"image", originalName:string } | null;
};

export type WardrobeUnitPageResponse = {
    items: WardrobeUnit[];
    currentPage: number;
    totalPages: number;
};



export const createWardrobeUnitApi = async ({
    formData,
    api,
}: {
    formData: FormData;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/externalunits/createwardrobe`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};




export const useCreateWardrobeUnit = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ formData }: { formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
            if (!api) throw new Error("API instance not available");
            return await createWardrobeUnitApi({ formData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-units", "wardrobe"] });
        },
    });
};

export const getWardrobeUnitsApi = async ({
    pageParam = 1,
    search = "",
    api,
}: {
    pageParam?: number;
    search?: string;
    api: AxiosInstance;
}): Promise<WardrobeUnitPageResponse> => {
    const res = await api.get(`/externalunits/getwardrobe?page=${pageParam}&search=${search}`);


    const { data, pagination } = res.data;
    console.log("data form api", data)
    return {
        items: data,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
    };
};


export const useGetWardrobeUnitsInfinite = (search: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery<WardrobeUnitPageResponse,       // TQueryFnData
        Error,                          // TError
        InfiniteData<WardrobeUnitPageResponse>,       // TData
        [string, string],               // TQueryKey: tuple
        number>({
            queryKey: ["wardrobe-units", search],
            enabled: !!role,
            initialPageParam: 1, // ✅ this is required in v5
            queryFn: async ({ pageParam = 1 }) => {
                if (!api) throw new Error("Only authenticated users can see products")
                return await getWardrobeUnitsApi({ pageParam, search, api })
        },
            getNextPageParam: (lastPage) => {
                const { currentPage, totalPages } = lastPage;
                return currentPage < totalPages ? currentPage + 1 : undefined;
            },
        });
};