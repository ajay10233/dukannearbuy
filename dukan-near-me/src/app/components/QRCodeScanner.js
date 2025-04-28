"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export default function QRCodeScanner() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (scanning) {
      const html5QrCode = new Html5Qrcode("qr-reader");

      const config = { fps: 10, qrbox: { width: 300, height: 300 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          alert(`Scanned QR Code: ${decodedText}`);
        
          // Optionally stop scanning after a successful scan
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            setScanning(false); // update state to stop scanning button
          });
        },
        (errorMessage) => {
          // You can log scan errors if needed
          console.warn("Scan error:", errorMessage);
        }
      ).catch((err) => {
        console.error("QR Code scanning failed to start", err);
      });

      scannerRef.current = html5QrCode;

      return () => {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        });
      };
    }
  }, [scanning]);

  return (
    <div>
      <button onClick={() => setScanning((prev) => !prev)}>
        {scanning ? "Stop Scanning" : "Start QR Scanner"}
      </button>
      <div id="qr-reader" style={{ width: "300px", marginTop: "1rem" }}></div>
    </div>
  );
}
