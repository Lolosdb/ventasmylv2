import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# 1. Buscamos la línea exacta que dibuja la columna "Nº" (la que encontramos antes)
# Copio y pego literalmente lo que salió en tu búsqueda para asegurar que coincida.
target_code = 'className: `sticky left-0 z-10 font-black text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] py-2 text-center transition-colors ${w.sticky}`, children: S.id'

# 2. El reemplazo con la "MÁSCARA" visual
# Significa: ¿El ID es mayor de 10,000? Entonces divide por 10,000 y dame el resto (Ej: 20260001 -> 1).
# Si no, muestra el ID normal.
new_code = 'className: `sticky left-0 z-10 font-black text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] py-2 text-center transition-colors ${w.sticky}`, children: S.id > 10000 ? S.id % 10000 : S.id'

try:
    if not os.path.exists(path):
        print(f"❌ No encuentro el archivo en: {path}")
        exit()

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if target_code in content:
        # Hacemos el cambio
        new_content = content.replace(target_code, new_code)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ ¡ÉXITO! Máscara visual aplicada.")
        print("   - Internamente tu ID será seguro (ej. 20260001).")
        print("   - Visualmente verás solo '1', '2', '3'...")
        
    else:
        print("⚠️ No encontré el código exacto para reemplazar.")
        print("   Puede que haya una pequeña diferencia de espacios.")
        
except Exception as e:
    print(f"❌ Error: {e}")