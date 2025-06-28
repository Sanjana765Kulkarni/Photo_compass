import { ArrowLeft, Share } from "lucide-react";
import type { Photo, AIAnalysis } from "@shared/schema";

interface PhotoDetailProps {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
}

export default function PhotoDetail({ isOpen, photo, onClose }: PhotoDetailProps) {
  if (!photo) return null;

  const analysis: AIAnalysis = JSON.parse(photo.analysis);
  
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "from-green-400 to-green-500";
    if (score >= 6.5) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  const getProgressWidth = (score: number) => {
    return `${(score / 10) * 100}%`;
  };

  const getProgressColor = (score: number) => {
    if (score >= 8.5) return "bg-green-400";
    if (score >= 6.5) return "bg-yellow-400";
    return "bg-red-400";
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const response = await fetch(photo.imageData);
        const blob = await response.blob();
        const file = new File([blob], `photo-score-${photo.score}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          title: `My photo scored ${photo.score}/10!`,
          text: `Check out this Instagram-worthy shot I took with PhotoAI - scored ${photo.score}/10!`,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div 
      className={`absolute inset-0 bg-black transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Photo Detail Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="text-white w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className={`bg-gradient-to-br ${getScoreColor(photo.score)} rounded-full px-3 py-1`}>
              <span className="text-sm font-bold text-white">{photo.score.toFixed(1)}</span>
            </div>
            <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center">
              <Share className="text-white w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Photo Display */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img 
            src={photo.imageData} 
            alt="Selected photo" 
            className="max-w-full max-h-full object-contain rounded-lg" 
          />
        </div>

        {/* AI Analysis Panel */}
        <div className="bg-gray-900 p-4 rounded-t-3xl">
          <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
          
          <div className="space-y-4">
            {/* Score Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Score Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Composition</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(analysis.composition)} rounded-full`}
                        style={{ width: getProgressWidth(analysis.composition) }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{analysis.composition}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Lighting</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(analysis.lighting)} rounded-full`}
                        style={{ width: getProgressWidth(analysis.lighting) }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{analysis.lighting}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Focus</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(analysis.focus)} rounded-full`}
                        style={{ width: getProgressWidth(analysis.focus) }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{analysis.focus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Great */}
            {analysis.positives.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">What's Great</h4>
                <div className="space-y-2">
                  {analysis.positives.map((positive, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-white">{positive}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions for Improvement */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Next Time Try</h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-white">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
