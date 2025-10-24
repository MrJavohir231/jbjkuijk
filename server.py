
---

# 2) `server.py` — Flask + Twilio (Python)
> Saqlang `server.py` sifatida. `requirements.txt` ga: `Flask twilio python-dotenv` qo‘ying.

```python
# server.py
import os
from flask import Flask, request, jsonify
from twilio.rest import Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()  # agar .env fayl ishlatilsin

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM = os.getenv("TWILIO_FROM")         # masalan +1XXXXXXXXXX
ADMIN_PHONE = os.getenv("ADMIN_PHONE")         # +998944189898

app = Flask(__name__)

# oddiy tekshiruv
if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ADMIN_PHONE]):
    app.logger.warning("TWILIO yoki ADMIN_PHONE muhit o'zgaruvchilari to'liq emas. SMS jo'natish ishlamasligi mumkin.")


def send_sms_via_twilio(to_number: str, body: str) -> dict:
    """
    Twilio orqali SMS yuboradi. Returns message info or raises exception.
    """
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=body,
        from_=TWILIO_FROM,
        to=to_number
    )
    return {"sid": message.sid, "status": message.status, "to": message.to, "body": message.body}


@app.route("/api/send-sms", methods=["POST"])
def api_send_sms():
    """
    Expected JSON:
    {
      "customer_name": "Alisher",
      "customer_phone": "+998901234567",
      "services": [
         {"name":"Soch kesish", "price":40000, "time":30},
         {"name":"Soqol", "price":25000, "time":15}
      ],
      "total_price": 65000,
      "total_minutes": 45,
      "slot": "2025-10-25 10:00"   # optional
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"ok": False, "error": "JSON talab qilinadi"}), 400

    # minimal validatsiya
    required = ["customer_name", "customer_phone", "services", "total_price", "total_minutes"]
    for key in required:
        if key not in data:
            return jsonify({"ok": False, "error": f"'{key}' maydoni kerak"}), 400

    # Build message text
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    customer_name = data["customer_name"]
    customer_phone = data["customer_phone"]
    total_price = data["total_price"]
    total_minutes = data["total_minutes"]
    slot = data.get("slot", "—")
    services = data["services"]

    services_lines = []
    for s in services:
        # s expected to have name, price, time
        services_lines.append(f"- {s.get('name','?')} ({s.get('price',0)} so'm, {s.get('time',0)} min)")

    msg_body = (
        f"YANGI BUYURTMA ({now})\n"
        f"Mijoz: {customer_name}\n"
        f"Tel: {customer_phone}\n"
        f"Xizmatlar:\n" + "\n".join(services_lines) + "\n\n"
        f"Umumiy: {total_price} so'm\n"
        f"Vaqt: {total_minutes} min\n"
        f"Slot: {slot}\n"
        f"---\n"
        f"Namozov Jamshid barber"
    )

    try:
        # haqiqiy SMSni admin raqamiga yuboramiz
        result = send_sms_via_twilio(ADMIN_PHONE, msg_body)
    except Exception as e:
        app.logger.exception("SMS jo'natishda xatolik")
        return jsonify({"ok": False, "error": "SMS jo'natishda xatolik", "detail": str(e)}), 500

    # agar hamma joyda yaxshi bo'lsa
    return jsonify({"ok": True, "message": "SMS yuborildi", "twilio": result}), 200


if __name__ == "__main__":
    # development server
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)

import requests

def send_sms_via_provider(to_number, body):
    provider_url = "https://sms-provider.uz/api/send"
    api_key = os.getenv("SMS_PROVIDER_KEY")
    payload = {
        "to": to_number,
        "text": body,
        # qo'shimcha maydonlar: sender, service_id va h.k.
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    r = requests.post(provider_url, json=payload, headers=headers, timeout=10)
    r.raise_for_status()
    return r.json()
