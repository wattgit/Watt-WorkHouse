
import React, { useState, useCallback } from 'react';
import { AppStatus, AudioData } from './types';
import { transcribeAudio } from './services/geminiService';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { ResetIcon } from './components/Icons';
import AudioControl from './components/AudioControl';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import Loader from './components/Loader';
import ActionButton from './components/ActionButton';

const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRecordingComplete = useCallback(async (blob: Blob) => {
    setStatus(AppStatus.IDLE);
    try {
      const base64 = await fileToBase64(blob);
      setAudioData({
        base64,
        mimeType: blob.type,
        fileName: `recording-${new Date().toISOString()}.webm`,
      });
    } catch (err) {
      setError('Failed to process recording.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const { isRecording, recordingTime, startRecording, stopRecording, error: recorderError } = useAudioRecorder(handleRecordingComplete);
  
  const handleStartRecording = () => {
    setAudioData(null);
    setTranscript('');
    setError('');
    setStatus(AppStatus.RECORDING);
    startRecording();
  };
  
  const handleStopRecording = () => {
    stopRecording();
    // Status will be set to IDLE by handleRecordingComplete
  };


  const handleFileSelect = async (file: File) => {
    setAudioData(null);
    setTranscript('');
    setError('');
    try {
      const base64 = await fileToBase64(file);
      setAudioData({
        base64,
        mimeType: file.type,
        fileName: file.name,
      });
    } catch (err) {
      setError('Failed to read file.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleTranscribe = async () => {
    if (!audioData) return;
    setStatus(AppStatus.PROCESSING);
    setError('');
    try {
      const result = await transcribeAudio(audioData.base64, audioData.mimeType);
      if (result.startsWith('Error:')) {
         throw new Error(result.replace('Error: ', ''));
      }
      setTranscript(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setAudioData(null);
    setTranscript('');
    setError('');
  };

  const renderContent = () => {
    switch (status) {
      case AppStatus.PROCESSING:
        return <Loader message="Analyzing audio... The AI is thinking." />;
      case AppStatus.SUCCESS:
        return <TranscriptionDisplay text={transcript} />;
      case AppStatus.ERROR:
        return (
          <div className="text-center bg-red-900/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-red-400 mb-2">Transcription Failed</h3>
            <p className="text-red-300">{error}</p>
          </div>
        );
      case AppStatus.IDLE:
      case AppStatus.RECORDING:
      default:
        return (
          <AudioControl
            onFileSelect={handleFileSelect}
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            startRecording={handleStartRecording}
            stopRecording={handleStopRecording}
            recordingTime={recordingTime}
            recorderError={recorderError}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            EchoScribe AI
          </h1>
          <p className="mt-2 text-lg text-gray-400">Your Personal Audio-to-Text Assistant</p>
        </header>

        <div className="w-full p-8 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700/50 min-h-[300px] flex items-center justify-center">
            {renderContent()}
        </div>

        {audioData && status !== AppStatus.PROCESSING && status !== AppStatus.RECORDING && (
          <div className="text-center p-3 bg-gray-700 rounded-full text-sm font-mono text-teal-300">
            Ready to transcribe: {audioData.fileName}
          </div>
        )}

        <footer className="flex items-center space-x-4">
          {status === AppStatus.IDLE && audioData && (
            <ActionButton onClick={handleTranscribe} disabled={!audioData}>
              Transcribe Audio
            </ActionButton>
          )}

          {(status === AppStatus.SUCCESS || status === AppStatus.ERROR || audioData) && status !== AppStatus.RECORDING && status !== AppStatus.PROCESSING && (
            <ActionButton onClick={handleReset} variant="secondary">
              <span className="flex items-center gap-2">
                <ResetIcon className="w-5 h-5" /> Start Over
              </span>
            </ActionButton>
          )}
        </footer>
      </main>
    </div>
  );
};

export default App;
