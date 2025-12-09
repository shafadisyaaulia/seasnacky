import winston from "winston";
import LokiTransport from "winston-loki";

// Cek apakah kita sedang di dalam Docker atau Local
// Di docker-compose.yml kita sudah set LOKI_HOST=http://loki:3100
const lokiHost = process.env.LOKI_HOST || "http://localhost:3100";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { app: "seasnacky-app" }, // Label ini yang nanti dicari di Grafana
  transports: [
    // 1. Tampilkan di Console (Terminal)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // 2. Kirim ke Grafana Loki
    new LokiTransport({
      host: lokiHost,
      labels: { app: "seasnacky-app" },
      json: true,
      replaceTimestamp: true,
      onConnectionError: (err) => {
        console.error("⚠️ Gagal kirim log ke Loki:", err);
      },
    }),
  ],
});

export default logger;