import {
  CircularProgress,
  Typography,
  Stack,
  Box,
  Button,
} from "@mui/material";

import useAPI from "../api/useAPI";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box display="inline-block" width="75vw">
      <Typography variant="h4">HOME PAGE</Typography>
      <Button onClick={() => {navigate("/busModels")}} variant="contained">
        Lets go to bus models page
      </Button>
    </Box>
  );
};

export default Homepage;
