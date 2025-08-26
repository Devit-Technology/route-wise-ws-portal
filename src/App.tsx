import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Login } from "./components/Login";
import { WebSocketConnection } from "./components/WebSocket";
import { ServiceRequestCreator } from "./components/ServiceRequestCreator";
import { ServiceRequestManager } from "./components/ServiceRequestManager";
import { AuthService } from "./services/api.service";
import { IServiceRequest } from "./types";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isAuthenticated()
  );
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<
    IServiceRequest | undefined
  >();

  useEffect(() => {
    // Check authentication status on initial load
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    toast.success("Login successful!");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleServiceRequestCreated = (sr: IServiceRequest) => {
    toast.success(`Service request created: ${sr.orderNumber}`);
    setSelectedRequest(sr);
    setActiveTab(2); // Switch to the Manage tab
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    toast.info("Logged out");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            RouteWise Tester
          </Typography>

          {isAuthenticated && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="text.secondary">
                Logged in as Admin
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </Typography>
            </Box>
          )}
        </Box>

        {!isAuthenticated ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {selectedRequest?.id && (
              <WebSocketConnection serviceRequestId={selectedRequest.id} />
            )}

            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Create Service Request" />
                <Tab label="Manage Requests" />
              </Tabs>
            </Paper>

            {activeTab === 0 && (
              <ServiceRequestCreator onCreated={handleServiceRequestCreated} />
            )}

            {activeTab === 1 && (
              <ServiceRequestManager
                selectedRequest={selectedRequest}
                onSelectRequest={setSelectedRequest}
              />
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
