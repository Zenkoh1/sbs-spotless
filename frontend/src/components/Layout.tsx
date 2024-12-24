import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import { logoutUser } from "../api/sessionManager";
import { useContext } from "react";
import { AuthContext } from "../App";
import { NavLink, useLocation } from "react-router-dom";
import { BusAlert, Checklist, Home, Settings, CleaningServices } from "@mui/icons-material";

const NAV_ITEMS = [
  { label: "Home", icon: <Home />, path: "/" },
  { label: "Bus Models", icon: <BusAlert />, path: "/busModels" },
  { label: "Buses", icon: <BusAlert />, path: "/buses" },
  { label: "Checklists", icon: <Checklist />, path: "/checklists" },
  { label: "Cleaners", icon: <CleaningServices />, path: "/cleaners" },
  { label: "Schedules", icon: <Checklist />, path: "/schedules" },
  { label: "Settings", icon: <Settings />, path: "/settings" },
]

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: 200,
        height: "100vh",
        left: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "8px",
        }}
      >
        <Typography variant="h5" mb={2} p={1}>
          Spotless™
        </Typography>

        <List sx={{ width: "100%" }}>
          {NAV_ITEMS.map((item, index) => (
            <ListItem
              key={index}
              component={NavLink}
              to={item.path}
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "inherit"
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
}

const Topbar = () => {
  const { setIsAuth } = useContext(AuthContext);
  const location = useLocation();

  return (
    <AppBar
      position="fixed"
      sx={{
        left: 200,
        width: `calc(100% - 200px)`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {NAV_ITEMS.find(i => i.path === location.pathname)?.label}
        </Typography>

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
      </Toolbar>
    </AppBar>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <Topbar />
      <Box
        sx={{
          marginLeft: "200px",
          marginTop: "64px",
          padding: "16px"
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default Layout;