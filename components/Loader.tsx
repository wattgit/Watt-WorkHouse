
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
      <p className="text-lg text-gray-300 font-semibold">{message}</p>
    </div>
  );
};

export default Loader;
