// file: js/data.js
import { db, ref, push, set, get, remove, child } from "./firebase-config.js";

/**
 * Tambahkan data booking baru ke Firebase
 */
export async function addBooking(data) {
  const bookingsRef = ref(db, "bookings");
  const newBooking = push(bookingsRef);
  await set(newBooking, data);
  return newBooking.key; // Kembalikan ID unik booking
}

/**
 * Ambil semua data booking
 */
export async function getBookings() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "bookings"));
  return snapshot.exists() ? snapshot.val() : {};
}

/**
 * Hapus booking berdasarkan ID
 */
export async function deleteBooking(id) {
  const bookingRef = ref(db, "bookings/" + id);
  await remove(bookingRef);
}

/**
 * Kirim notifikasi WhatsApp via CallMeBot
 */
export async function sendWhatsAppNotification(bookingData) {
  const adminPhone = "6285176999941"; // 🔧 Ganti nomor admin
  const apiKey = "YOUR_CALLMEBOT_APIKEY"; // 🔧 Ganti API key CallMeBot kamu

  const message = `
📢 *Booking Baru UGTV!*
👤 Nama: ${bookingData.nama}
📧 Email: ${bookingData.email}
🎬 Jenis Acara: ${bookingData.jenis}
📅 Tanggal: ${bookingData.tanggal}
🕒 Jam: ${bookingData.mulai} - ${bookingData.selesai}
`.trim();

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(
    message
  )}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log("✅ Notifikasi WhatsApp berhasil dikirim ke admin!");
    } else {
      console.warn("⚠️ Gagal kirim notifikasi WhatsApp:", res.status);
    }
  } catch (err) {
    console.error("❌ Error kirim ke CallMeBot:", err);
  }
}
