
path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"
search_term = 'Copias Disponibles'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
    index = content.find(search_term)
    if index != -1:
        # Custom range for insertion point
        start = 854950
        end = 855050
        with open('insertion_point.txt', 'w', encoding='utf-8') as outfile:
             outfile.write(content[start:end])
        print(f"Written insertion point to insertion_point.txt")
    else:
        print("Not found")
