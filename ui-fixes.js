/**
 * UI FIXES - v4 DETECCIÓN INTELIGENTE DE TARJETA
 * No depende del color blanco exacto. Busca sombras y bordes.
 */

(function (window) {
    'use strict';

    console.log('⚡ UI Fixes cargado (MutationObserver) - v4 INTELIGENTE');

    // --- 0. ESTILOS SUPREMOS ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Bloqueo total del fondo */
        body.modal-open {
            overflow: hidden !important;
            overscroll-behavior: none !important;
            position: fixed !important; 
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            left: 0 !important;
        }

        /* Clase de Fuerza Bruta para el scroll de la tarjeta */
        .modal-card-fixed-scroll {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important; 
            overscroll-behavior: contain !important;
            max-height: 65vh !important; /* Más corto aún para seguridad total */
            display: block !important;
            pointer-events: auto !important;
            padding-bottom: 120px !important; /* Margen gigante para ver botones */
            box-sizing: border-box !important;
        }
    `;
    document.head.appendChild(style);

    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] };

    const observer = new MutationObserver(() => {
        requestAnimationFrame(aplicarCorreccionesUI);
        gestionarVisibilidadMapa();
        gestionarBotonReparar();
        detectarClienteEnPantalla();
    });

    function aplicarCorreccionesUI() {
        const titulosBusqueda = ['editar pedido', 'editar cliente', 'nuevo pedido', 'nuevo cliente', 'detalle pedido'];

        const todosLosElementos = document.querySelectorAll('h1, h2, h3, div, span, p, strong');
        let modalActivo = false;

        todosLosElementos.forEach(el => {
            if (!el.textContent || el.offsetParent === null) return;

            const txt = el.textContent.trim().toLowerCase();
            if (titulosBusqueda.some(t => txt === t)) {
                modalActivo = true;

                // --- BUSCAR LA TARJETA (Hacia arriba) ---
                let p = el.parentElement;
                let foundCard = false;

                while (p && p.tagName !== 'BODY') {
                    const s = window.getComputedStyle(p);
                    const hasBg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
                    const hasShadow = s.boxShadow !== 'none' && s.boxShadow !== '';
                    const hasRadius = parseInt(s.borderRadius) > 0;

                    // Si tiene fondo y (sombra o radio), es nuestra tarjeta
                    if (hasBg && (hasShadow || hasRadius)) {
                        if (!p.classList.contains('modal-card-fixed-scroll')) {
                            p.classList.add('modal-card-fixed-scroll');
                            console.log('🎯 Tarjeta detectada y corregida:', p);
                        }
                        foundCard = true;
                        break;
                    }
                    p = p.parentElement;
                }

                // Si no encontramos con sombra, probamos simplemente el padre más grande que no sea el body ni el overlay
                if (!foundCard) {
                    let container = el.closest('div');
                    if (container && container.parentElement && container.parentElement.tagName !== 'BODY') {
                        // Aplicar al segundo nivel hacia arriba suele ser la tarjeta
                        let target = container.parentElement;
                        if (!target.classList.contains('modal-card-fixed-scroll')) {
                            target.classList.add('modal-card-fixed-scroll');
                        }
                    }
                }
            }
        });

        if (modalActivo) {
            if (!document.body.classList.contains('modal-open')) {
                document.body.classList.add('modal-open');
            }
        } else {
            const visorMap = document.getElementById('visor-mapa-myl');
            if (document.body.classList.contains('modal-open') && (!visorMap || visorMap.style.display === 'none')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    // (Omitidas por brevedad pero mantenidas en el archivo real: mapa, reparar, detectar)
    // ... incluiré las funciones gestoras para que el archivo sea funcional al 100% ...

    function gestionarVisibilidadMapa() {
        let mapaActivo = false;
        if (window.location.href.includes('/map')) mapaActivo = true;
        document.querySelectorAll('a, div, span, p').forEach(el => {
            const txt = el.textContent ? el.textContent.trim().toLowerCase() : '';
            if (txt === 'mapa' || txt === 'map') {
                const style = window.getComputedStyle(el);
                if (el.className.includes('active') || style.color === 'rgb(255, 255, 255)' || style.color === 'rgb(37, 99, 235)') mapaActivo = true;
            }
        });
        const visorMyl = document.getElementById('visor-mapa-myl');
        if (mapaActivo) {
            if (visorMyl && visorMyl.style.display !== 'block') {
                visorMyl.style.display = 'block';
                if (window.initMap) window.initMap();
            }
        } else if (visorMyl && visorMyl.style.display !== 'none') {
            visorMyl.style.display = 'none';
        }
    }

    function gestionarBotonReparar() {
        const botonesTexto = document.querySelectorAll('div, button, label, span');
        let botonOriginal = null;
        for (const el of botonesTexto) {
            if (el.textContent && el.textContent.trim() === "Seleccionar Archivo" && el.offsetParent !== null) {
                botonOriginal = el; break;
            }
        }
        if (botonOriginal) {
            let contenedor = botonOriginal.parentElement;
            while (contenedor && contenedor.tagName !== 'DIV' && !contenedor.className.includes('card')) {
                contenedor = contenedor.parentElement;
            }
            if (contenedor && !document.getElementById('btn-reparar-inyectado')) {
                const btn = document.createElement('div');
                btn.id = 'btn-reparar-inyectado';
                btn.innerHTML = '🛠️ REPARAR FICHA BLANCA';
                btn.style.cssText = "width:100%; padding:12px; margin-top:15px; border-radius:8px; cursor:pointer; font-weight:bold; background:#f97316; color:white; text-align:center;";
                btn.onclick = () => window.repararBaseDatos ? window.repararBaseDatos() : alert("No cargado");
                contenedor.appendChild(btn);
            }
        }
    }

    function detectarClienteEnPantalla() {
        const btn = document.getElementById('btn-editar-flotante');
        if (!btn) return;
        const titulos = document.querySelectorAll('h1, h2, h3, div[class*="title"], span[class*="title"]');
        const clientes = JSON.parse(localStorage.getItem('clients') || '[]');
        let encontrado = null;
        for (let el of titulos) {
            const texto = el.textContent ? el.textContent.trim().toUpperCase() : "";
            if (texto.length > 3) {
                const match = clientes.find(c => (c.name || "").toUpperCase() === texto);
                if (match) { encontrado = match; break; }
            }
        }
        if (encontrado) {
            btn.style.display = 'flex';
            window.clienteEnEdicionGlobal = encontrado;
        } else {
            btn.style.display = 'none';
        }
    }

    // --- INICIO ---
    observer.observe(document.body, observerConfig);
    if (!document.getElementById('btn-editar-flotante')) {
        const b = document.createElement('div');
        b.id = 'btn-editar-flotante';
        b.innerHTML = '✏️';
        b.onclick = () => window.abrirEditor ? window.abrirEditor() : null;
        document.body.appendChild(b);
    }
})(window);
