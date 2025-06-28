import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useCamera() {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<"user" | "environment">("environment");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const capturePhotoMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/photos", { imageData });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Photo captured!",
        description: "Your photo has been analyzed and saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save photo.",
        variant: "destructive",
      });
    },
  });

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Try with specific facing mode first
      let constraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn("Failed with specific facing mode, trying fallback:", err);
        // Fallback to basic video constraints without facing mode
        const fallbackConstraints = {
          video: true,
          audio: false,
        };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (errorMessage.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (errorMessage.includes("not found")) {
        setError("No camera found. Please check your device has a working camera.");
      } else {
        setError("Unable to access camera. Please ensure you have granted camera permissions and your camera is not being used by another app.");
      }
      setIsStreamActive(false);
    }
  }, [currentFacingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreamActive(false);
  }, []);

  const switchCamera = useCallback(async () => {
    stopCamera();
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
    setCurrentFacingMode(newFacingMode);
    // Restart camera with new facing mode
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [stopCamera, currentFacingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    
    // Save photo
    capturePhotoMutation.mutate(imageData);
  }, [capturePhotoMutation]);

  return {
    videoRef,
    canvasRef,
    isStreamActive,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    currentFacingMode,
  };
}
