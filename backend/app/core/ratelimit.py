from datetime import datetime, timedelta
from collections import defaultdict
from fastapi import HTTPException, Request
import threading

_lock = threading.Lock()
_hits = defaultdict(list)
WINDOW = timedelta(minutes=1)
LIMIT = 10


def rate_limit(request: Request):
    key = request.client.host if request.client else "unknown"
    now = datetime.utcnow()
    with _lock:
        _hits[key] = [t for t in _hits[key] if now - t < WINDOW]
        if len(_hits[key]) >= LIMIT:
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        _hits[key].append(now)
