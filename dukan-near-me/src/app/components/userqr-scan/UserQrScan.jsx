'use client';

import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UserQrScan({ onScanSuccess }) {
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
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
          const extractedUserId = code.data.split('/').pop();

          try {
            const res = await axios.get(`/api/users/${extractedUserId}`);
            if (res?.data) {
              const userData = {
                userId: extractedUserId,
                username: {
                  firstName: res.data.firstName,
                  lastName: res.data.lastName,
                },
                address: res.data.address, 
                mobile: res.data.phone,
              };

              clearInterval(intervalRef.current);
              toast.success(`User found: ${res.data.firstName}`);

              // Pass userData to handleScanSuccess
              onScanSuccess?.(userData);
            }
          } catch (err) {
            toast.error('Failed to fetch user details');
            console.error(err);
          }
        }
      };
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: 'environment' }}
        className="rounded shadow w-full max-w-sm"
      />
    </div>
  );
}
