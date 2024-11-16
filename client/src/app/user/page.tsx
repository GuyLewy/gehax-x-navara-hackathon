"use client";
import Image from "next/image";
import React from 'react';
import { FormEvent, ChangeEventHandler, useState } from "react";

export const fileToDataString = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result as string);
  });
};

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewImgUrl, setPreviewimgUrl] = useState("");

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.target.files as FileList;
    setSelectedImage(file?.[0]);
    if (!file) {
      return;
    }
    try {
      const imgUrl = await fileToDataString(file?.[0]);
      setPreviewimgUrl(imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
      {previewImgUrl && (
        <div className="image_wrapper">
          <img src={previewImgUrl} />
        </div>
      )}
      <form >
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </form>
    </div>
    
  );
}
