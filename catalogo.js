'use strict';

/*
 * ================================================================
 * CATÁLOGO
 * ================================================================
 * Filtros, búsqueda, fichas técnicas, disponibilidad y tarjetas
 * de vehículos y motocicletas.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

// ------------------------------------------------------------------
// Catálogo público dinámico
// ------------------------------------------------------------------
const catalogGrid = obtenerElemento('#catalog-grid');
const catalogSearch = obtenerElemento('#catalog-search');
let catalogFilter = 'todos';

function obtenerStockModelo(nombreModelo) {
    var cantidad = 0;

    for (var i = 0; i < db.stock.length; i++) {
        var vehiculo = db.stock[i];

        if (vehiculo.model === nombreModelo && vehiculo.status === 'Disponible') {
            cantidad++;
        }
    }

    return cantidad;
}

function mostrarCatalogoPublico() {
    if (!catalogGrid) return;
    const query = (catalogSearch?.value || '').trim().toLowerCase();
    const list = db.models.filter(m => (catalogFilter === 'todos' || m.category === catalogFilter) && (!query || `${m.name} ${m.version} ${m.tag}`.toLowerCase().includes(query)));
    obtenerElemento('#catalog-empty')?.classList.toggle('oculto', list.length > 0);
    catalogGrid.innerHTML = list.map(m => {
        const specs = Object.entries(m.specs || {});
        const summarySpecs = specs.slice(0, 4).map(([label, value]) => `<li><strong>${escaparHTML(label)}:</strong> ${escaparHTML(value)}</li>`).join('');
        const pdfButton = m.pdf ? `<a class="btn btn-secondary js-pdf-modelo" href="${escaparHTML(m.pdf)}" download>Descargar ficha PDF</a>` : '';
        return `
        <article class="vehicle-card">
            <img src="${escaparHTML(m.image)}" alt="${escaparHTML(m.name)}" onerror="this.onerror=null;this.src='img/imagen-no-disponible.svg';">
            <div class="vehicle-content">
                <div class="vehicle-topline"><span class="vehicle-tag">${escaparHTML(m.tag)}</span><span>Disponibles: ${obtenerStockModelo(m.name)}</span></div>
                <h3>${escaparHTML(m.name)}</h3>
                <ul class="vehicle-spec-list">
                    <li><strong>Versión:</strong> ${escaparHTML(m.version)}</li>
                    ${summarySpecs}
                    <li><strong>Precio:</strong> ${formatearDinero(m.price)}</li>
                </ul>
                <div class="vehicle-actions">
                    <a class="btn btn-primary" href="financiamiento.html?modelo=${encodeURIComponent(m.name)}&valor=${m.price}">Simular financiamiento</a>
                    <button type="button" class="btn btn-secondary js-ficha-modelo" data-model="${escaparHTML(m.id)}">Ver ficha técnica</button>
                    ${pdfButton}
                    <a href="contacto.html?tipo=cotizacion&modelo=${encodeURIComponent(m.name)}" class="btn btn-secondary">Solicitar cotización</a>
                    <a href="contacto.html?tipo=test-drive&modelo=${encodeURIComponent(m.name)}" class="btn btn-secondary">Solicitar test drive</a>
                </div>
            </div>
        </article>`;
    }).join('');
    obtenerElementos('.js-simular-modelo', catalogGrid).forEach(btn => btn.addEventListener('click', () => {
        selectedFinanceModelName = btn.dataset.model || '';
        obtenerElemento('#valor-vehiculo').value = btn.dataset.valor;
        actualizarVistaFinanciamiento();
        abrirFinanciamiento();
    }));
    obtenerElementos('.js-ficha-modelo', catalogGrid).forEach(btn => btn.addEventListener('click', () => {
        const m = db.models.find(x => x.id === btn.dataset.model);
        const units = db.stock.filter(x => x.model === m.name);
        const specHtml = Object.entries(m.specs || {}).map(([label,value]) => `<div><span>${escaparHTML(label)}</span><strong>${escaparHTML(value)}</strong></div>`).join('');
        const pdfHtml = m.pdf ? `<div class="detail-block"><a class="btn btn-primary btn-full" href="${escaparHTML(m.pdf)}" download>Descargar ficha técnica PDF</a></div>` : '';
        abrirModalInformacion(m.name, `<div class="detail-grid"><div><span>Versión</span><strong>${escaparHTML(m.version)}</strong></div><div><span>Precio lista</span><strong>${formatearDinero(m.price)}</strong></div><div><span>Disponibles</span><strong>${obtenerStockModelo(m.name)}</strong></div><div><span>Unidades registradas</span><strong>${units.length}</strong></div>${specHtml}</div><div class="detail-block"><h3>Equipamiento destacado</h3><p>${escaparHTML(m.equipment)}</p></div>${pdfHtml}`, 'Ficha técnica completa y disponibilidad del catálogo AutoMaster.', 'Catálogo técnico');
    }));
    obtenerElementos('.js-quote-public', catalogGrid).forEach(link => link.addEventListener('click', () => {
        obtenerElemento('#tipo-solicitud').value = 'cotizacion';
        obtenerElemento('#tipo-solicitud').dataset.model = link.dataset.model;
    }));
    obtenerElementos('.js-test-public', catalogGrid).forEach(link => link.addEventListener('click', () => {
        obtenerElemento('#tipo-solicitud').value = 'test-drive';
        obtenerElemento('#tipo-solicitud').dataset.model = link.dataset.model;
    }));
}

obtenerElementos('.catalog-filter').forEach(btn => btn.addEventListener('click', () => {
    obtenerElementos('.catalog-filter').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    catalogFilter = btn.dataset.filter;
    mostrarCatalogoPublico();
}));
catalogSearch?.addEventListener('input', mostrarCatalogoPublico);


mostrarCatalogoPublico();
