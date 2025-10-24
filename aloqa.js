// Telefon raqamini nusxalash
document.getElementById("copy-btn").addEventListener("click", () => {
  const phone = document.getElementById("phone").innerText;
  navigator.clipboard.writeText(phone);
  alert("📋 Raqam nusxalandi: " + phone);
});

// Forma yuborish va localStorage-ga saqlash
const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const phoneInput = document.getElementById("phoneInput");

form.addEventListener("input", () => {
  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  if (name && phone.startsWith("+998") && phone.length === 13) {
    sendBtn.disabled = false;
  } else {
    sendBtn.disabled = true;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  const message = document.getElementById("message").value.trim();

  const contactData = {
    name,
    phone,
    message,
    time: new Date().toLocaleString()
  };

  let saved = JSON.parse(localStorage.getItem("contacts")) || [];
  saved.push(contactData);
  localStorage.setItem("contacts", JSON.stringify(saved));

  alert("✅ Xabaringiz yuborildi! Biz tez orada bog‘lanamiz.");
  form.reset();
  sendBtn.disabled = true;
});

