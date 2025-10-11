import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';
import useGetRole from '../../Hooks/useGetRole';
import { queryClient } from '../../QueryClient/queryClient';
import { getApiForRole } from '../../utils/roleCheck';

// Types
interface CartItem {
    productId: string;
    quantity: number;
    specification: any;
    singleItemCost: number;
    orderedBefore: boolean;
}

interface Cart {
    _id: string;
    organizationId: string;
    projectId: string;
    items: CartItem[];
    status: string;
    totalCost: number;
    pdfLink?: string;
}

const allowedRoles = ['owner', 'staff', 'CTO'];

interface ApiResponse<T> {
    ok: boolean;
    message?: string;
    data: T;
}

// API functions
const addToCart = async ({ organizationId, projectId, productId, quantity, specification, api }: {
    organizationId: string;
    projectId: string;
    productId: string;
    quantity: number;
    specification: any;
    api: AxiosInstance;
}): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/materialinventory/cart/add', {
        organizationId,
        projectId,
        productId,
        quantity,
        specification
    });
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};

const getCart = async ({ organizationId, projectId, api }: {
    organizationId: string;
    projectId: string;
    api: AxiosInstance;
}): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>(`/materialinventory/cart/get?organizationId=${organizationId}&projectId=${projectId}`);
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};

const updateCartItemQuantity = async ({ cartId, productId, quantity, api }: {
    cartId: string;
    productId: string;
    quantity: number;
    api: AxiosInstance;
}): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>('/materialinventory/cart/update-quantity', {
        cartId,
        productId,
        quantity
    });
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};

const removeCartItem = async ({ cartId, productId, api }: {
    cartId: string;
    productId: string;
    api: AxiosInstance;
}): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>('/materialinventory/cart/remove-item', {
        data: { cartId, productId }
    });
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};


const generatePdf = async ({ id, projectId, api }: {
    id: string;
    projectId: string;
    api: AxiosInstance;
}): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>(`/materialinventory/cart/generatematerial/pdf/${projectId}/${id}`);
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};





const getCartHistory = async ({ organizationId, projectId, api }: {
    organizationId: string;
    projectId: string;
    api: AxiosInstance;
}): Promise<Cart[]> => {
    const response = await api.get<ApiResponse<Cart[]>>(`/materialinventory/cart/history?organizationId=${organizationId}&projectId=${projectId}`);
    if (!response.data.ok) throw new Error(response.data.message);
    return response.data.data;
};

// React Query Hooks
export const useAddToCart = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation<
        Cart,
        Error,
        {
            organizationId: string;
            projectId: string;
            productId: string;
            quantity: number;
            specification: any;
        }
    >({
        mutationFn: async (params) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return addToCart({ ...params, api });
        },
        onSuccess: (_, { organizationId, projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["cart", organizationId, projectId] });
        }
    });
};

export const useGetCart = ({ organizationId, projectId }: {
    organizationId: string;
    projectId: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery<Cart, Error>({
        queryKey: ["cart", organizationId, projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return getCart({ organizationId, projectId, api });
        },
        enabled: Boolean(organizationId && projectId && role && allowedRoles.includes(role))
    });
};

export const useUpdateCartItemQuantity = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation<
        Cart,
        Error,
        {
            cartId: string;
            productId: string;
            quantity: number;
        }
    >({
        mutationFn: async (params) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return updateCartItemQuantity({ ...params, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });
};

export const useRemoveCartItem = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation<
        Cart,
        Error,
        {
            cartId: string;
            productId: string;
        }
    >({
        mutationFn: async (params) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return removeCartItem({ ...params, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });
};



export const useGenrateMaterialInventCartPdf = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({id, projectId}:{id:string, projectId:string}) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return generatePdf({ id, projectId, api });
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ["cart"] });
        // }
    });
};




export const useGetCartHistory = ({ organizationId, projectId }: {
    organizationId: string;
    projectId: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery<Cart[], Error>({
        queryKey: ["cartHistory", organizationId, projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return getCartHistory({ organizationId, projectId, api });
        },
        enabled: Boolean(organizationId && projectId && role && allowedRoles.includes(role))
    });
};
