import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";

/* ------------------------- CATEGORY API FUNCTIONS ------------------------- */

// 1. Create Category
const createMaterialWithLabourCategory = async ({
  api,
  body
}: {
  api: AxiosInstance;
  body: { organizationId: string; name: string, fields: any };
}) => {
  const { data } = await api.post(`/quote/materialwithlabour/rateconfig/categories`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateMaterialWithLabourRateConfigCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async (body: { organizationId: string; name: string, fields: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await createMaterialWithLabourCategory({ api, body });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourwithmaterial","rateconfig", "categories", organizationId] });
    },
  });
};

// 2. Get Categories by organizationId
const getMaterialWithLabourCategories = async ({
  api,
  organizationId
}: {
  api: AxiosInstance;
  organizationId: string;
}) => {
  const { data } = await api.get(`/quote/materialwithlabour/rateconfig/categories/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetMaterialWithLabourRateConfigCategories = (organizationId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["labourwithmaterial","rateconfig", "categories", organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getMaterialWithLabourCategories({ api, organizationId });
    },
    enabled: !!organizationId,
  });
};

// 3. Delete Category
const deleteMaterialWithLabourCategory = async ({
  api,
  categoryId
}: {
  api: AxiosInstance;
  categoryId: string;
}) => {
  const { data } = await api.delete(`/quote/materialwithlabour/rateconfig/categories/${categoryId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteMaterialWithLabourRateConfigCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string; organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteMaterialWithLabourCategory({ api, categoryId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourwithmaterial","rateconfig", "categories", organizationId] });
    },
  });
};

/* --------------------------- salary API FUNCTIONS --------------------------- */



const getSingleMaterialWithLabourCost = async ({
  api,
  organizationId,
  categoryId
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryId: string;
}) => {
  const { data } = await api.get(`/quote/materialwithlabour/rateconfig/categories/${organizationId}/singlesalary/${categoryId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetSingleMaterialWithLabourCost = ({organizationId, categoryId}:{organizationId: string, categoryId:string}) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  
  return useQuery({
    queryKey: ["labourwithmaterial","labourcost", organizationId, categoryId],
    queryFn: async () => {
      console.log("categoryId", categoryId);

      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleMaterialWithLabourCost({ api, organizationId, categoryId });
    },
    enabled: !!organizationId && !!categoryId,
    retry: false
  });
};



//  get by the category name // Updated API call to use Query Parameters for categoryName
const getSingleMaterialWithLabourCostByCategoryName = async ({
  api,
  organizationId,
  categoryName // Changed from categoryId to name string
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryName: string;
}) => {
  // Pass categoryName as a query parameter (?categoryName=Glass)
  const { data } = await api.get(
    `/quote/materialwithlabour/rateconfig/categories/${organizationId}/singlesalary`, 
    { params: { categoryName } }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data; // This returns the total salary number
};



export const useGetSingleMaterialWithLabourCostByCategoryName = ({
  organizationId, 
  categoryName // Changed from categoryId
}: {
  organizationId: string; 
  categoryName: string;
}) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    // queryKey now tracks the categoryName string
    queryKey: ["labourwithmaterial","labourcost-categoryName", organizationId, categoryName],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      
      return await getSingleMaterialWithLabourCostByCategoryName({ 
        api, 
        organizationId, 
        categoryName 
      });
    },
    // Only run if both ID and Name are provided
    enabled: !!organizationId && !!categoryName,
    retry: false,
    staleTime: 5 * 60 * 1000, // Optional: Cache for 5 minutes
  });
};
/* --------------------------- ITEM API FUNCTIONS --------------------------- */

// 4. Create Items (multiple at once)
const createMaterialWithLabourItems = async ({
  api,
  //   categoryId,
  organizationId,
  items,
  categoryId,
}: {
  api: AxiosInstance;
  categoryId: string;
  organizationId: string,
  items: Array<Record<string, any>>; // multiple fields allowed
}) => {
  const { data } = await api.post(`/quote/materialwithlabour/rateconfig/categories/${organizationId}/${categoryId}/items`, { items });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateMaterialWithLabourRateConfigItems = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      categoryId,
      organizationId,
      items
    }: {
      categoryId: string;
      organizationId: string;
      items: Array<Record<string, any>>;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await createMaterialWithLabourItems({ api, items, categoryId, organizationId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourwithmaterial","rateconfig", "items", organizationId] });
    },
  });
};

// 5. Get Items by Category
const getItemsByMaterialWithLabourCategory = async ({
  api,
  organizationId,
  categoryId,
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryId: string
}) => {
  const { data } = await api.get(`/quote/materialwithlabour/rateconfig/categories/${organizationId}/${categoryId}/items`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetItemsByMaterialWithLabourRateConfigCategory = (organizationId: string, categoryId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["labourwithmaterial","rateconfig", "items", organizationId, categoryId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getItemsByMaterialWithLabourCategory({ api, organizationId, categoryId });
    },
    enabled: !!organizationId && !!categoryId
  });
};





// 6. Update Item
const updateMaterialWithLabourItem = async ({
  api,
  itemId,
  body
}: {
  api: AxiosInstance;
  itemId: string;
  body: Record<string, any>;
}) => {
  const { data } = await api.put(`/quote/materialwithlabour/rateconfig/items/${itemId}`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateMaterialWithLabourRateConfigItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId, body }: { itemId: string; body: Record<string, any>; categoryId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateMaterialWithLabourItem({ api, itemId, body });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourwithmaterial","rateconfig", "items", categoryId] });
    },
  });
};

// 7. Delete Item
const deleteMaterialWithLabourItem = async ({
  api,
  itemId
}: {
  api: AxiosInstance;
  itemId: string;
}) => {
  const { data } = await api.delete(`/quote/materialwithlabour/rateconfig/items/${itemId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteMaterialWithLabourRateConfigItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId }: { itemId: string; organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteMaterialWithLabourItem({ api, itemId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourwithmaterial","rateconfig", "items", organizationId] });
    },
  });
};