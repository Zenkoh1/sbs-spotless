import { Button, Stack } from "@mui/material";
import React, { useState, useRef } from "react";

type ImageObjectType = {
  imagePreview: string;
  imageFile: File;
} | null;
/**
 * credit: https://stackoverflow.com/questions/59997551/react-how-does-one-access-a-phones-actual-camera-app-not-load-feed-in-browser
 */
const UploadImageComponent: React.FC = () => {
  const [imageObject, setImageObject] = useState<ImageObjectType>(null);
  const handleFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    handleFileInput.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageObject({
        imagePreview: URL.createObjectURL(file),
        imageFile: file,
      });
    }
  };

  return (
    <Stack>
      <Button onClick={handleClick}>Upload Photo</Button>
      <label>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          capture="environment"
          ref={handleFileInput}
          onChange={handleImageChange}
        />
      </label>
      {imageObject && (
        <img
          width={100}
          src={imageObject.imagePreview}
          alt="Uploaded Preview"
        />
      )}
    </Stack>
  );
};

export default UploadImageComponent;
