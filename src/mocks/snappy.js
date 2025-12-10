// Ini adalah Snappy palsu untuk menipu winston-loki
module.exports = {
  compress: (data) => data, // Mengembalikan data tanpa kompresi
  uncompress: (data) => data
};