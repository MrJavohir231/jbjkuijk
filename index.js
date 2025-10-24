const form = document.getElementById("orderForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;
  const date = new Date().toLocaleString("uz-UZ");

  if (!phone.startsWith("+998") || phone.length < 13) {
    msg.textContent = "❌ Telefon raqami +998 bilan va to‘liq bo‘lishi kerak!";
    msg.style.color = "red";
    return;
  }

  const priceMap = {
    "Soch kesish": 40000,
    "Soch yuvish": 10000,
    "Soqol olish": 25000,
    "Kompleks xizmat": 65000
  };

  const order = { name, phone, service, price: priceMap[service], date };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  msg.textContent = "✅ Buyurtma muvaffaqiyatli yuborildi!";
  msg.style.color = "lime";

  form.reset();
});
