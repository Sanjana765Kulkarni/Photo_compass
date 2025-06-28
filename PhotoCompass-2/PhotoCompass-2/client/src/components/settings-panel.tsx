import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Settings, InsertSettings } from "@shared/schema";

interface SettingsPanelProps {
  isOpen: boolean;
  settings?: Settings;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, settings, onClose }: SettingsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: InsertSettings) => {
      const response = await apiRequest("PUT", "/api/settings", newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (setting: keyof InsertSettings, value: boolean) => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      ...settings,
      [setting]: value,
    });
  };

  const handleSliderChange = (setting: keyof InsertSettings, value: number) => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      ...settings,
      [setting]: value,
    });
  };

  if (!settings) return null;

  return (
    <div 
      className={`absolute inset-0 bg-black/95 backdrop-blur-sm transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Settings Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <X className="text-white w-6 h-6" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Camera Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Camera</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Show composition grid</span>
                  <div className="relative">
                    <button
                      onClick={() => handleToggle('showGrid', !settings.showGrid)}
                      className={`block w-12 h-6 rounded-full transition-colors ${
                        settings.showGrid ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          settings.showGrid ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Real-time AI guidance</span>
                  <div className="relative">
                    <button
                      onClick={() => handleToggle('showAIGuidance', !settings.showAIGuidance)}
                      className={`block w-12 h-6 rounded-full transition-colors ${
                        settings.showAIGuidance ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          settings.showAIGuidance ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">Analysis sensitivity</label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">Low</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={settings.sensitivity} 
                      onChange={(e) => handleSliderChange('sensitivity', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(settings.sensitivity / 10) * 100}%, #374151 ${(settings.sensitivity / 10) * 100}%, #374151 100%)`
                      }}
                    />
                    <span className="text-sm text-gray-400">High</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-white">{settings.sensitivity}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>PhotoAI v1.0.0</p>
                <p>AI-powered photography assistant</p>
                <p>© 2024 PhotoAI Team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
