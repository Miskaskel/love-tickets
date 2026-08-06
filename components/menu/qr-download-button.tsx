"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
}

export function QrDownloadButton({ codigo, titulo }: { codigo: string; titulo: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const url = `${getSiteUrl()}/ticket/${codigo}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
        color: { dark: "#6E1423", light: "#F8F2E4" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `love-ticket-${codigo}.png`;
      a.click();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={loading} title={`QR do ticket: ${titulo}`}>
      <QrCode className="w-3.5 h-3.5" />
      {loading ? "Gerando..." : "Baixar QR Code"}
    </Button>
  );
}
