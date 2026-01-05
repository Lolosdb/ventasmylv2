import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("--- Buscando la fórmula del TOP CLIENTES ---")
    
    # Pista 1: El Top Clientes usa ".sort" para ordenar ventas de mayor a menor (b - a)
    # Pista 2: Usa "Object.entries" para convertir el diccionario de clientes en lista.
    
    # Buscamos donde ocurre "Object.entries" y ".sort" cerca uno del otro
    indices = [i for i in range(len(content)) if content.startswith("Object.entries", i)]
    
    found = False
    for idx in indices:
        # Miramos el contexto posterior
        snippet = content[idx:idx+600]
        
        # Buscamos la estructura típica de ordenación descendente: sort((... b[1] - a[1]))
        if ".sort" in snippet and ("-" in snippet or "b" in snippet):
            print(f"✅ ¡Candidato encontrado en índice {idx}!")
            print(snippet)
            print("-" * 50)
            found = True
            
    if not found:
        print("⚠️ No encontré la estructura exacta. Buscando por 'reduce' (suma de ventas)...")
        # Intento alternativo: buscar donde se suman los importes de los clientes
        # Buscamos algo como: .reduce((..., {clientName, amount})
        idx_reduce = content.find("amount")
        if idx_reduce != -1:
             print(content[max(0, idx_reduce-200):idx_reduce+200])

except Exception as e:
    print(f"Error: {e}")