from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request
import threading

_lock = threading.Lock()
_hits: dict = {}
WINDOW = timedelta(minutes=1)
LIMIT = 10


def rate_limit(request: Request):
    key = request.client.host if request.client else "unknown"
    now = datetime.now(timezone.utc)
    with _lock:
        # plain dict + explicit pop avoids defaultdict's auto-vivification leak for one-off IPs
        hits = [t for t in _hits.get(key, []) if now - t < WINDOW]
        if len(hits) >= LIMIT:
            _hits[key] = hits
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        hits.append(now)
        _hits[key] = hits
        # drop IPs with no activity in the current window so the dict doesn't grow unbounded
        for stale_key in [k for k, v in _hits.items() if all(now - t >= WINDOW for t in v)]:
            _hits.pop(stale_key, None)
