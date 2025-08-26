import axios from "axios";
import { AuthResponse, IServiceRequest, ServiceRequestStatus } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["x-api-key"] = token;
  }
  return config;
});

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("api/auth/login", { email, password });
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};

export const ServiceRequestService = {
  getAllServiceRequests: async (): Promise<IServiceRequest[]> => {
    const response = await api.get("api/service-request/all");
    return response.data.data;
  },

  getServiceRequestById: async (id: string): Promise<IServiceRequest> => {
    const response = await api.get(`api/service-request/${id}`);
    return response.data.data;
  },

  createServiceRequest: async (
    serviceRequest: Partial<IServiceRequest>
  ): Promise<IServiceRequest> => {
    const response = await api.post("api/service-request", serviceRequest);
    return response.data.data;
  },

  updateServiceRequestStatus: async (
    id: string,
    status: ServiceRequestStatus
  ): Promise<IServiceRequest> => {
    const response = await api.put(`api/service-request/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};

export const WebSocketTokenService = {
  getWebSocketToken: async (serviceRequestId: string): Promise<string> => {
    const response = await api.post(`api/web-socket/token/${serviceRequestId}`);
    return response.data.data.token;
  },
};