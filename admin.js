const ordersBox = document.getElementById('orders');
const clearAllBtn = document.getElementById('clearAll');

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('buyurtmalar')) || [];
  if (orders.length === 0) {
    ordersBox.innerHTML = `<div class="no-orders">Hozircha buyurtmalar yo‘q.</div>`;
    return;
  }

  ordersBox.innerHTML = orders.map((o, i) => `
    <div class="order">
      <button class="del" onclick="deleteOrder(${i})">🗑️</button>
      <b>${o.name}</b> — ${o.phone}<br>
      <small>${o.date} | ${o.time}</small><br>
      Xizmatlar: ${o.services.join(", ")}<br>
      <span style="color:#00ff99">Narx: ${o.total.toLocaleString()} so'm</span>,
      <span style="color:#38bdf8">Vaqt: ${o.minutes} daqiqa</span><br>
      <small>📅 Yaratilgan: ${o.created}</small>
    </div>
  `).join("");
}

function deleteOrder(index) {
  let orders = JSON.parse(localStorage.getItem('buyurtmalar')) || [];
  orders.splice(index, 1);
  localStorage.setItem('buyurtmalar', JSON.stringify(orders));
  renderOrders();
}

clearAllBtn.addEventListener('click', () => {
  if (confirm("Barcha buyurtmalarni o‘chirishni xohlaysizmi?")) {
    localStorage.removeItem('buyurtmalar');
    renderOrders();
  }
});

window.addEventListener('load', renderOrders);

  