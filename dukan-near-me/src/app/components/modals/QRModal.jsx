'use client';

import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import QRScanner from '../qr-scanner/QrScanner';
import { Scan } from 'lucide-react';

export default function QRScannerDialog({ onScanned }) {
  const closeRef = useRef(null);

  const handleScan = (data) => {
    onScanned?.(data);
    // Programmatically close the dialog
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center whitespace-nowrap bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-sm md:text-md text-white gap-2 font-medium px-4 md:px-6 py-2 rounded-md transition duration-300 ease-in-out">
          <Scan size={20} strokeWidth={1.5} color="#ffffff" /> Scan QR
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[500px] rounded-xl border-none flex flex-col bg-[#F5FAFC] overflow-auto dialogScroll">
        <DialogHeader>
          <DialogTitle className="text-center">Scan QR Code</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Place the QR code within the camera frame
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center flex-1">
          <QRScanner onScanned={handleScan} />
        </div>

        <DialogClose
          ref={closeRef}
          className="mt-4 self-center bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
        >
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
