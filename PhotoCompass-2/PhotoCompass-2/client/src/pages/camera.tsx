import { useState, useEffect } from "react";
import CameraView from "@/components/camera-view";
import PhotoGallery from "@/components/photo-gallery";
import PhotoDetail from "@/components/photo-detail";
import SettingsPanel from "@/components/settings-panel";
import { useCamera } from "@/hooks/use-camera";
import { useQuery } from "@tanstack/react-query";
import type { Photo, Settings } from "@shared/schema";

export default function CameraPage() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPhotoDetailOpen, setIsPhotoDetailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const { 
    videoRef, 
    canvasRef, 
    isStreamActive, 
    error: cameraError, 
    startCamera, 
    stopCamera, 
    switchCamera, 
    capturePhoto,
    currentFacingMode 
  } = useCamera();

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleViewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsPhotoDetailOpen(true);
  };

  const handleClosePhotoDetail = () => {
    setIsPhotoDetailOpen(false);
    setSelectedPhoto(null);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  if (cameraError) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Camera Access Required</h1>
          <p className="text-gray-300 mb-4">{cameraError}</p>
          <button
            onClick={startCamera}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <CameraView
        videoRef={videoRef}
        canvasRef={canvasRef}
        isStreamActive={isStreamActive}
        settings={settings}
        photos={photos}
        onOpenGallery={handleOpenGallery}
        onOpenSettings={handleOpenSettings}
        onSwitchCamera={switchCamera}
        onCapturePhoto={capturePhoto}
        currentFacingMode={currentFacingMode}
      />

      <PhotoGallery
        isOpen={isGalleryOpen}
        photos={photos}
        onClose={handleCloseGallery}
        onViewPhoto={handleViewPhoto}
      />

      <PhotoDetail
        isOpen={isPhotoDetailOpen}
        photo={selectedPhoto}
        onClose={handleClosePhotoDetail}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={handleCloseSettings}
      />
    </div>
  );
}
