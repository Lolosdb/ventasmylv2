import os

# Ruta al archivo JS
path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# 1. El código EXACTO que encontró el asistente antes de colgarse
#    (Es la lógica antigua que causa conflictos entre años)
target_code = "(t.length > 0 ? Math.max(...t.map(oe => oe.id)) + 1 : 900)"

# 2. La NUEVA lógica inteligente (Formato ID: 20260001)
#    Esto verifica: Si el último ID es menor que 20260000, empieza en 20260001.
#    Si ya estamos en 2026, simplemente suma 1.
new_logic = "(() => { const m = t.length > 0 ? Math.max(...t.map(oe => oe.id)) : 0; const y = new Date().getFullYear() * 10000; return m < y ? y + 1 : m + 1 })()"

try:
    if not os.path.exists(path):
        print(f"❌ No encuentro el archivo en: {path}")
        exit()

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Verificamos si el código objetivo está ahí
    if target_code in content:
        # Reemplazamos
        new_content = content.replace(target_code, new_logic)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ ¡ÉXITO! Lógica actualizada.")
        print("   Ahora los pedidos usarán el formato de año (ej. 20260001) internamente.")
        print("   Esto soluciona el conflicto de duplicados.")
        
    else:
        print("⚠️ No encontré el código exacto. Es posible que ya se haya cambiado.")
        # Buscamos si ya tiene la lógica nueva para confirmar
        if "getFullYear() * 10000" in content:
            print("   ¡Buenas noticias! Parece que el archivo YA TIENE la lógica nueva aplicada.")
        else:
            print("   Revisa manualmente o intenta regenerar el archivo original.")

except Exception as e:
    print(f"❌ Error crítico: {e}")