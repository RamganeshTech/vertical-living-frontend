import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";

/* ------------------------- CATEGORY API FUNCTIONS ------------------------- */

// 1. Create Category
const createCategory = async ({
  api,
  body
}: {
  api: AxiosInstance;
  body: { organizationId: string; name: string, fields: any, isProductSpecific: boolean };
}) => {
  const { data } = await api.post(`/quote/rateconfig/categories`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async (body: { organizationId: string; name: string, fields: any, isProductSpecific: boolean }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await createCategory({ api, body });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "categories", organizationId] });
    },
  });
};

// 2. Get Categories by organizationId
const getCategories = async ({
  api,
  organizationId
}: {
  api: AxiosInstance;
  organizationId: string;
}) => {
  const { data } = await api.get(`/quote/rateconfig/categories/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetCategories = (organizationId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["rateconfig", "categories", organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getCategories({ api, organizationId });
    },
    enabled: !!organizationId,
  });
};

// 3. Delete Category
const deleteCategory = async ({
  api,
  categoryId
}: {
  api: AxiosInstance;
  categoryId: string;
}) => {
  const { data } = await api.delete(`/quote/rateconfig/categories/${categoryId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string; organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteCategory({ api, categoryId });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "categories", organizationId] });
    },
  });
};



// 1. Create Category
const updateCategoryDescription = async ({
  api,
  categoryId,
  field, content
}: {
  api: AxiosInstance;
  categoryId: string;
  field: string,
  content: any,
}) => {
  const { data } = await api.put(`/quote/rateconfig/categories/${categoryId}/description`, { field, content });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateCategoryDescription = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryId,
      field, content }: {
        categoryId: string;
        field: string,
        content: any,
      }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateCategoryDescription({
        api, categoryId,
        field, content
      });
    },
    onSuccess: (_, { categoryId }) => {
      // queryClient.invalidateQueries({ queryKey: ["rateconfig", "categories", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });

    },
  });
};

/* --------------------------- ITEM API FUNCTIONS --------------------------- */

// 4. Create Items (multiple at once)
const createItems = async ({
  api,
  categoryId,
  organizationId,
  items
}: {
  api: AxiosInstance;
  categoryId: string;
  organizationId: string,
  // items: Array<Record<string, any>>; // multiple fields allowed
  items: FormData;

}) => {
  const { data } = await api.post(`/quote/rateconfig/categories/${organizationId}/${categoryId}/items`, items);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCreateItems = () => {
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
      // items: Array<Record<string, any>>;
      items: FormData;

    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await createItems({ api, categoryId, items, organizationId });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};

// 5. Get Items by Category
const getItemsByCategory = async ({
  api,
  categoryId
}: {
  api: AxiosInstance;
  categoryId: string;
}) => {
  const { data } = await api.get(`/quote/rateconfig/categories/${categoryId}/items`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useGetItemsByCategory = (categoryId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["rateconfig", "items", categoryId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getItemsByCategory({ api, categoryId });
    },
    enabled: !!categoryId,
  });
};



// 5. Get Items by Category
export const getItemsBycategoryNameForFittings = async ({
  api,
  organizationId,
  categoryName,
  itemName
}: {
  api: AxiosInstance;
  organizationId: string,
  categoryName: string;
  itemName: string;
}) => {
  // const { data } = await api.get(`/quote/rateconfig/categories/${categoryId}/items`);
  const { data } = await api.get(`/quote/rateconfig/categories/fittings/${organizationId}?categoryName=${categoryName}&itemName=${itemName}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const getItemsBycategoryNameForAllCategories = async ({
  api,
  organizationId,
  itemName
}: {
  api: AxiosInstance;
  organizationId: string,
  itemName: string;
}) => {
  // const { data } = await api.get(`/quote/rateconfig/categories/${categoryId}/items`);
  const { data } = await api.get(`/quote/rateconfig/categories/all/${organizationId}?itemName=${itemName}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useGetBrandsByCategoryForFittings = ({ categoryName, organizationId, itemName }: { categoryName: string, organizationId: string, itemName: string }) => {
  const { role } = useGetRole();
  const allowedRoles = ["owner", "CTO", "staff"];

  const api = getApiForRole(role!);

  return useQuery({
    // queryKey ensures data is unique to the specific item being typed
    queryKey: ["rateconfig", "fittings", categoryName, itemName],
    queryFn: async () => {
      // if (!api) throw new Error("API instance not found");
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getItemsBycategoryNameForFittings({ api, organizationId, categoryName, itemName });
    },
    // Only fetch if the category is provided and the user has typed at least 3 characters
    enabled: !!categoryName && !!itemName,
  });
};


export const useGetBrandsByCategoryForallCategories = ({ organizationId, itemName }: { organizationId: string, itemName: string }) => {
  const { role } = useGetRole();
  const allowedRoles = ["owner", "CTO", "staff"];

  const api = getApiForRole(role!);

  return useQuery({
    // queryKey ensures data is unique to the specific item being typed
    queryKey: ["rateconfig", "allcategories", itemName],
    queryFn: async () => {
      // if (!api) throw new Error("API instance not found");
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getItemsBycategoryNameForAllCategories({ api, organizationId, itemName });
    },
    // Only fetch if the category is provided and the user has typed at least 3 characters
    enabled: !!api && !!itemName,
  });
};

// 6. Update Item
const updateItem = async ({
  api,
  itemId,
  body
}: {
  api: AxiosInstance;
  itemId: string;
  // body: Record<string, any>;
  body: FormData;
}) => {
  const { data } = await api.put(`/quote/rateconfig/items/${itemId}`, body);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId, body }: {
      itemId: string;
      //  body: Record<string, any>;
      body: FormData,
      categoryId: string
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateItem({ api, itemId, body });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};

// 7. Delete Item
const deleteItem = async ({
  api,
  itemId
}: {
  api: AxiosInstance;
  itemId: string;
}) => {
  const { data } = await api.delete(`/quote/rateconfig/items/${itemId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId }: { itemId: string; categoryId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteItem({ api, itemId });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};
