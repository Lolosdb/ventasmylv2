import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"
target = "(t.length > 0 ? Math.max(...t.map(oe => oe.id)) + 1 : 900)"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

index = content.find(target)
if index != -1:
    print(f"Found at index: {index}")
    # Show some context
    start = max(0, index - 50)
    end = min(len(content), index + len(target) + 50)
    print("Context around found snippet:")
    print(content[start:end])
else:
    print("Not found exactly. Trying partial match...")
    partial = "Math.max(...t.map(oe => oe.id))"
    index = content.find(partial)
    if index != -1:
        print(f"Partial found at index: {index}")
        start = max(0, index - 100)
        end = min(len(content), index + 200)
        print("Context around partial match:")
        print(content[start:end])
    else:
        print("Partial match also not found.")
