"use client";

import { useState, useEffect } from "react";
import { Activity, RefreshCw, Filter, AlertCircle, Info, AlertTriangle, Terminal, Bug, Database, CheckCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface LogEntry {
  _id: string;
  level: "info" | "warning" | "error";
  message: string;
  source?: string;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch logs
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/logs?level=${filter}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  // Auto refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, filter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="text-red-500" size={18} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      error: "bg-red-100 text-red-700 border-red-300",
      warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
      info: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return styles[level as keyof typeof styles] || styles.info;
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === "error").length,
    warnings: logs.filter(l => l.level === "warning").length,
    info: logs.filter(l => l.level === "info").length,
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Terminal className="text-blue-600" size={36} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Logs & Debugging</h1>
                <p className="text-gray-500 text-sm">Real-time application monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  autoRefresh 
                    ? "bg-green-500 text-white shadow-lg" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {autoRefresh ? <CheckCircle size={18} /> : <RefreshCw size={18} />}
                {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
              </button>
              <button
                onClick={fetchLogs}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <RefreshCw className={isLoading ? "animate-spin" : ""} size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Activity className="text-gray-400" size={32} />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 mb-1">Errors</p>
                  <p className="text-3xl font-bold text-red-700">{stats.errors}</p>
                </div>
                <AlertCircle className="text-red-400" size={32} />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 mb-1">Warnings</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.warnings}</p>
                </div>
                <AlertTriangle className="text-yellow-400" size={32} />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Info</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.info}</p>
                </div>
                <Info className="text-blue-400" size={32} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-4">
              <Filter className="text-gray-400" size={20} />
              <div className="flex gap-2">
                {["all", "error", "warning", "info"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === level
                        ? "bg-blue-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 text-white p-4 flex items-center gap-3">
              <Terminal size={24} />
              <h2 className="text-lg font-bold">Application Logs</h2>
              <span className="ml-auto text-sm text-gray-400">Last {logs.length} entries</span>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
                  <p className="text-gray-600">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center">
                  <Info className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-gray-600">No logs found</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getLevelIcon(log.level)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelBadge(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString('id-ID')}
                          </span>
                          {log.source && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {log.source}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 font-mono break-words">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Debugging Examples */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="text-red-600" size={28} />
                <h3 className="font-bold text-red-900">Case 1: Login Error</h3>
              </div>
              <div className="space-y-2 text-sm text-red-800">
                <p><strong>Problem:</strong> User tidak bisa login (500 error)</p>
                <p><strong>Log Query:</strong> <code className="bg-red-200 px-2 py-1 rounded">level=error</code></p>
                <p><strong>Finding:</strong> MongoDB connection timeout</p>
                <p><strong>Solution:</strong> Check internet atau connection string</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-yellow-600" size={28} />
                <h3 className="font-bold text-yellow-900">Case 2: Slow API</h3>
              </div>
              <div className="space-y-2 text-sm text-yellow-800">
                <p><strong>Problem:</strong> Products page loading sangat lambat</p>
                <p><strong>Log Query:</strong> <code className="bg-yellow-200 px-2 py-1 rounded">GET /api/products</code></p>
                <p><strong>Finding:</strong> Response time 16775ms</p>
                <p><strong>Solution:</strong> Add database indexing</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-blue-600" size={28} />
                <h3 className="font-bold text-blue-900">Case 3: Session Issue</h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Problem:</strong> User redirect loop ke login</p>
                <p><strong>Log Query:</strong> <code className="bg-blue-200 px-2 py-1 rounded">Session</code></p>
                <p><strong>Finding:</strong> DB lookup failed, fallback JWT</p>
                <p><strong>Solution:</strong> Implement retry logic</p>
              </div>
            </div>
          </div>

          {/* Guide */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
              <Info size={24} />
              Logging & Debugging Guide
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-indigo-800 mb-2">📝 Log Levels:</h4>
                <ul className="space-y-1 text-indigo-700">
                  <li>• <strong>ERROR:</strong> Critical issues yang perlu immediate action</li>
                  <li>• <strong>WARNING:</strong> Potensi masalah, tapi masih berjalan</li>
                  <li>• <strong>INFO:</strong> Informasi penting (login, transactions)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-800 mb-2">🔍 Best Practices:</h4>
                <ul className="space-y-1 text-indigo-700">
                  <li>• Gunakan structured logging (JSON format)</li>
                  <li>• Jangan log sensitive data (password, tokens)</li>
                  <li>• Include context (userId, transactionId)</li>
                  <li>• Monitor error rates secara real-time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
