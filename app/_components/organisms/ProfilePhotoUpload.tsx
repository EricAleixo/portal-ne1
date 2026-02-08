"use client";
import { getCroppedImage } from "@/app/_utils/CropImage";
import { userServiceClient } from "@/services/user.service";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";

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

  // Função para pegar a primeira letra do nome
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Função para gerar cor de fundo baseada no nome
  const getAvatarColor = (name: string) => {
    const colors = [
      "from-[#283583] to-[#3d4ba8]",
      "from-[#C4161C] to-[#e01b22]",
      "from-[#5FAD56] to-[#4a9d47]",
      "from-[#F9C74F] to-[#f4a93f]",
      "from-purple-600 to-purple-700",
      "from-pink-600 to-pink-700",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Verifica se tem foto válida (não é placeholder)
  const hasValidPhoto = preview && !preview.includes("avatar-placeholder");

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

  const handleCancel = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-linear-to-r from-[#283583] via-[#5FAD56] to-[#C4161C] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Avatar Container */}
        <div 
          className="relative w-32 h-32 rounded-full cursor-pointer overflow-hidden border-4 border-white shadow-2xl ring-4 ring-gray-200 group-hover:ring-[#283583] transition-all duration-300"
          onClick={() => inputRef.current?.click()}
        >
          {hasValidPhoto ? (
            <Image
              src={preview}
              alt={`Foto de ${userName}`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div 
              className={`
                w-full h-full 
                bg-linear-to-br ${getAvatarColor(userName)}
                flex items-center justify-center
                text-white font-black text-5xl
              `}
            >
              {getInitial(userName)}
            </div>
          )}
          
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all duration-300">
            <Camera className="w-8 h-8 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wide">Alterar Foto</span>
          </div>
        </div>

        {/* Badge de upload */}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-10 h-10 bg-linear-to-br from-[#283583] to-[#3d4ba8] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-white"
        >
          <Upload className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Input file hidden */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelectFile}
      />

      {/* Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-[#283583] to-[#3d4ba8] px-6 py-4">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Ajustar Foto de Perfil
              </h3>
              <p className="text-white/80 text-sm font-medium mt-1">
                Arraste e use o zoom para ajustar sua foto
              </p>
            </div>

            {/* Cropper */}
            <div className="p-6">
              <div className="relative w-full h-80 bg-gray-900 rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              {/* Zoom Control */}
              <div className="mt-6 px-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Zoom
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#283583]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 uppercase text-sm tracking-wide"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black rounded-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 uppercase text-sm tracking-wide flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Salvar Foto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info text */}
      <p className="text-xs text-gray-200 font-semibold text-center max-w-xs">
        Clique na foto para alterar. Recomendamos uma imagem quadrada de pelo menos 400x400px.
      </p>
    </div>
  );
};