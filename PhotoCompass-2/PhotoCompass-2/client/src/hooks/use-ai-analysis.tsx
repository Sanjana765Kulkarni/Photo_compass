import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAIAnalysis() {
  const [currentScore, setCurrentScore] = useState(7.5);
  const [guidance, setGuidance] = useState<string | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/analyze", { imageData });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentScore(data.score);
      setGuidance(data.analysis.guidance);
    },
    onError: () => {
      // Silently fail for real-time analysis
    },
  });

  const analyzeFrame = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions for analysis (smaller for performance)
    canvas.width = 320;
    canvas.height = 240;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 (lower quality for real-time analysis)
    const imageData = canvas.toDataURL("image/jpeg", 0.5);
    
    // Analyze frame
    analyzeMutation.mutate(imageData);
  }, [analyzeMutation]);

  return {
    currentScore,
    guidance,
    analyzeFrame,
    isAnalyzing: analyzeMutation.isPending,
  };
}
