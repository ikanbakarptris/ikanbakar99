import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// Utility to create image from url
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Utility to get cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.translate(image.width / 2, image.height / 2);
  if (flip.horizontal) ctx.scale(-1, 1);
  if (flip.vertical) ctx.scale(1, -1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
        if (file) {
          const webpBlob = file as any;
          webpBlob.name = 'cropped_image.webp';
          resolve(webpBlob);
        } else {
          resolve(null);
        }
      }, 'image/webp', 0.8);
  });
}

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropperModal({ imageSrc, onCropComplete, onCancel, aspectRatio = 4 / 3 }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: any) => setZoom(zoom);

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal memproses gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm p-4">
      <div className="flex-1 relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-lg">
        <div className="flex-1 w-full text-sm text-muted-foreground flex items-center gap-2">
          <span className="text-xl">👆</span>
          <span><strong>Drag/Geser</strong> gambar untuk memposisikan.<br/><strong>Scroll/Pinch</strong> untuk zoom in/out.</span>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-5 py-2.5 rounded-lg border border-input text-sm font-medium hover:bg-accent transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex-1 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition"
          >
            {isProcessing ? "Memproses..." : "Potong & Unggah"}
          </button>
        </div>
      </div>
    </div>
  );
}
