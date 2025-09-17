// // src/api/shortlistedDesigns.ts
// import { type AxiosInstance } from "axios";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import useGetRole from "../../Hooks/useGetRole";
// import { getApiForRole } from "../../utils/roleCheck";
// import { queryClient } from "../../QueryClient/queryClient";

import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";

// export const uploadShortlistedDesigns = async ({
//   projectId,
//   roomName,
//   categoryName,
//   categoryId,
//   formData,
//   api,
// }: {
//   projectId: string;
//   roomName: string;
//   categoryName: string;
//   categoryId: string;
//   formData: FormData;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/shortlisteddesign/upload/${projectId}/${roomName}/${categoryName}/${categoryId}`, formData);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const addExistingDesignsToShortlist = async ({
//   projectId,
//   roomName,
//   categoryName,
//   categoryId,
//   selectedImages,
//   api,
// }: {
//   projectId: string;
//   roomName: string;
//   categoryName: string;
//   categoryId: string;
//   selectedImages: {url:string, type:string, _id:string, originalName:string}[];
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/shortlisteddesign/addexising/${projectId}/${roomName}/${categoryName}/${categoryId}`, { selectedImages });
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const getShortlistedRoomDesigns = async ({
//   projectId,
//   roomName,
//   api,
// }: {
//   projectId: string;
//   roomName: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.get(`/shortlisteddesign/getroom/${projectId}/${roomName}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// export const removeShortlistedDesign = async ({
//   projectId,
//   roomName,
//   categoryId,
//   fileId,
//   api,
// }: {
//   projectId: string;
//   roomName: string;
//   categoryId: string;
//   fileId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.delete(`/shortlisteddesign/remove/${projectId}/${roomName}/${fileId}/${categoryId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };







//   // 1️⃣ Upload New Images
//   export const useUploadShortlistedDesigns = () => {
//     const allowedRoles = ["owner", "staff", "CTO"];
//     const { role } = useGetRole();
//     const api = getApiForRole(role!);

//     return useMutation({
//       mutationFn: async ({
//         projectId,
//         roomName,
//         categoryName,
//         categoryId,
//         formData,
//       }: {
//         projectId: string;
//         roomName: string;
//         categoryName: string;
//         categoryId: string;
//         formData: FormData;
//       }) => {
//         if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//         if (!api) throw new Error("API instance missing");
//         return await uploadShortlistedDesigns({ projectId, roomName, categoryName, categoryId, formData, api });
//       },
//       onSuccess: (_, { projectId, roomName }) => {
//         queryClient.invalidateQueries({ queryKey: ["shortlistedRoomDesigns", projectId, roomName] });
//       },
//     });
//   };

// // 2️⃣ Add Existing Images
// export const useAddExistingShortlistedDesigns = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomName,
//       categoryId,
//       categoryName,
//       selectedImages,
//     }: {
//       projectId: string;
//       roomName: string;
//       categoryName: string;
//       categoryId: string;
//       selectedImages: {url:string, type:string, _id:string, originalName:string}[];
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance missing");
//       return await addExistingDesignsToShortlist({ projectId, roomName, categoryName, categoryId, selectedImages, api });
//     },
//     onSuccess: (_, { projectId, roomName }) => {
//       queryClient.invalidateQueries({ queryKey: ["shortlistedRoomDesigns", projectId, roomName] });
//     },
//   });
// };

// // 3️⃣ Get Designs Per Room
// export const useGetShortlistedRoomDesigns = ({
//   projectId,
//   roomName,
// }: {
//   projectId: string;
//   roomName: string;
// }) => {
//   const allowedRoles = ["owner", "staff", "CTO", "client"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["shortlistedRoomDesigns", projectId, roomName],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance missing");
//       return await getShortlistedRoomDesigns({ projectId, roomName, api });
//     },
//     enabled: !!projectId && !!roomName,
//     retry: false,
//     refetchOnWindowFocus: false,
//   });
// };

// // 4️⃣ Remove Image
// export const useRemoveShortlistedDesign = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomName,
//       categoryId,
//       fileId,
//     }: {
//       projectId: string;
//       roomName: string;
//       categoryId: string;
//       fileId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance missing");
//       return await removeShortlistedDesign({ projectId, roomName,  categoryId ,fileId, api });
//     },
//     onSuccess: (_, { projectId, roomName }) => {
//       queryClient.invalidateQueries({ queryKey: ["shortlistedRoomDesigns", projectId, roomName] });
//     },
//   });
// };




// SECOND VERSION

export const getShortlistedDesigns = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/shortlisteddesign/getshortlisteddesigns/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ React Query hook


// ✅ API function
export const uploadShortlistedDesigns = async ({
  projectId,
  selections,
  api,
}: {
  projectId: string;
  selections: any[];
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/shortlisteddesign/upload/${projectId}`, { selections });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// ✅ API function
export const getAllSiteImages = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/shortlisteddesign/getsiteimages/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetShortlistedDesigns = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["shortlistedDesigns", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getShortlistedDesigns({ projectId, api });
    },
    enabled: !!projectId && !!role,
  });
};


export const useUploadShortlistedDesigns = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId, selections }: { projectId: string; selections: any[] }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await uploadShortlistedDesigns({ projectId, selections, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["shortlistedDesigns", projectId] });
    },
  });
};



export const useGetAllSiteImages = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["siteImages", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getAllSiteImages({ projectId, api });
    },
    enabled: !!projectId && !!role,
  });
};


