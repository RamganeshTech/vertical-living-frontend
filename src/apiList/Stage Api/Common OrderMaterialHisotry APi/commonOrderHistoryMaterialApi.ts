import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

// ------------------- API FUNCTIONS -------------------

export const createCommonProjectApi = async (
  organizationId: string,
  payload: { projectName: string },
  api: AxiosInstance
) => {
  const { data } = await api.post(`/commonorder/createcommonproject/${organizationId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const editCommonProjectApi = async (
  id: string,
  payload: { projectName: string },
  api: AxiosInstance
) => {
  const { data } = await api.put(`/commonorder/editcommonproject/${id}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const deleteCommonProjectApi = async (
  id: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/commonorder/deletecommonproject/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.message;
};

// export const createCommonUnitApi = async (
//   id: string,
//   payload: { unitName: string; quantity: number; singleUnitCost: number },
//   api: AxiosInstance
// ) => {
//   const { data } = await api.post(`/commonorder/createcommonorder/${id}/units`, payload);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const editCommonUnitApi = async (
//   id: string,
//   unitId: string,
//   payload: { unitName: string; quantity: number; singleUnitCost: number },
//   api: AxiosInstance
// ) => {
//   const { data } = await api.put(`/commonorder/${id}/editcommonorder/${unitId}`, payload);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const deleteCommonUnitApi = async (
//   id: string,
//   unitId: string,
//   api: AxiosInstance
// ) => {
//   const { data } = await api.delete(`/commonorder/${id}/deletecommonorder/${unitId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// ------------------- REACT QUERY HOOKS -------------------

export const useCreateCommonProject = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, payload }: { organizationId: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not available");
      return await createCommonProjectApi(organizationId, payload, api);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["common-order-history"] });
    },
  });
};

export const useEditCommonProject = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not available");
      return await editCommonProjectApi(id, payload, api);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-history", id] });
    },
  });
};

export const useDeleteCommonProject = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not available");
      return await deleteCommonProjectApi(id, api);
    },
    onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-history", id] });
    },
  });
};

// export const useCreateCommonUnit = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: { unitName: string; quantity: number; singleUnitCost: number };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API not available");
//       return await createCommonUnitApi(id, payload, api);
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };

// export const useEditCommonUnit = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       id,
//       unitId,
//       payload,
//     }: {
//       id: string;
//       unitId: string;
//       payload: { unitName: string; quantity: number; singleUnitCost: number };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API not available");
//       return await editCommonUnitApi(id, unitId, payload, api);
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };

// export const useDeleteCommonUnit = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, unitId }: { id: string; unitId: string }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API not available");
//       return await deleteCommonUnitApi(id, unitId, api);
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };

// ------------------- Fetch full order -------------------

export const getCommonOrderHistoryApi = async ({ organizationId, api }: { organizationId: string; api: AxiosInstance }) => {
  const { data } = await api.get(`/commonorder/getalldetails/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetCommonOrderHistory = (organizationId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["common-order-history", organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not available");
      return await getCommonOrderHistoryApi({ organizationId, api });
    },
    enabled: !!role && !!organizationId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};



export const getSingleCommonOrder = async ({ id, api }: { id: string; api: AxiosInstance }) => {
  const { data } = await api.get(`/commonorder/getsingleproject/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetSingleCommonOrder = (id: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["common-order-single", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not available");
      return await getSingleCommonOrder({ id, api });
    },
    enabled: !!role && !!id && !!api,
    retry: false,
    refetchOnMount: false,
  });
};






