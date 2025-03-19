import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageData {
    source: string;
    type: 'upload' | 'webcam';
    timestamp: number;
}

const ImageCommon: React.FC = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
    const [isStreamActive, setIsStreamActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { t } = useTranslation('inventory');

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: ImageData[] = [];
            Array.from(files).forEach(file => {
                const imageUrl = URL.createObjectURL(file);
                newImages.push({
                    source: imageUrl,
                    type: 'upload',
                    timestamp: Date.now()
                });
            });
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreamActive(true);
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Failed to access webcam. Please ensure you've granted camera permissions.");
        }
    };

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setIsStreamActive(false);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current && isStreamActive) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL('image/png');
                setImages(prev => [...prev, {
                    source: imageUrl,
                    type: 'webcam',
                    timestamp: Date.now()
                }]);
            }
        }
    };

    const deleteImage = (timestamp: number) => { setImages(prev => prev.filter(img => img.timestamp !== timestamp)); };
    const handleTabChange = (tab: 'upload' | 'webcam') => {
        setActiveTab(tab);
        if (tab === 'webcam' && !isStreamActive) {
            startWebcam();
        } else if (tab === 'upload' && isStreamActive) {
            stopWebcam();
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{t("image_capture")}</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        {t("image_capture_desc")}
                    </p>
                </div>

                {/* Tab navigation */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange('upload')}
                            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'upload'
                                ? 'text-[#2563eb] border-b-2 border-[#3b82f6]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {t("upload_image")}
                        </button>
                        <button
                            onClick={() => handleTabChange('webcam')}
                            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'webcam'
                                ? 'text-[#2563eb] border-b-2 border-[#3b82f6]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {t("webcam_capture")}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'upload' ? (
                            <div className="flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />
                                <div onClick={triggerFileInput} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#3b82f6] transition-colors">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48">
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {t("browse_or_drag")}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t("file_formats")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="relative w-full max-w-lg mx-auto mb-4 bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full"
                                    />
                                </div>
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="flex space-x-4">
                                    {!isStreamActive ? (
                                        <button onClick={startWebcam} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]">
                                            {t("start_camera")}
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={captureImage} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#22c55e] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28a745]">
                                                {t("capture_image")}
                                            </button>
                                            <button onClick={stopWebcam} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#dc2626] hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444]" >
                                                {t("stop_camera")}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image gallery */}
                {images.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">{t("captured_images")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div key={image.timestamp} className="relative group border rounded-lg overflow-hidden">
                                    <img
                                        src={image.source}
                                        alt={`Captured at ${new Date(image.timestamp).toLocaleString()}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button onClick={() => deleteImage(image.timestamp)} className="p-1 bg-[#dc2626] rounded-full text-white hover:bg-[#b91c1c] focus:outline-none">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                                        <div>{image.type === 'upload' ? 'Uploaded' : 'Webcam'}</div>
                                        <div>{new Date(image.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCommon;