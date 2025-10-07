
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";



// SECOND VERSION

 const getShortlistedDesigns = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/detection/getshortlisteddesigns/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ React Query hook


// ✅ API function
 const uploadShortlistedDesigns = async ({
  projectId,
  selections,
  api,
}: {
  projectId: string;
  selections: any[];
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/detection/upload/${projectId}`, { selections });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// ✅ API function
 const getAllSiteImages = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/detection/getsiteimages/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


 const getShortlitedReferenceDesings = async ({
  organizationId,
  api,
  tags
}: {
  organizationId: string;
  api: AxiosInstance;
  tags?: any[]
}) => {
 
  // const { data } = await api.get(`/detection/getreferencedesigns/${organizationId}`, {
  //   params: {
  //     tags: tags ? (tags.length > 0 ? tags : "all") : "all"
  //   }
  // });

  let query = "";
  if (tags && tags.length > 0) {
    const tagParams = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join("&");
    query = `?${tagParams}`;
  } else {
    query = `?tags=all`; // to indicate "show all"
  }

  const { data } = await api.get(`/detection/getreferencedesigns/${organizationId}${query}`);
  
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const deleteOrderPdf = async (
  id: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/detection/deletepdf/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// const getSuggestTags = async (
//   id: string,
//   api: AxiosInstance
// ) => {
//   const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/detection/getsuggestedtags?q=${q}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };


 export const useGetMicaShortlistedDesigns = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["mica-shortlistedDesigns", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getShortlistedDesigns({ projectId, api });
    },
    enabled: !!projectId && !!role,
    retry:false
  });
};


export const useUploadMicaShortlistedDesigns = () => {
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
      queryClient.invalidateQueries({ queryKey: ["mica-shortlistedDesigns", projectId] });
    },
  });
};




export const useDeleteMicaShortListedPdf = () => {
  const allowedRoles = ["owner", "staff", "CTO"];

  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string, projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
      if (!api) throw new Error("API instance not available");
      return await deleteOrderPdf(id, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["mica-shortlistedDesigns", projectId] });
    },
  });
};



export const useGetMicaAllSiteImages = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["mica-siteImages", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getAllSiteImages({ projectId, api });
    },
    enabled: !!projectId && !!role,
    retry:false,
  });
};


export const useGetMicaReferenceDesign = (organizationId: string, tags: string[]) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["mica-reference-shortlist", organizationId, tags],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getShortlitedReferenceDesings({ organizationId, api, tags });
    },
    enabled: !!organizationId && !!role,
    retry:false
  });
};


