import QRCodeStyling from 'qr-code-styling';
import { QRCodeProps } from '../Designer/interfaces';

export const generateQRCodeDataUrl = async (qrProps: QRCodeProps): Promise<string> => {
  try {
    const qrCode = new QRCodeStyling({
      width: qrProps.size || 128,
      height: qrProps.size || 128,
      type: 'canvas',
      data: qrProps.value || '',
      image: qrProps.imageSettings?.src || undefined,
      margin: qrProps.marginSize || 1,
      qrOptions: {
        errorCorrectionLevel: qrProps.level || 'M',
      },
      imageOptions: {
        hideBackgroundDots: qrProps.imageSettings?.excavate ?? true,
        imageSize: (qrProps.imageSettings?.width || 16) / (qrProps.size || 128),
        margin: 0,
      },
      dotsOptions: {
        color: qrProps.fgColor || '#000000',
        type: 'square',
      },
      backgroundOptions: {
        color: qrProps.bgColor || '#FFFFFF',
      },
    });

    // Get the QR code as a Blob
    const blob = await qrCode.getRawData('png');

    // Check if blob is valid
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Failed to generate QR code: Invalid or null blob');
    }

    // Convert Blob to Data URL
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert Blob to Data URL'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading Blob'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return ''; // Return empty string as fallback
  }
};