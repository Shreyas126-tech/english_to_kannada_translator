import requests
import time

def verify():
    url = "http://127.0.0.1:5000/translate"
    payload = {"text": "Hello world"}
    
    print(f"Testing {url} with payload {payload}")
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        print("Response status:", response.status_code)
        # print("Data received:", data) # Commented out to avoid encoding error
        
        if 'translation' in data and 'audio_url' in data:
            print("SUCCESS: Translation and Audio URL received.")
            print(f"Translation length: {len(data['translation'])}")
            print(f"Audio URL: {data['audio_url']}")
            # Do not print raw translation to avoid console encoding errors on Windows
        else:
            print("FAILURE: Missing keys in response.")
            
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    time.sleep(1) # Give server a moment if just started (it is already running though)
    verify()
