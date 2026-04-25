import { useQuery, useMutation } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
// Adjust these imports based on your actual file structure
// import { useGetRole } from "../../hooks/useGetRole";
// import { getApiForRole } from "../../utils/apiHelpers";

const allowedRoles = ["owner", "CTO", "staff"];

// ============================================================================
// 1. Get Product Specific Categories
// ============================================================================
const getProductSpecificCategories = async ({
    api,
    organizationId,
    isProductSpecific
}: {
    api: AxiosInstance;
    organizationId: string;
    isProductSpecific: boolean;
}) => {
    const { data } = await api.get(`/quote/instantcostcalculator/get-all-category/${organizationId}?isProductSpecific=${isProductSpecific}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetProductSpecificCategories = (organizationId: string, isProductSpecific: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instantcost", "categories", organizationId, isProductSpecific],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
            if (!api) throw new Error("API instance not found for role");
            return await getProductSpecificCategories({ api, organizationId, isProductSpecific });
        },
        enabled: !!organizationId,
    });
};

// ============================================================================
// 2. Get Category Dimensions
// ============================================================================
const getCategoryDimensions = async ({
    api,
    organizationId,
    categoryId
}: {
    api: AxiosInstance;
    organizationId: string;
    categoryId: string;
}) => {
    // Note: Using the exact spelling from your route definition
    const { data } = await api.get(`/quote/instantcostcalculator/get-all-dimentions/${organizationId}/${categoryId}`);
    if (!data.ok) throw new Error(data.message);
    return data; // Returning full data to get categoryName and data array
};

export const useGetCategoryDimensions = (organizationId: string, categoryId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instantcost", "dimensions", organizationId, categoryId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
            if (!api) throw new Error("API instance not found for role");
            return await getCategoryDimensions({ api, organizationId, categoryId });
        },
        enabled: !!organizationId && !!categoryId,
    });
};

// ============================================================================
// 3. Get Single Cost Calculator Product Configuration
// ============================================================================
const getCostCalculatorProduct = async ({
    api,
    organizationId,
    categoryId,
    dimensionKey
}: {
    api: AxiosInstance;
    organizationId: string;
    categoryId: string;
    dimensionKey: string;
}) => {
    // Safely encode the dimension key since it likely contains spaces (e.g. "6 x 7")
    const encodedDimensionKey = encodeURIComponent(dimensionKey);
    const { data } = await api.get(`/quote/instantcostcalculator/get-single/${organizationId}/${categoryId}/${encodedDimensionKey}`);
    
    if (!data.ok) throw new Error(data.message);
    return data.data; // Will be null if it doesn't exist yet, which is handled cleanly by the backend
};

export const useGetCostCalculatorProduct = (organizationId: string, categoryId: string, dimensionKey: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instantcost", "product", organizationId, categoryId, dimensionKey],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
            if (!api) throw new Error("API instance not found for role");
            return await getCostCalculatorProduct({ api, organizationId, categoryId, dimensionKey });
        },
        // Only run the query if ALL three parameters are present
        enabled: !!organizationId && !!categoryId && !!dimensionKey,
    });
};

// ============================================================================
// 4. Upsert Cost Calculator Product Configuration
// ============================================================================
const upsertCostCalculatorProduct = async ({
    api,
    body
}: {
    api: AxiosInstance;
    body: any; // Ideally, pass your IInstantCostProduct interface here
}) => {
    const { data } = await api.post(`/quote/instantcostcalculator/upsert`, body);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpsertCostCalculatorProduct = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (body: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await upsertCostCalculatorProduct({ api, body });
        },
        onSuccess: (_, variables) => {
            // Invalidate the specific dimension query so it refetches immediately upon success
            queryClient.invalidateQueries({ 
                queryKey: ["instantcost", "product", variables.organizationId, variables.categoryId, variables.dimensionKey] 
            });
        },
    });
};