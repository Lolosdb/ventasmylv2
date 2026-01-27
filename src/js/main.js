document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    initApp();
});

async function initApp() {
    console.log('App iniciada');

    // Inicializar Data Manager (DB)
    try {
        const initResult = await dataManager.init();
        console.log('LocalDB inicializada correctament');

        // --- AVISO AÑO NUEVO ---
        if (initResult && initResult.created) {
            alert(`Año ${initResult.year} creado`);
        }

        // --- CHEQUEO RESUMEN ANUAL ---
        const currentYear = new Date().getFullYear();
        const resumenKey = `resumen_${currentYear}_enviado`;
        const mensajeVistoKey = `mensaje_resumen_${currentYear}_visto`;

        if (localStorage.getItem(resumenKey)) {
            if (!localStorage.getItem(mensajeVistoKey)) {
                alert(`¡Hola! Ya tienes el resumen del año ${currentYear} guardado en Google Drive.`);
                localStorage.setItem(mensajeVistoKey, 'true');
            }
        }
    } catch (e) {
        console.error('Error inicializando DB:', e);
    }

    // Start Backup Scheduler
    if (window.startBackupScheduler) {
        window.startBackupScheduler();
    }

    // Por defecto cargar el Dashboard
    renderDash().catch(e => {
        console.error("Error rendering Dash:", e);
        document.getElementById('app').innerHTML = `<div style="color:red; padding:2rem;">Error cargando Dashboard: ${e.message}</div>`;
    });
}
