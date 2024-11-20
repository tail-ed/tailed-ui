import  React, { SyntheticEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MIN_DIMENSION = 50;

interface ImageCropperProps {
  id: string;
  imageSrc: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  logoName: string;
  maxWidth: number;
  maxHeight: number;
  onImageCrop: (file: File) => void;
  title?: string;
  description?: string;
  saveButtonText?: string;
}

export const ImageCropper = ({
  id,
  imageSrc,
  isOpen,
  setIsOpen,
  logoName,
  maxWidth,
  maxHeight,
  onImageCrop,
  title, 
  description,
  saveButtonText,
}:ImageCropperProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error] = useState<string>("");
  const [crop, setCrop] = useState<Crop | any>();
  const regularStyle = "bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ";
  const randomName = generateRandomString();

  const onLoadImage = (
    e: SyntheticEvent<HTMLImageElement>,
    maxWidth: number,
    maxHeight: number
  ) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: (maxWidth / naturalWidth) * 100,
        height: (maxHeight / naturalHeight) * 100,
      },
      maxWidth / maxHeight,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  function handleCrop() {
    setCanvasPreview(
      imageRef.current!,
      previewCanvasRef.current!,
      convertToPixelCrop(crop, imageRef.current!.width, imageRef.current!.height)
    );

    const newImage = previewCanvasRef.current!.toDataURL();
    const newLogo = new Image();

    newLogo.src = newImage;

    const newFile = dataURLtoFile(newImage, `${logoName}-${randomName}`);

    onImageCrop?.(newFile);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${regularStyle}`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(percentCrop) => setCrop(percentCrop)}
              keepSelection
              aspect={maxWidth / maxHeight}
              minWidth={MIN_DIMENSION}
              minHeight={MIN_DIMENSION}
              maxWidth={
                imageRef.current
                  ? (maxWidth / imageRef.current.naturalWidth) *
                    imageRef.current.width
                  : 0
              }
              maxHeight={
                imageRef.current
                  ? (maxHeight / imageRef.current.naturalHeight) *
                    imageRef.current.height
                  : 0
              }
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Upload"
                onLoad={(event: SyntheticEvent<HTMLImageElement>) =>
                  onLoadImage(event, maxWidth, maxHeight)
                }
              />
            </ReactCrop>
          )}
          {crop && (
            <canvas
              ref={previewCanvasRef}
              className="mt-4"
              style={{
                display: "none",
                border: "1px solid black",
                width: 150,
                height: 150,
              }}
            />
          )}
          <Button onClick={() => handleCrop()}>{saveButtonText}</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};


function setCanvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: any
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function generateRandomString(length = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}