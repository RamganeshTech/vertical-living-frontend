import Api from "../apiService/apiService";
import clientApi from "../apiService/clientService";
import CTOApi from "../apiService/CTOService";
import staffApi from "../apiService/staffApiservice";
import workerApi from "../apiService/workerApiService";

export const getApiForRole = (role: string) => {
  if (role === "owner") return Api;
  if (role === "staff") return staffApi;
  if (role === "worker") return workerApi;
  if (role === "CTO") return CTOApi;
  if (role === "client") return clientApi;
  return null;
};



