
import { useState, useRef, useCallback } from 'react';

type AudioRecorderHook = {
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
};

export const useAudioRecorder = (onRecordingComplete: (blob: Blob) => void): AudioRecorderHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied. Please allow microphone permissions in your browser settings.");
    }
  }, [isRecording, onRecordingComplete, startTimer]);

  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopTimer();
  }, [isRecording, stopTimer]);
  
  return { isRecording, recordingTime, startRecording, stopRecording, error };
};
