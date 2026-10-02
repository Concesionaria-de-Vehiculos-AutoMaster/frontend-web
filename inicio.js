'use strict';

/*
 * ================================================================
 * INICIO
 * ================================================================
 * Actualiza los indicadores de la página principal:
 * stock, cotizaciones, test drive y órdenes de trabajo.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

// ------------------------------------------------------------------
// Resumen público sincronizado
// ------------------------------------------------------------------
function actualizarResumen() {
    var disponibles = obtenerElemento('#stat-disponibles');
    var cotizaciones = obtenerElemento('#stat-cotizaciones');
    var testDrive = obtenerElemento('#stat-testdrive');
    var ordenes = obtenerElemento('#stat-ot');

    if (disponibles) {
        disponibles.textContent = db.stock.filter(function(item) {
            return item.status === 'Disponible';
        }).length;
    }

    if (cotizaciones) {
        cotizaciones.textContent = db.clients
            .flatMap(function(cliente) {
                return cliente.quotes || [];
            })
            .filter(function(cotizacion) {
                return cotizacion.status === 'Abierta';
            }).length;
    }

    if (testDrive) {
        testDrive.textContent = db.testdrives.filter(function(cita) {
            return cita.status !== 'Cancelado';
        }).length;
    }

    if (ordenes) {
        ordenes.textContent = db.workorders.filter(function(orden) {
            return !['Cerrada', 'Listo entrega'].includes(orden.status);
        }).length;
    }
}


actualizarResumen();
