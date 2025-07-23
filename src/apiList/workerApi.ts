import { useMutation } from "@tanstack/react-query";
import workerApi from "../apiService/workerApiService";

// ============ WORKER AUTH FUNCTIONS ============

const loginWorker = async (payload: { email: string; password: string }) => {
  const { data } = await workerApi.post("/auth/worker/login", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const registerWorker = async ({
  invite,
  payload
}: {
  invite: string;
  payload: {
    email: string;
    password: string;
    phoneNo: string;
    workerName: string;
  };
}
) => {
  const { data } = await workerApi.post(`/auth/worker/registerworker?invite=${invite}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const logoutWorker = async () => {
  const { data } = await workerApi.post("/auth/worker/logout");
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// ============ HOOK EXPORTS ============

export const useLoginWorker = () =>
  useMutation({
    mutationFn: loginWorker,
  });

export const useRegisterWorker = () =>
  useMutation({
    mutationFn: registerWorker,
  });

export const useLogoutWorker = () =>
  useMutation({
    mutationFn: logoutWorker,
  });
