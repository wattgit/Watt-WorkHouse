
import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicIcon, StopIcon, UploadIcon } from './Icons';

interface AudioControlProps {
  onFileSelect: (file: File) => void;
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordingTime: number;
  recorderError: string | null;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const AudioControl: React.FC<AudioControlProps> = ({
  onFileSelect,
  onRecordingComplete,
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
  recorderError
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const { isRecording: localIsRecording, recordingTime: localRecordingTime, startRecording: localStart, stopRecording: localStop, error } = useAudioRecorder(onRecordingComplete);
  
  return (
    <div className="w-full max-w-lg space-y-6">
       {error && <p className="text-red-400 text-center">{error}</p>}
       {recorderError && <p className="text-red-400 text-center">{recorderError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload */}
        <label
          htmlFor="audio-upload"
          className="group relative flex flex-col items-center justify-center h-48 p-4 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-teal-400 transition-all duration-300"
        >
          <UploadIcon className="w-12 h-12 text-gray-500 group-hover:text-teal-400 transition-colors" />
          <span className="mt-2 text-sm font-medium text-gray-400 group-hover:text-white">
            Upload an audio file
          </span>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isRecording}
          />
        </label>

        {/* Audio Recorder */}
        <div className="relative flex flex-col items-center justify-center h-48 p-4 bg-gray-800 border-2 border-transparent rounded-lg">
          {isRecording ? (
            <>
              <button
                onClick={stopRecording}
                className="flex items-center justify-center w-20 h-20 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <StopIcon className="w-8 h-8" />
              </button>
              <div className="absolute bottom-4 px-3 py-1 bg-gray-900 rounded-full text-sm font-mono text-white">
                {formatTime(recordingTime)}
              </div>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-20 h-20 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MicIcon className="w-8 h-8" />
            </button>
          )}
          <span className="mt-4 text-sm font-medium text-gray-400">
            {isRecording ? 'Recording...' : 'Record audio'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioControl;
