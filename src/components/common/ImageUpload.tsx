import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setLoading(true);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Convert to base64 for storage
      const base64String = await convertToBase64(file);
      onImageChange(base64String);
    } catch (err) {
      console.error('Error converting image:', err);
      setError('Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ 
        display: 'block', 
        marginBottom: 4, 
        fontSize: 14, 
        fontWeight: 'bold',
        color: '#333' 
      }}>
        Avatar Image
      </label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
          padding: 8,
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
          border: '1px solid #ddd'
        }}>
          <img
            src={currentImage}
            alt="Current avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <span style={{ fontSize: 12, color: '#666', flex: 1 }}>
            Current avatar
          </span>
          <button
            type="button"
            onClick={handleRemoveImage}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={{
          border: `2px dashed ${dragActive ? '#ff5a00' : '#ccc'}`,
          borderRadius: 8,
          padding: 20,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? '#fff5f0' : '#fafafa',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {loading ? (
          <div style={{ color: '#666' }}>
            <div style={{ 
              display: 'inline-block',
              width: 20,
              height: 20,
              border: '2px solid #ff5a00',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ marginTop: 8, fontSize: 14 }}>Processing image...</div>
          </div>
        ) : (
          <div style={{ color: '#666' }}>
            <Upload size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <div style={{ fontSize: 14, marginBottom: 4 }}>
              <strong>Click to upload</strong> or drag and drop
            </div>
            <div style={{ fontSize: 12 }}>
              JPEG, PNG, GIF, WebP up to {maxSize}MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          color: '#ff0000',
          fontSize: 12,
          marginTop: 4,
          padding: 4,
          backgroundColor: '#ffe6e6',
          borderRadius: 4,
          border: '1px solid #ffcccc'
        }}>
          {error}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ImageUpload;