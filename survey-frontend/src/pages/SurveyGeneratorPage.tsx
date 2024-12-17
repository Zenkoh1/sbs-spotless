import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Stack,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormTextField from "../components/FormTextField";
import FormCard from "../components/FormCard";
import QRCode from "react-qr-code";

const SurveyGeneratorPage = () => {
  const [busNumberPlate, setBusNumberPlate] = useState("");
  const [surveyURL, setSurveyURL] = useState("");

  const navigate = useNavigate();

  const getSurveyURL = (busNumberPlate: string) => {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.hostname}${
      url.port ? ":" + url.port : ""
    }/?bus_number_plate=${busNumberPlate}`;
  };

  const qrRef = useRef<HTMLDivElement | null>(null);
  // Function to export the QR code as an image
  const exportQRCode = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    console.log(svg);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create a canvas element to draw the SVG and export it as PNG
      const img = new Image();
      img.src = svgUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Set canvas size to match the SVG
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          // Export the canvas to PNG
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = `${busNumberPlate}_survey.png`; // Filename for download
          link.click(); // Trigger download
        }
      };
    }
  };

  return (
    <Box width="80vw" display="inline-block" height="100vh">
      <FormCard title="Generate Cleanliness Survey QR Code">
        <FormTextField
          input={busNumberPlate}
          setInput={setBusNumberPlate}
          label="Bus Number Plate"
        />
        <Button
          sx={{ m: 2, bgcolor: "purple" }}
          onClick={() => setSurveyURL(getSurveyURL(busNumberPlate))}
          variant="contained"
        >
          {"Generate"}
        </Button>
        {surveyURL && (
          <>
            <div ref={qrRef}>
              <QRCode value={surveyURL} size={256} />
            </div>
            <Button
              sx={{ m: 2, bgcolor: "red" }}
              onClick={exportQRCode}
              variant="contained"
            >
              {"Export QR Code"}
            </Button>
          </>
        )}
      </FormCard>
    </Box>
  );
};

export default SurveyGeneratorPage;
