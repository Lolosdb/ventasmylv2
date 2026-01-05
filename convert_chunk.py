
try:
    with open(r"c:\Users\lolos\Desktop\App Ventas\chunk.txt", "rb") as f:
        raw = f.read()
        
    try:
        content = raw.decode("utf-16le")
    except:
        content = raw.decode("utf-8", errors="replace")

    with open(r"c:\Users\lolos\Desktop\App Ventas\safe_text.txt", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Done")
except Exception as e:
    print(f"Error: {e}")
