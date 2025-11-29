import axios, { type AxiosInstance } from "axios";


import { useMutation, useQuery } from '@tanstack/react-query';
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";


// // 1. Create Vehicle
// export const createVehicle = async ({
//   payload,
//   organizationId,
//   api
// }: {
//   payload: any;
//   organizationId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/department/logistics/vehicle/create/${organizationId}`, payload);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // 2. Update Vehicle
// export const updateVehicle = async ({
//   vehicleId,
//   organizationId,
//   payload,
//   api
// }: {
//   vehicleId: string;
//   organizationId: string;
//   payload: any;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/department/logistics/vehicle/update/${vehicleId}/${organizationId}`, payload);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // 3. Delete Vehicle
// export const deleteVehicle = async ({
//   vehicleId,
//   organizationId,
//   api
// }: {
//   vehicleId: string;
//   organizationId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.delete(`/department/logistics/vehicle/delete/${vehicleId}/${organizationId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.message;
// };

// // 4. Get Vehicles by Org
// export const getVehicles = async ({
//   organizationId,
//   api
// }: {
//   organizationId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.get(`/department/logistics/vehicle/getvehicle/${organizationId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// 5. Create Shipment
export const createShipment = async ({
  projectId,
  organizationId,
  payload,
  projectName,
  api
}: {
  projectId: string;
  organizationId: string;
  payload: any;
  projectName: string,
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/department/logistics/shipment/create/${projectId}/${organizationId}/${projectName}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 6. Update Shipment
export const updateShipment = async ({
  projectId,
  organizationId,
  shipmentId,
  payload,
  api
}: {
  projectId: string;
  organizationId: string;
  shipmentId: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/logistics/shipment/update/${projectId}/${organizationId}/${shipmentId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 7. Delete Shipment
export const deleteShipment = async ({
  shipmentId,
  organizationId,
  api
}: {
  shipmentId: string;
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/department/logistics/shipment/delete/${organizationId}/${shipmentId}`);
  if (!data.ok) throw new Error(data.message);
  return data.message;
};

// 8. Get Shipments
export const getShipments = async ({
  api,
  organizationId,
  status,
  projectId,
  scheduledDate,
}: {
  api: AxiosInstance;
  organizationId: string,
  status?: string;
  projectId?: string;
  scheduledDate?: string;
}) => {
  const params = new URLSearchParams({ organizationId });

  if (status) params.append("status", status);
  if (projectId) params.append("projectId", projectId);
  if (scheduledDate) params.append("scheduledDate", scheduledDate);

  const { data } = await api.get(`/department/logistics/shipment/getshipment?${params.toString()}`);
  if (!data.ok) throw new Error(data.message);
  return data?.data;
};



// 8. Get Shipments
export const getSingleShipment = async ({
  api,
  shipmentId
}: {
  api: AxiosInstance;
  shipmentId: string
}) => {
  const { data } = await api.get(`/department/logistics/shipment/getsingle/${shipmentId}`);
  if (!data.ok) throw new Error(data.message);
  return data?.data;
};



// LIVE TRACKING API

// ============================================
// 🚀 WITHOUT AUTH - Update Driver Location
// ============================================
const updateDriverLocation = async ({
  shipmentId,
  latitude,
  longitude
}: {
  shipmentId: string;
  latitude: number;
  longitude: number;
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/department/logistics/shipment/${shipmentId}/update-location`,
    { latitude, longitude }
  );
  if (!response.data.ok) throw new Error(response.data.message);
  return response.data.data;
};


const startTracking = async ({ shipmentId }: { shipmentId: string }) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/department/logistics/shipment/${shipmentId}/start-tracking`
  );
  if (!response.data.ok) throw new Error(response.data.message);
  return response.data.data;
};



const getActiveShipmentsWithLocation = async ({
  organizationId,
  projectId,
  api
}: {
  organizationId: string;
  projectId?: string;
  api: AxiosInstance;
}) => {
  const params = new URLSearchParams({ organizationId });
  if (projectId) params.append('projectId', projectId);

  const { data } = await api.get(
    `/department/logistics/shipment/active-with-location?${params.toString()}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const getShipmentRouteHistory = async ({
  shipmentId,
  api
}: {
  shipmentId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(
    `/department/logistics/shipment/${shipmentId}/route-history`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const allowedRoles = ["owner", "CTO", "staff"];

// export const useCreateVehicle = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   return useMutation({
//     mutationFn: async ({ organizationId, payload }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//          if (!api) throw new Error("API instance not found for role");
//       return await createVehicle({ organizationId, payload, api });
//     },
//     onSuccess: () => {
//       // can refresh relevant queries
//       console.log("Vehicle created");
//     }
//   });
// };

// export const useUpdateVehicle = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   return useMutation({
//     mutationFn: async ({ vehicleId, organizationId, payload }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//          if (!api) throw new Error("API instance not found for role");
//       return await updateVehicle({ vehicleId, organizationId, payload, api });
//     },
//     onSuccess: () => {
//       console.log("Vehicle updated");
//     },
//   });
// };

// export const useDeleteVehicle = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   return useMutation({
//     mutationFn: async ({ vehicleId, organizationId }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//          if (!api) throw new Error("API instance not found for role");
//       return await deleteVehicle({ vehicleId, organizationId, api });
//     },
//     onSuccess: () => {
//       console.log("Vehicle deleted");
//     }
//   });
// };

// export const useGetVehicles = (organizationId: string) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   return useQuery({
//     queryKey: ['logistics', 'vehicles', organizationId],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//          if (!api) throw new Error("API instance not found for role");
//       return await getVehicles({ organizationId, api });
//     },
//     enabled: !!organizationId
//   });
// };

export const useCreateShipment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ projectId, organizationId, payload, projectName }: { projectId: string, organizationId: string, payload: any, projectName: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await createShipment({ projectId, organizationId, payload, projectName, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })
    }
  });
};

export const useUpdateShipment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ projectId, organizationId, shipmentId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await updateShipment({ projectId, organizationId, shipmentId, payload, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })

    }

  });
};

