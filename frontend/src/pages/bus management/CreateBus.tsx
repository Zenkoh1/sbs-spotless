import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBus = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    // Send data to API via POST request
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Bus
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="License Plate"
          variant="outlined"
          fullWidth
          required
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Create Bus Model
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/busModels")}
        >
          Cancel
        </Button>
      </Box>

    </Container>
  )
}

export default CreateBus;