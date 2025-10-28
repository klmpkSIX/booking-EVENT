// Ambil semua data booking
export const getBookings = () => {
  return JSON.parse(localStorage.getItem("bookedSlots") || "[]");
};

// Simpan data booking baru
export const addBooking = (booking) => {
  const data = getBookings();
  data.push(booking);
  localStorage.setItem("bookedSlots", JSON.stringify(data));
};
