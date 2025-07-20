import React, { useState } from 'react';

const NarrationPlayer = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      await window.puter.ai.txt2speech(text).then(audio => {
        audio.onended = () => setIsPlaying(false);
        audio.play();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-xl w-full max-w-xl bg-white">
      <h2 className="text-xl font-bold mb-2">Narration Preview</h2>
      <p className="text-gray-700 mb-4">{text}</p>
      <button
        onClick={handlePlay}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={isPlaying}
      >
        {isPlaying ? 'Playing...' : 'Play Narration'}
      </button>
    </div>
  );
};

export default NarrationPlayer;