// file: js/booking.js
import { addBooking, sendWhatsAppNotification } from "./data.js";

const form = document.getElementById("bookingForm");
const msgSuccess = document.getElementById("msg-success");
const msgError = document.getElementById("msg-error");

// 🔹 Ambil tanggal dari parameter URL
const params = new URLSearchParams(window.location.search);
const tanggalDipilih = params.get("tanggal");

// Jika ada parameter tanggal, isi otomatis dan kunci input
if (tanggalDipilih) {
  const tanggalInput = document.getElementById("tanggal");
  tanggalInput.value = tanggalDipilih;
  tanggalInput.readOnly = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgSuccess.classList.add("hidden");
  msgError.classList.add("hidden");

  const data = {
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    jenis: form.jenis.value.trim(),
    tanggal: form.tanggal.value,
    mulai: form.mulai.value,
    selesai: form.selesai.value,
    createdAt: new Date().toISOString(),
  };

  try {
    // 🔹 Simpan ke Firebase
    await addBooking(data);

    // 🔹 Kirim notifikasi WhatsApp ke admin
    await sendWhatsAppNotification(data);

    // 🔹 Tampilkan pesan sukses
    msgSuccess.classList.remove("hidden");

    // 🔹 Reset form hanya jika tanggal tidak dikunci
    if (!tanggalDipilih) form.reset();

    // 🔹 Kembali ke kalender setelah 2 detik
    setTimeout(() => (window.location.href = "schedule.html"), 2000);
  } catch (err) {
    console.error("❌ Gagal simpan booking:", err);
    msgError.textContent = "❌ Gagal menyimpan booking. Coba lagi.";
    msgError.classList.remove("hidden");
  }
});