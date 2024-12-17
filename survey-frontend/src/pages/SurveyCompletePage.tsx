import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SurveyCompletePage = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(-1);
  };

  return (
    <Box width="80vw" display="inline-block" height="100vh">
      <Card sx={{ mt: 5, mb: 0 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={"bold"} textAlign="left">
            {
              "Thank you for completing the survey! You will be notified via email if you are a selected winner of the voucher."
            }
          </Typography>
          <Button sx={{ m: 2 }} onClick={onClick} variant="contained">
            {"Submit another form"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SurveyCompletePage;
