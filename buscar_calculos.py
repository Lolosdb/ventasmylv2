import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("--- Buscando lógica de TOP CLIENTES ---")
    # Buscamos el título "Top Clientes" para ver qué variable usa
    idx_top = content.find("Top Clientes")
    if idx_top != -1:
        start = max(0, idx_top - 500)
        end = min(len(content), idx_top + 500)
        print(f"Encontrado en {idx_top}:")
        print(content[start:end])
    else:
        print("❌ No encontré 'Top Clientes'.")

    print("\n" + "-"*40 + "\n")

    print("--- Buscando lógica de TOTALES POR PROVINCIA ---")
    # Buscamos algo característico de esa pantalla. 
    # En tu captura sale "ASTURIAS", "CANTABRIA". A veces se hardcodean o se sacan de los pedidos.
    # Buscaremos una función que use 'reduce' y 'amount' o 'province' cerca de donde se pintan los cuadros.
    
    # Intentamos buscar clases CSS que se ven en los cuadros de totales
    # Suelen tener "bg-white" y mostrar el importe.
    # Vamos a buscar donde se procesan las provincias.
    
    idx_prov = content.find("ASTURIAS")
    if idx_prov != -1:
         # Buscamos un poco antes, donde se define el array de provincias o el map
         start = max(0, idx_prov - 1000)
         end = min(len(content), idx_prov + 500)
         print(f"Posible lógica de Provincias en {idx_prov}:")
         print(content[start:end])
    else:
        # Si no encuentra Asturias explícitamente, buscamos por estructura de reduce
        print("⚠️ No encontré 'ASTURIAS' en texto plano. Buscando iteraciones de importes...")
        # Esto busca donde se suma el dinero (amount)
        matches = [i for i in range(len(content)) if content.startswith(".reduce", i)]
        for m in matches[:3]: # Mostramos los 3 primeros reduces que encuentre
             print(f"Reduce encontrado en {m}:")
             print(content[m-100:m+200])

except Exception as e:
    print(f"Error: {e}")