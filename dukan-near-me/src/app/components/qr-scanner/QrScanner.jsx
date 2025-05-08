import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import Link from 'next/link';

export default function QRScanner() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [copied, setCopied] = useState(false); // for showing "Copied!" message

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

    setIntervalId(id);

    return () => {
      clearInterval(id);
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (webcamRef.current) {
      const stream = webcamRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleClickResult = () => {
    stopCamera();
  };

  const handleCopy = () => {
    const userId = result.split('/').pop();
    navigator.clipboard.writeText(userId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: 'environment' }}
        className="rounded shadow w-full max-w-sm"
      />

      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded max-w-sm w-full text-center">
          ✅ <strong>Scanned:</strong>{' '}
          <Link href={result} className="text-blue-500 underline" onClick={handleClickResult}>
            {result}
          </Link>

          <button
            onClick={handleCopy}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy User ID
          </button>

          {copied && <p className="text-sm text-green-600 mt-1">✅ User ID copied!</p>}
        </div>
      )}
    </div>
  );
}
