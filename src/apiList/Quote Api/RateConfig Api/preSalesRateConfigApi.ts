import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

// 6. Update Item
const updateItem = async ({
  api,
  itemId,
  manufacturCostPerSqft
}: {
  api: AxiosInstance;
  itemId: string;
  manufacturCostPerSqft: number;
}) => {
  const { data } = await api.put(`/quote/presales/rateconfig/items/${itemId}`, { manufacturCostPerSqft });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


//  not used anywhere
export const useUpdatePreSalesRateConfigItem = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ itemId, manufacturCostPerSqft }: { itemId: string; manufacturCostPerSqft: number; categoryId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateItem({ api, itemId, manufacturCostPerSqft });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};





const updateRateConfigCategory = async ({
  api,
  categoryId,
  organizationId,
  name,
  fields,
  isProductSpecific
}: {
  api: AxiosInstance;
  categoryId: string,
  organizationId: string,
  name: string,
  fields: any,
  isProductSpecific: boolean
}) => {
  const { data } = await api.put(`/quote/rateconfig/categories/update/${organizationId}/${categoryId}`, { name, fields ,isProductSpecific});
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useUpdateRateConfigCategory = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ categoryId,
      organizationId,
      name,
      fields,
      isProductSpecific
    }: {
      categoryId: string,
      organizationId: string,
      name: string,
      fields: any
      isProductSpecific: boolean
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      return await updateRateConfigCategory({
        api, categoryId,
        organizationId,
        name,
        fields,
        isProductSpecific
      });
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["rateconfig", "items", categoryId] });
    },
  });
};
