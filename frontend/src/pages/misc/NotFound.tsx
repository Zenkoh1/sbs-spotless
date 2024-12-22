import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h1">404 Not Found</Typography>
      <Typography variant="h2">The page you are looking for is not found</Typography>
      <Button onClick={() => navigate("/")}>Return Home</Button>
    </Container>
  )
}

export default NotFound;