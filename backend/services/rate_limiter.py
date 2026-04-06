import json
import os
import time
import threading
from typing import Dict, Any


class RateLimiter:
    def __init__(self, monthly_cap: int = 28000):
        self.monthly_cap = monthly_cap
        self.counter_file = "data/rate_counter.json"
        self._lock = threading.Lock()
        self._load_or_reset_counter()

    def _load_or_reset_counter(self):
        """Load or reset the counter with thread safety."""
        with self._lock:
            current_month = time.strftime("%Y-%m")
            os.makedirs(os.path.dirname(self.counter_file), exist_ok=True)
            
            if os.path.exists(self.counter_file):
                try:
                    with open(self.counter_file, "r") as f:
                        data = json.load(f)
                    if data.get("month") != current_month:
                        self.used = 0
                        self._save_counter_locked(0, current_month)
                    else:
                        self.used = data.get("count", 0)
                except (json.JSONDecodeError, KeyError):
                    # Reset on corrupted file
                    self.used = 0
                    self._save_counter_locked(0, current_month)
            else:
                self.used = 0
                self._save_counter_locked(0, current_month)

    def _save_counter_locked(self, count: int, month: str | None = None):
        """Save counter with lock held."""
        if month is None:
            month = time.strftime("%Y-%m")
        with open(self.counter_file, "w") as f:
            json.dump({"month": month, "count": count, "updated": time.time()}, f)

    def can_make_request(self) -> bool:
        with self._lock:
            return self.used < self.monthly_cap

    def increment(self):
        with self._lock:
            if self.used < self.monthly_cap:
                self.used += 1
                self._save_counter_locked(self.used)
                return True
            return False

    def get_remaining(self) -> int:
        with self._lock:
            return max(0, self.monthly_cap - self.used)

    def get_used(self) -> int:
        with self._lock:
            return self.used
