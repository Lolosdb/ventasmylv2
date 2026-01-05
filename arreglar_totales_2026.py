import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# 1. Lógica antigua (Suma sin mirar fecha)
# Esta es la línea exacta que nos dio tu script
target_code = 'V.includes(C.toLowerCase()) ? D + (Number(b.amount) || 0) : D'

# 2. Nueva lógica (Suma SOLO si es del año actual)
# Añadimos: && (b.date||"").includes(String(new Date().getFullYear()))
# Esto mira si la fecha del pedido contiene "2026" (o el año que sea).
new_code = 'V.includes(C.toLowerCase()) && (b.date||"").includes(String(new Date().getFullYear())) ? D + (Number(b.amount) || 0) : D'

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
            
        print("✅ ¡Parche aplicado a TOTALES!")
        print("   - Facturación Anual Real: Ahora solo suma 2026.")
        print("   - Desglose Asturias/Cantabria: Ahora solo suma 2026.")
        
    else:
        print("⚠️ No encontré el código exacto de la suma.")
        print("   Puede que haya espacios distintos. Revisa el archivo manualmenete.")

except Exception as e:
    print(f"❌ Error: {e}")