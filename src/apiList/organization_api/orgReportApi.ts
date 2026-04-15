import { type AxiosInstance } from "axios";


import { useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";


// Interface for the date filters
interface DateFilters {
  startDate?: string;
  endDate?: string;
}


// Fetch Ordering/Procurement Report
const fetchOrgOrderingReport = async (organizationId: string, api: AxiosInstance, filters?: DateFilters) => {
  // const { data } = await api.get(`/orgs/reports/get/order-material/${organizationId}`);
  // if (!data.ok) return null;
  // return data.data;

  // Construct query parameters dynamically
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString();
  const url = `/orgs/reports/get/order-material/${organizationId}${queryString ? `?${queryString}` : ''}`;

  const { data } = await api.get(url);
  if (!data.ok) return null;
  return data.data;
};


// Fetch Ordering Trend Report (Time-Series Data)
const fetchOrgOrderingTrend = async (organizationId: string, api: AxiosInstance, filters?: any) => {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString();
  const { data } = await api.get(`/orgs/reports/get/order-material-line-chart/${organizationId}${queryString ? `?${queryString}` : ''}`);
  if (!data.ok) return [];
  return data.data; // This is now an array: [{ date: '...', sent: 2, pending: 5, drafts: 1 }, ...]
};

// Fetch Material Arrival/Inventory Report
const fetchOrgArrivalReport = async (organizationId: string, api: AxiosInstance, filters?:any) => {

   const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString();

  const { data } = await api.get(`/orgs/reports/get/material-arrival/${organizationId}${queryString ? `?${queryString}` : ''}`);
  if (!data.ok) return null;
  return data.data;
};

const fetchOrgProjectsReport = async (
  organizationId: string,
  api: AxiosInstance,
  filters: { status?: string; priority?: string; completion?: string }
) => {
  const { data } = await api.get(`/orgs/reports/get/projects/${organizationId}`, {
    params: filters,
  });
  if (!data.ok) return null;
  return data.data;
};




/**
 * Hook to get the Ordering and Procurement Sync report
 */
export const useGetOrgOrderingReport = (organizationId: string, filters?: DateFilters) => {
  const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["org-report-ordering", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      if (!organizationId) return null;

      return await fetchOrgOrderingReport(organizationId, api, filters);
    },
    enabled: !!organizationId && !!role,
    refetchOnWindowFocus: false,
    retry: false,
  });
};



export const useGetOrgOrderingTrend = (organizationId: string, filters?: any) => {
  const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["org-report-ordering-trend", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("No API instance");
      if (!organizationId) return [];
      return await fetchOrgOrderingTrend(organizationId, api, filters);
    },
    enabled: !!organizationId && !!role,
    refetchOnWindowFocus: false,
  });
};


// Fetch Trend Report (For Line Chart)
export const useGetOrgArrivalTrend = (organizationId: string, filters?: any) => {
  const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["org-arrival-trend", organizationId, filters],
    queryFn: async () => {
       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("No API instance");
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/orgs/reports/get/material-arrival-line-chart/${organizationId}?${params}`);
      return data.data;
    },
    enabled: !!organizationId
  });
};

/**
 * Hook to get the Material Arrival and Verification report
 */
export const useGetOrgArrivalReport = (organizationId: string, filters?: any) => {
  const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["org-report-arrival", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      if (!organizationId) return null;

      return await fetchOrgArrivalReport(organizationId, api, filters);
    },
    enabled: !!organizationId && !!role,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Hook to get the Projects Progress Report
 */
export const useGetOrgProjectsReport = (
  organizationId: string,
  filters: { status?: string; priority?: string; completion?: string } = {}
) => {
  const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["org-report-projects", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");
      if (!organizationId) return null;

      return await fetchOrgProjectsReport(organizationId, api, filters);
    },
    enabled: !!organizationId && !!role,
    refetchOnWindowFocus: false,
    retry: false,
  });
};