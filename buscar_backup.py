import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# Esta es parte de tu URL de Google, es la huella digital perfecta para buscar
google_id = "AKfycbyVYxW9uXRPIANntN4rwZ4mmEEEnEwVMEJ6g1oIpm93Fn4Q6iAy9vuGEpBD0g3AWcCT"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("--- Buscando lógica de COPIA DE SEGURIDAD ---")
    
    idx = content.find(google_id)
    
    if idx != -1:
        # Encontramos la URL. Vamos a ver el código que la usa.
        # Buscamos hacia atrás para ver la función que llama a esta URL
        start = max(0, idx - 1000)
        end = min(len(content), idx + 500)
        
        print(f"✅ Encontrado en índice {idx}")
        print("--- CÓDIGO ALREDEDOR DE LA URL ---")
        print(content[start:end])
        print("-" * 50)
        
        # Ahora buscamos la lógica de "Auto" o "21:00"
        # A veces se busca por "getHours()", "21", "Monday", etc.
        # Vamos a buscar referencias a horas cerca de ahí o en todo el archivo.
        
        print("\n--- Buscando condiciones de hora (21:00) ---")
        # Buscamos "getHours" y algo relacionado con 21
        indices_hora = [i for i in range(len(content)) if "getHours" in content[i:i+20]]
        for i in indices_hora:
            snippet = content[i:i+300]
            if "21" in snippet or ">" in snippet:
                print(f"⏰ Posible chequeo de hora en {i}:")
                print(snippet)
                print("-" * 20)
                
    else:
        print("❌ No encontré la URL exacta del script de Google.")
        print("   Puede que esté guardada en una variable o cortada.")

except Exception as e:
    print(f"Error: {e}")