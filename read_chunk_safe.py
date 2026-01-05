
import sys

try:
    with open(r"c:\Users\lolos\Desktop\App Ventas\chunk.txt", "rb") as f:
        raw = f.read()
        
    try:
        content = raw.decode("utf-16le")
    except:
        content = raw.decode("utf-8", errors="replace")

    safe_content = content.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding)
    print(safe_content)
except Exception as e:
    print(f"Error: {e}")
