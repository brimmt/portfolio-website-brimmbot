#from fastapi import FastAPI, Form
#from fastapi.middleware.cors import CORSMiddleware
#from dotenv import load_dotenv
#import requests
#import os
#import httpx

#load_dotenv()

#EmailJS_Service_ID=os.getenv("EMAILJS_SERVICE_ID")
#Contact_TEMPLATE_ID=os.getenv("Contact_TEMPLATE_ID")
#Auto_reply=os.getenv("Auto_reply")
#EMAILJS_USER_ID=os.getenv("EMAILJS_USER_ID")

#app = FastAPI()

#app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#@app.post("/send-email/")
async def send_email(
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    payload = {
        "service_id": EmailJS_Service_ID,
        "template_id": Contact_TEMPLATE_ID,  # <- use template_mohxl2k
        "user_id": EMAILJS_USER_ID,
        "template_params": {
            "name": name,
            "email": email,
            "message": message
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.emailjs.com/api/v1.0/email/send", json=payload)

    if response.status_code == 200:
        return {"success": True, "message": "Email sent successfully"}
    else:
        print("EmailJS error:", response.text)
        return {"success": False, "message": "Failed to send email"}