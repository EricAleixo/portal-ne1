"use client";

import { getCroppedImage } from "@/app/_utils/CropImage";
import { userServiceClient } from "@/services/user.service";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";

interface ProfilePhotoUploadProps {
  initialPhoto: string;
  userName: string;
  userId: number;
}

export const ProfilePhotoUpload = ({
  initialPhoto,
  userName,
  userId,
}: ProfilePhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState(initialPhoto);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageSrc(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!imageSrc) return;

    setLoading(true);

    try {
      const croppedFile = await getCroppedImage(imageSrc, crop, zoom);
      const result = await userServiceClient.updateProfileImage(
        userId,
        croppedFile
      );

      setPreview(result.photoProfile);
      setImageSrc(null);
    } catch (e) {
      console.error("Erro ao atualizar foto", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <img
          src={preview}
          alt={`Foto de ${userName}`}
          className="w-24 h-24 rounded-full object-cover border cursor-pointer"
          onClick={() => inputRef.current?.click()}
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition"
        >
          Alterar
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelectFile}
      />

      {imageSrc && (
        <div className="relative w-64 h-64 bg-black rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>
      )}

      {imageSrc && (
        <button
          disabled={loading}
          onClick={handleSave}
          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar nova foto"}
        </button>
      )}
    </div>
  );
};
