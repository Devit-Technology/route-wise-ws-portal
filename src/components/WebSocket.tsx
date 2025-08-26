import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import { websocketService, WebSocketTokenService } from "../services";
import { EventMessage } from "../types";

export const WebSocketConnection: React.FC<{ serviceRequestId: string }> = ({
  serviceRequestId,
}) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventMessage[]>([]);

  const handleConnect = async () => {
    try {
      const token = await WebSocketTokenService.getWebSocketToken(
        serviceRequestId
      );
      if (!token) {
        setError("No authentication token found. Please login first.");
        return;
      }

      // Connect to WebSocket server
      await websocketService.connect(token);
      setConnected(true);
      setError(null);

      debugger;
      // Join the admin room
      await websocketService.joinCustomerRoom(serviceRequestId);
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`);
      setConnected(false);
    }
  };

  const handleDisconnect = () => {
    websocketService.disconnect();
    setConnected(false);
  };

  const handleClearEvents = () => {
    setEvents([]);
  };

  // Add event listeners for WebSocket events
  useEffect(() => {
    if (!connected) return;

    const handleStatusChanged = (data: any) => {
      console.log("Status changed event received:", data);
      const event: EventMessage = {
        eventId: data.eventId,
        sequence: data.sequence,
        timeStamp: new Date().toISOString(),
        type: "service_request:status_changed",
        data: data,
      };
      setEvents((prev) => [event, ...prev].slice(0, 100));
    };

    const handleGenericEvent = (event: EventMessage) => {
      console.log("Generic event received:", event);
      setEvents((prev) => [event, ...prev].slice(0, 100));
    };

    // Register specific event listeners
    websocketService.on("service_request:status_changed", handleStatusChanged);

    // Register generic event listener for all other events
    websocketService.on("*", handleGenericEvent);

    return () => {
      websocketService.off(
        "service_request:status_changed",
        handleStatusChanged
      );
      websocketService.off("*", handleGenericEvent);
    };
  }, [connected]); // Add connected as dependency

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        WebSocket Connection
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        {!connected ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnect}
            // disabled={!token}
          >
            Connect
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={handleDisconnect}>
            Disconnect
          </Button>
        )}

        <Button variant="outlined" onClick={handleClearEvents}>
          Clear Events
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          Status:
        </Typography>
        <Chip
          label={connected ? "Connected" : "Disconnected"}
          color={connected ? "success" : "default"}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Events Received:
      </Typography>

      <List
        sx={{
          maxHeight: 300,
          overflow: "auto",
          bgcolor: "background.paper",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
        }}
      >
        {events.length === 0 ? (
          <ListItem>
            <ListItemText primary="No events received yet" />
          </ListItem>
        ) : (
          events.map((event, index) => (
            <ListItem key={index} divider={index < events.length - 1}>
              <ListItemText
                primary={`${event.type} (${new Date(
                  event.timeStamp
                ).toLocaleTimeString()})`}
                secondary={
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};
