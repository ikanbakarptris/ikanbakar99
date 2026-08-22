import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropperModal } from "./ImageCropperModal";

interface FileUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  className?: string;
  aspectRatio?: number;
}

export function FileUploadButton({
  onUploadSuccess,
  folder = "gallery",
  accept = "image/*,video/*",
  label = "Unggah File",
  className = "",
  aspectRatio = 4 / 3,
}: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [pendingFileExt, setPendingFileExt] = useState<string>("");

  const doSupabaseUpload = async (file: Blob | File, fileExt: string) => {
    setUploading(true);
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
    } catch (error: any) {
      alert(`Upload gagal: ${error.message}`);
    } finally {
      setUploading(false);
      setCropImageSrc(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop() || 'jpg';
    
    // If video, bypass cropper
    if (file.type.startsWith('video/')) {
      doSupabaseUpload(file, fileExt);
      return;
    }

    // If image, read as data url to pass to cropper
    setPendingFileExt('jpg'); // cropped image is always exported as jpg blob
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result?.toString() || null);
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    doSupabaseUpload(croppedBlob, pendingFileExt);
  };

  return (
    <>
      <label className={`relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
        {uploading ? (
          <span className="animate-pulse">Mengunggah...</span>
        ) : (
          <>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {label}
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </>
  );
}
