import { type AxiosInstance } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

const createModularUnitApi = async (
    organizationId: string,
    unitType: string,
    formValues: any,
    files: File[],
    api: AxiosInstance
) => {
    const formData = new FormData();

    // Add fields
    Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== undefined) {
            formData.append(key, formValues[key]);
        }
    });

    // Add multiple images
    files.forEach((file) => {
        formData.append("images", file);
    });

    const { data } = await api.post(`/modularunit/create/${organizationId}/${unitType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const updateModularUnitApi = async (
    unitType: string,
    unitId: string,
    formValues: any,
    files: File[],
    api: AxiosInstance
) => {
    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== undefined) {
            formData.append(key, formValues[key]);
        }
    });

    files.forEach((file) => {
        formData.append("images", file);
    });

    const { data } = await api.put(`/modularunit/update/${unitType}/${unitId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const deleteModularUnitApi = async (
    organizationId: string,
    unitType: string,
    unitId: string,
    api: AxiosInstance
) => {
    const { data } = await api.delete(`/modularunit/delete/${organizationId}/${unitType}/${unitId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getModularUnitsApi = async (
    unitType: string,
    api: AxiosInstance
) => {
    const { data } = await api.get(`/modularunit/getunits/${unitType}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// 📁 src/api/modularUnitApi.ts

const getAllMixedUnitsApi = async (
  organizationId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/modular/getallunits/${organizationId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data; // This will be your mixed units
};







export const useCreateModularUnit = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({
            organizationId,
            unitType,
            formValues,
            files,
        }: {
            organizationId: string;
            unitType: string;
            formValues: any;
            files: File[];
        }) => {
            if (!role) throw new Error("Role missing");
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");
            return await createModularUnitApi(organizationId, unitType, formValues, files, api);
        },
        onSuccess: (_, { unitType }) => {
            queryClient.invalidateQueries({ queryKey: ["modularUnits", unitType] });
        },
    });
};

export const useUpdateModularUnit = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]
    return useMutation({
        mutationFn: async ({
            unitType,
            unitId,
            formValues,
            files,
        }: {
            unitType: string;
            unitId: string;
            formValues: any;
            files: File[];
        }) => {
            if (!role) throw new Error("Role missing");
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");
            return await updateModularUnitApi(unitType, unitId, formValues, files, api);
        },
        onSuccess: (_, { unitType }) => {
            queryClient.invalidateQueries({ queryKey: ["modularUnits", unitType] });
        },
    });
};

export const useDeleteModularUnit = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({
            organizationId,
            unitType,
            unitId,
        }: {
            organizationId: string;
            unitType: string;
            unitId: string;
        }) => {
            if (!role) throw new Error("Role missing");

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await deleteModularUnitApi(unitType, organizationId, unitId, api);
        },
        onSuccess: (_, { unitType }) => {
            queryClient.invalidateQueries({ queryKey: ["modularUnits", unitType] });
        },
    });
};

export const useGetModularUnits = (unitType: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    return useQuery({
        queryKey: ["modularUnits", unitType],
        queryFn: async () => {
            if (!role) throw new Error("Role missing");

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await getModularUnitsApi(unitType, api);
        },
         retry:false,
    refetchOnMount:false
    });
};


export const useGetAllMixedUnits = (organizationId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "client"];

  return useQuery({
    queryKey: ["mixedUnits", organizationId],
    queryFn: async () => {
      if (!role) throw new Error("Role missing");
      if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await getAllMixedUnitsApi(organizationId, api);
    },
    retry:false,
    refetchOnMount:false
  });
};
