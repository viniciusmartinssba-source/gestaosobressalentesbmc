import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { X, Camera } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 md:bg-black/80 flex flex-col items-center justify-center p-0 md:p-4">
      <div className="relative w-full h-full md:h-auto md:max-w-md bg-white md:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Camera size={20} className="text-sky-600" /> Scanner de Peça
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="relative aspect-square md:aspect-auto md:h-64 overflow-hidden rounded-2xl bg-slate-100">
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  onScan(result.getText());
                }
              }}
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: "100%" }}
              videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="absolute inset-0 border-2 border-sky-500/50 rounded-2xl pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Posicione o código de barras ou QR Code da peça dentro da área marcada.
          </p>
        </div>
      </div>
    </div>
  );
};
