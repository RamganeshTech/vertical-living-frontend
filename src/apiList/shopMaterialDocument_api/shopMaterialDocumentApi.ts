import { type AxiosInstance } from "axios";
import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

// 🔹 Upload API
export const uploadMaterialShopFilesApi = async ({
  categoryName,
  organizationId,
  files,
  api
}: {
  categoryName: string;
  organizationId: string;
  files: File[];
  api: AxiosInstance;
}) => {
  const formData = new FormData();
  formData.append("categoryName", categoryName);
  formData.append("organizationId", organizationId);
  files.forEach(file => formData.append("files", file));

  const { data } = await api.post(`/materialshop/document/uploadmaterials`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};



// 🔹 Upload API
export const uploadMaterialShopFilesApiv1 = async ({
  categoryName,
  materialCategoryId,
  organizationId,
  files,
  api
}: {
  categoryName: string;
  materialCategoryId: string,
  organizationId: string;
  files: File[];
  api: AxiosInstance;
}) => {
  const formData = new FormData();
  formData.append("categoryName", categoryName);
  formData.append("materialCategoryId", materialCategoryId);
  formData.append("organizationId", organizationId);
  files.forEach(file => formData.append("files", file));

  const { data } = await api.post(`/materialshop/document/uploadmaterials/v1`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};


// 🔹 Delete API
export const updateCategoryMaterialShopDocumentApi = async ({ id, categoryName, organizationId, api }: { id: string, categoryName: string, organizationId: string, api: AxiosInstance }) => {
  const { data } = await api.patch(`/materialshop/document/update/category/${id}`, { categoryName, organizationId });
  return data;
};


// 🔹 Upload API
export const updateUploadMaterialShopFilesApi = async ({
  categoryId,
  files,
  api
}: {
  categoryId: string;
  files: File[];
  api: AxiosInstance;
}) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const { data } = await api.post(`/materialshop/document/update/upload/doc/${categoryId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};



// 🔹 Get All (Infinite) API
export const getAllMaterialShopDocumentsApi = async ({
  api,
  organizationId,
  categoryName,
  pageParam = 1,
  limit = 20
}: {
  api: AxiosInstance;
  organizationId: string;
  categoryName?: string;
  pageParam: number;
  limit?: number;
}) => {
  const { data } = await api.get(`/materialshop/document/getall`, {
    params: { categoryName, organizationId, page: pageParam, limit }
  });
  return data; // Expected: { ok, data, pagination: { page, totalPages } }
};


// 🔹 Get Single Document API
export const getMaterialShopDocumentByIdApi = async (id: string, api: AxiosInstance) => {
  const { data } = await api.get(`/materialshop/document/getsingle/${id}`);
  return data.data; // Returning the document object directly
};


export const getMaterialShopDocumentByIdApiV1 = async ({ categoryId, api }: { categoryId: string, api: AxiosInstance }) => {
  const { data } = await api.get(`/materialshop/document/getsingle/v1/${categoryId}`);
  return data.data; // Returning the document object directly
};


// 🔹 Delete API
export const deleteMaterialShopDocumentApi = async (id: string, api: AxiosInstance) => {
  const { data } = await api.delete(`/materialshop/document/delete/${id}`);
  return data;
};

export const deleteMaterialShopFileApi = async ({
  id,
  fileId,
  api
}: {
  id: string;
  fileId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/materialshop/document/deletefile/${id}/${fileId}`);
  return data;
};

// 🔹 Extract AI Details API
export const extractMaterialShopDocDetailsApi = async (id: string, fileId: string, api: AxiosInstance) => {
  const { data } = await api.put(`/materialshop/document/extract/${id}/${fileId}`);
  return data.data;
};


// 🔹 Extract AI Details API
export const extractMaterialShopDocDetailsApiv1 = async ({ id, fileId, categoryId, organizationId, api }: { id: string, fileId: string, categoryId: string, organizationId: string, api: AxiosInstance }) => {
  const { data } = await api.put(`/materialshop/document/extract/v1/${organizationId}/${categoryId}/${id}/${fileId}`);
  return data.data;
};




const allowedRoles = ["owner", "staff", "CTO"];

// 🔹 1. Hook for Uploading Documents
export const useUploadMaterialShopFiles = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryName, organizationId, files }: { categoryName: string; organizationId: string, files: File[] }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await uploadMaterialShopFilesApi({ categoryName, organizationId, files, api });
    },
    onSuccess: () => {
      // Refetch the infinite list after a new upload
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
    }
  });
};


