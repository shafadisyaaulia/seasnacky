"use client";

import { useState } from "react";
import { Activity, ExternalLink, Play, Pause } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function LogsPage() {
  const [isGrafanaRunning, setIsGrafanaRunning] = useState(false);
  const grafanaUrl = "http://localhost:3001";
  const lokiUrl = "http://localhost:3100";

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" size={36} />
            <h1 className="text-3xl font-bold text-gray-900">📊 System Logs (Grafana + Loki)</h1>
          </div>
          <a
            href={grafanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <ExternalLink size={18} />
            Buka Grafana Fullscreen
          </a>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Grafana Dashboard</p>
                <p className="text-xl font-bold text-green-700">{grafanaUrl}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Loki (Log Storage)</p>
                <p className="text-xl font-bold text-purple-700">{lokiUrl}</p>
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
          <h3 className="font-bold text-blue-900 mb-2">🚀 Cara Menjalankan Grafana + Loki:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Buka terminal di folder <code className="bg-blue-100 px-2 py-1 rounded">seasnacky/grafana-loki/</code></li>
            <li>Jalankan: <code className="bg-blue-100 px-2 py-1 rounded">docker-compose up -d</code></li>
            <li>Tunggu beberapa detik, lalu buka <strong>http://localhost:3001</strong></li>
            <li>Grafana akan terbuka dengan datasource Loki sudah terkonfigurasi</li>
          </ol>
        </div>

        {/* Embedded Grafana */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Grafana Dashboard Preview</h2>
            <Activity className="animate-pulse" size={24} />
          </div>
          <div className="relative" style={{ height: "800px" }}>
            <iframe
              src={grafanaUrl}
              className="w-full h-full border-0"
              title="Grafana Dashboard"
              allow="fullscreen"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 Informasi Tambahan:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Winston + Loki</strong>: Aplikasi SeaSnacky menggunakan winston-loki untuk mengirim logs ke Loki</li>
            <li>• <strong>Grafana</strong>: Dashboard untuk visualisasi logs dengan query language LogQL</li>
            <li>• <strong>Promtail</strong>: Agent untuk scraping logs dari file sistem</li>
            <li>• <strong>Docker Compose</strong>: Semua service berjalan dalam container terpisah</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
