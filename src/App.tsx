import React, { useState } from "react";
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

import { WebSocketConnection } from "./components/WebSocket";
import { ServiceRequestCreator } from "./components/ServiceRequestCreator";
import { ServiceRequestManager } from "./components/ServiceRequestManager";
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
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<
    IServiceRequest | undefined
  >();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleServiceRequestCreated = (sr: IServiceRequest) => {
    toast.success(`Service request created: ${sr.orderNumber}`);
    setSelectedRequest(sr);
    setActiveTab(2); // Switch to the Manage tab
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
        </Box>

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
              {/* <Tab label="Manage Requests" /> */}
            </Tabs>
          </Paper>

          {activeTab === 0 && (
            <ServiceRequestCreator onCreated={handleServiceRequestCreated} />
          )}

          {/* {activeTab === 1 && (
            <ServiceRequestManager
              selectedRequest={selectedRequest}
              onSelectRequest={setSelectedRequest}
            />
          )} */}
        </>
      </Container>
    </ThemeProvider>
  );
}

export default App;
