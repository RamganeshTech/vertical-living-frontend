import { type AxiosInstance } from "axios";


import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";


// 1️⃣ Upload Reference Designs
export const uploadReferenceDesigns = async ({
  organizationId,
  formData,
  api,
}: {
  organizationId: string;
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(
    `/shortlist/referencedesign/${organizationId}/uploaddesign`,
    formData
  );
  if (!data.ok) throw new Error(data.message);
  return data;
};

// 2️⃣ Get Reference Designs
export const getReferenceDesigns = async ({
  organizationId,
  api,
  search
}: {
  organizationId: string;
  api: AxiosInstance;
  search?:string,
}) => {
  const { data } = await api.get(
    `/shortlist/referencedesign/getdesigns/${organizationId}`,
    { params: { search } }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// 2️⃣ Get Reference Designs
export const udpateReferenceImgTag = async ({
  organizationId,
  api,
  imageId,
  tags
}: {
  organizationId: string;
  api: AxiosInstance;
  imageId:string,
  tags:string[],
}) => {
  const { data } = await api.patch(
    `/shortlist/referencedesign/updatetag/${organizationId}/${imageId}`,
    { tags }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// 3️⃣ Delete Reference Design
export const deleteReferenceDesign = async ({
  organizationId,
  imageId,
  api,
}: {
  organizationId: string;
  imageId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/shortlist/referencedesign/deletedesign/${organizationId}/${imageId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data;
};


// 1️⃣ Upload New Reference Designs
export const useUploadReferenceDesigns = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      formData,
    }: {
      organizationId: string;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await uploadReferenceDesigns({ organizationId, formData, api });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["referenceDesigns", organizationId],
      });
    },
  });
};

// 2️⃣ Get Reference Designs
export const useGetReferenceDesigns = ({ organizationId, search }: { organizationId: string , search?:string}) => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  console.log("search", search)

  return useQuery({
    queryKey: ["referenceDesigns", organizationId, search],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await getReferenceDesigns({ organizationId, api , search});
    },
    enabled: !!organizationId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};




// 3️⃣ update tag of  Reference Design
export const useUpdateReferenceImageTag = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      imageId,
      tags
    }: {
      organizationId: string;
      imageId: string;
      tags: string[]
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await udpateReferenceImgTag({ organizationId, imageId, tags, api });
    },
    // onSuccess: (_, { organizationId }) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["referenceDesigns", organizationId],
      // });
    // },
  });
};





// 3️⃣ Delete Reference Design
export const useDeleteReferenceDesign = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      imageId,
    }: {
      organizationId: string;
      imageId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await deleteReferenceDesign({ organizationId, imageId, api });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["referenceDesigns", organizationId],
      });
    },
  });
};
