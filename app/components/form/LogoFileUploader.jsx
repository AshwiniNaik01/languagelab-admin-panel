"use client";

import { useState } from "react";
import { FaCloudUploadAlt, FaFileImage, FaTrashAlt } from "react-icons/fa";

export default function LogoFileUploader({ onFileUploaded, initialLogoUrl }) {
  const [previewUrl, setPreviewUrl] = useState(initialLogoUrl || "");
  const [compressing, setCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Compress image helper using HTML5 canvas
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Target dimensions (max 400x400 for a quality responsive logo)
          let width = img.width;
          let height = img.height;
          const maxDim = 400;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to WebP / JPEG format with quality 0.8
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setCompressing(true);
    try {
      const compressedDataUrl = await compressImage(file);
      setPreviewUrl(compressedDataUrl);
      onFileUploaded(compressedDataUrl);
    } catch (err) {
      console.error("Image compression error", err);
    } finally {
      setCompressing(false);
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl("");
    onFileUploaded("");
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-semibold text-[#3C1E0A]">
        Institute Logo Upload
      </label>
      
      {previewUrl ? (
        <div className="relative border border-orange-500/20 bg-orange-500/5 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={previewUrl} 
              alt="Institute logo preview" 
              className="w-14 h-14 object-cover rounded-xl border border-orange-500/20 bg-white" 
            />
            <div>
              <p className="text-xs font-black text-[#3C1E0A]">Logo uploaded successfully</p>
              <p className="text-[10px] text-orange-950/60 font-semibold">Image compressed & web-optimized</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 transition"
          >
            <FaTrashAlt size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition cursor-pointer text-center ${
            dragActive 
              ? "border-orange-500 bg-orange-500/5" 
              : "border-orange-500/20 bg-[#FFF8F4]/50 hover:bg-orange-500/5 hover:border-orange-500/30"
          }`}
        >
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={onFileSelect}
          />
          <label htmlFor="logo-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <div className="p-3 bg-orange-500/10 text-orange-700 rounded-2xl mb-3">
              <FaCloudUploadAlt size={28} />
            </div>
            <p className="text-xs font-black text-[#3C1E0A]">
              {compressing ? "Compressing & optimizing..." : "Drag & drop image here or browse"}
            </p>
            <p className="text-[10px] text-orange-950/50 font-bold mt-1">
              Supports JPG, PNG, WEBP (Autocompressed)
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
