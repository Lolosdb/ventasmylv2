import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos la línea exacta que encontramos antes (Candidate 2)
    # Object.entries(b).sort(([, G], [, X]) => X - G)
    
    # Usamos un trozo único de ese código para anclarnos
    anchor = "Object.entries(b).sort(([, G], [, X]) => X - G)"
    
    idx = content.find(anchor)
    
    if idx != -1:
        # Mostramos los 600 caracteres ANTERIORES.
        # Ahí debe estar la definición: const b = t.reduce(...)
        start = max(0, idx - 600)
        end = idx + 50 # Un poco después para confirmar
        
        print("--- CÓDIGO DE SUMA DE TOP CLIENTES ---")
        print(content[start:end])
        print("-" * 50)
    else:
        print("❌ No encontré el ancla exacta. Probando búsqueda flexible...")
        # Intento flexible por si acaso
        anchor_flex = ".sort(([, G], [, X]) => X - G)"
        idx_flex = content.find(anchor_flex)
        if idx_flex != -1:
            print(content[max(0, idx_flex-600):idx_flex+50])

except Exception as e:
    print(f"Error: {e}")