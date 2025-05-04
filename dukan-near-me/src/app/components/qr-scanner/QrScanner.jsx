'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import Link from 'next/link';

export default function QRScanner() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  // Start scanning
  useEffect(() => {
    const id = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          setResult(code.data);
          if (intervalId) clearInterval(intervalId);
        }
      };
    }, 1000);
    setIntervalId(id); // Set the interval ID after starting the interval

    // Cleanup when component unmounts or when interval changes
    return () => {
      clearInterval(id); // Clear interval on component unmount
      stopCamera(); // Stop camera when component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const stopCamera = () => {
    if (webcamRef.current) {
      const stream = webcamRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop all media tracks
      }
    }
  };

  const handleClickResult = () => {
    stopCamera(); // Stop camera when QR result is clicked
  };

  return (
    <div className="flex flex-col items-center justify-center  p-4">

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: 'environment' }}
        className="rounded shadow w-full max-w-sm"
      />

      {result && (
        <p className="mt-4 p-3 bg-green-100 text-green-800 rounded max-w-sm w-full text-center">
          ✅ <strong>Scanned:</strong>
          <Link href={result}  className="text-blue-500 underline" onClick={handleClickResult}>
            {result}
          </Link>
        </p>
      )}
    </div>
  );
}
