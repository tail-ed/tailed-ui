"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "./input";
import { FormControl, FormField, FormLabel, FormMessage } from "./form";
import { ImageCropper } from "./image-cropper";
import * as m from "@/paraglide/messages.js";
import { cn } from "@/lib/utils";

interface UploadPhotoProps {
  changeHandler?: (imgUrl: string) => void;
  id: string;
  maxWidth: number;
  maxHeight: number;
  defaultImage?: string;
  className?: string;
  title?: string;
  description?: string;
  saveButtonText?: string;
  hoverText?: string;
  imageSizeText?: string;
  uploadText?: string;
  dragText?: string;
}

/**
 * UploadPhoto component
 * @param changeHandler A function that will be called when the image is uploaded, recieves the image name as a parameter
 * @param id The id of the input, what it's called in the form
 * @param defaultImage Optional, the Url of the default image to display, useful if you add a default value to the field and want to show that default value since rhf doesn't support file inputs with default values
 */
export const CropUploadPhoto = React.forwardRef<
  HTMLInputElement,
  UploadPhotoProps
>(
  (
    { changeHandler, id, defaultImage, className, maxWidth, maxHeight, title, description, saveButtonText, hoverText, imageSizeText, uploadText, dragText },
    ref
  ) => {
    const [image, setImage] = useState<string>(defaultImage ?? "");
    const [uploadedImage, setUploadedImage] = useState<string>(
      defaultImage ?? ""
    );
    const [isCropOpen, setIsCropOpen] = useState(false);
    const regularStyle = "bg-background dark:border-gray-600";
    const hoverStyle =
      "dark:bg-bray-800 bg-gray-100 dark:border-gray-500 dark:bg-gray-600";
    const [imageName, setImageName] = useState<string>("");
    const [dropZoneStyle, setDropZoneStyle] = useState(regularStyle);

    const { control, setValue, formState } = useFormContext();

    function handleChangeProp(imgName: string) {
      if (typeof imgName === "string") {
        changeHandler?.(imgName);
      }
    }

    function handleChangePicture(file: File) {
      setIsCropOpen(false);
      handleChangeProp(file.name);
      setImageName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e != null && e.target != null && e.target.result != null) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }

    function handleChangeUploadNewPicture(file: File) {
      setIsCropOpen(false);
      setImageName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e != null && e.target != null && e.target.result != null) {
          setUploadedImage(e.target.result as string);
          setTimeout(() => setIsCropOpen(true), 100);
        }
      };
      reader.readAsDataURL(file);
    }

    function handleClick() {
      setIsCropOpen(false);
      const input = document.getElementById(
        `${id}-dropzone-file`
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    }

    return (
      <div className="flex">
        <FormField
          name={id}
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex items-center justify-center p-2 rounded-lg shadow dark:bg-background">
                <FormLabel
                  id="dropzone-file-label"
                  htmlFor={`${id}-dropzone-file`}
                  className={`flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${dropZoneStyle}`}
                  {...useDragAndDrop({
                    onHoverEnter: () => {
                      setDropZoneStyle(hoverStyle);
                    },
                    onHoverLeave: () => {
                      setDropZoneStyle(regularStyle);
                    },
                    onDrop: (file: File) => {
                      handleChangeUploadNewPicture(file);
                    },
                  })}
                >
                  {!image ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold">
                          {uploadText}
                        </span>{" "}
                        {dragText}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {imageSizeText}
                      </p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        className={cn(
                          "rounded-lg group-hover:blur-sm transition duration-300 group-hover:opacity-40",
                          className
                        )}
                        src={image}
                        alt="Loading Photo"
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
                        {hoverText}
                      </span>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      id={`${id}-dropzone-file`}
                      type="file"
                      className="hidden"
                      onClick={handleClick}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChangeUploadNewPicture(file);
                        }
                      }}
                    />
                  </FormControl>
                </FormLabel>
              </div>
              <div className="m-auto text-center">
                <FormMessage />
              </div>
              <ImageCropper
                id={id}
                imageSrc={uploadedImage}
                isOpen={isCropOpen}
                setIsOpen={setIsCropOpen}
                logoName={imageName}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                onImageCrop={(image: File) => {
                  field.onChange(image);
                  setValue(id, image, { shouldDirty: true });
                  handleChangePicture(image);
                }}
                title={title}
                description={description}
                saveButtonText={saveButtonText}
              />
            </div>
          )}
        />
      </div>
    );
  }
);

interface DragAndDropProps {
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
  onDrop?: (file: File) => void;
}

const useDragAndDrop = (props: DragAndDropProps = {}) => {
  const onMouseEnter = () => {
    props.onHoverEnter?.();
  };
  const onMouseLeave = () => {
    props.onHoverLeave?.();
  };
  const onDragEnter = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    props.onHoverEnter?.();
  };
  const onDragLeave = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    props.onHoverLeave?.();
  };
  const onDragOver = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      props.onDrop?.(file);
    }
  };
  return {
    onMouseEnter,
    onMouseLeave,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
  };
};
