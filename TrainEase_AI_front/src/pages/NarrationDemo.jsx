import React from 'react';
import NarrationPlayer from '../components/NarrationPlayer';

const NarrationDemo = () => {
  const sampleText = "Welcome to AI-powered training! This is your first narrated slide.";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <NarrationPlayer text={sampleText} />
    </div>
  );
};

export default NarrationDemo;