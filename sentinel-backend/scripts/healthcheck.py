import sys
import httpx

try:
    response = httpx.get("http://localhost:8000/health", timeout=5.0)
    if response.status_code == 200:
        print("Healthcheck passed.")
        sys.exit(0)
    else:
        print(f"Healthcheck failed with status code {response.status_code}")
        sys.exit(1)
except Exception as e:
    print(f"Healthcheck exception: {e}")
    sys.exit(1)
