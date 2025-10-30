// file: js/schedule.js
import { getBookings } from "./data.js";

const calendar = document.getElementById("calendar");
const availableTimes = document.getElementById("availableTimes");
const selectedDate = document.getElementById("selectedDate");
const nextButton = document.getElementById("nextButton");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const monthNames = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

// 🔧 Siapkan dropdown
let currentDate = new Date();
monthNames.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

const currentYear = currentDate.getFullYear();
for (let y = currentYear - 2; y <= currentYear + 3; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}
monthSelect.value = currentDate.getMonth();
yearSelect.value = currentYear;

// 🔁 Render kalender
async function renderCalendar() {
  calendar.innerHTML = "";

  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Ambil data booking
  let bookings = {};
  try {
    bookings = await getBookings();
  } catch (err) {
    console.error("Gagal ambil data booking:", err);
    alert("Tidak dapat memuat data dari Firebase!");
  }

  // Kelompokkan berdasarkan tanggal
  const bookedDates = {};
  Object.entries(bookings || {}).forEach(([id, data]) => {
    if (data.tanggal) {
      if (!bookedDates[data.tanggal]) bookedDates[data.tanggal] = [];
      bookedDates[data.tanggal].push(data);
    }
  });

  // Tambah elemen kosong sebelum tanggal 1
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);
  }

  // Tampilkan tanggal 1–akhir
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.textContent = day;

    if (bookedDates[dateStr]) cell.classList.add("booked");
    else cell.classList.add("available");

    cell.addEventListener("click", () =>
      showSchedule(dateStr, cell, bookedDates)
    );

    calendar.appendChild(cell);
  }
}

// 🔍 Menampilkan detail tanggal
function showSchedule(dateStr, cell, bookedDates) {
  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
  cell.classList.add("selected");

  selectedDate.textContent = `📆 Jadwal tanggal ${new Intl.DateTimeFormat("id-ID").format(new Date(dateStr))}`;
  availableTimes.innerHTML = "";
  nextButton.style.display = "none";

  // Semua slot jam dari 09:00–17:00 (1 jam per slot)
  const allSlots = [];
  for (let h = 9; h < 17; h++) {
    const start = `${String(h).padStart(2, "0")}:00`;
    const end = `${String(h + 1).padStart(2, "0")}:00`;
    allSlots.push({ start, end });
  }

  const booked = bookedDates[dateStr] || [];

  // Tandai jam yang sudah dibooking
  const bookedRanges = booked.map(b => ({ start: b.mulai, end: b.selesai }));

  // Tampilkan daftar jam
  let adaKosong = false;
  allSlots.forEach(slot => {
    const isBooked = bookedRanges.some(r =>
      (slot.start >= r.start && slot.start < r.end) ||
      (slot.end > r.start && slot.end <= r.end)
    );

    const li = document.createElement("li");
    if (isBooked) {
      const b = booked.find(x => x.mulai === slot.start || x.selesai === slot.end);
      li.innerHTML = `❌ <strong>${slot.start} - ${slot.end}</strong> 
        (${b ? b.jenis : "Sudah dibooking"})`;
      li.style.color = "#ff9999";
    } else {
      li.innerHTML = `✅ <strong>${slot.start} - ${slot.end}</strong> (Tersedia)`;
      li.style.color = "#aaffaa";
      adaKosong = true;
    }
    availableTimes.appendChild(li);
  });

  // Jika masih ada slot kosong, tampilkan tombol lanjutkan
  if (adaKosong) {
    nextButton.style.display = "block";
    nextButton.onclick = () => window.location.href = `booking.html?tanggal=${dateStr}`;
  }
}

// Event dropdown bulan/tahun
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

// Jalankan saat halaman siap
document.addEventListener("DOMContentLoaded", renderCalendar);