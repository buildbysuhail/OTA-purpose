import QRCodeStyling, { Gradient } from "qr-code-styling";
import { QRCodeProps } from "../Designer/interfaces";

interface MyGradient {
  type?: "linear" | "radial";
  rotation?: number;
  colorStops: { offset: number; color: string }[];
}

function normalizeGradient(g?: MyGradient): Gradient | undefined {
  if (!g || !g.type || !g.colorStops) return undefined;
  return {
    type: g.type,
    rotation: g.rotation,
    colorStops: g.colorStops,
  };
}

export const generateQRCodeDataUrl = async (
  qrProps: QRCodeProps
): Promise<string> => {
  try {
    const qrCode = new QRCodeStyling({
      width: qrProps.width || 128,
      height: qrProps.height || 128,
      type: qrProps.type || "canvas",
      data: qrProps.value || "",
      margin: qrProps.margin ?? 0,
      qrOptions: {
        errorCorrectionLevel: qrProps.level || "M",
      },
      image: qrProps.image,
      imageOptions: qrProps.imageOptions
        ? {
            hideBackgroundDots: qrProps.imageOptions.hideBackgroundDots,
            imageSize: qrProps.imageOptions.imageSize,
            margin: qrProps.imageOptions.margin,
            crossOrigin: qrProps.imageOptions.crossOrigin,
          }
        : undefined,
      backgroundOptions: qrProps.backgroundOptions
        ? {
            color: qrProps.backgroundOptions.color,
            gradient: normalizeGradient(
              qrProps.backgroundOptions.gradient
            ),
          }
        : undefined,
      dotsOptions: qrProps.dotsOptions
        ? {
            color: qrProps.dotsOptions.color,
            gradient: normalizeGradient(qrProps.dotsOptions.gradient),
            type: qrProps.dotsOptions.type,
          }
        : undefined,
      cornersSquareOptions: qrProps.cornersSquareOptions
        ? {
            color: qrProps.cornersSquareOptions.color,
            gradient: normalizeGradient(
              qrProps.cornersSquareOptions.gradient
            ),
            type: qrProps.cornersSquareOptions.type,
          }
        : undefined,
      cornersDotOptions: qrProps.cornersDotOptions
        ? {
            color: qrProps.cornersDotOptions.color,
            gradient: normalizeGradient(
              qrProps.cornersDotOptions.gradient
            ),
            type: qrProps.cornersDotOptions.type,
          }
        : undefined,
    });

    const blob = await qrCode.getRawData("png");
    if (!blob || !(blob instanceof Blob)) {
      throw new Error("Failed to generate QR code: Invalid or null blob");
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to convert Blob to Data URL"));
      };
      reader.onerror = () => reject(new Error("Error reading Blob"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
};
