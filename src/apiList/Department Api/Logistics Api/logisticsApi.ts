import { type AxiosInstance } from "axios";


import { useMutation, useQuery } from '@tanstack/react-query';
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";


// 1. Create Vehicle
export const createVehicle = async ({
  payload,
  organizationId,
  api
}: {
  payload: any;
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/department/logistics/vehicle/create/${organizationId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 2. Update Vehicle
export const updateVehicle = async ({
  vehicleId,
  organizationId,
  payload,
  api
}: {
  vehicleId: string;
  organizationId: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/logistics/vehicle/update/${vehicleId}/${organizationId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 3. Delete Vehicle
export const deleteVehicle = async ({
  vehicleId,
  organizationId,
  api
}: {
  vehicleId: string;
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/department/logistics/vehicle/delete/${vehicleId}/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.message;
};

// 4. Get Vehicles by Org
export const getVehicles = async ({
  organizationId,
  api
}: {
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/logistics/vehicle/getvehicle/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

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
  organizationId
}: {
  api: AxiosInstance;
  organizationId:string
}) => {
  const { data } = await api.get(`/department/logistics/shipment/getshipment?organizationId=${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data?.data;
};



const allowedRoles = ["owner", "CTO", "staff"];

export const useCreateVehicle = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ organizationId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await createVehicle({ organizationId, payload, api });
    },
    onSuccess: () => {
      // can refresh relevant queries
      console.log("Vehicle created");
    }
  });
};

export const useUpdateVehicle = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ vehicleId, organizationId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await updateVehicle({ vehicleId, organizationId, payload, api });
    },
    onSuccess: () => {
      console.log("Vehicle updated");
    },
  });
};

export const useDeleteVehicle = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ vehicleId, organizationId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await deleteVehicle({ vehicleId, organizationId, api });
    },
    onSuccess: () => {
      console.log("Vehicle deleted");
    }
  });
};

export const useGetVehicles = (organizationId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ['logistics', 'vehicles', organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await getVehicles({ organizationId, api });
    },
    enabled: !!organizationId
  });
};

export const useCreateShipment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ projectId, organizationId, payload, projectName }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await createShipment({ projectId, organizationId, payload, projectName, api });
    },
    onSuccess: () => {
      console.log("Shipment created");
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
      console.log("Shipment updated");
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
      console.log("Shipment deleted");
    }
  });
};

export const useGetShipments = (organizationId:string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ['logistics', 'shipments'],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
         if (!api) throw new Error("API instance not found for role");
      return await getShipments({ api , organizationId});
    },
    retry:false,
    enabled: !!organizationId,
  });
};