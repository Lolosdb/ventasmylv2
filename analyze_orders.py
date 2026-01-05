
import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"
keywords = ["ventas-storage", "localStorage", "pedido", "id:"]

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for kw in keywords:
        print(f"--- Searching for '{kw}' ---")
        start_idx = 0
        count = 0
        while True:
            idx = content.find(kw, start_idx)
            if idx == -1:
                break
            
            # Print context
            start_context = max(0, idx - 100)
            end_context = min(len(content), idx + 200)
            print(f"Match {count+1} at index {idx}:")
            print(content[start_context:end_context])
            print("-" * 40)
            
            start_idx = idx + 1
            count += 1
            if count >= 5: # Limit to 5 matches per keyword
                print("... (more matches truncated)")
                break
                
except Exception as e:
    print(f"Error: {e}")
