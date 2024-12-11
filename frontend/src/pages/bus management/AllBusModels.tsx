import { Box, Card, CardContent, Container, Fab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BusModel from "../../types/BusModel.type";
import Searchbar from "../../components/Searchbar";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

const AllBusModels = () => {
  const [busModels, setBusModels] = useState<BusModel[]>();


  const navigate = useNavigate();

  /*
  FIXME: Waiting for API to be up
  useEffect(() => {
    retrieveAllBusModels()
      .then(result => setBusModels(result));
  }, []);
  */

  return (
    <Container>
      <Typography variant="h4">
        All bus models
      </Typography>

      <Searchbar onSearch={(query: string) => {console.log(`Searched for ${query}`)}}/>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {navigate("/busModels/new")}}
      >
        <Add /> 
      </Fab>
    </Container>
  )
}

export default AllBusModels;