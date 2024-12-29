import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Stack } from "@mui/material";
import { getName, logoutUser } from "../api/sessionManager";
import { useContext } from "react";
import { AuthContext } from "../App";
import { NavLink, useLocation } from "react-router-dom";
import { Checklist, CleaningServices, QuestionMark, DirectionsBus, Commute, Schedule, Logout, Home } from "@mui/icons-material";

const NAV_ITEMS = [
  { label: "Home", icon: <Home />, path: "/" },
  { label: "Models", icon: <Commute />, path: "/busModels" },
  { label: "Buses", icon: <DirectionsBus />, path: "/buses" },
  { label: "Checklists", icon: <Checklist />, path: "/checklists" },
  { label: "Cleaners", icon: <CleaningServices />, path: "/cleaners" },
  { label: "Schedules", icon: <Schedule />, path: "/schedules" },
  { label: "Survey", icon: <QuestionMark />, path: "/survey" },
]

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: 200,
        height: "100vh",
        left: 0,
        bgcolor: "#5d107c",
        color: "white",
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
        <Typography variant="h4" mb={4} mt={1}>
          Spotless
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: isActive ? "white" : "rgba(255, 255, 255, 0.7)",
                backgroundColor: isActive ? "#9b65af" : "transparent",
                padding: "8px 8px",
                borderRadius: "8px",
              })}
            >
              <IconButton
                sx={{
                  color: "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </IconButton>
              <Typography variant="body1">
                {item.label}
              </Typography>
            </NavLink>
          ))}
        </Box>
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
        bgcolor: "white",
        color: "black",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" ml="8px" sx={{ fontWeight: "bold" }}>
          { NAV_ITEMS.filter(item => item.path !== "/").find(item => location.pathname.startsWith(item.path))?.label}
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={() => {
              logoutUser()
                .then(() => setIsAuth(false))
                .catch(() => {
                  alert("Error logging out, refresh the page!");
                });
            }}
          >
            <Logout />
          </IconButton>
          <Avatar>
            {getName().charAt(0)}
          </Avatar>
        </Stack>
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
          padding: "16px",
          paddingTop: "64px",
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default Layout;