from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel, EmailStr
from .mailchimp import upsert_member
from .emailer import send_contact_email
 



app = FastAPI()

DEFAULT_ORIGINS = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500"
origins = os.getenv("CORS_ALLOW_ORIGINS", DEFAULT_ORIGINS).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

class SubscribeIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    honey: str | None = None
    

@app.post("/api/subscribe")
async def subscribe(payload: SubscribeIn):
    if payload.honey:
        return {"ok": True, "message": "Thanks!"}
    try:
        await upsert_member(
            email=payload.email,
            first_name=payload.first_name,
            last_name=payload.last_name,
            tags=["JobSeekerAI", "Beta"]
        )
        return {"ok": True, "message": "You're almost in! 🎉 Please check your email to confirm your subscription — and don’t forget to peek in your spam or promotions folder just in case."}
    except Exception as e:
        # print stack + message for debugging
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Subscription failed: {e}")
    
    # Email Sender

class ContactIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    subject: str
    message: str
    company: str | None = None  # honeypot

@app.post("/api/contact")
async def contact(payload: ContactIn):
    # Honeypot: silently succeed if bots fill it
    if payload.company:
        return {"ok": True, "message": "Thanks!"}
    try:
        await send_contact_email(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message,
        )
        return {"ok": True, "message": "Message sent! I’ll get back to you soon."}
    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Contact failed: {e}")





