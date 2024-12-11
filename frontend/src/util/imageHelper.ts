export const getImagePreview = (image: string | File | null) => {
  if (!image) return "defaultImagePath";
  if (typeof image === "string") return image;
  return URL.createObjectURL(image);
}