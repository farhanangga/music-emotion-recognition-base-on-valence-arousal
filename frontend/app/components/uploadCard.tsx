"use client";

import { UploadCloud } from "lucide-react";

interface Props {
  file: File | null;
  onClick: () => void;
  onDrop: any;
  onDragOver: any;
}

export default function UploadCard({
  file,
  onClick,
  onDrop,
  onDragOver,
}: Props) {
  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="
        cursor-pointer
        rounded-3xl
        border
        border-cyan-500/20
        bg-white/5
        backdrop-blur-xl
        p-12
        text-center
        hover:border-cyan-400
        transition
      "
    >
      <UploadCloud
        className="
        mx-auto
        mb-4
        text-cyan-400
      "
        size={60}
      />

      <h2 className="text-2xl font-bold">
        Upload Audio
      </h2>

      <p className="opacity-70 mt-2">
        Drag & Drop audio file
      </p>

      <p className="text-sm opacity-50">
        MP3, WAV, FLAC
      </p>

      {file && (
        <div className="mt-6 w-full">
        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 w-60 sm:w-full">
            <p className="text-sm break-all whitespace-normal">
            {file.name}
            </p>
        </div>
        </div>
      )}
    </div>
  );
}