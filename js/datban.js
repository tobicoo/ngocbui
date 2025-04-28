// set cho khách mặc định là 2 và set 
let guests = 2, time = new Date(), selectedDate = null;

time.setHours(18, 30, 0, 0);

const calendarGrid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let current = new Date();
const today = new Date(); today.setHours(0, 0, 0, 0);
const maxSelectableDate = new Date(today);
maxSelectableDate.setMonth(today.getMonth() + 3);
maxSelectableDate.setDate(0);

function updateGuests(change) {
  guests = Math.max(1, guests + change);
  document.getElementById('guestCount').textContent = guests;
}

function changeTime(min) {
  time.setMinutes(time.getMinutes() + min);
  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  document.getElementById('timeSlot').textContent = `${hh}:${mm}`;
}

function renderCalendar(date) {
  const y = date.getFullYear(), m = date.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const start = new Date(y, m, 1).getDay();
  monthYear.textContent = `${date.toLocaleString('en-US', { month: 'long' })} ${y}`;
  calendarGrid.innerHTML = '';

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
    let head = document.createElement('div');
    head.className = 'day-cell header-cell';
    head.textContent = day;
    calendarGrid.appendChild(head);
  });

  for (let i = 0; i < start; i++) {
    let empty = document.createElement('div');
    empty.className = 'day-cell empty-cell';
    calendarGrid.appendChild(empty);
  }

  for (let d = 1; d <= days; d++) {
    const cell = document.createElement('div');
    const cellDate = new Date(y, m, d);
    cell.textContent = d;

    if (cellDate < today || cellDate > maxSelectableDate) {
      cell.className = cellDate < today ? 'day-cell past-day' : 'day-cell future-limit-day';
    } else {
      cell.className = 'day-cell valid-day';
      if (cellDate.toDateString() === today.toDateString())
        Object.assign(cell.style, { backgroundColor: '#ffc107', fontWeight: 'bold' });
      if (selectedDate && cellDate.toDateString() === selectedDate.toDateString())
        Object.assign(cell.style, { backgroundColor: '#a47551', color: '#fff' });
      cell.onclick = () => { selectedDate = cellDate; renderCalendar(current); };
    }
    calendarGrid.appendChild(cell);
  }
}

document.getElementById("booking-form").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!selectedDate) {
    alert("❗ Vui lòng chọn ngày!");
    return;
  }
  const timeStr = document.getElementById('timeSlot').textContent;
  const query = `?date=${selectedDate.toLocaleDateString()}&guests=${guests}&time=${timeStr}`;
  window.location.href = 'confirmation.html' + query;
});

prevBtn.onclick = () => {
  if (current.getMonth() === 0) {
    current.setFullYear(current.getFullYear() - 1);
    current.setMonth(11);
  } else {
    current.setMonth(current.getMonth() - 1);
  }
  renderCalendar(current);
};

nextBtn.onclick = () => {
  if (current.getMonth() === 11) {
    current.setFullYear(current.getFullYear() + 1);
    current.setMonth(0);
  } else {
    current.setMonth(current.getMonth() + 1);
  }
  renderCalendar(current);
};

renderCalendar(current);