export const useDeleteShipment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ organizationId, shipmentId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await deleteShipment({ shipmentId, organizationId, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })
    }
  });
};

export const useGetShipments = (organizationId: string, filters?: { status?: string; projectId?: string; scheduledDate?: string }) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ['logistics', 'shipments', filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getShipments({
        api, organizationId,
        status: filters?.status,
        projectId: filters?.projectId,
        scheduledDate: filters?.scheduledDate,
      });
    },
    retry: false,
    enabled: !!organizationId,
  });
};


export const useGetSinglShipment = (shipmentId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ['logistics', 'single'],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleShipment({ api, shipmentId });
    },
    retry: false,
    enabled: !!shipmentId,
  });
};






export interface IAccountsEntry {
  organizationId: string;
  projectId: string;
  fromDept: "logistics" | "procurement" | "hr" | "factory" ;
  totalCost: number;
  upiId: string | null
  api?: AxiosInstance
}

export const useSyncAccountsLogistics = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ organizationId, projectId, fromDept, totalCost , upiId}: IAccountsEntry) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await synAccountsFromLogistics({ organizationId, projectId, fromDept, totalCost, api, upiId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })
    }
  });
};


const synAccountsFromLogistics = async ({
  api,
  organizationId,
  projectId,
  fromDept,
  totalCost,
  upiId
}: IAccountsEntry) => {
  const { data } = await api!.post(`/department/logistics/syncaccounting/${organizationId}/${projectId}`, {totalCost, fromDept, upiId});
  return data;
}



// LIVE TRACKING HOOKS


export const useUpdateDriverLocation = () => {
  return useMutation({
    mutationFn: async ({ 
      shipmentId, 
      latitude, 
      longitude 
    }: { 
      shipmentId: string; 
      latitude: number; 
      longitude: number;
    }) => {
      return await updateDriverLocation({ shipmentId, latitude, longitude });
    },
    onSuccess: (_data, variables) => {
      // Invalidate active shipments query to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['logistics', 'active-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipment', variables.shipmentId] });
    }
  });
};



export const useStartTracking = () => {
  return useMutation({
    mutationFn: async ({ shipmentId }: { shipmentId: string }) => {
      return await startTracking({ shipmentId });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'active-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipment', variables.shipmentId] });
    }
  });
};







export const useGetActiveShipmentsWithLocation = ({
  organizationId,
  projectId,
  enabled = true
}: {
  organizationId: string;
  projectId?: string;
  enabled?: boolean;
}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ['logistics', 'active-shipments', organizationId, projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getActiveShipmentsWithLocation({ organizationId, projectId, api });
    },
    enabled: enabled && !!organizationId && !!role && allowedRoles.includes(role),
    refetchOnMount: true,
  });
};


// ============================================
// ✅ WITH AUTH - Get Shipment Route History
// ============================================

export const useGetShipmentRouteHistory = ({
  shipmentId,
  enabled = true
}: {
  shipmentId: string;
  enabled?: boolean;
}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ['logistics', 'shipment-route', shipmentId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getShipmentRouteHistory({ shipmentId, api });
    },
    enabled: enabled && !!shipmentId && !!role && allowedRoles.includes(role),
    refetchOnMount: false,
    });
};




// ============================================
// 🚀 PUBLIC - Get Shipment by Token (Driver Tracking)
// ============================================
const getShipmentByToken = async ({ token }: { token: string }) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/department/logistics/track/${token}`
  );
  if (!response.data.ok) throw new Error(response.data.message);
  return response.data.data;
};

export const useGetShipmentByToken = (token: string) => {
  return useQuery({
    queryKey: ['logistics', 'driver-tracking', token],
    queryFn: () => getShipmentByToken({ token }),
    enabled: !!token, // Only fetch if token exists
    retry: 1, // Only retry once if failed
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};