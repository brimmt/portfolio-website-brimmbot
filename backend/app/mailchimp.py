import os, httpx, hashlib

MC_API_KEY = os.getenv("MAILCHIMP_API_KEY")
MC_LIST_ID = os.getenv("MAILCHIMP_LIST_ID")
MC_DC = MC_API_KEY.split("-")[-1] if MC_API_KEY else None
MC_BASE = f"https://{MC_DC}.api.mailchimp.com/3.0"

def _hash_email(email: str) -> str:
    return hashlib.md5(email.strip().lower().encode("utf-8")).hexdigest()

async def upsert_member(email: str, first_name: str | None = None, last_name: str | None = None, tags: list[str] | None = None):
    if not (MC_API_KEY and MC_LIST_ID and MC_DC):
        raise RuntimeError("Mailchimp not configured. Check MAILCHIMP_* env vars.")
    payload = {
        "email_address": email.strip().lower(),
        "status_if_new": "pending",
        "status": "pending",
        "merge_fields": {"FNAME": first_name or "", "LNAME": last_name or ""},
    }
    sub_hash = _hash_email(email)
    async with httpx.AsyncClient(auth=("anystring", MC_API_KEY), timeout=10) as client:
        r = await client.put(f"{MC_BASE}/lists/{MC_LIST_ID}/members/{sub_hash}", json=payload)
        print("PUT response", r.status_code, r.text)
        r.raise_for_status()
        if tags:
            tr = await client.post(
                f"{MC_BASE}/lists/{MC_LIST_ID}/members/{sub_hash}/tags",
                json={"tags": [{"name": t, "status": "active"} for t in tags]},
            )
            tr.raise_for_status()