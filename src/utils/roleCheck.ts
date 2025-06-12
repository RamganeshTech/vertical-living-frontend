import Api from "../apiService/apiService";
import staffApi from "../apiService/staffApiservice";
import workerApi from "../apiService/workerApiService";

export const getApiForRole = (role: string) => {
  if (role === "owner") return Api;
  if (role === "staff") return staffApi;
  if (role === "worker") return workerApi;
  return null;
};



