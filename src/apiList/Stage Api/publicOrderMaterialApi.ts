import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../../QueryClient/queryClient";


const backendUrl = `${import.meta.env.VITE_API_URL}/api`

const getAllOrderMAterialPublicUnits = async ({ projectId, }: { projectId: string, }) => {
    const { data } = await axios.get(`${backendUrl}/publicordermaterial/${projectId}/getpublicsubitems`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useGetAllOrderMaterialPublicUnits = (projectId: string) => {

    return useQuery({
        queryKey: ["public-ordering-material", projectId],
        queryFn: async () => {
            return await getAllOrderMAterialPublicUnits({ projectId });
        },
        enabled: !!projectId,
        retry: false,
        refetchOnMount: false,
    });
};



// ✅ Add SubItem
const addOrderingMaterialSubItemApi = async ({
    projectId,
    subItemName,
    quantity,
    unit,
}: {
    projectId: string;
    subItemName: string;
    quantity: number;
    unit: string;
}) => {
    const { data } = await axios.post(`${backendUrl}/publicordermaterial/${projectId}/addsubitem`,
        { subItemName, quantity, unit }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useAddOrderingMaterialSubItem = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            projectId,
            subItemName,
            quantity,
            unit,
        }: {
            projectId: string;
            unitId: string;
            subItemName: string;
            quantity: number;
            unit: string;
        }) => {

            return await addOrderingMaterialSubItemApi({ projectId, subItemName, quantity, unit });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", vars.projectId] });
            queryClient.invalidateQueries({
                queryKey: ["inventory", vars.projectId],
                refetchType: 'active' // Force active queries to refetch
            });
        },
    });
};

// ✅ Delete SubItem
const deleteOrderingMaterialSubItemApi = async ({
    projectId,
    subItemId,
}: {
    projectId: string;
    subItemId: string;
}) => {
    const { data } = await axios.delete(`${backendUrl}/publicordermaterial/${projectId}/deletesubitem/${subItemId}`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useDeleteOrderingMaterialSubItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            projectId,
            subItemId,
        }: {
            projectId: string;
            subItemId: string;
        }) => {
            return await deleteOrderingMaterialSubItemApi({ projectId, subItemId });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", vars.projectId] });
            queryClient.invalidateQueries({
                queryKey: ["inventory", vars.projectId],
                refetchType: 'active' // Force active queries to refetch
            });
        },
    });
};


const deleteAllSubUnits = async (
    projectId: string,
) => {
    const { data } = await axios.delete(`${backendUrl}/publicordermaterial/deleteallsubunits/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const useDeleteAllSubItems = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            projectId,
        }: {
            projectId: string;
        }) => {
            return await deleteAllSubUnits(projectId);
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", vars.projectId] });
            queryClient.invalidateQueries({
                queryKey: ["inventory", vars.projectId],
                refetchType: 'active' // Force active queries to refetch
            });
        },
    });
};

// ✅ Update SubItem
const updateOrderingMaterialSubItemApi = async ({
    projectId,
    subItemId,
    subItemName,
    quantity,
    unit,
}: {
    projectId: string;
    subItemId: string;
    subItemName?: string;
    quantity?: number;
    unit?: string;
}) => {
    const { data } = await axios.put(
        `${backendUrl}/publicordermaterial/${projectId}/updatesubitem/${subItemId}`,
        { subItemName, quantity, unit }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpdateOrderingMaterialSubItem = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            projectId,
            subItemId,
            subItemName,
            quantity,
            unit,
        }: {
            projectId: string;
            subItemId: string;
            subItemName?: string;
            quantity?: number;
            unit?: string;
        }) => {
            return await updateOrderingMaterialSubItemApi({
                projectId,
                subItemId,
                subItemName,
                quantity,
                unit,
            });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", vars.projectId] });
            queryClient.invalidateQueries({
                queryKey: ["inventory", vars.projectId],
                refetchType: 'active' // Force active queries to refetch
            });


        },
    });
};




const generatedPublicLink = async ({
    projectId,
    organizationId,
}: {
    projectId: string;
    organizationId: string;
}) => {
    const { data } = await axios.patch(`${backendUrl}/publicordermaterial/generatelink/${projectId}/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const useGeneratePublicOrderMaterial = () => {
    return useMutation({
        mutationFn: async ({ projectId, organizationId }: { projectId: string, organizationId: string }) => {
            return await generatedPublicLink({ projectId, organizationId });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", projectId] });
        },
    });
};



const getPublicProjects = async ({ orgsId }: { orgsId: string }) => {
    try {

        let { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/publicordermaterial/getprojects/${orgsId}`)
        if (data.ok) {
            return data.data
        }
        return []
    }
    catch (error) {
        throw error
    }
}

export const useGetPublicProjects = (orgsId: string) => {
    return useQuery({
        queryKey: ["publicproject"],
        queryFn: async () => {
            return await getPublicProjects({ orgsId })
        },
        refetchOnWindowFocus: false,
        retry: false,
    })
}





const updateShopDetailsApi = async (
    projectId: string,
    updates: any,
) => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/publicordermaterial/${projectId}/shop`, updates);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpdatePublicOrderShopDetails = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, updates }: { projectId: string, updates: any }) => {

            return await updateShopDetailsApi(projectId, updates);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["public-ordering-material", projectId] });
        },
    });
};