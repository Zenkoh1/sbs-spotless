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

  return (
    <Box display="inline-block" width="75vw">
      <Typography variant="h4">HOME PAGE</Typography>
    </Box>
  );
};

export default Homepage;
