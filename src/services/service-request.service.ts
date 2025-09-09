import { IServiceRequest, ServiceRequestStatus } from "../types";
import { ApiService } from "./api.service";

export class ServiceRequestService {
  constructor(private api: ApiService) {}

  async getAllServiceRequests(): Promise<IServiceRequest[]> {
    const response = await this.api.get("api/service-request/all");
    return response.data.data;
  }

  async getServiceRequestById(id: string): Promise<IServiceRequest> {
    const response = await this.api.get(`api/service-request/${id}`);
    return response.data.data;
  }

  async createServiceRequest(
    serviceRequest: Partial<IServiceRequest>
  ): Promise<IServiceRequest> {
    const response = await this.api.post("api/service-request", serviceRequest);
    return response.data.data;
  }

  async updateServiceRequestStatus(
    id: string,
    status: ServiceRequestStatus
  ): Promise<IServiceRequest> {
    const response = await this.api.put(`api/service-request/${id}/status`, {
      status,
    });
    return response.data.data;
  }
}
