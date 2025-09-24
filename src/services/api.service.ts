import axios, { AxiosInstance } from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  // Singleton pattern to ensure a single instance
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private constructor() {
    // Create axios instance
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "MLZgwcruwCmf0biO4Fh9",
      },
    });
  }

  // Generic GET request
  get = (url: string, params?: any) => {
    return this.api.get(url, { params });
  };

  // Generic POST request
  post = (url: string, data?: any) => {
    return this.api.post(url, data);
  };

  // Generic PUT request
  put = (url: string, data?: any) => {
    return this.api.put(url, data);
  };

  // Generic DELETE request
  delete = (url: string) => {
    return this.api.delete(url);
  };
}
