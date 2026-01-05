
path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start = 259119
length = 10000 
chunk = content[start:start+length]

print(chunk)
