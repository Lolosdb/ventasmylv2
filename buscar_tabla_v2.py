import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos la etiqueta exacta de la cabecera.
    # En React minificado suele verse como: children:"Nº" o children: "Nº"
    patterns = [
        'children:"Nº"', 
        'children: "Nº"',
        'children:"TIENDA"',
        'children: "TIENDA"'
    ]
    
    found = False
    print("--- Buscando cabeceras de tabla ---")
    
    for p in patterns:
        index = content.find(p)
        if index != -1:
            print(f"✅ ¡EUREKA! Encontrado '{p}' en índice {index}")
            # Mostramos contexto para ver cómo se dibuja la fila de abajo
            start = max(0, index - 200)
            end = min(len(content), index + 1500)
            print(f"--- CÓDIGO DE LA TABLA ---")
            print(content[start:end])
            print("-" * 50)
            found = True
            break
            
    if not found:
        print("❌ Sigo sin encontrar la cabecera exacta.")
        print("   Vamos a probar buscando la palabra 'IMPORTE' que es menos común en nombres de tiendas.")
        idx = content.find("IMPORTE")
        if idx != -1:
             print(f"✅ Encontrado por 'IMPORTE' en {idx}")
             print(content[max(0, idx-500):min(len(content), idx+1000)])

except Exception as e:
    print(f"Error: {e}")