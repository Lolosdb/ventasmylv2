/**
 * UI FIXES - v6 LIMPIEZA FINAL
 * Mantiene scroll inteligente, bloqueo de fondo y limpia botones obsoletos.
 */

(function (window) {
    'use strict';

    console.log('⚡ UI Fixes cargado - v6 (Limpieza Final)');

    const style = document.createElement('style');
    style.innerHTML = `
        body.modal-open { overflow: hidden !important; position: fixed !important; width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; }
        .modal-card-fixed-scroll { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; max-height: 85vh !important; display: block !important; padding-bottom: 120px !important; box-sizing: border-box !important; }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
            aplicarCorreccionesUI();
            gestionarVisibilidadMapa();
            gestionarTextosAyuda();
            detectarClienteEnPantalla();
        });
    });

    function aplicarCorreccionesUI() {
        const titulosModales = ['editar pedido', 'editar cliente', 'nuevo pedido', 'nuevo cliente', 'detalle pedido'];
        let modalRealmenteAbierto = false;

        document.querySelectorAll('h1, h2, h3, div, span').forEach(el => {
            if (!el.textContent || el.offsetParent === null) return;

            const txt = el.textContent.trim().toLowerCase();
            if (titulosModales.includes(txt)) {
                // Buscamos el contenedor del modal (la "tarjeta")
                let p = el.parentElement;
                while (p && p.tagName !== 'BODY') {
                    const s = window.getComputedStyle(p);
                    const zIndex = parseInt(s.zIndex) || 0;
                    const esFixedBajo = s.position === 'fixed' || s.position === 'absolute';

                    // Solo es un modal real si tiene z-index alto o fondo con sombra
                    if (zIndex > 100 || (s.boxShadow !== 'none' && esFixedBajo)) {
                        modalRealmenteAbierto = true;
                        if (!p.classList.contains('modal-card-fixed-scroll')) {
                            p.classList.add('modal-card-fixed-scroll');
                        }
                        break;
                    }
                    p = p.parentElement;
                }
            }
        });

        // Solo bloqueamos el body si hay un modal real activo
        if (modalRealmenteAbierto) {
            if (!document.body.classList.contains('modal-open')) document.body.classList.add('modal-open');
        } else {
            if (document.body.classList.contains('modal-open')) document.body.classList.remove('modal-open');
        }
    }

    function gestionarTextosAyuda() {
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Selecciona el archivo "Clientes.xls"')) {
                el.innerHTML = 'Selecciona un archivo Excel (<b>Clientes</b> o <b>Clientes_CON_COORDENADAS</b>) para actualizar la lista.';
            }
        });

        // Auto-conectar el input file si existe
        const inputExcel = document.getElementById('input-excel') || document.querySelector('input[type="file"]');
        if (inputExcel && !inputExcel.dataset.hooked) {
            inputExcel.onchange = (e) => { if (window.cargarExcel) window.cargarExcel(e.target); };
            inputExcel.dataset.hooked = "true";
        }
    }

    function gestionarVisibilidadMapa() {
        const visorMyl = document.getElementById('visor-mapa-myl');
        if (!visorMyl) return;
        let mapaActivo = window.location.href.includes('/map');
        document.querySelectorAll('a, div, span').forEach(el => {
            const txt = el.textContent ? el.textContent.trim().toLowerCase() : '';
            if (txt === 'mapa') {
                const s = window.getComputedStyle(el);
                if (el.className.includes('active') || s.color === 'rgb(255, 255, 255)') mapaActivo = true;
            }
        });
        visorMyl.style.display = mapaActivo ? 'block' : 'none';
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
        if (encontrado) { btn.style.display = 'flex'; window.clienteEnEdicionGlobal = encontrado; }
        else { btn.style.display = 'none'; }
    }

    observer.observe(document.body, { childList: true, subtree: true });

    if (!document.getElementById('btn-editar-flotante')) {
        const b = document.createElement('div');
        b.id = 'btn-editar-flotante';
        b.innerHTML = '✏️';
        b.onclick = () => window.abrirEditor ? window.abrirEditor() : null;
        document.body.appendChild(b);
    }
})(window);
