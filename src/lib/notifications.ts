// Notification Helper Functions

export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Browser tidak mendukung notifikasi");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifikasi diizinkan");
        return true;
      }
    });
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/logo.png", // Bisa diganti dengan logo SeaSnacky
      badge: "/logo.png",
      vibrate: [200, 100, 200],
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    return notification;
  }
  return null;
}

export function notifyNewOrder(orderId: string, customerName: string, total: number) {
  showNotification("🎉 Pesanan Baru Masuk!", {
    body: `${customerName} - Rp ${total.toLocaleString("id-ID")}\nKlik untuk lihat detail`,
    tag: `order-${orderId}`,
    requireInteraction: true,
    data: { orderId, type: 'new-order' },
  });

  // Play sound
  playNotificationSound();
}

export function notifyOrderStatusChange(orderId: string, status: string) {
  const statusMessages: Record<string, string> = {
    paid: "✅ Pembayaran Diterima",
    process: "📦 Pesanan Sedang Dikemas",
    shipped: "🚚 Pesanan Dalam Pengiriman",
    completed: "✨ Pesanan Selesai",
  };

  const message = statusMessages[status] || "Status pesanan diperbarui";

  showNotification(message, {
    body: `Order #${orderId.substring(0, 8)}\nKlik untuk lihat detail`,
    tag: `order-status-${orderId}`,
    data: { orderId, type: 'status-change', status },
  });

  playNotificationSound();
}

function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3'); // Bisa tambahkan file sound
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback to beep if no sound file
      const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGWS57OufTRAMUKbj8LZjHAY5kdj');
      beep.play().catch(() => {});
    });
  } catch (e) {
    console.error("Cannot play sound:", e);
  }
}
