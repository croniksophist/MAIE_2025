import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography, Button } from "@mui/material";

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #007bff",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon fontSize="large" color="primary" />
      <Typography variant="h6">
        {isDragActive ? "Drop files here..." : "Drag & Drop files or click to upload"}
      </Typography>
      <Button variant="contained" color="primary" sx={{ marginTop: "10px" }}>
        Browse Files
      </Button>
    </Box>
  );
};

export default FileUpload;
