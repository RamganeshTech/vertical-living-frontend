import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const BASE_URL = "https://houseofram.in/";

export const useGetOrgTransactions = (organizationId: string, filters: any) => {
  return useQuery({
    // queryKey: ['publicTransactions', organizationId],
    queryKey: ['publicTransactions', organizationId, filters],
    queryFn: async () => {
      // Build query string dynamically
      const params = new URLSearchParams({
        organizationId,
        search: filters.search || '',
        status: filters.status || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
      });

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/public/transaction/getall?${params.toString()}`);
      return data.data; // Returns the array of transactions
    },
    enabled: !!organizationId, // Only run if ID exists
  });
};