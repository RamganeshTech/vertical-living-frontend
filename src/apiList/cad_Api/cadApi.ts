import { useMutation, useQueries } from '@tanstack/react-query';
import { type AxiosInstance } from 'axios';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { getMaterialBrand } from '../Quote Api/QuoteVariant Api/quoteVariantApi';

// 1. Updated Interface to match the new "Trade-Based" structure
export interface CADExtractionResponse {
    ok: boolean;
    data: {
        project_name: string;
        works: Array<{
            work_type: string; // e.g., "Glass Work", "Carpentry Work"
            rooms: Array<{
                room_name: string;
                items: Array<{
                    s_no: string;      // maps to code like MT-1
                    description: string;
                    location: string;
                    quantity: number;
                    uom: string;       // NOS, SQFT, etc.
                    price: number | null;
                    total_price: number | null;
                    metadata: {
                        l: string | null;
                        b: string | null;
                        h: string | null;
                    };
                }>;
            }>;
        }>;
        extraction_warnings: string[];
    };
}

const extractCADDetails = async ({
    file,
    api,
    organizationId
}: {
    file: File;
    api: AxiosInstance;
    organizationId: string;
}): Promise<CADExtractionResponse> => {
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('file', file); // Matches your backend .single("file")

    const { data } = await api.post<CADExtractionResponse>(
        `/cad/extract/${organizationId}`,
        formData,

    );

    return data;
};

// Usage in your component
export const useExtractCAD = () => {

    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useMutation({
        mutationFn: async ({ file, organizationId }: { file: File, organizationId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await extractCADDetails({ file, api, organizationId })
        },
        onSuccess: (data) => {
            console.log('Extracted Data:', data.data);
            // Here you would typically update a local state to show the editable table
        },
        onError: (error: Error) => {
            console.error('Failed to extract CAD:', error.message);
        }
    });
};

export const useGetMultiMaterialBrands = (organizationId: string, categories: string[]) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQueries({
        queries: categories.map((category) => ({
            queryKey: ["quote-brand-multi", organizationId, category],
            queryFn: () => {
                // Security checks
                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
                if (!api) throw new Error("API instance not found");
                
                // DO NOT use await here. Just return the promise.
                return getMaterialBrand({ api, organizationId, categoryName: category });
            },
            enabled: !!organizationId && !!category && !!api && !!role,
        })),
    });
};