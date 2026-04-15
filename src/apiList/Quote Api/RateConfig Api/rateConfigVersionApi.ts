import { useInfiniteQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
// Adjust these imports based on your file structure

// --- API Function ---
export const getAllItemVersionsApi = async ({
  organizationId,
  itemId,
  categoryId,
  page = 1,
  limit = 10,
  api
}: {
  organizationId: string;
  itemId?: string;
  categoryId?: string;
  page: number;
  limit: number;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/quote/rateconfig/version/get-all`, {
    params: {
      organizationId,
      itemId,
      categoryId,
      page,
      limit,
    }
  });
  if (!data.ok) throw new Error(data.message);
  return data.data; // Returning the nested data { versions, pagination }
};

const allowedRoles = ["owner", "staff", "CTO"];

// --- React Query Hook ---
export const useGetAllItemVersions = ({
  organizationId,
  itemId,
  categoryId,
  limit = 10,
}: {
  organizationId?: string;
  itemId?: string;
  categoryId?: string;
  limit?: number;
}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery({
    queryKey: ["itemVersions", organizationId, itemId, categoryId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await getAllItemVersionsApi({
        organizationId: organizationId!,
        itemId,
        categoryId,
        page: pageParam,
        limit,
        api
      });
    },
    getNextPageParam: (lastPage) => {
      // Check if we have more pages
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!role && allowedRoles.includes(role) && !!organizationId
  });
};