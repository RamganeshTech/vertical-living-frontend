import Api from '../apiService/apiService';
import { queryClient } from '../QueryClient/queryClient';
import type { LabourItemType } from './../types/types';
import { useQuery, useMutation } from '@tanstack/react-query';

// ─── CRUD CALLS ────────────────────────────────────────────────────────────

const createLabourList = async ({
    labourListName,
    projectId,
}: {
    labourListName: string;
    projectId: string;
}) => {
    const { data } = await Api.post(
        `labour/createlabourlist/${projectId}`,
        { labourListName }
    );
    if (data.ok) return data;
};

const createLabour = async ({
    labourData,
    projectId,
    labourListId,
}: {
    labourData: LabourItemType;
    projectId: string;
    labourListId: string;
}) => {
    const { data } = await Api.post(
        `labour/createlabour/${projectId}?labourListId=${labourListId}`,
        labourData
    );
    if (data.ok) return data;
};

const getLabourLists = async ({ projectId }: { projectId: string }) => {
    const { data } = await Api.get(`labour/getlabourlist/${projectId}`);
    if (data.ok) return data;
    return []
};

const getLabourItems = async ({ labourListId }: { labourListId: string }) => {
    const { data } = await Api.get(`labour/getlabour/${labourListId}`);
    if (data.ok) return data;
};

const updateLabourList = async ({
    projectId,
    labourListId,
    labourListName,
}: {
    projectId: string;
    labourListId: string;
    labourListName: string;
}) => {
    const { data } = await Api.put(
        `labour/updatelabourlist/${projectId}/${labourListId}`,
        { labourListName }
    );
    if (data.ok) return data;
};

const updateLabourItem = async ({
    labourListId,
    labourItemId,
    labourItem,
}: {
    labourListId: string;
    labourItemId: string;
    labourItem: LabourItemType;
}) => {
    const { data } = await Api.put(
        `labour/updatelabouritem/${labourListId}/${labourItemId}`,
        labourItem
    );
    if (data.ok) return data;
};

const deleteLabourList = async ({
    projectId,
    labourListId,
}: {
    projectId: string;
    labourListId: string;
}) => {
    const { data } = await Api.delete(
        `labour/deletelabourlist/${projectId}/${labourListId}`
    );
    if (data.ok) return data;
};

const deleteLabourItem = async ({
    labourListId,
    labourItemId,
}: {
    labourListId: string;
    labourItemId: string;
}) => {
    const { data } = await Api.delete(
        `labour/deletelabour/${labourListId}/${labourItemId}`
    );
    if (data.ok) return data;
};


export const useGetLabourLists = ({ projectId }: { projectId: string }) =>
  useQuery({
    queryKey: ['labourLists', projectId],
    queryFn: () => getLabourLists({ projectId }),
    retry: false,
    refetchOnWindowFocus: false,
  });


export const useGetLabourItems = ({ labourListId }: { labourListId: string }) =>
  useQuery({
    queryKey: ['labourItems', labourListId],
    queryFn: () => getLabourItems({ labourListId }),
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useCreateLabourList = () =>
    useMutation({
        mutationFn: createLabourList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourLists', variables.projectId],
            });
        },
    });

export const useCreateLabourItem = () =>
    useMutation({
        mutationFn: createLabour,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourItems', variables.labourListId],
            });
        },
    });

export const useUpdateLabourList = () =>
    useMutation({
        mutationFn: updateLabourList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourLists', variables.projectId],
            });
        },
    });

export const useUpdateLabourItem = () =>
    useMutation({
        mutationFn: updateLabourItem,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourItems', variables.labourListId],
            });
        },
    });

export const useDeleteLabourList = () =>
    useMutation({
        mutationFn: deleteLabourList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourLists', variables.projectId],
            });
        },
    });

export const useDeleteLabourItem = () =>
    useMutation({
        mutationFn: deleteLabourItem,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['labourItems', variables.labourListId],
            });
        },
    });
