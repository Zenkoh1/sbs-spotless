import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Stack,
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import useAPI from "../api/useAPI";

function ScannedImageComponent(props: {
  img: ImageObjectType;
  index: number;
  imageToReplaceIndex: number | null;
  setImageToReplaceIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleDeleteImage: (index: number) => void;
}) {
  const {
    img,
    index,
    imageToReplaceIndex,
    setImageToReplaceIndex,
    handleDeleteImage,
  } = props;
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulating an API call to fetch cleanliness rating
  const fetchCleanlinessRating = async () => {
    setLoading(true);
    setTimeout(() => {
      setRating(Math.floor(Math.random() * 100));
      setLoading(false);
    }, 5000);
    try {
      const response = await fetch(
        `/api/getcleanlinessrating/${img.imageFile.name}`
      );
      const data = await response.json();
      setRating(data.rating);
    } catch (error) {
      console.error("Failed to fetch cleanliness rating:", error);
      setRating(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCleanlinessRating();
  }, [img.imageFile.name]);

  return (
    <Box
      key={index}
      textAlign="center"
      position="relative"
      sx={{
        border: imageToReplaceIndex === index ? "2px solid #1976d2" : "none",
        borderRadius: "8px",
        padding: "4px",
        backgroundColor:
          imageToReplaceIndex === index ? "#e3f2fd" : "transparent",
      }}
    >
      <img
        src={img.imagePreview}
        alt={`Uploaded Preview ${index}`}
        style={{
          maxWidth: "100px",
          maxHeight: "100px",
          marginBottom: "8px",
        }}
      />
      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton
          size="small"
          color={imageToReplaceIndex === index ? "secondary" : "primary"}
          onClick={() =>
            setImageToReplaceIndex(imageToReplaceIndex === index ? null : index)
          }
        >
          {imageToReplaceIndex === index ? <CancelIcon /> : <ReplayIcon />}
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteImage(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
      <Box mt={2}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="body2">
            {rating !== null
              ? `Cleanliness Rating: ${rating}/100`
              : "Rating not available"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function Scanpage() {
  const { bus_id, item_id } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [images, setImages] = useState<ImageObjectType[]>([]);
  const [imageToReplaceIndex, setImageToReplaceIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Reset the retake mode if the deleted image is the one being replaced
    if (imageToReplaceIndex === index) {
      setImageToReplaceIndex(null);
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <h1>Scanpage</h1>
      <img src="https://via.placeholder.com/150" alt="placeholder" />
      <UploadImageComponent
        images={images}
        setImages={setImages}
        imageToReplaceIndex={imageToReplaceIndex}
        setImageToReplaceIndex={setImageToReplaceIndex}
      />
      <Stack spacing={2}>
        {images.map((img, index) => (
          <ScannedImageComponent
            key={img.imageFile.name}
            img={img}
            index={index}
            imageToReplaceIndex={imageToReplaceIndex}
            setImageToReplaceIndex={setImageToReplaceIndex}
            handleDeleteImage={handleDeleteImage}
          />
        ))}
      </Stack>
    </Stack>
  );
}

type ImageObjectType = {
  imagePreview: string;
  imageFile: File;
};

/**
 * UploadImageComponent handles image upload and previews, including retakes.
 */
const UploadImageComponent: React.FC<{
  images: ImageObjectType[];
  setImages: React.Dispatch<React.SetStateAction<ImageObjectType[]>>;
  imageToReplaceIndex: number | null;
  setImageToReplaceIndex: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ images, setImages, imageToReplaceIndex, setImageToReplaceIndex }) => {
  const handleFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    handleFileInput.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = {
        imagePreview: URL.createObjectURL(file),
        imageFile: file,
      };

      if (imageToReplaceIndex !== null) {
        // Replace the selected image
        const updatedImages = [...images];
        updatedImages[imageToReplaceIndex] = newImage;
        setImages(updatedImages);
        setImageToReplaceIndex(null); // Reset after replacing
      } else {
        // Add a new image
        setImages([...images, newImage]);
      }
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Button variant="contained" onClick={handleClick}>
        {imageToReplaceIndex !== null ? "Retake Photo" : "Upload Photo"}
      </Button>
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        capture="environment"
        ref={handleFileInput}
        onChange={handleImageChange}
      />
    </Stack>
  );
};
