
path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target area around localStorage.setItem("orders"
# Previous match was at 260760. Let's look at 259000 to 262000
start = 259000
end = 262000

print(f"--- Context {start}-{end} ---")
print(content[start:end])
