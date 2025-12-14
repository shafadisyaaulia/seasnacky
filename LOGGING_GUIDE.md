# 📊 Panduan Logging & Debugging dengan Grafana + Loki

## 🎯 Overview
Project ini menggunakan **Grafana + Loki** untuk logging dan debugging aplikasi SeaSnacky. Semua log dari aplikasi akan dikirim ke Loki dan divisualisasikan di Grafana Dashboard.

---

## 🚀 Cara Menjalankan Grafana + Loki

### 1. Pastikan Docker Desktop Running
```bash
# Buka Docker Desktop terlebih dahulu
```

### 2. Jalankan Stack Monitoring
```bash
cd "grafana-loki"
docker-compose up -d
```

### 3. Cek Status Container
```bash
docker-compose ps
```

Harusnya ada 4 container running:
- ✅ `seasnacky_app` (Port 3000) - Aplikasi utama
- ✅ `loki` (Port 3100) - Log aggregator
- ✅ `promtail` - Log collector
- ✅ `grafana` (Port 3001) - Dashboard visualisasi

---

## 📈 Cara Akses Grafana Dashboard

### 1. Buka Browser
```
http://localhost:3001
```

### 2. Login (Otomatis)
- Setup sudah dikonfigurasi dengan **anonymous authentication**
- Tidak perlu login, langsung masuk sebagai Admin

### 3. Explore Logs
Klik **☰ Menu** → **Explore** (ikon kompas)

---

## 🔍 Query Logs di Grafana

### Query Dasar - Semua Logs
```logql
{app="seasnacky-app"}
```

### Filter by Level
```logql
# Error logs only
{app="seasnacky-app"} |= "error" |= "Error"

# Warning logs
{app="seasnacky-app"} |= "warning"

# Info logs
{app="seasnacky-app"} |= "info"
```

### Filter by API Route
```logql
# Login errors
{app="seasnacky-app"} |= "/api/auth/login"

# Product API logs
{app="seasnacky-app"} |= "/api/products"

# Database errors
{app="seasnacky-app"} |= "MongoDB"
```

### Filter by Time Range
Di Grafana, pilih time range di pojok kanan atas:
- Last 5 minutes
- Last 15 minutes
- Last 1 hour
- Last 24 hours
- Custom range

---

## 🐛 3 Contoh Kasus Debugging dengan Logs

### Contoh 1: Debug Login Error (500 Internal Server Error)

#### Masalah:
User tidak bisa login, mendapat error 500

#### Query Grafana:
```logql
{app="seasnacky-app"} |= "Login Error" | json
```

#### Hasil Log:
```json
{
  "level": "error",
  "message": "Login Error: MongoServerSelectionError",
  "error": "getaddrinfo ENOTFOUND ac-0pcclp6-shard-00-00.sy5zadd.mongodb.net",
  "timestamp": "2025-12-14T10:30:45.123Z"
}
```

#### Solusi:
- ❌ Database MongoDB tidak terhubung (DNS error atau internet mati)
- ✅ **Fix**: Cek koneksi internet atau MongoDB connection string

---

### Contoh 2: Debug Slow API Response

#### Masalah:
Halaman produk loading sangat lama (>30 detik)

#### Query Grafana:
```logql
{app="seasnacky-app"} |= "GET /api/products" |= "ms"
```

#### Hasil Log:
```
GET /api/products?t=1765718235159 200 in 16775ms
GET /api/products?t=1765718252039 200 in 857ms
GET /api/products?t=1765718253320 200 in 5600ms
```

#### Analisis:
- Response time sangat bervariasi: 857ms - 16775ms
- Kemungkinan masalah database query atau network

#### Query Lanjutan - Cek Database Error:
```logql
{app="seasnacky-app"} |= "Error GET Products" | json
```

#### Hasil Log:
```json
{
  "level": "error",
  "message": "Error GET Products: MongoServerSelectionError",
  "error": "Socket 'secureConnect' timed out after 46172ms",
  "timestamp": "2025-12-14T10:32:15.456Z"
}
```

#### Solusi:
- ❌ Database timeout karena koneksi lambat
- ✅ **Fix**: Optimize query dengan indexing atau upgrade connection tier MongoDB

---

### Contoh 3: Debug Session/Authentication Issue

#### Masalah:
User sudah login tapi tetap redirect ke login page

#### Query Grafana:
```logql
{app="seasnacky-app"} |= "Session" | json
```

#### Hasil Log:
```json
{
  "level": "warn",
  "message": "Session DB Lookup Failed, using token payload only",
  "error": "MongoServerSelectionError",
  "userId": "693d4cb8d967f14969bfb293",
  "timestamp": "2025-12-14T10:35:20.789Z"
}
```

#### Analisis:
- Session token valid (JWT ada)
- Tapi lookup user di database gagal
- User tetap bisa akses karena fallback ke JWT payload

#### Query API /api/me:
```logql
{app="seasnacky-app"} |= "/api/me" |= "500"
```

