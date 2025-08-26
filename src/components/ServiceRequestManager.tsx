import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Chip,
} from "@mui/material";
import { ServiceRequestService } from "../services/api.service";
import { IServiceRequest, ServiceRequestStatus } from "../types";

export const ServiceRequestManager: React.FC<{
  selectedRequest?: IServiceRequest;
  onSelectRequest: (request: IServiceRequest) => void;
}> = ({ selectedRequest, onSelectRequest }) => {
  const [serviceRequests, setServiceRequests] = useState<IServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    ServiceRequestStatus | ""
  >("");

  const fetchServiceRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const requests = await ServiceRequestService.getAllServiceRequests();
      setServiceRequests(requests);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch service requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateServiceRequestStatus = async () => {
    if (!selectedRequest || !selectedStatus) {
      setError("Please select a service request and status");
      return;
    }

    setUpdateLoading(true);
    setError(null);

    try {
      const updated = await ServiceRequestService.updateServiceRequestStatus(
        selectedRequest.id!,
        selectedStatus as ServiceRequestStatus
      );

      // Update the local list with the updated service request
      setServiceRequests((prev) =>
        prev.map((sr) => (sr.id === updated.id ? updated : sr))
      );

      setSuccess(`Status updated to ${selectedStatus}`);
      setSelectedStatus("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update service request status"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case ServiceRequestStatus.REQUESTED:
        return "default";
      case ServiceRequestStatus.ASSIGNED:
        return "info";
      case ServiceRequestStatus.IN_PROGRESS:
        return "primary";
      case ServiceRequestStatus.COMPLETED:
        return "success";
      case ServiceRequestStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manage Service Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchServiceRequests}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          Refresh Requests
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 400, mb: 3 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No service requests found
                  </TableCell>
                </TableRow>
              ) : (
                serviceRequests.map((sr) => (
                  <TableRow
                    key={sr.id}
                    selected={selectedRequest?.id === sr.id}
                    hover
                  >
                    <TableCell>{sr.orderNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={sr.status}
                        color={getStatusChipColor(sr.status!) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {sr.pickupAddress.suburb}, {sr.pickupAddress.province}
                    </TableCell>
                    <TableCell>
                      {sr.deliveryAddress.suburb}, {sr.deliveryAddress.province}
                    </TableCell>
                    <TableCell>
                      {new Date(sr.createdAt!).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onSelectRequest(sr)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mb: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Update Service Request Status
        </Typography>

        {selectedRequest ? (
          <Typography variant="body1" gutterBottom>
            Selected: <strong>{selectedRequest.orderNumber}</strong> (Current
            status: {selectedRequest.status})
          </Typography>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please select a service request from the table above
          </Alert>
        )}

        {selectedRequest && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={selectedStatus}
                label="New Status"
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ServiceRequestStatus)
                }
                disabled={!selectedRequest || updateLoading}
              >
                <MenuItem value="">
                  <em>Select status</em>
                </MenuItem>
                {Object.values(ServiceRequestStatus).map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    disabled={selectedRequest?.status === status}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={updateServiceRequestStatus}
              disabled={!selectedRequest || !selectedStatus || updateLoading}
              startIcon={
                updateLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Update Status
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </Paper>
  );
};
