import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Box,
  Snackbar,
  Grid,
} from "@mui/material";
import { IServiceRequest, ServiceRequestStatus } from "../types";
import { ApiService, ServiceRequestService } from "../services";

const initialPickUpAddress = {
  street: "Earlsfield",
  streetNumber: "137C",
  suburb: "Earlsfield",
  province: "London",
  postalCode: "SW18 3DD",
  country: "England",
  latitude: 51.44717521729619,
  longitude: -0.1842625314326739,
};

const initialDeliveryAddress = {
  street: "Fieldview",
  streetNumber: "1",
  suburb: "Earlsfield",
  province: "London",
  postalCode: "SW18 3HG",
  country: "England",
  latitude: 51.44468709817766,
  longitude: -0.18020518910297,
};

const initialServiceRequest: Partial<IServiceRequest> = {
  orderNumber: "",
  pickupAddress: { ...initialPickUpAddress },
  deliveryAddress: { ...initialDeliveryAddress },
  weight: 5,
  volume: 5000,
  packageCount: 1,
  notes: "",
};

export const ServiceRequestCreator: React.FC<{
  onCreated: (sr: IServiceRequest) => void;
}> = ({ onCreated }) => {
  const [serviceRequest, setServiceRequest] = useState<
    Partial<IServiceRequest>
  >(initialServiceRequest);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    serviceRequest.status = ServiceRequestStatus.REQUESTED;
    try {
      const srService = new ServiceRequestService(ApiService.getInstance());
      const createdSR = await srService.createServiceRequest(serviceRequest);
      setSuccess(true);
      setServiceRequest(initialServiceRequest);
      onCreated(createdSR);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create service request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested fields like pickupAddress.street
      const [parent, child] = name.split(".");
      setServiceRequest((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as object) || {}),
          [child]: value,
        },
      }));
    } else {
      // Handle direct fields like orderNumber
      setServiceRequest((prev) => ({
        ...prev,
        [name]:
          name === "weight" || name === "volume" || name === "packageCount"
            ? parseFloat(value)
            : value,
      }));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Service Request
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Order Number"
          name="orderNumber"
          value={serviceRequest.orderNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Pickup Address
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Street"
              name="pickupAddress.street"
              value={serviceRequest.pickupAddress?.street}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Street Number"
              name="pickupAddress.streetNumber"
              value={serviceRequest.pickupAddress?.streetNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Suburb"
              name="pickupAddress.suburb"
              value={serviceRequest.pickupAddress?.suburb}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Province"
              name="pickupAddress.province"
              value={serviceRequest.pickupAddress?.province}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Postal Code"
              name="pickupAddress.postalCode"
              value={serviceRequest.pickupAddress?.postalCode}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Country"
              name="pickupAddress.country"
              value={serviceRequest.pickupAddress?.country}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Latitude"
              name="pickupAddress.latitude"
              value={serviceRequest.pickupAddress?.latitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Longitude"
              name="pickupAddress.longitude"
              value={serviceRequest.pickupAddress?.longitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Delivery Address
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Street"
              name="deliveryAddress.street"
              value={serviceRequest.deliveryAddress?.street}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Street Number"
              name="deliveryAddress.streetNumber"
              value={serviceRequest.deliveryAddress?.streetNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Suburb"
              name="deliveryAddress.suburb"
              value={serviceRequest.deliveryAddress?.suburb}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Province"
              name="deliveryAddress.province"
              value={serviceRequest.deliveryAddress?.province}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Postal Code"
              name="deliveryAddress.postalCode"
              value={serviceRequest.deliveryAddress?.postalCode}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Country"
              name="deliveryAddress.country"
              value={serviceRequest.deliveryAddress?.country}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Latitude"
              name="deliveryAddress.latitude"
              value={serviceRequest.deliveryAddress?.latitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Longitude"
              name="deliveryAddress.longitude"
              value={serviceRequest.deliveryAddress?.longitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Package Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Weight (kg)"
              name="weight"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              value={serviceRequest.weight}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Volume (cm³)"
              name="volume"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={serviceRequest.volume}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Package Count"
              name="packageCount"
              type="number"
              inputProps={{ min: 1, step: 1 }}
              value={serviceRequest.packageCount}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
        </Grid>

        <TextField
          label="Notes"
          name="notes"
          value={serviceRequest.notes}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Creating..." : "Create Service Request"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Service Request created successfully!"
      />
    </Paper>
  );
};
