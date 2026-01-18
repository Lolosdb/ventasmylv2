/**
 * UI FIXES - Correcciones visuales y comportamientos reactivos
 * Reemplaza el bucle infinito setInterval por MutationObserver para mejor rendimiento.
 */

(function (window) {
    'use strict';

    console.log('⚡ UI Fixes cargado (MutationObserver)');

    // Estado global de detección
    window.clienteEnEdicionGlobal = null;

    // --- 1. CONFIGURACIÓN DEL OBSERVER ---
    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] };

    const observer = new MutationObserver((mutations) => {
        let checkScrollHelpers = false;
        let checkMapVisibility = false;

        for (const mutation of mutations) {
            // Optimización: Solo verificamos si se añaden nodos o cambian estilos relevantes
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) checkScrollHelpers = true;
            if (mutation.type === 'attributes') checkMapVisibility = true;
        }

        requestAnimationFrame(() => {
            if (checkScrollHelpers) aplicarCorreccionesUI();
            if (checkMapVisibility) gestionarVisibilidadMapa();

            // Siempre verificar reparaciones y botón flotante en cambios de DOM
            gestionarBotonReparar();
            detectarClienteEnPantalla();
        });
    });

    // --- 2. FUNCIONES DE CORRECCIÓN ---

    function aplicarCorreccionesUI() {
        // A. SCROLL MODAL EDITAR PEDIDO
        // Buscamos textos que digan "Editar Pedido"
        const titulos = Array.from(document.querySelectorAll('h1, h2, h3, div, span')).filter(el =>
            el.textContent && el.textContent.trim() === "Editar Pedido"
        );

        if (titulos.length > 0) {
            // BLOQUEAR SCROLL DEL BODY (Para que el fondo no se mueva)
            if (document.body.style.overflow !== 'hidden') {
                document.body.style.setProperty('overflow', 'hidden', 'important');
            }
        } else {
            // RESTAURAR SCROLL SI NO ESTÁ EL MODAL Y NO ESTÁ EL MAPA
            const visorMap = document.getElementById('visor-mapa-myl');
            if (document.body.style.overflow === 'hidden' && (!visorMap || visorMap.style.display === 'none')) {
                document.body.style.removeProperty('overflow');
            }
        }

        titulos.forEach(el => {
            // 1. Asegurar contenedor padre (bloqueo oscuro) con scroll
            let wrapper = el.closest('div[style*="position: fixed"]') || el.closest('div[style*="z-index"]');
            if (wrapper) {
                // Asegurar que el overlay ocupe todo
                if (wrapper.style.height !== '100%') wrapper.style.setProperty('height', '100%', 'important');

                // Habilitar scroll en el wrapper
                if (wrapper.style.overflowY !== 'auto') {
                    wrapper.style.setProperty('overflow-y', 'auto', 'important');
                    wrapper.style.setProperty('padding-bottom', '80px', 'important');
                    wrapper.style.setProperty('overscroll-behavior', 'contain', 'important');
                }
            }

            // 2. Buscar tarjeta blanca y darle altura max
            let p = el.parentElement;
            let tarjetaEncontrada = false;
            while (p && p.tagName !== 'BODY' && !tarjetaEncontrada) {
                try {
                    const s = window.getComputedStyle(p);
                    if (s.backgroundColor === 'rgb(255, 255, 255)' || s.backgroundColor === '#ffffff' || s.backgroundColor === 'white') {
                        if (p.style.maxHeight !== '85vh') {
                            p.style.setProperty('max-height', '85vh', 'important');
                            p.style.setProperty('overflow-y', 'auto', 'important');
                            p.style.setProperty('display', 'block', 'important');
                            p.style.setProperty('overscroll-behavior', 'contain', 'important');
                        }
                        tarjetaEncontrada = true;
                    }
                } catch (e) { }
                p = p.parentElement;
            }
        });

        // B. OCULTAR ELEMENTOS INNECESARIOS
        document.querySelectorAll('div,p,span').forEach(e => {
            if (e.textContent && e.textContent.includes('Mejorando precisión') && e.style.display !== 'none') {
                e.style.display = 'none';
            }
        });

        // C. Z-INDEX FIX (Elementos pegados al fondo que tapan cosas)
        document.querySelectorAll('div').forEach(d => {
            if (d.style.position === 'fixed' && d.style.bottom === '0px' && d.style.zIndex !== "9999") {
                const r = d.getBoundingClientRect();
                if (r.bottom >= window.innerHeight) {
                    d.style.zIndex = "9999";
                    d.querySelectorAll('svg, img').forEach(i => i.style.filter = 'brightness(0) invert(1)');
                }
            }
        });
    }

    function gestionarVisibilidadMapa() {
        let mapaActivo = false;

        // Detección por URL
        if (window.location.href.includes('/map')) mapaActivo = true;

        // Detección por botones activos en la navbar
        document.querySelectorAll('a, div, span, p').forEach(el => {
            const txt = el.textContent ? el.textContent.trim().toLowerCase() : '';
            if (txt === 'mapa' || txt === 'map') {
                const style = window.getComputedStyle(el);
                if (el.className.includes('active') || style.color === 'rgb(255, 255, 255)' || style.color === 'rgb(37, 99, 235)') {
                    mapaActivo = true;
                }
            }
        });

        const visorMyl = document.getElementById('visor-mapa-myl');
        const visorOld = document.getElementById('visor-mapa'); // Por compatibilidad si quedase

        if (mapaActivo) {
            // Prioridad al mapa nuevo
            if (visorMyl && visorMyl.style.display !== 'block') {
                visorMyl.style.display = 'block';
                document.body.style.overflow = 'hidden';
                if (window.initMap) window.initMap(); // De mapa-myl.js
            } else if (visorOld && (!visorMyl || visorMyl.style.display === 'none')) {
                // Fallback a mapa viejo si existiese
                visorOld.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        } else {
            // Ocultar todo
            if (visorMyl && visorMyl.style.display !== 'none') {
                visorMyl.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (visorOld && visorOld.style.display !== 'none') {
                visorOld.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    }

    function gestionarBotonReparar() {
        // Busca el botón "Seleccionar Archivo" original de la app para inyectarle al lado el botón reparar
        const botonesTexto = document.querySelectorAll('div, button, label, span');
        let botonOriginal = null;

        // Búsqueda del ancla
        for (const el of botonesTexto) {
            if (el.textContent && el.textContent.trim() === "Seleccionar Archivo" && el.offsetParent !== null) {
                botonOriginal = el;
                break;
            }
        }

        if (botonOriginal) {
            let contenedor = botonOriginal.parentElement;
            // Subir hasta encontrar un contenedor decente
            let depth = 0;
            while (contenedor && contenedor.tagName !== 'DIV' && !contenedor.className.includes('card') && depth < 3) {
                contenedor = contenedor.parentElement;
                depth++;
            }
            if (!contenedor) contenedor = botonOriginal.parentElement.parentElement;

            if (contenedor && !document.getElementById('btn-reparar-inyectado')) {
                const btn = document.createElement('div');
                btn.id = 'btn-reparar-inyectado';
                btn.innerHTML = '🛠️ REPARAR FICHA BLANCA';
                // Estilos básicos por si CSS falla
                btn.style.cssText = "width:100%; padding:12px; margin-top:15px; border-radius:8px; cursor:pointer; font-weight:bold; background:#f97316; color:white; text-align:center;";
                btn.onclick = function () {
                    if (window.repararBaseDatos) window.repararBaseDatos();
                    else alert("Módulo Data Manager no cargado");
                };
                contenedor.appendChild(btn);
            }
        }
    }

    function detectarClienteEnPantalla() {
        const btn = document.getElementById('btn-editar-flotante');
        if (!btn) return;

        // Si el mapa está visible, ocultar lápiz
        const visor = document.getElementById('visor-mapa-myl');
        if (visor && visor.style.display === 'block') {
            btn.style.display = 'none';
            return;
        }

        // Buscar títulos grandes que parezcan nombres de clientes
        const titulos = document.querySelectorAll('h1, h2, h3, div[class*="title"], span[class*="title"]');
        const clientes = JSON.parse(localStorage.getItem('clients') || '[]'); // TODO: Optimizar lectura?
        // Nota: Leemos localStorage aquí porque puede cambiar. Se podría optimizar con cache pero es riesgoso si cambia fuera.

        let encontrado = null;
        for (let el of titulos) {
            const texto = el.textContent ? el.textContent.trim().toUpperCase() : "";
            if (texto.length > 3) {
                // Búsqueda exacta primero
                const match = clientes.find(c => (c.name || "").toUpperCase() === texto);
                if (match) { encontrado = match; break; }
            }
        }

        if (encontrado) {
            btn.style.display = 'flex';
            window.clienteEnEdicionGlobal = encontrado; // Exportar para data-manager
        } else {
            btn.style.display = 'none';
            window.clienteEnEdicionGlobal = null;
        }
    }

    // --- 3. INICIALIZACIÓN ---

    // Iniciar Observer
    observer.observe(document.body, observerConfig);

    // Inyección inicial HTML (Botón Flotante)
    if (!document.getElementById('btn-editar-flotante')) {
        const btn = document.createElement('div');
        btn.id = 'btn-editar-flotante';
        btn.innerHTML = '✏️';
        btn.onclick = () => {
            if (window.abrirEditor) window.abrirEditor();
        };
        document.body.appendChild(btn);
    }

    // Inyección inicial HTML (Modal Editor - Skeleton básico si no existe)
    if (!document.getElementById('modal-editor')) {
        // Nota: Idealmente el modal debería estar en el HTML estático, pero si no está, lo creamos
        // Para esta refactorización asumimos que el HTML del modal sigue en index.html o se inyectó dinámicamente.
        // Si se borra de index.html, aquí es donde deberíamos recrearlo. 
        // Verificaremos si el usuario quiere mantenerlo en index.html o moverlo aquí.
        // Por ahora confiamos en que index.html lo tenga.
    }

})(window);
