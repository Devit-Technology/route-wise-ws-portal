import { io, Socket } from "socket.io-client";
import { CustomerWsScope } from "../types";
import { ApiService } from "./api.service";

export class WebSocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, ((data: any) => void)[]>;

  constructor(private api: ApiService) {
    this.eventListeners = new Map();
  }

  connect(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Connect to the Socket.IO server with auth token
        this.socket = io(
          (process.env.REACT_APP_API_URL || "http://localhost:3000") +
            "/customer",
          {
            auth: { token },
          }
        );

        // Setup connection event handlers
        this.socket.on("connect", () => {
          console.log("WebSocket connected:", this.socket?.id);
          resolve(true);
        });

        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          reject(error);
        });

        this.socket.on("disconnect", () => {
          console.log("WebSocket disconnected");
        });

        // Listen for any events and dispatch to registered listeners
        this.socket.onAny((event, ...args) => {
          console.log(`Received event ${event}:`, args);

          // Trigger specific event listeners
          const listeners = this.eventListeners.get(event);
          if (listeners) {
            listeners.forEach((listener) => listener(args[0]));
          }

          // Also trigger generic listeners (for "*" events)
          const genericListeners = this.eventListeners.get("*");
          if (genericListeners) {
            genericListeners.forEach((listener) =>
              listener({
                type: event,
                data: args[0],
                timeStamp: new Date().toISOString(),
              })
            );
          }
        });
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
  }

  joinCustomerRoom(serviceRequestId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      this.socket.emit(
        "join",
        { serviceRequestId, scope: CustomerWsScope.SERVICE_REQUEST },
        (response: any) => {
          if (response.success) {
            console.log("Successfully joined customer room");
            resolve();
          } else {
            reject(
              new Error(response.message || "Failed to join customer room")
            );
          }
        }
      );
    });
  }

  on(event: string, callback: (data: any) => void): void {
    console.log(`Registering listener for event: ${event}`);

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public getWebSocketToken = async (
    serviceRequestId: string
  ): Promise<string> => {
    const response = await this.api.post(
      `api/web-socket/token/${serviceRequestId}`
    );
    return response.data.data.token;
  };
}

export const websocketService = new WebSocketService(ApiService.getInstance());
