import os

path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

# 1. El código bloqueante (Busca excusas para no guardar)
# Busca: if (A.length <= h2.length && v.length === 0)
# (Simplificado para asegurar que lo encuentra aunque varíen los espacios)
part_to_find = 'if (A.length <= h2.length && v.length === 0)'

# 2. El reemplazo: Lo cambiamos por una condición que nunca se cumpla (false)
# O simplemente quitamos ese IF bloqueante. 
# Lo más seguro es cambiar la condición para que SIEMPRE intente guardar.
# Vamos a buscar el bloque entero y simplificarlo.

# En vez de complicarnos con regex, vamos a buscar la cadena exacta que salió en tu log.
target_snippet = 'if (A.length <= h2.length && v.length === 0) { console.warn("Auto Backup skipped: Data appears'

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Vamos a buscar el bloque if completo que contiene esa advertencia
    # y lo vamos a anular para que NO salte el return o el bloqueo.
    
    if target_snippet in content:
        # Reemplazamos la condición por "if (false)" para que NUNCA entre en el bloqueo
        # y siempre siga adelante con la copia.
        new_snippet = target_snippet.replace('if (A.length <= h2.length && v.length === 0)', 'if (false)')
        
        new_content = content.replace(target_snippet, new_snippet)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ ¡Parche de Backup aplicado!")
        print("   - Se ha eliminado la restricción de 'pocos datos'.")
        print("   - Ahora la copia saltará siempre a las 21:00 de L-V.")
        
    else:
        print("⚠️ No encontré el bloque exacto. Vamos a probar una búsqueda más corta.")
        # Intento secundario con menos texto
        short_target = 'if (A.length <= h2.length && v.length === 0)'
        if short_target in content:
             new_content = content.replace(short_target, 'if (false)')
             with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
             print("✅ ¡Parche aplicado (versión corta)!")
        else:
             print("❌ Error: No encuentro el código bloqueante. Puede que las variables A, h2, v se llamen distinto.")

except Exception as e:
    print(f"Error: {e}")