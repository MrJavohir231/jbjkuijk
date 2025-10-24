const services = document.querySelectorAll('.service');
  const totalPrice = document.getElementById('totalPrice');
  const totalTime = document.getElementById('totalTime');
  const saveBtn = document.getElementById('saveBtn');
  const ssmBox = document.getElementById('ssmBox');
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const phoneError = document.getElementById('phoneError');
  const ordersList = document.getElementById('ordersList');

  let total = 0, minutes = 0;

  services.forEach(ch => ch.addEventListener('change', updateTotals));
  [dateInput, timeInput, nameInput, phoneInput].forEach(inp => inp.addEventListener('input', checkReady));

  function updateTotals() {
    total = 0; minutes = 0;
    services.forEach(ch => {
      if (ch.checked) {
        total += Number(ch.dataset.price);
        minutes += Number(ch.dataset.time);
      }
    });
    totalPrice.textContent = `Umumiy narx: ${total.toLocaleString()} so'm`;
    totalTime.textContent = `Umumiy vaqt: ${minutes} daqiqa`;
    checkReady();
  }

  function validatePhone() {
    const phone = phoneInput.value.trim();
    const valid = /^\+998\d{9}$/.test(phone);
    if (!valid && phone !== "") {
      phoneInput.classList.add("invalid");
      phoneError.textContent = "❌ Raqam noto‘g‘ri! To‘liq +998 bilan yozing (masalan: +998901234567)";
    } else {
      phoneInput.classList.remove("invalid");
      phoneError.textContent = "";
    }
    return valid;
  }

  function checkReady() {
    const validPhone = validatePhone();
    const ok = dateInput.value && timeInput.value && nameInput.value.trim() && validPhone && total > 0;
    saveBtn.disabled = !ok;
  }

  saveBtn.addEventListener('click', () => {
    const chosen = Array.from(services).filter(s => s.checked).map(s => s.dataset.name);
    const order = {
      date: dateInput.value,
      time: timeInput.value,
      name: nameInput.value,
      phone: phoneInput.value,
      total,
      minutes,
      services: chosen,
      created: new Date().toLocaleString()
    };

    let all = JSON.parse(localStorage.getItem('buyurtmalar')) || [];
    all.push(order);
    localStorage.setItem('buyurtmalar', JSON.stringify(all));

    renderOrders();

    // ✅ O‘zgartirilgan xabar:
    ssmBox.innerHTML = `
      💌 <b>Buyurtma qabul qilindi!</b><br>
      Iltimos, yarim to‘lovni amalga oshiring chekni telegramga tashab qoying<br>
      📞 Telegram: <b>+998 94 418 89 98</b><br>
      💳 Plastik karta: <b>5614 6819 1423 1810</b>
    `;
    ssmBox.style.background = "#00ff99";
    ssmBox.style.color = "#000";
    ssmBox.style.display = "block";

    setTimeout(() => ssmBox.style.display = "none", 8000);
    resetForm();
  });

  function renderOrders() {
    let all = JSON.parse(localStorage.getItem('buyurtmalar')) || [];
    if (all.length === 0) {
      ordersList.innerHTML = "Hozircha buyurtmalar yo‘q.";
      return;
    }
    ordersList.innerHTML = all.map(o => `
      <div class="order-item">
        <b>${o.name}</b> — ${o.phone}<br>
        <small>${o.date} | ${o.time}</small><br>
        Xizmatlar: ${o.services.join(", ")}<br>
        <span style="color:var(--ok)">Narx: ${o.total.toLocaleString()} so'm</span>,
        <span style="color:var(--accent)">Vaqt: ${o.minutes} daqiqa</span><br>
        <small>${o.created}</small>
      </div>
    `).join("");
  }

  function resetForm() {
    [dateInput, timeInput, nameInput, phoneInput].forEach(i => i.value = '');
    services.forEach(s => s.checked = false);
    total = 0; minutes = 0;
    totalPrice.textContent = "Umumiy narx: 0 so'm";
    totalTime.textContent = "Umumiy vaqt: 0 daqiqa";
    checkReady();
  }

  window.addEventListener('load', renderOrders);

