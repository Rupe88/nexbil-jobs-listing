'use client';

import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0]) return;

      const file = e.target.files[0];
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative w-full h-60 rounded-md overflow-hidden">
          <div className="absolute inset-0">
            <Image
              fill
              className="object-cover"
              alt="Upload preview"
              src={value}
            />
          </div>
          <div className="absolute inset-0 hover:bg-black/30 transition flex items-center justify-center gap-2">
            <button
              onClick={() => onRemove(value)}
              className="p-2 bg-white rounded-full hover:scale-110 transition"
              type="button"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-60 relative rounded-md flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <label className="w-full h-full">
              <div className="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                <ImagePlus className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload an image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                disabled={disabled || isLoading}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;