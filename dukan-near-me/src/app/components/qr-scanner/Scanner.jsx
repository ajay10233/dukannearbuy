'use client';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Scanner() {
  const webcamRef = useRef(null);
  const router = useRouter();
  const [scanned, setScanned] = useState(false); 

  useEffect(() => {
    const id = setInterval(() => {
      if (scanned) return;

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
          setScanned(true); // disable scanning
          clearInterval(id);

          let institutionId = '';
          try {
            const url = new URL(code.data);
            const parts = url.pathname.split('/');
            institutionId = parts[parts.length - 1];
          } catch {
            institutionId = code.data.trim();
          }

          if (institutionId) {
            toast.success('Scan successful! Redirecting...', { duration: 2000 });
            setTimeout(() => {
              router.push(`/partnerProfile/${institutionId}`);
            }, 1500); 
          } else {
            toast.error('Invalid QR Code!');
            setScanned(false); 
          }
        }
      };
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [scanned]);

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