#### Hasil Log:
```
Error API /api/me: MongoServerSelectionError
GET /api/me 500 in 60530ms
```

#### Solusi:
- ❌ Database connection unstable
- ✅ **Fix**: Implement retry logic atau cache user data di Redis

---

## 📊 Membuat Dashboard di Grafana

### 1. Buat Dashboard Baru
1. Klik **☰ Menu** → **Dashboards** → **New Dashboard**
2. Klik **Add visualization**
3. Pilih **Loki** sebagai data source

### 2. Panel: Error Rate
**Query:**
```logql
sum(count_over_time({app="seasnacky-app"} |= "error" [5m]))
```
**Visualization**: Time series line chart
**Title**: "Error Rate (per 5 minutes)"

### 3. Panel: API Response Time
**Query:**
```logql
{app="seasnacky-app"} |= "GET" |= "ms" | regexp `(?P<method>\w+) (?P<path>/[^ ]+) \d+ in (?P<duration>\d+)ms`
```
**Visualization**: Graph
**Title**: "API Response Times"

### 4. Panel: Log Level Distribution
**Query:**
```logql
sum(count_over_time({app="seasnacky-app"} [1h])) by (level)
```
**Visualization**: Pie chart
**Title**: "Log Levels (Last 1 Hour)"

### 5. Panel: Recent Errors
**Query:**
```logql
{app="seasnacky-app"} |= "error" | json
```
**Visualization**: Logs table
**Title**: "Recent Errors"
**Limit**: 50

---

## 🎨 Tips & Tricks

### 1. Filter Multiple Conditions
```logql
{app="seasnacky-app"} 
  |= "POST" 
  |= "/api/auth/login" 
  |= "500"
```

### 2. Exclude Logs
```logql
{app="seasnacky-app"} 
  |= "error" 
  != "favicon.ico"
```

### 3. Parse JSON Logs
```logql
{app="seasnacky-app"} 
  | json 
  | level="error" 
  | line_format "{{.message}}"
```

### 4. Count Logs
```logql
count_over_time({app="seasnacky-app"} |= "Login Error" [1h])
```

### 5. Rate Calculation
```logql
rate({app="seasnacky-app"} |= "error" [5m])
```

---

## 🔧 Troubleshooting

### Grafana tidak bisa akses Loki
**Masalah**: "Loki: 500 Server Error"

**Solusi:**
```bash
# Restart Loki container
docker-compose restart loki

# Cek logs Loki
docker-compose logs loki
```

### Logs tidak muncul di Grafana
**Masalah**: Query tidak return data

**Checklist:**
1. ✅ Aplikasi sudah running dan mengirim logs?
2. ✅ Loki container running? (`docker-compose ps`)
3. ✅ LOKI_HOST environment variable sudah benar?
4. ✅ Time range di Grafana sudah sesuai?

**Debug:**
```bash
# Cek logs aplikasi
docker-compose logs seasnacky_app

# Cek logs Loki
docker-compose logs loki

# Test Loki API
curl http://localhost:3100/ready
```

### Winston-Loki connection error
**Masalah**: "⚠️ Gagal kirim log ke Loki"

**Solusi:**
1. Pastikan Loki running di `http://localhost:3100`
2. Di dalam Docker, gunakan `http://loki:3100`
3. Cek network configuration di docker-compose.yml

---

## 📝 Best Practices

### 1. Structured Logging
Gunakan JSON format untuk logs:
```typescript
import logger from '@/lib/logger';

logger.info('User login successful', {
  userId: user._id,
  email: user.email,
  timestamp: new Date().toISOString()
});

logger.error('Database connection failed', {
  error: err.message,
  stack: err.stack,
  operation: 'User.findOne'
});
```

### 2. Log Levels
- **ERROR**: Masalah kritis yang perlu immediate action
- **WARN**: Potensi masalah, tapi masih berjalan
- **INFO**: Informasi penting (login, logout, transactions)
- **DEBUG**: Informasi detail untuk development

### 3. Avoid Logging Sensitive Data
❌ **Jangan log:**
- Password
- Token/JWT
- Credit card numbers
- Personal identifiable information (PII)

✅ **Log:**
- User ID (bukan username)
- Transaction ID
- Error messages
- Performance metrics

---

## 🎓 Resources

- **Grafana Docs**: https://grafana.com/docs/grafana/latest/
- **Loki Query Language**: https://grafana.com/docs/loki/latest/query/
- **Winston Logger**: https://github.com/winstonjs/winston
- **Winston-Loki**: https://github.com/JaniAnttonen/winston-loki

---

## ✅ Checklist untuk Presentasi

- [ ] Docker Desktop running
- [ ] Semua container UP (`docker-compose ps`)
- [ ] Grafana accessible di http://localhost:3001
- [ ] Loki receiving logs (test dengan query `{app="seasnacky-app"}`)
- [ ] Dashboard sudah dibuat dengan minimal 3 panels
- [ ] 3 contoh kasus debugging sudah disiapkan
- [ ] Screenshot logs untuk dokumentasi

---

**Happy Logging! 📊🚀**
