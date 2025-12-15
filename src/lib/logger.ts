import winston from "winston";
import Transport from "winston-transport";

// Custom MongoDB Transport untuk menyimpan log ke database
class MongoDBTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      // Import dinamis untuk menghindari circular dependency
      const connectDB = (await import("@/lib/mongodb")).default;
      const Log = (await import("@/models/Log")).default;

      await connectDB();

      // Simpan log ke MongoDB (works in both local & Vercel serverless)
      await Log.create({
        level: info.level,
        message: info.message,
        source: info.source || "system",
        timestamp: new Date(),
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      });
    } catch (error) {
      // Fallback: jika gagal simpan ke DB, tetap log ke console (penting untuk Vercel logs)
      console.error("Failed to save log to MongoDB:", error);
    }

    callback();
  }
}

// Build transports array
const transports: winston.transport[] = [
  // 1. Tampilkan di Console (Terminal)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  // 2. Simpan ke MongoDB untuk dashboard admin
  new MongoDBTransport(),
];

// 3. Optional: Kirim ke Grafana Loki (jika tersedia)
// Loki transport dimatikan sementara karena dependency issue dengan snappy
// Uncomment block ini jika sudah install snappy: npm install snappy
/*
try {
  const LokiTransport = require("winston-loki");
  const lokiHost = process.env.LOKI_HOST || "http://localhost:3100";
  
  transports.push(
    new LokiTransport({
      host: lokiHost,
      labels: { app: "seasnacky-app" },
      json: true,
      replaceTimestamp: true,
      onConnectionError: (err: any) => {
        console.error("⚠️ Gagal kirim log ke Loki:", err);
      },
    })
  );
} catch (err) {
  console.warn("⚠️ Loki transport not available, logs will only save to MongoDB and Console");
}
*/

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { app: "seasnacky-app" },
  transports,
});

export default logger;