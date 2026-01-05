import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# 1. El código "tonto" que suma todo sin mirar fecha
target_code = 'b = t.reduce((G, X) => (G[X.clientName] = (G[X.clientName] || 0) + (Number(X.amount) || 0), G), {})'

# 2. El código "listo" que solo suma si el año coincide con el actual
# Usamos: (X.date||"").includes(String(new Date().getFullYear()))
# Esto hace que sea dinámico: en 2026 filtra por 2026, en 2027 por 2027...
new_code = 'b = t.reduce((G, X) => ((X.date||"").includes(String(new Date().getFullYear())) && (G[X.clientName] = (G[X.clientName] || 0) + (Number(X.amount) || 0)), G), {})'

try:
    if not os.path.exists(path):
        print(f"❌ Error: No encuentro el archivo index en {path}")
        exit()

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if target_code in content:
        # Reemplazamos
        new_content = content.replace(target_code, new_code)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ ¡Parche aplicado a TOP CLIENTES!")
        print("   - Ahora el ranking se reinicia automáticamente cada 1 de Enero.")
        print("   - Solo verás las ventas de ESTE año en el Top.")
        
    else:
        print("⚠️ No encontré el código exacto.")
        print("   Es posible que haya una pequeña variación de espacios.")

except Exception as e:
    print(f"❌ Error: {e}")