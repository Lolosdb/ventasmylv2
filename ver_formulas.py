import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos "Cantabria" que es tu punto de referencia claro
    idx = content.find('x("Cantabria")')
    
    if idx != -1:
        # Mostramos los 600 caracteres ANTERIORES para ver las definiciones de 's' y 'x'
        start = max(0, idx - 600)
        end = idx + 100
        print("--- FÓRMULAS DE TOTALES ---")
        print(content[start:end])
        print("-" * 50)
    else:
        print("❌ No encontré 'Cantabria'. Probemos con 'Asturias'.")
        idx_ast = content.find('x("Asturias")')
        if idx_ast != -1:
             print(content[max(0, idx_ast-600):idx_ast+100])

except Exception as e:
    print(f"Error: {e}")