const updateDeliveryLocationApi = async (
  id: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/commonorder/${id}/delivery-location`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateCommonOrderDeliveryLocation = () => {
  const allowedRoles = ["owner", "staff", "CTO"]

  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: {id:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update delivery location");
      if (!api) throw new Error("API instance not available");
      return await updateDeliveryLocationApi(id, updates, api);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};




const updateShopDetailsApi = async (
  id: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/commonorder/${id}/shop`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateCommonOrderShopDetails = () => {
  const allowedRoles = ["owner", "staff", "CTO"];

  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: {id:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update shop details");
      if (!api) throw new Error("API instance not available");
      return await updateShopDetailsApi(id, updates, api);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};



// SUB ITEMS HOOKS

// ✅ Add SubItem
// const addOrderingMaterialSubItemApi = async ({
//   id,
//   unitId,
//   subItemName,
//   quantity,
//   unit,
//   api,
// }: {
//   id: string;
//   unitId: string;
//   subItemName: string;
//   quantity: number;
//   unit: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(
//     `/commonorder/${id}/unit/${unitId}/addsubitem`,
//     { subItemName, quantity, unit }
//   );
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const useAddCommonOrderMaterialSubItem = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       id,
//       unitId,
//       subItemName,
//       quantity,
//       unit,
//     }: {
//       id: string;
//       unitId: string;
//       subItemName: string;
//       quantity: number;
//       unit: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
//       if (!api) throw new Error("API instance missing");
//       return await addOrderingMaterialSubItemApi({ id, unitId, subItemName, quantity, unit, api });
//     },
//     onSuccess: (_, vars) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
//     },
//   });
// };

// // ✅ Delete SubItem
// const deleteOrderingMaterialSubItemApi = async ({
//   id,
//   unitId,
//   subItemId,
//   api,
// }: {
//   id: string;
//   unitId: string;
//   subItemId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.delete(
//     `/commonorder/${id}/unit/${unitId}/deletesubitem/${subItemId}`
//   );
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const useDeleteCommonOrderMaterialSubItem = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       id,
//       unitId,
//       subItemId,
//     }: {
//       id: string;
//       unitId: string;
//       subItemId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
//       if (!api) throw new Error("API instance missing");
//       return await deleteOrderingMaterialSubItemApi({ id, unitId, subItemId, api });
//     },
//     onSuccess: (_, vars) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
//     },
//   });
// };

// // ✅ Update SubItem
// const updateOrderingMaterialSubItemApi = async ({
//   id,
//   unitId,
//   subItemId,
//   subItemName,
//   quantity,
//   unit,
//   api,
// }: {
//   id: string;
//   unitId: string;
//   subItemId: string;
//   subItemName?: string;
//   quantity?: number;
//   unit?: string;
//   api: AxiosInstance;
// }) => {


//     // console.log("subitem", subItemName)
//     // console.log("quantity", quantity)
//     // console.log("unit", unit)
//   const { data } = await api.put(
//     `/commonorder/${id}/unit/${unitId}/updatesubitem/${subItemId}`,
//     { subItemName, quantity, unit }
//   );
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const useUpdateCommonOrderMaterialSubItem = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       id,
//       unitId,
//       subItemId,
//       subItemName,
//       quantity,
//       unit,
//     }: {
//       id: string;
//       unitId: string;
//       subItemId: string;
//       subItemName?: string;
//       quantity?: number;
//       unit?: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
//       if (!api) throw new Error("API instance missing");
//       return await updateOrderingMaterialSubItemApi({
//         id,
//         unitId,
//         subItemId,
//         subItemName,
//         quantity,
//         unit,
//         api,
//       });
//     },
//     onSuccess: (_, vars) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
//     },
//   });
// };



// completion status



// ✅ 11. Complete Stage
const completeOrderMaterialHistoryStageApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/commonorder/completionstatus/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useCompleteCommonOrderMaterialHistoryStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeOrderMaterialHistoryStageApi({ id, api });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};

//  GENERATE PDF 

// const deleteOrderPdf = async (
//   id: string,
//   pdfId: string,
//   api: AxiosInstance
// ) => {
//   const { data } = await api.delete(`/commonorder/delete/${id}/${pdfId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };



// export const useDeleteCommonOrderMaterialPdf = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];

//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, pdfId }: {id:string, pdfId: string,}) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
//       if (!api) throw new Error("API instance not available");
//       return await deleteOrderPdf(id, pdfId, api);
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };







// const generatedPublicLink = async ({
//   id,
//   api,
// }: {
//   id: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.patch(`/commonorder/generatelink/${id}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };


// export const useCommonOrderMaterialGenerateLink = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ id }: { id: string }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
//       if (!api) throw new Error("API instance missing");
//       return await generatedPublicLink({ id, api });
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };






// const updateCommonPdfStatus = async ({
//   id,
//   pdfId,
//   status,
//   api,
// }: {
//   id: string;
//   pdfId: string;
//   status: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.patch(`/commonorder/upddatepdfstatus/${id}/${pdfId}`, {status});
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };




// export const useUpdateCommonOrderPdfStatus = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ id , pdfId, status }: { id: string, pdfId:string, status:string }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
//       if (!api) throw new Error("API instance missing");
//       return await updateCommonPdfStatus({ id, pdfId, status, api });
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
//     },
//   });
// };







