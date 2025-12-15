import { useState, useRef } from "react";
import { Upload, X, Image, FileText } from "lucide-react";
import { cn } from "../lib/utils";

const ImageUploader = ({ onImageSelect, accept = "image/*", label = "Upload Image" }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageSelect(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />

      {!preview ? (
        <label
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all",
                isDragging ? "gradient-primary" : "bg-secondary"
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8 transition-colors",
                  isDragging ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
            </div>
            <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, JPEG up to 10MB
            </p>
          </div>
        </label>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden bg-muted/30 border border-border animate-scale-in">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain bg-secondary/50"
          />
          <button
            onClick={clearImage}
            className="absolute top-3 right-3 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent">
            <div className="flex items-center gap-2 text-background">
              <Image size={16} />
              <span className="text-sm font-medium">Image uploaded successfully</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
