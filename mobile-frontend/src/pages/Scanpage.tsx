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
import { CleaningChecklistStep_Backend_Type } from "../types/CleaningSchedule.type";
import axios from "axios";
import { BACKEND_URL } from "../constants";

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
  const [rating, setRating] = useState<number>();
  const isAuth = useContext(AuthContext);
  const navigate = useNavigate();

  const { fetchAPI, loading, data } = useAPI<number>(`scanimage`);

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
    if (!loading) {
      console.log(data);
      setRating(data!);
    }
  }, [isAuth, loading]);

  return (
    <Box
      key={index}
      position="relative"
      sx={{
        border: imageToReplaceIndex === index ? "2px solid #1976d2" : "none",
        borderRadius: "8px",
        padding: "8px",
        backgroundColor:
          imageToReplaceIndex === index ? "#e3f2fd" : "transparent",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        width: "90%",
      }}
    >
      {/* Image */}
      <img
        src={img.imagePreview}
        alt={`Uploaded Preview ${index}`}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />

      {/* Rating */}
      <Box flex="1">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="body2" noWrap>
            {rating !== null
              ? `Cleanliness Rating: ${rating}/100`
              : "Rating not available"}
          </Typography>
        )}
      </Box>

      {/* Retake Icon */}
      <IconButton
        color={imageToReplaceIndex === index ? "secondary" : "primary"}
        onClick={() =>
          setImageToReplaceIndex(imageToReplaceIndex === index ? null : index)
        }
        sx={{ flexShrink: 0 }}
      >
        <ReplayIcon />
      </IconButton>

      {/* Delete Icon */}
      <IconButton
        color="error"
        onClick={() => handleDeleteImage(index)}
        sx={{ flexShrink: 0 }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default function Scanpage() {
  const { schedule_id, number_plate, step_id } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchAPI, loading, data } =
    useAPI<CleaningChecklistStep_Backend_Type>(`checklist_steps/${step_id}`, {
      method: "GET",
    });
  const [step, setStep] = useState<CleaningChecklistStep_Backend_Type>();

  const [images, setImages] = useState<ImageObjectType[]>([]);
  const [imageToReplaceIndex, setImageToReplaceIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
    fetchAPI();
    if (!loading) {
      console.log(data);
      setStep(data!);
    }
  }, [isAuth, loading]);

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Reset the retake mode if the deleted image is the one being replaced
    if (imageToReplaceIndex === index) {
      setImageToReplaceIndex(null);
    }
  };

  const submitImages = async () => {
    try {
      const uploadImageResponse = await axios.patch(
        `${BACKEND_URL}checklist_steps/${step_id}/upload_images/`,
        {
          images: images.map((img) => img.imageFile),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (uploadImageResponse.status === 200) {
        const updateStatusResponse = await axios.patch(
          `${BACKEND_URL}checklist_steps/${step_id}/`,
          {
            status: "COMPLETE",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (updateStatusResponse.status === 200) {
          navigate(`/checklist/${schedule_id}/${number_plate}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting images, refresh page");
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <h1>{step?.cleaning_checklist_item.title}</h1>
      <img
        src={
          step?.cleaning_checklist_item.image
            ? step.cleaning_checklist_item.image
            : "https://via.placeholder.com/150"
        }
        alt="Image of item to clean"
      />
      <Typography variant="h6">
        {step?.cleaning_checklist_item.description}
      </Typography>
      <UploadImageComponent
        images={images}
        setImages={setImages}
        imageToReplaceIndex={imageToReplaceIndex}
        setImageToReplaceIndex={setImageToReplaceIndex}
      />
      <Stack spacing={2} width={"100%"} alignItems={"center"}>
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
      <Button
        variant={
          !step?.cleaning_checklist_item.is_image_required || images.length > 0
            ? "contained"
            : "outlined"
        }
        disabled={
          !step?.cleaning_checklist_item.is_image_required || images.length > 0
            ? false
            : true
        }
        onClick={submitImages}
      >
        Cleaned
      </Button>
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
