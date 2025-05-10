'use client';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function QRScanner({ onScanned }) {
  const webcamRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [username, setUsername] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const id = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
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
          if (onScanned) onScanned(code.data);
          clearInterval(id);
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

  const handleSaveToken = async () => {
    if (!userId) return toast.error('No user ID detected from the QR code');
    try {
      const res = await axios.post('/api/token/create', { userId });
      toast.success('Token generated successfully');
    } catch (error) {
      console.error('Error generating token', error);
      toast.error('Error generating token');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: 'environment' }}
        className="rounded shadow w-full max-w-sm"
      />

      {userId && (
        <div className="mt-2 md:mt-4 p-2 md:p-3 bg-green-50 text-green-800 rounded max-w-sm w-full text-center">
          {/* ✅ <strong>Scanned </strong> */}
            {username && (
              <p className="mt-2 text-md font-semibold">Username: {username}</p>
            )}
          <button
            onClick={handleSaveToken}
            className="mt-4 p-2 md:px-6 md:py-2 text-white rounded cursor-pointer transition-all duration-400 ease-in-out bg-emerald-400 hover:bg-emerald-500"
          >
            Save and Generate Token
          </button>
        </div>
      )}
    </div>
  );
}
