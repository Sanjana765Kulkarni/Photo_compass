import { X, Camera } from "lucide-react";
import type { Photo } from "@shared/schema";

interface PhotoGalleryProps {
  isOpen: boolean;
  photos: Photo[];
  onClose: () => void;
  onViewPhoto: (photo: Photo) => void;
}

export default function PhotoGallery({ isOpen, photos, onClose, onViewPhoto }: PhotoGalleryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "from-green-400 to-green-500";
    if (score >= 6.5) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  return (
    <div 
      className={`absolute inset-0 bg-black transform transition-transform duration-300 z-30 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Gallery Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Your Photos</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <X className="text-white w-6 h-6" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Camera className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No photos yet</h3>
              <p className="text-gray-400">Start capturing Instagram-worthy shots!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  onClick={() => onViewPhoto(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img 
                    src={photo.imageData} 
                    alt="Captured photo" 
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute top-2 right-2 bg-gradient-to-br ${getScoreColor(photo.score)} rounded-full px-2 py-1`}>
                    <span className="text-xs font-bold text-white">{photo.score.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
