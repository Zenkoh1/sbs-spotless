import {
  Button,
  Box,
  Rating,
  Stack,
  Typography,
  TextField,
  Grid2,
  Card,
} from "@mui/material";
import React, { useState } from "react";
import { UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FormTextField from "../components/FormTextField";
import FormCard from "../components/FormCard";
import useAPI from "../api/useAPI";
import SurveyType from "../types/Survey.type";

const SurveyPage = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const [busNumberPlate, setBusNumberPlate] = useState(
    queryParameters.get("bus_number_plate") || ""
  );
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(images);
    if (!e.target.files) return;
    setImages([...images, e.target.files[0]]);
    console.log(images);
  };
  const formData = new FormData();
  const navigate = useNavigate();
  const { fetchAPI } = useAPI<SurveyType>("survey/", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !rating) {
      alert("Please fill in your email and rating");
      return;
    }
    formData.append("bus_number_plate", busNumberPlate);
    formData.append("email", email);
    formData.append("rating", rating.toString());
    formData.append("comments", comments);
    images.forEach((image) => formData.append("images", image));
    fetchAPI().then(() => {
      navigate("/complete");
    });
  };

  return (
    <Box width="80vw" display="inline-block" my={2}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={2} textAlign="center">
          <Card sx={{ py: 2 }}>
            <Typography variant="h4" textAlign="center">
              SBS Transit Cleanliness Survey
            </Typography>
            <Typography variant="subtitle1" textAlign="center">
              Please fill in the following form for a chance to win a $20
              shopping voucher!
            </Typography>
            <Typography variant="subtitle1" textAlign="center" color="red">
              * Required
            </Typography>
          </Card>
          <FormCard title="Bus Number Plate" required>
            <FormTextField
              input={busNumberPlate}
              setInput={setBusNumberPlate}
              label="Bus Number Plate"
              disabled
            />
          </FormCard>
          <FormCard title="Email" required>
            <FormTextField
              input={email}
              setInput={setEmail}
              type="email"
              label="Email"
            />
          </FormCard>
          <FormCard title="Cleanliness Rating" required>
            <Typography variant="subtitle2">
              1 - very dirty, 10 - very clean
            </Typography>
            <Rating
              max={10}
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue);
              }}
            ></Rating>
          </FormCard>
          <FormCard title="Comments">
            <TextField
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              multiline
              rows={2}
              maxRows={4}
              fullWidth
            />
          </FormCard>
          <FormCard title="Images">
            <Typography variant="subtitle2">
              Please upload images of any cleanliness issues
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
            >
              Upload Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </Button>
            <Grid2
              container
              mt={2}
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {Array.from(images).map((image, index) => (
                <Grid2 key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={"Uploaded"}
                    style={{
                      maxWidth: "100%", // Ensure it fits within the grid cell
                      height: "auto", // Maintain aspect ratio
                      objectFit: "cover", // Ensure the image fills the space nicely
                    }}
                  />
                </Grid2>
              ))}
            </Grid2>
          </FormCard>
          <Button variant="contained" color="secondary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default SurveyPage;
