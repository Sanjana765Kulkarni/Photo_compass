export interface CameraConstraints {
  video: {
    facingMode: "user" | "environment";
    width: { ideal: number };
    height: { ideal: number };
  };
  audio: boolean;
}

export function getOptimalConstraints(facingMode: "user" | "environment"): CameraConstraints {
  return {
    video: {
      facingMode,
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };
}

export function captureImageFromVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement, quality = 0.8): string {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to base64
  return canvas.toDataURL("image/jpeg", quality);
}

export function resizeImageForAnalysis(video: HTMLVideoElement, canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Smaller dimensions for real-time analysis performance
  canvas.width = 320;
  canvas.height = 240;

  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to base64 with lower quality
  return canvas.toDataURL("image/jpeg", 0.5);
}

export function checkCameraSupport(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  if (!checkCameraSupport()) {
    return Promise.reject(new Error("Camera not supported"));
  }

  return navigator.mediaDevices.enumerateDevices()
    .then(devices => devices.filter(device => device.kind === 'videoinput'));
}
