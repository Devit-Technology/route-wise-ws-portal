export interface IDeliveryAddress {
  street: string;
  streetNumber?: string;
  suburb: string;
  province: string;
  postalCode: string;
  country: string;
  longitude?: number;
  latitude?: number;
}

export interface IServiceRequest {
  id?: string;
  customerId?: string;
  orderNumber: string;
  pickupAddress: IDeliveryAddress;
  deliveryAddress: IDeliveryAddress;
  otp?: string;
  weight: number;
  volume: number;
  tripId?: string;
  packageCount: number;
  notes?: string;
  status: ServiceRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum ServiceRequestStatus {
  REQUESTED = "requested",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum CustomerWsScope {
  SERVICE_REQUEST = "service_request",
}

export interface ServiceRequestStatusUpdate {
  status: ServiceRequestStatus;
}

export interface EventMessage {
  eventId: string;
  sequence: number;
  timeStamp: string;
  type: string;
  data: any;
}
