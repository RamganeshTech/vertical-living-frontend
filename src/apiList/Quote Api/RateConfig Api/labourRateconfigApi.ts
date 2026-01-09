import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";

/* ------------------------- CATEGORY API FUNCTIONS ------------------------- */

// 1. Create Category
const createLabourCategory = async ({
  api,
  body
}: {
  api: AxiosInstance;
  body: { organizationId: string; name: string, fields: any };
}) => {
  const { data } = await api.post(`/quote/labour/rateconfig/categories`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateLabourRateConfigCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async (body: { organizationId: string; name: string, fields: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await createLabourCategory({ api, body });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "categories", organizationId] });
    },
  });
};

// 2. Get Categories by organizationId
const getLabourCategories = async ({
  api,
  organizationId
}: {
  api: AxiosInstance;
  organizationId: string;
}) => {
  const { data } = await api.get(`/quote/labour/rateconfig/categories/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetLabourRateConfigCategories = (organizationId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["rateconfig", "categories", organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getLabourCategories({ api, organizationId });
    },
    enabled: !!organizationId,
  });
};

// 3. Delete Category
const deleteLabourCategory = async ({
  api,
  categoryId
}: {
  api: AxiosInstance;
  categoryId: string;
}) => {
  const { data } = await api.delete(`/quote/labour/rateconfig/categories/${categoryId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteLabourRateConfigCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string; organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteLabourCategory({ api, categoryId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "categories", organizationId] });
    },
  });
};

/* --------------------------- salary API FUNCTIONS --------------------------- */



const getSingleLabourCost = async ({
  api,
  organizationId,
  categoryId
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryId: string;
}) => {
  const { data } = await api.get(`/quote/labour/rateconfig/categories/${organizationId}/singlesalary/${categoryId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetSingleLabourCost = ({organizationId, categoryId}:{organizationId: string, categoryId:string}) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  
  return useQuery({
    queryKey: ["labourcost", organizationId, categoryId],
    queryFn: async () => {
      console.log("categoryId", categoryId);

      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleLabourCost({ api, organizationId, categoryId });
    },
    enabled: !!organizationId && !!categoryId,
    retry: false
  });
};



//  get by the category name // Updated API call to use Query Parameters for categoryName
const getSingleLabourCostByCategoryName = async ({
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
    `/quote/labour/rateconfig/categories/${organizationId}/singlesalary`, 
    { params: { categoryName } }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data; // This returns the total salary number
};
export const useGetSingleLabourCostByCategoryName = ({
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
    queryKey: ["labourcost-categoryName", organizationId, categoryName],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      
      return await getSingleLabourCostByCategoryName({ 
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
const createLabourItems = async ({
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
  const { data } = await api.post(`/quote/labour/rateconfig/categories/${organizationId}/${categoryId}/items`, { items });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateLabourRateConfigItems = () => {
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
      return await createLabourItems({ api, items, categoryId, organizationId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", organizationId] });
    },
  });
};

// 5. Get Items by Category
const getItemsByLabourCategory = async ({
  api,
  organizationId,
  categoryId,
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryId: string
}) => {
  const { data } = await api.get(`/quote/labour/rateconfig/categories/${organizationId}/${categoryId}/items`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetItemsByLabourRateConfigCategory = (organizationId: string, categoryId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["rateconfig", "items", organizationId, categoryId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getItemsByLabourCategory({ api, organizationId, categoryId });
    },
    enabled: !!organizationId,
  });
};





// 6. Update Item
const updateLabourItem = async ({
  api,
  itemId,
  body
}: {
  api: AxiosInstance;
  itemId: string;
  body: Record<string, any>;
}) => {
  const { data } = await api.put(`/quote/labour/rateconfig/items/${itemId}`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateLabourRateConfigItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId, body }: { itemId: string; body: Record<string, any>; categoryId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateLabourItem({ api, itemId, body });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};

// 7. Delete Item
const deleteLabourItem = async ({
  api,
  itemId
}: {
  api: AxiosInstance;
  itemId: string;
}) => {
  const { data } = await api.delete(`/quote/labour/rateconfig/items/${itemId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteLabourRateConfigItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId }: { itemId: string; organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteLabourItem({ api, itemId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", organizationId] });
    },
  });
};