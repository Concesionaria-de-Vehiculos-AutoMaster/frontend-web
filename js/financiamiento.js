'use strict';

/*
 * ================================================================
 * FINANCIAMIENTO
 * ================================================================
 * Simulador de crédito: pie, tasa, VFG, seguros, cuotas
 * y registro de simulaciones.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

// ------------------------------------------------------------------
// Simulador de financiamiento: pie, tasa, VFG y seguros
// ------------------------------------------------------------------
const financeSection = obtenerElemento('#financiamiento');
const valueInput = obtenerElemento('#valor-vehiculo');
const installmentsSelect = obtenerElemento('#plazo-cuotas');
const PUBLIC_MONTHLY_RATE = 2.79;
const PUBLIC_VFG_PERCENT = 20;
let selectedFinanceModelName = '';
if (installmentsSelect) {
    for (var i = 6; i <= 72; i += 6) {
        var opcionCuota = document.createElement('option');
        opcionCuota.value = i;
        opcionCuota.textContent = i + ' cuotas';

        if (i === 48) {
            opcionCuota.selected = true;
        }

        installmentsSelect.appendChild(opcionCuota);
    }
}
function actualizarVistaFinanciamiento() {
    if (!valueInput) {
        return;
    }

    var valor = Number(valueInput.value) || 0;
    var pieElemento = obtenerElemento('#monto-pie');
    var montoElemento = obtenerElemento('#monto-financiar-preview');

    if (pieElemento) pieElemento.textContent = formatearDinero(valor * 0.10);
    if (montoElemento) montoElemento.textContent = formatearDinero(valor * 0.90);
}

function abrirFinanciamiento() {
    if (window.location.pathname.endsWith('financiamiento.html')) {
        if (financeSection) {
            financeSection.scrollIntoView({behavior:'smooth', block:'start'});
        }
        return;
    }

    window.location.href = 'financiamiento.html';
}
obtenerElementos('.js-abrir-financiamiento').forEach(el => el.addEventListener('click', e => {e.preventDefault(); abrirFinanciamiento();}));
obtenerElemento('#cerrar-simulador')?.addEventListener('click', function() {
    window.location.href = 'index.html';
});

if (valueInput) valueInput.addEventListener('input', () => {
    actualizarVistaFinanciamiento();
    const selectedModel = buscarModelo(selectedFinanceModelName);
    if (!selectedModel || Number(valueInput.value) !== Number(selectedModel.price)) selectedFinanceModelName = '';
});
obtenerElemento('.js-ejemplo')?.addEventListener('click', function(evento) {
    var valor = evento.currentTarget.dataset.valor;
    var cuotas = evento.currentTarget.dataset.cuotas;
    window.location.href = 'financiamiento.html?valor=' + encodeURIComponent(valor) + '&cuotas=' + encodeURIComponent(cuotas);
});

const calcularCredito = ({value, installments, monthlyRate, vfgPct, desgravamen=false, cesantia=false}) => {
    const pie = value * 0.10;
    const principal = value - pie;
    const r = monthlyRate / 100;
    const n = installments;
    const balloon = value * (vfgPct / 100);
    const discountedBalloon = balloon / Math.pow(1+r,n);
    const financedForAnnuity = Math.max(principal - discountedBalloon, 0);
    const basePayment = r > 0 ? financedForAnnuity * (r / (1-Math.pow(1+r,-n))) : financedForAnnuity/n;
    const baseTotal = basePayment*n + balloon;
    const insurance1 = desgravamen ? principal*0.020 : 0;
    const insurance2 = cesantia ? principal*0.020 : 0;
    const total = baseTotal + insurance1 + insurance2;
    return {pie, principal, balloon, basePayment, baseTotal, insurance1, insurance2, total, monthlyPayment: total/n};
};

const mostrarCodigoSimulacion = code => {
    let target = obtenerElemento('#res-codigo-simulacion');
    if (!target) {
        const resultCard = obtenerElemento('#tarjeta-resultado');
        const title = obtenerElemento('#res-titulo-cuotas');
        if (resultCard && title) {
            const row = document.createElement('div');
            row.className = 'result-row';
            row.innerHTML = '<span>Código de simulación</span><strong id="res-codigo-simulacion"></strong>';
            title.insertAdjacentElement('afterend', row);
            target = obtenerElemento('#res-codigo-simulacion');
        }
    }
    if (target) target.textContent = code;
};

var formularioSimulador = obtenerElemento('#form-simulador');
if (formularioSimulador) formularioSimulador.addEventListener('submit', event => {
    event.preventDefault();
    const value = Number(valueInput.value);
    const error = obtenerElemento('#error-simulador');
    error.classList.add('oculto');
    if (!value || value < 1000000) {error.textContent='Ingresa un valor de vehículo válido desde $1.000.000.'; error.classList.remove('oculto'); return;}
    const installments=Number(installmentsSelect.value), monthlyRate=PUBLIC_MONTHLY_RATE, vfgPct=PUBLIC_VFG_PERCENT;
    const hasDesgravamen = obtenerElemento('#seguro-desgravamen').checked;
    const hasCesantia = obtenerElemento('#seguro-cesantia').checked;
    const result = calcularCredito({value, installments, monthlyRate, vfgPct, desgravamen:hasDesgravamen, cesantia:hasCesantia});

    const matchedModel = buscarModelo(selectedFinanceModelName) || db.models.find(m => Number(m.price) === value);
    const simulation = {
        id: crearCodigo('SIM'),
        clientId: null,
        origin: 'Simulación web',
        model: matchedModel?.name || 'Valor ingresado manualmente',
        vehicleValue: value,
        amount: result.principal,
        installments,
        monthlyRate,
        vfg: vfgPct,
        vfgValue: result.balloon,
        desgravamen: hasDesgravamen,
        cesantia: hasCesantia,
        insuranceDesgravamen: result.insurance1,
        insuranceCesantia: result.insurance2,
        monthlyPayment: result.monthlyPayment,
        total: result.total,
        risk: 'Pendiente',
        status: 'Simulación web',
        createdAt: new Date().toISOString(),
        attachments: []
    };
    db.finance.unshift(simulation);
    guardarDatos();

    mostrarCodigoSimulacion(simulation.id);
    obtenerElemento('#res-titulo-cuotas').textContent=`Simulación en ${installments} cuotas`;
    obtenerElemento('#res-valor-vehiculo').textContent=formatearDinero(value);
    obtenerElemento('#res-pie').textContent=formatearDinero(result.pie);
    obtenerElemento('#res-monto-solicitado').textContent=formatearDinero(result.principal);
    obtenerElemento('#res-tasa-mensual').textContent=`${monthlyRate.toLocaleString('es-CL')}%`;
    obtenerElemento('#res-vfg').textContent=formatearDinero(result.balloon);
    obtenerElemento('#res-costo-base').textContent=formatearDinero(result.baseTotal);
    obtenerElemento('#res-costo-desgravamen').textContent=formatearDinero(result.insurance1);
    obtenerElemento('#res-costo-cesantia').textContent=formatearDinero(result.insurance2);
    obtenerElemento('#res-cuota-mensual').textContent=formatearDinero(result.monthlyPayment);
    obtenerElemento('#res-costo-total').textContent=formatearDinero(result.total);
    obtenerElemento('#resultado-placeholder').classList.add('oculto');
    obtenerElemento('#tarjeta-resultado').classList.remove('oculto');
});

// ------------------------------------------------------------------


// Datos recibidos desde catalogo.html
var parametrosFinanciamiento = new URLSearchParams(window.location.search);

if (valueInput) {
    var valorParametro = parametrosFinanciamiento.get('valor');
    var modeloParametro = parametrosFinanciamiento.get('modelo');
    var cuotasParametro = parametrosFinanciamiento.get('cuotas');

    if (valorParametro) {
        valueInput.value = valorParametro;
    }

    if (modeloParametro) {
        selectedFinanceModelName = modeloParametro;
    }

    if (cuotasParametro && installmentsSelect) {
        installmentsSelect.value = cuotasParametro;
    }
}

actualizarVistaFinanciamiento();
