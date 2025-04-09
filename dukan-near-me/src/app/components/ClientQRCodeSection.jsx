"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

// Dynamically import QRCodeScanner with SSR disabled
const QRCodeScanner = dynamic(() => import("./QRCodeScanner"), { ssr: false });

export default function ClientQRCodeSection() {
  const handleScanSuccess = useCallback((text, result) => {
    console.log("Scanned QR Code:", text);
    // Add your logic here (e.g., router.push, fetch, etc.)
  }, []);

  const handleScanFailure = useCallback((error) => {
    console.warn("QR scan error:", error);
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Scan a QR Code</h2>
      <QRCodeScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
    </div>
  );
}
