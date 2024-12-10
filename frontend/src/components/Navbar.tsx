import { AppBar, Toolbar, Stack, Typography, Button } from "@mui/material";
import { getName, logoutUser } from "../api/sessionManager";
import { useContext } from "react";
import { AuthContext } from "../App";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Stack spacing={2} direction="row" alignItems="center">
          <Typography
            sx={{ textDecoration: "none", fontWeight: "bold" }}
            variant="h5"
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Spotless
          </Typography>
          {isAuth && (
            <Typography variant="h6">Welcome {getName()}!</Typography>
          )}
        </Stack>
        <div>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  logoutUser()
                    .then(() => setIsAuth(false))
                    .catch(() => {
                      alert("Error logging out, refresh the page!");
                    });
                }}
              >
                Logout
              </Button>
            </Stack>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;