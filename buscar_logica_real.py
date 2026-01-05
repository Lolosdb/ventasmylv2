import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("--- 1. BUSCANDO CÁLCULO DE TOP CLIENTES ---")
    # Sabemos que "Top Clientes" está en el código.
    # La variable que usa es 'O' según tu búsqueda anterior: O.map(...)
    # Vamos a buscar dónde se define 'O' justo antes de "Top Clientes".
    
    idx_top = content.find('children: "Top Clientes"')
    if idx_top == -1:
        idx_top = content.find('Top Clientes') # Intento simple
        
    if idx_top != -1:
        # Miramos 1000 caracteres ANTES para ver la fórmula matemática
        start = max(0, idx_top - 1200)
        end = idx_top
        print(f"Contexto ANTERIOR a Top Clientes:")
        print(content[start:end])
    else:
        print("❌ No encontré Top Clientes esta vez.")

    print("\n" + "-"*40 + "\n")

    print("--- 2. BUSCANDO CÁLCULO DE TOTALES (Facturación Real) ---")
    # En tu captura sale "FACTURACIÓN ANUAL REAL". Esa frase es única.
    # La lógica de suma estará justo antes de mostrar ese título.
    
    idx_fact = content.find("FACTURACIÓN ANUAL REAL")
    if idx_fact == -1:
         # A veces está en minúsculas o con tildes codificadas
         idx_fact = content.find("Facturación Anual Real")
         
    if idx_fact != -1:
        start = max(0, idx_fact - 1500) # Necesitamos ver bastante código antes
        end = idx_fact + 200
        print(f"Lógica encontrada cerca de FACTURACIÓN ANUAL REAL:")
        print(content[start:end])
    else:
        print("❌ No encontré la frase 'FACTURACIÓN ANUAL REAL'.")

except Exception as e:
    print(f"Error: {e}")