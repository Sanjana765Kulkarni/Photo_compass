import { useState, useRef, useEffect } from "react";
import { Settings, Cog, Grid3X3, RotateCcw, Camera } from "lucide-react";
import { useAIAnalysis } from "@/hooks/use-ai-analysis";
import type { Photo, Settings as SettingsType } from "@shared/schema";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreamActive: boolean;
  settings?: SettingsType;
  photos: Photo[];
  onOpenGallery: () => void;
  onOpenSettings: () => void;
  onSwitchCamera: () => void;
  onCapturePhoto: () => void;
  currentFacingMode: "user" | "environment";
}

export default function CameraView({
  videoRef,
  canvasRef,
  isStreamActive,
  settings,
  photos,
  onOpenGallery,
  onOpenSettings,
  onSwitchCamera,
  onCapturePhoto,
  currentFacingMode
}: CameraViewProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const { currentScore, guidance, analyzeFrame } = useAIAnalysis();

  useEffect(() => {
    if (settings) {
      setShowGrid(settings.showGrid);
    }
  }, [settings]);

  // Real-time analysis
  useEffect(() => {
    if (isStreamActive && videoRef.current && canvasRef.current) {
      intervalRef.current = setInterval(() => {
        analyzeFrame(videoRef.current!, canvasRef.current!);
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreamActive, analyzeFrame]);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await onCapturePhoto();
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "from-green-400 to-green-500";
    if (score >= 6.5) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  const latestPhoto = photos[0];

  return (
    <>
      <div className="relative h-full w-full bg-gray-900">
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        
        {/* Canvas for analysis (hidden) */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width={640}
          height={480}
        />

        {/* Composition Grid */}
        {showGrid && (
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                background: `
                  linear-gradient(transparent 33%, rgba(255,255,255,0.3) 33%, rgba(255,255,255,0.3) 34%, transparent 34%, transparent 66%, rgba(255,255,255,0.3) 66%, rgba(255,255,255,0.3) 67%, transparent 67%),
                  linear-gradient(90deg, transparent 33%, rgba(255,255,255,0.3) 33%, rgba(255,255,255,0.3) 34%, transparent 34%, transparent 66%, rgba(255,255,255,0.3) 66%, rgba(255,255,255,0.3) 67%, transparent 67%)
                `
              }}
            />
          </div>
        )}

        {/* AI Guidance Overlay */}
        {settings?.showAIGuidance && guidance && (
          <div className="absolute top-20 left-4 right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-3 mb-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-sm font-medium text-white">{guidance}</p>
              </div>
            </div>
          </div>
        )}

        {/* Score Display */}
        <div className="absolute top-6 right-4 z-20">
          <div className={`bg-gradient-to-br ${getScoreColor(currentScore)} rounded-full w-16 h-16 flex items-center justify-center shadow-lg`}>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{currentScore.toFixed(1)}</div>
              <div className="text-xs text-white/80">Score</div>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-6 left-4 z-20 flex items-center space-x-3">
          <button 
            onClick={onOpenSettings}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Cog className="text-white w-5 h-5" />
          </button>
          <button 
            onClick={toggleGrid}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Grid3X3 className={`w-5 h-5 ${showGrid ? 'text-blue-400' : 'text-white'}`} />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="flex items-center justify-center space-x-8">
            {/* Gallery Button */}
            <button 
              onClick={onOpenGallery}
              className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30"
            >
              {latestPhoto ? (
                <img 
                  src={latestPhoto.imageData} 
                  alt="Last photo" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </button>

            {/* Capture Button */}
            <button 
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl relative disabled:opacity-70"
            >
              <div className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"></div>
              {isCapturing && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              )}
            </button>

            {/* Switch Camera Button */}
            <button 
              onClick={onSwitchCamera}
              className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <RotateCcw className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
