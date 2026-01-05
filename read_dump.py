
import sys

try:
    with open(r"c:\Users\lolos\Desktop\App Ventas\dump.txt", "rb") as f:
        raw = f.read()
        
    # Try utf-16le first (powershell output)
    try:
        content = raw.decode("utf-16le")
    except:
        content = raw.decode("utf-8", errors="replace")

    # Filter out potential BMP chars that fail on windows console
    safe_content = content.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding)
    print(safe_content)
except Exception as e:
    print(f"Error: {e}")
