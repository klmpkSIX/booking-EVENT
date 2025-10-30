// file: js/admin.js
import { getBookings, deleteBooking } from "./data.js";

const calendar = document.getElementById("calendar");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const selectedDate = document.createElement("h3");
const bookingsList = document.createElement("ul");
const tbody = document.getElementById("bookingTableBody");

selectedDate.id = "selectedDate";
bookingsList.id = "dateBookings";
calendar.parentNode.appendChild(selectedDate);
calendar.parentNode.appendChild(bookingsList);

const monthNames = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

// === Dropdown Bulan & Tahun ===
const currentDate = new Date();
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

// === Render Kalender ===
async function renderCalendar() {
  calendar.innerHTML = "";
  selectedDate.textContent = "Pilih tanggal di kalender untuk melihat detail booking.";
  bookingsList.innerHTML = "";

  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const data = await getBookings();
  const bookedDates = {};
  Object.values(data || {}).forEach((b) => {
    if (b.tanggal) {
      if (!bookedDates[b.tanggal]) bookedDates[b.tanggal] = [];
      bookedDates[b.tanggal].push(b);
    }
  });

  // Slot kosong sebelum tanggal 1
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);
  }

  // Isi tanggal
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.textContent = day;

    if (bookedDates[dateStr]) {
      cell.classList.add("booked");
      cell.title = bookedDates[dateStr]
        .map(b => `${b.jenis} (${b.nama}) ${b.mulai}-${b.selesai}`)
        .join("\n");
    } else {
      cell.classList.add("available");
    }

    // Klik tanggal → tampilkan detail booking hari itu
    cell.addEventListener("click", () => showDateDetail(dateStr, cell, bookedDates));

    calendar.appendChild(cell);
  }
}

// === Tampilkan detail tanggal yang diklik ===
function showDateDetail(dateStr, cell, bookedDates) {
  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
  cell.classList.add("selected");

  selectedDate.textContent = `📅 Jadwal tanggal ${new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date(dateStr))}`;

  bookingsList.innerHTML = "";

  if (bookedDates[dateStr]) {
    bookedDates[dateStr].forEach((slot) => {
      const li = document.createElement("li");
      li.innerHTML = `
        🔴 <strong>${slot.jenis}</strong><br>
        ${slot.mulai} - ${slot.selesai} (${slot.nama})<br>
        <small>${slot.email}</small>
      `;
      bookingsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "✅ Tanggal ini masih kosong (tidak ada booking).";
    bookingsList.appendChild(li);
  }
}

// === Render Tabel Booking ===
async function renderTable() {
  const data = await getBookings();
  tbody.innerHTML = "";

  const entries = Object.entries(data || {});
  if (entries.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>Belum ada booking.</td></tr>";
    return;
  }

  entries.forEach(([id, b]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.nama}</td>
      <td>${b.jenis}</td>
      <td>${b.tanggal}</td>
      <td>${b.mulai} - ${b.selesai}</td>
      <td>${b.email}</td>
      <td><button class="btn-delete" data-id="${id}">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Yakin ingin menghapus booking ini?")) {
        await deleteBooking(btn.dataset.id);
        await renderTable();
        await renderCalendar();
      }
    });
  });
}

// === Event Dropdown Bulan & Tahun ===
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

// === Jalankan Awal ===
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  renderTable();
});