const getSingleOrderItem = async ({ id,orderItemId, api }: { id: string, orderItemId: string, api: AxiosInstance }) => {
  const { data } = await api.get(`/commonorder/${id}/${orderItemId}/getsingleorderedItem`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
}

export const useGetSingleCommonOrderItem = (id: string, orderItemId:string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"]
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["common-order-single", "order-item", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch ordering material");
      if (!api) throw new Error("API not available");
      return await getSingleOrderItem({ id, api, orderItemId });
    },
    enabled: !!role && !!id && !!api,
    retry: false,
    // refetchOnMount: false,
  });
};


const uploadOrderingMateriaImages = async ({ id, files, api }: { id: string; files: File[]; api: AxiosInstance }) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const { data } = await api.post(`/commonorder/${id}/upload`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useUploadCommonOrderingMaterialImages = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, files }: { id: string, files: File[] }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await uploadOrderingMateriaImages({ id, files, api });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};




const deleteOrderingMaterialImage = async ({
  id,
  imageId,
  api
}: {
  id: string;
  imageId: string;
  api: AxiosInstance
}) => {
  const { data } = await api.delete(`/commonorder/${id}/deleteimage/${imageId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useDeleteCommonOrderMaterialImage = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, imageId }: { id: string, imageId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await deleteOrderingMaterialImage({ id, api, imageId });
    },
     onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};





//  sub item hooks



const addOrderingMaterialSubItemApi = async ({
  id,
  subItemName,
  quantity,
  unit,
  api,
}: {
  id: string;
  subItemName: string;
  quantity: number;
  unit: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(
    `/commonorder/${id}/unit/addsubitem`,
    { subItemName, quantity, unit }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useAddCommonOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      subItemName,
      quantity,
      unit,
    }: {
      id: string;
      subItemName: string;
      quantity: number;
      unit: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await addOrderingMaterialSubItemApi({ id, subItemName, quantity, unit, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
      
    },
  });
};

// ✅ Delete SubItem
const deleteOrderingMaterialSubItemApi = async ({
  id,
  subItemId,
  api,
}: {
  id: string;
  subItemId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/commonorder/${id}/unit/deletesubitem/${subItemId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useDeleteCommonOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      subItemId,
    }: {
      id: string;
      subItemId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await deleteOrderingMaterialSubItemApi({ id, subItemId, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
      
    },
  });
};


const deleteAllSubUnits = async (
  id: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/commonorder/deleteallsubunits/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useCommonOrderDeleteAllSubItems = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await deleteAllSubUnits(id, api);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
     
    },
  });
};

// ✅ Update SubItem
const updateOrderingMaterialSubItemApi = async ({
  id,
  subItemId,
  subItemName,
  quantity,
  unit,
  api,
}: {
  id: string;
  subItemId: string;
  subItemName?: string;
  quantity?: number;
  unit?: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/commonorder/${id}/unit/updatesubitem/${subItemId}`,
    { subItemName, quantity, unit }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateCommonOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      subItemId,
      subItemName,
      quantity,
      unit,
    }: {
      id: string;
      subItemId: string;
      subItemName?: string;
      quantity?: number;
      unit?: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await updateOrderingMaterialSubItemApi({
        id,
        subItemId,
        subItemName,
        quantity,
        unit,
        api,
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", vars.id] });
     
    },
  });
};







const submitOrderMaterial = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/commonorder/${id}/submitorder`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const sendToProcruement = async ({
  id,
  orderItemId, organizationId,
  api,
}: {
  id: string;
  orderItemId: string,
  organizationId: string
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/commonorder/${id}/${orderItemId}/${organizationId}/senttoprocurement`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useCommonOrderHistorySubmitOrder = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await submitOrderMaterial({ id, api, });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};




export const useCommonOrderHistorySendToProcurement = () => {
  const allowedRoles = ["owner", "staff", "CTO","worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, orderItemId, organizationId }: { id: string, orderItemId: string, organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await sendToProcruement({ id, orderItemId, organizationId, api, });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};







const generatedPdfOrderMaterial = async ({
  id,
  organizationId,
  orderItemId,
  api,
}: {
  id: string;
  organizationId: string;
  orderItemId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/commonorder/generatelink/${id}/${organizationId}/${orderItemId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useCommonOrderHistoryGneratePdf = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, organizationId, orderItemId }: { id: string, organizationId: string, orderItemId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generatedPdfOrderMaterial({ id, api, organizationId, orderItemId });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["common-order-single", id] });
    },
  });
};