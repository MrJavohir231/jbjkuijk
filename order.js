// order.js (frontend)
// Funksiya: tanlangan xizmatlar, mijoz ma'lumotlarini serverga yuboradi va SMS jo'natishni trigger qiladi.

async function sendOrderSms(payload, serverBaseUrl = "") {
    // serverBaseUrl misol: "https://abcd1234.ngrok.io"
    const url = serverBaseUrl + "/api/send-sms";
  
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    if (!resp.ok) {
      const err = await resp.json().catch(()=>({error: "unknown"}));
      throw new Error(err.error || JSON.stringify(err));
    }
    return await resp.json();
  }
  
  // Example usage: bu kodni sahifadagi "Pul yubordim" handleriga qo'shing
  document.getElementById("confirmBtn").addEventListener("click", async () => {
    // misol: sahifadagi tanlangan xizmatlarni yig'ish
    const services = [];
    document.querySelectorAll(".service").forEach(div => {
      const checkbox = div.querySelector("input[type=checkbox].serviceCheck");
      if (checkbox && checkbox.checked) {
        services.push({
          name: div.querySelector("h3")?.innerText || "Xizmat",
          price: parseInt(checkbox.dataset.price || "0"),
          time: parseInt(checkbox.dataset.time || "0")
        });
      }
    });
  
    const total_price = services.reduce((s, x) => s + (x.price||0), 0);
    const total_minutes = services.reduce((s, x) => s + (x.time||0), 0);
  
    if (total_price === 0) {
      alert("Hech narsa tanlanmadi!");
      return;
    }
  
    // mijoz ma'lumotlarini so'rash (minimal)
    const customer_name = prompt("Ismingizni kiriting:");
    const customer_phone = prompt("Telefon raqamingiz (+998...):");
  
    if (!customer_name || !customer_phone) {
      alert("Ism va telefon kiriting");
      return;
    }
  
    const payload = {
      customer_name,
      customer_phone,
      services,
      total_price,
      total_minutes,
      slot: "auto"  // agar siz aniq slot hisoblamoqchi bo'lsangiz, frontendda uni hisoblab qo'shing
    };
  
    try {
      // serverBaseUrl ni sozlang (dev: ngrok url yoki production domen)
      const serverBaseUrl = ""; // misol: "https://abcd1234.ngrok.io"
      const res = await sendOrderSms(payload, serverBaseUrl);
      console.log("Server javobi:", res);
      alert("Buyurtma yuborildi — adminga SMS yuborildi.");
    } catch (err) {
      console.error(err);
      alert("Xatolik: " + err.message);
    }
  });
  