import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos palabras clave que salen en tu foto
    keywords = ["TIENDA", "IMPORTE", "FECHA", "Nº"]
    
    found = False
    for kw in keywords:
        index = content.find(kw)
        if index != -1:
            print(f"\n✅ ENCONTRADO '{kw}' en el índice {index}")
            # Mostramos el contexto para identificar la columna del ID
            start = max(0, index - 400)
            end = min(len(content), index + 800)
            print(f"--- Contexto alrededor de {kw} ---")
            print(content[start:end])
            print("-" * 50)
            found = True
            # Solo necesitamos encontrar uno bueno para ubicarnos
            break 
            
    if not found:
        print("❌ No encontré las cabeceras exactas. ¿Quizás están en minúsculas en el código?")
        print("   Intenta buscar 'Tienda' o 'Importe' editando este script si falla.")

except Exception as e:
    print(f"Error: {e}")