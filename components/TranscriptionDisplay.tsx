
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface TranscriptionDisplayProps {
  text: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 relative">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Transcription Result</h3>
      <div className="w-full h-64 p-4 bg-gray-900 rounded-md text-gray-300 overflow-y-auto whitespace-pre-wrap">
        {text}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full text-gray-400 hover:bg-teal-500 hover:text-white transition-all duration-200"
        aria-label="Copy to clipboard"
      >
        {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default TranscriptionDisplay;
