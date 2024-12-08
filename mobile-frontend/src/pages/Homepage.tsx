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
import { getID } from "../api/sessionManager";

const Homepage = () => {
  
  // This doenst actually do anything now
  // I'll leave it here for reference
  const { fetchAPI, loading, data } = useAPI(`test`, {
    headers: {
      "content-type": "application/json",
    },
  });

  const { isAuth } = useContext(AuthContext);
  
  useEffect(() => {
    if (isAuth) {
        //fetchAPI();
    }
  }, [isAuth]);

  if (loading)
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );

  return (
    <Box display="inline-block" width="75vw">
      <Typography variant="h4">HOME PAGE</Typography>
    </Box>
  );
};

export default Homepage;
