import { Box, Card, CardContent, Container, Fab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BusModel from "../../types/BusModel.type";
import Searchbar from "../../components/Searchbar";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

const AllBusModels = () => {
  const [busModels, setBusModels] = useState<BusModel[]>();

  useEffect(() => {
    setBusModels([{model: "SBS123"}, {model: "sbs345"}]);
  }, []);

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

      <Box sx={{ display: "flex", gap: "16px" }}>
        {busModels?.map((busModel, index) => (
          <Card 
            key={index}
            onClick={() => {navigate(`/buses/${busModel.model}`)}}
          >
            <CardContent>
              <img
                src="https://picsum.photos/200"
                alt="Bus"
                width={200}
                height={200}
              />
              <Typography variant="h5">
                {busModel.model}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

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