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
import useAPI from "../api/useAPI";
import {
  CleaningChecklistStep_Backend_Type,
  ImageProps,
} from "../types/CleaningSchedule.type";
import axios from "axios";
import { BACKEND_URL } from "../constants";

function ScannedImageComponent(props: {
  img: ImageObjectType;
  index: number;
  image: ImageProps;
  step_id: string;
  imageToReplaceIndex: { index: number; image_id: string } | null;
  setImageToReplaceIndex: React.Dispatch<
    React.SetStateAction<{ index: number; image_id: string } | null>
  >;
  handleDeleteImage: (index: number) => void;
}) {
  const {
    img,
    index,
    image,
    step_id,
    imageToReplaceIndex,
    setImageToReplaceIndex,
    handleDeleteImage,
  } = props;
  const isAuth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<{
    cleanliness_level: number;
    image_id: string;
  }>();

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", img.imageFile);
      const response = await axios.patch(
        `${BACKEND_URL}checklist_steps/${step_id}/upload_image/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Image uploaded successfully", response.data);
        const data = await response.data;
        setResponse(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image, refresh page");
    }
  };

  const deleteImage = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${BACKEND_URL}checklist_steps/${step_id}/delete_image/`,
        {
          data: { image_id: response?.image_id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (deleteResponse.status === 204) {
        handleDeleteImage(index);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting image, refresh page");
    }
  };

  const replaceImage = async () => {
    setImageToReplaceIndex(
      imageToReplaceIndex?.index === index
        ? null
        : { index, image_id: response?.image_id || "" }
    );
  };

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
    if (image == null) {
      uploadImage();
    } else {
      setLoading(false);
      setResponse({
        cleanliness_level: image.cleanliness_level,
        image_id: image.id.toString(),
      });
    }
  }, [isAuth]);

  return (
    <Box
      key={index}
      position="relative"
      sx={{
        border:
          imageToReplaceIndex?.index === index ? "2px solid #1976d2" : "none",
        borderRadius: "8px",
        padding: "8px",
        backgroundColor:
          imageToReplaceIndex?.index === index ? "#e3f2fd" : "transparent",
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
            {response !== null
              ? `Cleanliness: ${response?.cleanliness_level}/100`
              : "Rating not available"}
          </Typography>
        )}
      </Box>

      {/* Retake Icon */}
      <IconButton
        color={imageToReplaceIndex?.index === index ? "secondary" : "primary"}
        onClick={replaceImage}
        sx={{ flexShrink: 0 }}
      >
        <ReplayIcon />
      </IconButton>

      {/* Delete Icon */}
      <IconButton color="error" onClick={deleteImage} sx={{ flexShrink: 0 }}>
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
  const [imageToReplaceIndex, setImageToReplaceIndex] = useState<{
    index: number;
    image_id: string;
  } | null>(null);

  const createFileFromURL = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob(); // Get the image data as a Blob
    const file = new File([blob], filename, { type: blob.type }); // Create a File object from the Blob
    return file;
  };

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
    fetchAPI();
    if (!loading) {
      console.log("step", data);
      setStep(data!);

      // Adding images to the images array
      if (data && data.images && data.images.length > 0) {
        const fetchedImages = data.images.map(async (imageData: ImageProps) => {
          const imageUrl = `${imageData.image}`; // The URL where the image is hosted
          const filename = imageData.image.split("/").pop(); // Extract filename from URL

          // Create a File object from the URL
          const imageFile = await createFileFromURL(imageUrl, filename!);

          return {
            imagePreview: imageUrl,
            imageFile, // The actual File object
          };
        });

        // Await the creation of all image files and update the state
        Promise.all(fetchedImages).then((images) => setImages(images));
      }
    }
  }, [isAuth, loading]);

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Reset the retake mode if the deleted image is the one being replaced
    if (imageToReplaceIndex?.index === index) {
      setImageToReplaceIndex(null);
    }
  };

  const updateCleaned = async () => {
    try {
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
    } catch (error) {
      console.error(error);
      alert("Error updating cleaned, refresh page");
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <h1>{step?.cleaning_checklist_item.title}</h1>
      <img
        src={
          step?.cleaning_checklist_item.image?.image
            ? step.cleaning_checklist_item.image.image
            : "https://via.placeholder.com/150"
        }
        alt="Image of item to clean"
      />
      <Typography variant="h6">
        {step?.cleaning_checklist_item.description}
      </Typography>
      <UploadImageComponent
        step_id={step_id!}
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
            image={step?.images[index]!}
            index={index}
            step_id={step_id!}
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
        onClick={updateCleaned}
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
  step_id: string;
  images: ImageObjectType[];
  setImages: React.Dispatch<React.SetStateAction<ImageObjectType[]>>;
  imageToReplaceIndex: { index: number; image_id: string } | null;
  setImageToReplaceIndex: React.Dispatch<
    React.SetStateAction<{ index: number; image_id: string } | null>
  >;
}> = ({
  step_id,
  images,
  setImages,
  imageToReplaceIndex,
  setImageToReplaceIndex,
}) => {
  const handleFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    handleFileInput.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = {
        imagePreview: URL.createObjectURL(file),
        imageFile: file,
      };

      if (imageToReplaceIndex !== null) {
        // Replace the selected image
        const updatedImages = [...images];
        updatedImages[imageToReplaceIndex.index] = newImage;
        setImages(updatedImages);
        setImageToReplaceIndex(null); // Reset after replacing

        // delete old image from backend
        try {
          const deleteResponse = axios.delete(
            `${BACKEND_URL}checklist_steps/${step_id}/delete_image/`,
            {
              data: { image_id: imageToReplaceIndex?.image_id },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          if ((await deleteResponse).status === 204) {
            console.log("Image deleted successfully");
          }
        } catch (error) {
          console.error(error);
          alert("Error deleting image, refresh page");
        }
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