// 🔹 1. Hook for Uploading Documents
export const useUploadMaterialShopFilesV1 = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryName, organizationId, materialCategoryId, files }: { categoryName: string; organizationId: string, materialCategoryId: string, files: File[] }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await uploadMaterialShopFilesApiv1({ categoryName, materialCategoryId, organizationId, files, api });
    },
    onSuccess: () => {
      // Refetch the infinite list after a new upload
      // queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single"] });
    }
  });
};




export const useUpdateCategoryNameMaterialShopDoc = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, categoryName, organizationId }: { id: string, categoryName: string, organizationId: string }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await updateCategoryMaterialShopDocumentApi({ id, categoryName, api, organizationId });
    },
    onSuccess: (_, { id }) => {
      // Refetch the infinite list after a new upload
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single", id] });

    }
  });
};


export const useUpdateUploadMaterialShopFiles = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ files, categoryId }: { categoryId: string, files: File[] }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await updateUploadMaterialShopFilesApi({ categoryId, files, api });
    },
    onSuccess: (_, { categoryId }) => {
      // Refetch the infinite list after a new upload
      // queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single", categoryId] });

    }
  });
};



// 🔹 2. Hook for Infinite Scroll / Paginated List
export const useGetMaterialShopDocumentInfinite = (organizationId: string, categoryName?: string,) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery({
    queryKey: ["materialShopDoc", "infinite", categoryName],
    queryFn: async ({ pageParam = 1 }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await getAllMaterialShopDocumentsApi({
        api,
        categoryName,
        organizationId,
        pageParam: pageParam as number
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!role && !!api,
  });
};



// 🔹 Hook for Fetching a Single Document
export const useGetMaterialShopDocumentById = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["materialShopDoc", "single", id],
    queryFn: async () => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await getMaterialShopDocumentByIdApi(id, api);
    },
    // Only fetch if we actually have an ID and valid credentials
    enabled: !!id && !!role && !!api,
  });
};




// 🔹 Hook for Fetching a Single Document
export const useGetMaterialShopDocumentByIdV1 = ({ categoryId }: { categoryId: string }) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["materialShopDoc", "single", categoryId],
    queryFn: async () => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await getMaterialShopDocumentByIdApiV1({ categoryId, api });
    },
    enabled: !!categoryId && !!role && !!api,
    retry: false
  });
};


// 🔹 3. Hook for Deleting a Document
export const useDeleteMaterialShopDocument = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async (id: string) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await deleteMaterialShopDocumentApi(id, api);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
    }
  });
};




// 🔹 Hook for AI Extraction
export const useExtractMaterialShopDocDetails = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, fileId }: { id: string, fileId: string }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await extractMaterialShopDocDetailsApi(id, fileId, api);
    },
    onSuccess: (_, id) => {
      // Invalidate the single document query to refresh the UI with extracted data
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single", id] });
      // Also invalidate the infinite list if the extraction status is visible there
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
    }
  });
};


export const useDeleteMaterialShopFile = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, fileId }: { id: string; fileId: string; }) => {
      if (!api) throw new Error("API instance not found");
      return await deleteMaterialShopFileApi({ id, fileId, api });
    },
    onSuccess: () => {
      // Refresh the specific category view to show the updated file list
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single"] });
    }
  });
};





// 🔹 Hook for AI Extraction
export const useExtractMaterialShopDocDetailsV1 = () => {
  const queryClient = useQueryClient();
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, organizationId, categoryId, fileId }: { id: string, organizationId: string, categoryId: string, fileId: string }) => {
      // Strict Role Checks
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await extractMaterialShopDocDetailsApiv1({ id, organizationId, categoryId, fileId, api });
    },
    onSuccess: (_, {id, categoryId}) => {
      // Invalidate the single document query to refresh the UI with extracted data
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "single", id] });
      // Also invalidate the infinite list if the extraction status is visible there
      queryClient.invalidateQueries({ queryKey: ["materialShopDoc", "infinite"] });
      queryClient.invalidateQueries({queryKey: ["rateconfig", "items", categoryId]});

    }
  });
};