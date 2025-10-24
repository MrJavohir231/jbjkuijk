const buttons = document.querySelectorAll(".select-btn");
const totalPriceEl = document.getElementById("total-price");
const totalTimeEl = document.getElementById("total-time");

let totalPrice = 0;
let totalTime = 0;

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".service-card");
    const price = parseInt(card.dataset.price);
    const time = parseInt(card.dataset.time);

    // Tanlangan bo‘lsa bekor qiladi
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
      btn.textContent = "Tanlash";
      totalPrice -= price;
      totalTime -= time;
    } else {
      btn.classList.add("active");
      btn.textContent = "Tanlangan";
      totalPrice += price;
      totalTime += time;
    }

    totalPriceEl.textContent = totalPrice.toLocaleString();
    totalTimeEl.textContent = totalTime;

    // LocalStorage'ga saqlash
    localStorage.setItem("xizmatlar", JSON.stringify({
      narx: totalPrice,
      vaqt: totalTime
    }));
  });
});

// Avvalgi ma’lumotni yuklash
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("xizmatlar"));
  if (saved) {
    totalPriceEl.textContent = saved.narx.toLocaleString();
    totalTimeEl.textContent = saved.vaqt;
  }
});
