"use client";

import { useState } from "react";

export default function Upload({ images, setImages, next }) {
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = async (files) => {
    setError(null);
    const fileList = Array.from(files);

    const validFiles = [];
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 10MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    const remainingSlots = 5 - images.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      setError("Maximum 5 screenshots. Extra files were ignored.");
    }

    const newImages = await Promise.all(
      filesToProcess.map((file) => toDataUrl(file))
    );

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-[#09090b] tracking-tight">Upload Screenshots</h2>
        <p className="text-[#52525b] text-sm max-w-md mx-auto">
          Add up to 5 screenshots of your conversation. We support WhatsApp, Instagram, iMessage, and more.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${
          dragging
            ? "border-[#18181b] bg-black/5"
            : "border-[#e4e4e7] bg-[#fafafa] hover:border-[#18181b] hover:bg-black/5"
        } ${images.length >= 5 ? "opacity-40 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={images.length >= 5}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="w-16 h-16 bg-white border border-[#e4e4e7] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm text-2xl text-[#18181b]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <span className="inline-block px-8 py-3 bg-[#18181b] text-white text-sm font-semibold rounded-full hover:bg-[#27272a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Select Screenshots
          </span>
          <p className="mt-5 text-xs font-medium text-[#71717a]">
            or drag and drop here · <span className="font-bold text-[#18181b]">{images.length}/5</span> added
          </p>
        </label>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden border border-[#e4e4e7] aspect-[3/4] shadow-sm bg-white"
            >
              <img
                src={img}
                alt={`Screenshot ${idx + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#18181b] rounded-full w-8 h-8 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all border border-[#e4e4e7] shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-end pt-6 border-t border-[#e4e4e7]">
        <button
          onClick={next}
          disabled={images.length === 0}
          className="px-10 py-3.5 bg-[#18181b] text-white rounded-full font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#27272a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}