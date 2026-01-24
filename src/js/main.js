document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    initApp();
});

async function initApp() {
    console.log('App iniciada');

    // Inicializar Data Manager (DB)
    try {
        await dataManager.init();
        console.log('LocalDB inicializada correctament');
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
