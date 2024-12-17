import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import SurveyPage from "./pages/SurveyPage";
import SurveyCompletePage from "./pages/SurveyCompletePage";
import SurveyGeneratorPage from "./pages/SurveyGeneratorPage";
function App() {
  return (
    <Box
      className="App"
      sx={{
        position: "relative", // Ensure pseudo-element is positioned correctly
        width: "100%",
        height: "100%",
        overflow: "hidden",
        overflowY: "auto",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/sbs_background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3, // Adjust opacity
          zIndex: -1, // Place behind content
        },
      }}
    >
      <BrowserRouter>
        <AppBar position="static" elevation={0}></AppBar>
        <Routes>
          <Route path="/" element={<SurveyPage />} />
          <Route path="/complete" element={<SurveyCompletePage />} />
          <Route path="/generate" element={<SurveyGeneratorPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
