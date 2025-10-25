import { type AxiosInstance } from "axios";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// ==================== CREATE MODULAR UNIT ====================
const createModularUnitNewApi = async (
    organizationId: string,
    formValues: any,
    productImages: File[],
    images2d: File[],
    images3d: File[],
    api: AxiosInstance
) => {
    const formData = new FormData();

    // Add form fields
    Object.keys(formValues).forEach((key) => {
        const value = formValues[key];

        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value)); // Send arrays as JSON string
            } else {
                formData.append(key, value);
            }
        }
    });

    // Add product images
    productImages.forEach((file) => {
        formData.append("productImages", file);
    });

    // Add 2D images
    images2d.forEach((file) => {
        formData.append("2dImages", file);
    });

    // Add 3D images
    images3d.forEach((file) => {
        formData.append("3dImages", file);
    });

    const { data } = await api.post(
        `/modularunitnew/create/${organizationId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==================== UPDATE MODULAR UNIT ====================
const updateModularUnitNewApi = async (
    unitId: string,
    formValues: any,
    productImages: File[],
    images2d: File[],
    images3d: File[],
    replaceProductImages: boolean,
    replace2dImages: boolean,
    replace3dImages: boolean,
    api: AxiosInstance
) => {
    const formData = new FormData();

    // // Add form fields
    // Object.keys(formValues).forEach((key) => {
    //     const value = formValues[key];

    //     if (value !== undefined && value !== null) {
    //         if (Array.isArray(value)) {
    //             formData.append(key, JSON.stringify(value));
    //         } else {
    //             formData.append(key, value);
    //         }
    //     }
    // });

        // ✅ CRITICAL FIX: Extract dimention BEFORE looping
    const { dimention, attributes, ...restValues } = formValues;

    // Add all form fields EXCEPT dimention and attributes
    Object.keys(restValues).forEach((key) => {
        const value = restValues[key];
        if (value !== undefined && value !== null && value !== '') {
            formData.append(key, String(value));
        }
    });

    // ✅ Add dimensions as SEPARATE fields
    if (dimention) {
        formData.append('height', String(dimention.height || 0));
        formData.append('width', String(dimention.width || 0));
        formData.append('depth', String(dimention.depth || 0));
    }

    // ✅ Add attributes as JSON string
    if (attributes && attributes.length > 0) {
        formData.append('attributes', JSON.stringify(attributes));
    } else {
        formData.append('attributes', JSON.stringify([]));
    }


    // Add replacement flags
    formData.append("replaceProductImages", String(replaceProductImages));
    formData.append("replace2dImages", String(replace2dImages));
    formData.append("replace3dImages", String(replace3dImages));

    // Add product images
    productImages.forEach((file) => {
        formData.append("productImages", file);
    });

    // Add 2D images
    images2d.forEach((file) => {
        formData.append("2dImages", file);
    });

    // Add 3D images
    images3d.forEach((file) => {
        formData.append("3dImages", file);
    });

    const { data } = await api.put(
        `/modularunitnew/update/${unitId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==================== DELETE MODULAR UNIT ====================
const deleteModularUnitNewApi = async (unitId: string, api: AxiosInstance) => {
    const { data } = await api.delete(`/modularunitnew/delete/${unitId}`);

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==================== GET SINGLE MODULAR UNIT ====================
const getModularUnitByIdNewApi = async (unitId: string, api: AxiosInstance) => {
    const { data } = await api.get(`/modularunitnew/getunits/${unitId}`);

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==================== GET ALL MODULAR UNITS (Paginated) ====================
interface GetAllModularUnitsParams {
    organizationId: string;
    page: number;
    limit: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

const getAllModularUnitsNewApi = async (
    params: GetAllModularUnitsParams,
    api: AxiosInstance
) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(params.page));
    queryParams.append("limit", String(params.limit));

    if (params.category) queryParams.append("category", params.category);
    if (params.minPrice) queryParams.append("minPrice", String(params.minPrice));
    if (params.maxPrice) queryParams.append("maxPrice", String(params.maxPrice));
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const { data } = await api.get(
        `/modularunitnew/getallunits/${params.organizationId}?${queryParams.toString()}`
    );

    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// ==================== CREATE MODULAR UNIT HOOK ====================
export const useCreateModularUnitNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({
            organizationId,
            formValues,
            productImages = [],
            images2d = [],
            images3d = [],
        }: {
            organizationId: string;
            formValues: any;
            productImages?: File[];
            images2d?: File[];
            images3d?: File[];
        }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await createModularUnitNewApi(
                organizationId,
                formValues,
                productImages,
                images2d,
                images3d,
                api
            );
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["modularUnitsNew", organizationId] });
        },
    });
};

// ==================== UPDATE MODULAR UNIT HOOK ====================
export const useUpdateModularUnitNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({
            unitId,
            formValues,
            productImages = [],
            images2d = [],
            images3d = [],
            replaceProductImages = false,
            replace2dImages = false,
            replace3dImages = false,
        }: {
            unitId: string;
            formValues: any;
            productImages?: File[];
            images2d?: File[];
            images3d?: File[];
            replaceProductImages?: boolean;
            replace2dImages?: boolean;
            replace3dImages?: boolean;
        }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await updateModularUnitNewApi(
                unitId,
                formValues,
                productImages,
                images2d,
                images3d,
                replaceProductImages,
                replace2dImages,
                replace3dImages,
                api
            );
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["modularUnitsNew"] });
            queryClient.invalidateQueries({ queryKey: ["modularUnitNew", data._id] });
        },
    });
};

// ==================== DELETE MODULAR UNIT HOOK ====================
export const useDeleteModularUnitNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({ unitId }: { unitId: string }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteModularUnitNewApi(unitId, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modularUnitsNew"] });
        },
    });
};

// ==================== GET SINGLE MODULAR UNIT HOOK ====================
export const useGetModularUnitByIdNew = (unitId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "client"];

    return useQuery({
        queryKey: ["modularUnitNew", unitId],
        queryFn: async () => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getModularUnitByIdNewApi(unitId, api);
        },
        enabled: !!unitId && !!role && !!api,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// ==================== GET ALL MODULAR UNITS (INFINITE QUERY) ====================
export const useGetAllModularUnitsNew = ({
    organizationId,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
}: {
    organizationId: string;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "client"];

    return useInfiniteQuery({
        queryKey: [
            "modularUnitsNew",
            organizationId,
            { category, minPrice, maxPrice, search, sortBy, sortOrder },
        ],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getAllModularUnitsNewApi(
                {
                    organizationId,
                    page: pageParam,
                    limit,
                    category,
                    minPrice,
                    maxPrice,
                    search,
                    sortBy,
                    sortOrder,
                },
                api
            );
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!organizationId && !!role && !!api,
        retry:false
    });
};