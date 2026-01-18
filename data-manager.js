/**
 * DATA MANAGER (Gestor de Datos)
 * Maneja la persistencia de datos (localStorage), importación/exportación de Excel,
 * y lógica del formulario de edición.
 */

(function(window) {
    'use strict';

    console.log('💾 Data Manager cargado');

    // EXPORTAR FUNCIONES GLOBALES (Necesarias para los onclick del HTML)
    window.cargarExcel = cargarExcel;
    window.repararBaseDatos = repararBaseDatos;
    window.borrarDatos = borrarDatos;
    window.guardarEdicion = guardarEdicion;
    window.capturarGPSPropio = capturarGPSPropio;
    window.abrirEditor = abrirEditor;
    window.cerrarEditor = cerrarEditor;

    // --- VARIABLES DE ESTADO ---
    let clienteEnEdicion = null;

    // --- IMPORTACIÓN DE EXCEL ---
    function cargarExcel(input) {
        const file = input.files[0]; 
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const wb = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
                // Usamos header: 1 para obtener Array de Arrays (Posiciones fijas)
                const sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1});
                
                // Empezamos en i=1 para saltar cabecera
                const nuevos = [];
                for(let i=1; i<sheetData.length; i++) {
                    const row = sheetData[i];
                    if(!row || row.length === 0) continue;

                    // LIMPIEZA
                    const clean = (val) => (val === undefined || val === null) ? "" : String(val).trim();
                    const cleanCoord = (val) => {
                        if(!val) return 0;
                        return parseFloat(String(val).replace(',', '.')) || 0;
                    };

                    // MAPEO MILIMÉTRICO (A=0 ... W=22)
                    const obj = {
                        id: clean(row[0]),          // A: CODIGO
                        name: clean(row[1]),        // B: TIENDA
                        cif: clean(row[2]),         // C: NIF
                        email: clean(row[3]),       // D: MAIL
                        address: clean(row[4]),     // E: DIRECCION
                        contact: clean(row[5]),     // F: CONTACTO
                        city: clean(row[6]),        // G: POBLACION
                        province: clean(row[7]),    // H: PROVINCIA
                        phone: clean(row[10]),      // K: TELEFONO
                        
                        // Coordenadas
                        lat: cleanCoord(row[21]),   // V: Lat
                        lon: cleanCoord(row[22]),   // W: Lon

                        // ESPEJOS PARA COMPATIBILIDAD
                        nombre: clean(row[1]),
                        tienda: clean(row[1]),
                        cliente: clean(row[1]),
                        correo: clean(row[3]),
                        direccion: clean(row[4]),
                        contacto: clean(row[5]),
                        poblacion: clean(row[6]),
                        provincia: clean(row[7]),
                        telefono: clean(row[10]),
                        movil: clean(row[10]),
                        
                        notes: ""
                    };

                    if(obj.id || obj.name) nuevos.push(obj);
                }

                if (nuevos.length > 0) {
                    localStorage.setItem('clients', JSON.stringify(nuevos));
                    alert(`✅ Importación Exitosa: ${nuevos.length} clientes procesados.`);
                    
                    // Actualizar mapa si existe y está visible
                    if (window.map && typeof window.pintarPuntos === 'function') {
                        window.pintarPuntos();
                    }
                    // Refrescar página para asegurar consistencia
                    location.reload();
                } else {
                    alert("⚠️ No se encontraron clientes válidos en el archivo.");
                }

            } catch (error) {
                console.error("Error importando Excel:", error);
                alert("❌ Error al procesar el archivo. Asegúrate de que sea un Excel válido (.xlsx).");
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // --- REPARACIÓN DE DATOS ---
    function repararBaseDatos() {
        try {
            const rawData = localStorage.getItem('clients');
            if(!rawData || rawData === '[]') { alert("No hay clientes guardados para reparar."); return; }
            
            let clientes = JSON.parse(rawData);
            let reparados = 0;
            
            clientes = clientes.map(c => {
                const safe = (val) => (val === undefined || val === null) ? "" : String(val);
                
                // Rellenar campos faltantes con espejos
                if(!c.name) c.name = safe(c.nombre || c.tienda || "Sin Nombre");
                if(!c.address) c.address = safe(c.direccion);
                if(!c.phone) c.phone = safe(c.telefono || c.movil);
                if(!c.email) c.email = safe(c.correo);
                if(!c.contact) c.contact = safe(c.contacto);
                if(!c.id) c.id = String(Math.floor(Math.random() * 1000000)); // ID temporal si falta
                
                // Asegurar espejos
                c.nombre = c.name; 
                c.direccion = c.address; 
                c.telefono = c.phone; 
                c.correo = c.email;
                
                reparados++; 
                return c;
            });
            
            localStorage.setItem('clients', JSON.stringify(clientes));
            alert(`✅ Base de datos reparada. ${reparados} registros normalizados.`);
            location.reload(); 
        } catch (e) { 
            alert("Error crítico reparando datos: " + e.message); 
        }
    }

    // --- BORRADO ---
    function borrarDatos() { 
        if(confirm("⚠ ATENCIÓN ⚠\n\nEstás a punto de borrar TODOS los clientes del mapa.\nEsta acción no se puede deshacer.\n\n¿Estás seguro?")) { 
            localStorage.setItem('clients', '[]'); 
            alert("🗑 Datos eliminados.");
            location.reload(); 
        } 
    }

    // --- EDITOR DE CLIENTES ---
    function abrirEditor() {
        // Intentar obtener el cliente en edición desde el contexto detectado por UI-Fixes
        // Si ui-fixes ha detectado un cliente, lo habrá puesto en window.clienteEnEdicionGlobal
        clienteEnEdicion = window.clienteEnEdicionGlobal || null;
        
        if(!clienteEnEdicion) {
            console.warn("No hay cliente seleccionado para editar");
            return;
        }

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.value = val || "";
        };

        setVal('edit-id', clienteEnEdicion.id);
        setVal('edit-name', clienteEnEdicion.name);
        setVal('edit-address', clienteEnEdicion.address);
        setVal('edit-phone', clienteEnEdicion.phone);
        setVal('edit-email', clienteEnEdicion.email);
        setVal('edit-notes', clienteEnEdicion.notes);
        setVal('edit-lat', clienteEnEdicion.lat || 0);
        setVal('edit-lon', clienteEnEdicion.lon || 0);
        
        const modal = document.getElementById('modal-editor');
        if(modal) {
            modal.style.display = 'block';
            modal.style.zIndex = '100000'; // Asegurar que esté encima de todo
        }
    }

    function cerrarEditor() { 
        const modal = document.getElementById('modal-editor');
        if(modal) modal.style.display = 'none'; 
    }

    function guardarEdicion() {
        const id = document.getElementById('edit-id').value;
        const clientes = JSON.parse(localStorage.getItem('clients') || '[]');
        const index = clientes.findIndex(c => String(c.id) === String(id));
        
        if(index === -1) { 
            // Si no existe por ID, intentar buscar nombre exacto (fallback)
            alert("Error: No se encuentra el cliente original para actualizar."); 
            return; 
        }

        const c = clientes[index];
        c.name = document.getElementById('edit-name').value;
        c.address = document.getElementById('edit-address').value;
        c.phone = document.getElementById('edit-phone').value;
        c.email = document.getElementById('edit-email').value;
        c.notes = document.getElementById('edit-notes').value;
        c.lat = parseFloat(document.getElementById('edit-lat').value) || 0;
        c.lon = parseFloat(document.getElementById('edit-lon').value) || 0;

        // Actualizar espejos
        c.nombre = c.name; c.direccion = c.address; c.telefono = c.phone; c.correo = c.email; c.notas = c.notes;

        clientes[index] = c;
        localStorage.setItem('clients', JSON.stringify(clientes));
        
        alert("✅ Cliente actualizado con éxito.");
        cerrarEditor();
        
        // Actualizar visualización
        if(window.location.href.includes('map') || document.getElementById('visor-mapa-myl').style.display === 'block') {
             // Si estamos en el mapa, recargar solo mapa
             if (window.cargarClientes) window.cargarClientes(); // fx de mapa-myl.js
        } else {
             location.reload(); // Recargar app completa para reflejar cambios en fichas
        }
    }

    // --- GPS ---
    function capturarGPSPropio() {
        if (!navigator.geolocation) { alert("Tu navegador no soporta GPS."); return; }
        
        const latField = document.getElementById('edit-lat');
        const lonField = document.getElementById('edit-lon');
        const btn = document.querySelector('.btn-gps');
        const textoOriginal = btn ? btn.innerHTML : "GPS";
        
        if(btn) btn.innerHTML = "⏳ Buscando...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                if(latField) latField.value = lat;
                if(lonField) lonField.value = lon;
                
                alert(`✅ Posición capturada:\nLat: ${lat.toFixed(5)}\nLon: ${lon.toFixed(5)}`);
                if(btn) btn.innerHTML = textoOriginal;
            },
            (error) => { 
                alert("❌ Error al obtener GPS: " + error.message); 
                if(btn) btn.innerHTML = textoOriginal; 
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

})(window);
