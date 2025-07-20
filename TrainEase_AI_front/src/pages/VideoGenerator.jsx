// File: src/pages/VideoGenerator.jsx
import React, { useRef, useState } from 'react';

const VideoGenerator = ({ narrationText }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const startRecording = async () => {
    const videoElement = videoRef.current;

    // Start capturing the video
    const videoStream = videoElement.captureStream();
    const audio = await window.puter.ai.txt2speech(narrationText);
    const audioStream = audio.captureStream();

    // Combine audio and video
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current = recorder;

    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
    };

    recorder.start();
    setRecording(true);

    // Play video and audio simultaneously
    videoElement.play();
    audio.play();

    // Stop when audio ends
    audio.onended = () => {
      recorder.stop();
      setRecording(false);
      videoElement.pause();
      videoElement.currentTime = 0;
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">🎬 Avatar Video Generator</h2>

      <video
        ref={videoRef}
        src="/avatar_talk1.mp4"
        width="240"
        height="240"
        className="rounded-xl border shadow-md mb-4"
        muted
      />

      <button
        onClick={startRecording}
        disabled={recording}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {recording ? 'Recording...' : 'Generate Video'}
      </button>

      {videoURL && (
        <div>
          <h3 className="text-lg font-semibold mb-2">🎥 Your Combined Video:</h3>
          <video src={videoURL} controls className="rounded shadow-md" />
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
