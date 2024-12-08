import { Label } from "@/components/ui/label";
import { FileIcon, UploadCloud, X as XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import axios from "axios";

function ProductImageUpload({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, isEditMode }) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false); // Upload state
  const [uploadError, setUploadError] = useState(null); // Error state

  // Handle file input change
  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setUploadedImageUrl(previewUrl);
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      const previewUrl = URL.createObjectURL(droppedFile);
      setUploadedImageUrl(previewUrl);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadedImageUrl(null);
    setUploadError(null); // Clear errors
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Upload image to server
  const uploadImageToCloudinary = useCallback(async () => {
    if (!imageFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        "http://localhost:5000/api/admin/product/upload-image",
        data
      );

      if (response.data?.success) {
        setUploadedImageUrl(response.data.url); // Update URL from server response
      } else {
        throw new Error(response.data.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [imageFile, setUploadedImageUrl]);

  // Trigger image upload on file selection
  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
  }, [imageFile, uploadImageToCloudinary]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center"
      >
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode} // Disable input in edit mode
        />
        {!imageFile && !uploadedImageUrl ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer`}
          >
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-muted-foreground">Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Uploaded Preview"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            )}
            <div className="flex items-center gap-2">
              {imageFile ? (
                <>
                  <FileIcon className="w-8 h-8 text-primary" />
                  <p className="text-sm font-medium">{imageFile.name}</p>
                </>
              ) : (
                <p className="text-sm font-medium">Existing Image</p>
              )}
            </div>
            {!isEditMode && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Uploading State */}
      {isUploading && <p className="text-sm text-blue-600 mt-2">Uploading image...</p>}
      {/* Error State */}
      {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
    </div>
  );
}

ProductImageUpload.propTypes = {
  imageFile: PropTypes.object,
  setImageFile: PropTypes.func.isRequired,
  uploadedImageUrl: PropTypes.string,
  setUploadedImageUrl: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool, // Add validation for isEditMode
};

export default ProductImageUpload;
