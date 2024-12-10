import { Container, Typography, Box, TextField, Button, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBusModel = () => {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Send data to API via POST request with form data
    navigate("/busModels");
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Bus Model
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="Model Name"
          variant="outlined"
          fullWidth
          required
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          variant="contained"
          component="label"
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {/* Image Preview */}
        {preview && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Avatar
              src={preview}
              alt="Bus Model Preview"
              sx={{
                width: 200,
                height: 200,
                borderRadius: 2,
              }}
            />
          </Box>
        )}

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

export default CreateBusModel;