import React, { useEffect, useRef, useState } from 'react';

const TriplePolaroidStrip = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const captureDelays = [3000, 6000, 9000];
        captureDelays.forEach((delay, index) => {
          setTimeout(() => {
            capturePhoto(index);
            if (index === 2) setCaptured(true);
          }, delay);
        });
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    init();
  }, []);

  const capturePhoto = (photoIndex) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const frameWidth = 350;
    const frameHeight = 450;
    const imageWidth = 300;
    const imageHeight = 350;
    const startX = 25;
    const startY = 25 + photoIndex * frameHeight;

    // White Polaroid frame
    ctx.fillStyle = 'white';
    ctx.fillRect(0, photoIndex * frameHeight, frameWidth, frameHeight);

    // Maintain aspect ratio: drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    const videoAspect = video.videoWidth / video.videoHeight;
    const targetAspect = imageWidth / imageHeight;

    let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

    if (videoAspect > targetAspect) {
      // Webcam is wider — crop sides
      const newWidth = video.videoHeight * targetAspect;
      sx = (video.videoWidth - newWidth) / 2;
      sWidth = newWidth;
    } else {
      // Webcam is taller — crop top/bottom
      const newHeight = video.videoWidth / targetAspect;
      sy = (video.videoHeight - newHeight) / 2;
      sHeight = newHeight;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, startX, startY, imageWidth, imageHeight);

    // Caption text
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Photo ${photoIndex + 1}`, 125, startY + imageHeight + 40);
  };

  const downloadStrip = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'polaroid-strip.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>📷 Polaroid Strip Generator</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="300"
        style={{ display: captured ? 'none' : 'block', borderRadius: '8px' }}
      />

      <canvas
        ref={canvasRef}
        width={350}
        height={1350}
        style={{ display: captured ? 'block' : 'none', marginTop: '20px', border: '2px solid #ccc', background: '#fff' }}
      />

      {captured && (
        <button
          onClick={downloadStrip}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Download Polaroid Strip
        </button>
      )}
    </div>
  );
};

export default TriplePolaroidStrip;
