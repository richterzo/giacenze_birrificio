"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ProductResponse = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
};

export function BarcodeScannerForm() {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<ProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "barcode-reader";

  async function handleScan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await searchProduct(barcode);
  }

  async function searchProduct(code: string) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Errore nella scansione");
      } else {
        setResult(data);
      }
    } catch {
      setError("Errore di rete, riprova");
    } finally {
      setLoading(false);
    }
  }

  async function startScanning() {
    setCameraError(null);
    
    // Controllo preliminare supporto MediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "Il tuo browser non supporta l'accesso alla fotocamera. Prova con Chrome o Safari."
      );
      return;
    }

    try {
      // Prima richiedi permesso camera esplicitamente
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;

      // Prova prima con camera posteriore
      const cameras = await Html5Qrcode.getCameras();
      let cameraId: string | { facingMode: string };
      
      if (cameras && cameras.length > 0) {
        // Usa l'ultima camera (solitamente quella posteriore)
        cameraId = cameras[cameras.length - 1].id;
      } else {
        // Fallback a facingMode
        cameraId = { facingMode: "environment" };
      }

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778,
          disableFlip: false,
        },
        (decodedText) => {
          // Barcode rilevato con successo
          setBarcode(decodedText);
          searchProduct(decodedText);
          stopScanning();
        },
        () => {
          // Errore di scansione ignorato (normale quando non trova codici)
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      let errorMessage = "Impossibile accedere alla fotocamera.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permesso fotocamera negato. Autorizza nelle impostazioni del browser.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "Nessuna fotocamera trovata sul dispositivo.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Fotocamera già in uso da un'altra app. Chiudila e riprova.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Fotocamera non supporta le configurazioni richieste.";
      } else if (err.message) {
        errorMessage = `Errore: ${err.message}`;
      }
      
      setCameraError(errorMessage);
      console.error("Camera error:", err);
    }
  }

  async function stopScanning() {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Scansione codice a barre
      </h2>

      {!isScanning ? (
        <>
          <form onSubmit={handleScan} className="space-y-3">
            <input
              type="text"
              required
              placeholder="EAN o codice interno"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Ricerca..." : "Cerca"}
              </button>
              <button
                type="button"
                onClick={startScanning}
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                📷 Fotocamera
              </button>
            </div>
          </form>
          {cameraError && (
            <p className="mt-3 text-sm text-red-600">{cameraError}</p>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div
            id={scannerContainerId}
            className="overflow-hidden rounded-md border border-zinc-300"
          />
          <button
            type="button"
            onClick={stopScanning}
            className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            ⏹ Ferma scansione
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          <p className="font-semibold">{result.name}</p>
          <p>SKU: {result.sku}</p>
          <p>Barcode: {result.barcode}</p>
          <p>Disponibilità: {result.quantity}</p>
        </div>
      )}
    </div>
  );
}

