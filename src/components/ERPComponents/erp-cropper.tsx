import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useEffect } from "react";
import ERPFileUploadButton from "./erp-file-upload-button";
import ERPModal from "./erp-modal";
import ERPButton from "./erp-button";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { handleResponse } from "../../utilities/HandleResponse";
import { postAction } from "../../redux/slices/app-thunks";
import { useTranslation } from "react-i18next";

const TO_RADIANS = Math.PI / 180;
export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: any
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);
    return () => {
      clearTimeout(t);
    };
  }, deps);
}

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 40,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

type ERPCropperProps = {
  closeModal?: any;
  apiUrl: string;
  useCircle?: boolean;
  onImageSuccess: (str: string) => void;
};

const ERPCropper: React.FC<ERPCropperProps> = ({
  closeModal,
  apiUrl,
  useCircle = false,
  onImageSuccess = () => { }
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('main');
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number>(1 / 1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = async () => {
    setIsLoading(true);
    const blob = await createCropImage();
    const base64String = await convertBlobToBase64(blob);
    let res = await dispatch(
      postAction({ apiUrl: apiUrl, data: { base64: base64String } }) as any
    );
    setIsLoading(false);
    handleResponse(res, () => {
      setIsOpen(false);
      setImgSrc("");
      onImageSuccess(res.payload.item);
      setIsOpen(false);
    });
  };

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() ?? "");
        let img = reader.result?.toString() ?? "";
        let img2 = reader.result?.toString();
        if (img2 != undefined && img2 != null && img2 != "") {
          setIsOpen(true);
          setImgSrc(img2);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }
  async function createCropImage() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    return blob;
  }
  async function onDownloadCropClick() {
    const blob = await createCropImage();
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  }

  async function convertBlobToBase64(blob: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  const PopUpModal = () => {
    return (
      <div className="w-full pt-4">
        <div className="grid grid-cols-12 gap-x-6 max-h-fit">
          <div className="xxl:col-span-6 xl:col-span-6  col-span-6">
            {!!imgSrc && (
              <ReactCrop
                circularCrop={useCircle}
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}>
                <img
                  ref={imgRef}
                  alt={t("crop_me")}
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>

          <div className="xxl:col-span-6 xl:col-span-6  col-span-6">
            {!!completedCrop && (
              <>
                <div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                      objectFit: "contain",
                      width: 150,
                      height: 150,
                    }}
                  />
                </div>
                <div>
                  <button onClick={onDownloadCropClick}>{t("download_crop")}</button>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {t("security_error_when_downloading")}
                  </div>
                  <a href="#hidden" ref={hiddenAnchorRef} download
                    style={{ position: "absolute", top: "-200vh", visibility: "hidden" }}>
                    {t("hidden_download")}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <ERPButton
            type="button"
            className="primary"
            loading={isLoading}
            onClick={onSubmit}
            title={t("save")}
          />

          <ERPButton
            type="reset"
            className="secondary"
            onClick={() => {
              setIsOpen(false);
              setImgSrc("");
            }}
            disabled={isLoading}
            title={t("cancel")}
          />
        </div>
      </div>
    );
  };
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(1 / 1);
    } else {
      setAspect(16 / 9);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  return (
    <div className="App">
      <div className="Crop-Controls">
        {(imgSrc == undefined || imgSrc != null || imgSrc != "") && (
          <ERPFileUploadButton
            buttonText={t("upload_image")}
            handleFileChange={onSelectFile}
          />
        )}
        {imgSrc != undefined && imgSrc != null && imgSrc != "" && (
          <ERPModal
            isOpen={isOpen}
            title={t("crop_image")}
            isForm={true}
            closeModal={() => {
              setIsOpen(false);
            }}
            content={PopUpModal()}
          />
        )}
        {/* <input type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target?.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target?.value))))
            }
          />
        </div>
        <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? 'off' : 'on'}
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default React.memo(ERPCropper);
export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();
  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
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