'use strict';

/*
 * ================================================================
 * CONTACTO
 * ================================================================
 * Formulario público, validaciones y registro de solicitudes
 * de cotización, test drive, postventa y garantías.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

// ------------------------------------------------------------------
// Contacto público
// ------------------------------------------------------------------
obtenerElemento('#tipo-solicitud')?.addEventListener('change',event=>{
    const selectedModel = event.currentTarget.dataset.model;
    if (!['cotizacion','test-drive'].includes(event.currentTarget.value) && selectedModel) delete event.currentTarget.dataset.model;
});

var formularioContacto = obtenerElemento('#formulario-cliente');
if (formularioContacto) formularioContacto.addEventListener('submit',event=>{
    event.preventDefault();
    const name=obtenerElemento('#nombre').value.trim();
    const email=obtenerElemento('#email').value.trim().toLowerCase();
    const phone=obtenerElemento('#telefono').value.trim();
    const reason=obtenerElemento('#tipo-solicitud').value;
    const selectedModelName=obtenerElemento('#tipo-solicitud').dataset.model || '';
    const selectedModel=buscarModelo(selectedModelName);

    obtenerElemento('#error-nombre').classList.add('oculto');
    obtenerElemento('#error-email').classList.add('oculto');
    let valid=true;
    if(name.length<3){obtenerElemento('#error-nombre').textContent='Ingresa un nombre válido.';obtenerElemento('#error-nombre').classList.remove('oculto');valid=false;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){obtenerElemento('#error-email').textContent='Ingresa un correo válido.';obtenerElemento('#error-email').classList.remove('oculto');valid=false;}
    if(!valid)return;

    const request={id:crearCodigo('SOL'),name,email,phone,reason,model:selectedModelName,date:obtenerFechaHoy(),createdAt:obtenerFechaHoraLocal()};
    db.publicRequests.unshift(request);

    let client=db.clients.find(c=>String(c.email||'').toLowerCase()===email);
    if(!client){
        client={
            id:crearCodigo('CLI'),
            rut:`WEB-${request.id.slice(-6)}`,
            name,
            address:'Pendiente',
            phone:phone || 'Pendiente',
            email,
            interest:selectedModelName || 'Solicitud web',
            status:reason==='cotizacion'?'Cotización':'Seguimiento',
            sellerId:null,
            licenseExpiry:'',
            quotes:[],
            purchases:[],
            source:'Web'
        };
        db.clients.unshift(client);
    } else {
        client.name=client.name || name;
        if(phone) client.phone=phone;
        if(selectedModelName) client.interest=selectedModelName;
        if(reason==='cotizacion') client.status='Cotización';
    }

    const reasonLabels={cotizacion:'Cotización / financiamiento','test-drive':'Solicitud de test drive',postventa:'Consulta de postventa',garantia:'Consulta de garantía'};
    db.interactions.unshift({id:crearCodigo('INT'),clientId:client.id,date:obtenerFechaHoy(),channel:'Web',note:`${reasonLabels[reason]||reason}${selectedModelName?' · '+selectedModelName:''}`});

    if(reason==='cotizacion' && selectedModel){
        const quote=crearCotizacionCliente(client,selectedModel,{notify:false});
        agregarNotificacion('Cotización web registrada',`${client.name} · ${quote.id} · ${selectedModel.name} · ${formatearDinero(selectedModel.price)}`);
    } else {
        agregarNotificacion('Nueva solicitud pública',`${name} · ${reasonLabels[reason]||reason}${selectedModelName?' · '+selectedModelName:''}${phone?' · '+phone:''}`);
    }

    guardarDatos();
    obtenerElemento('#mensaje-exito').textContent='¡Solicitud registrada con éxito! Ya quedó disponible para seguimiento interno.';
    obtenerElemento('#mensaje-exito').classList.remove('oculto');
    event.currentTarget.reset();
    delete obtenerElemento('#tipo-solicitud').dataset.model;
});


// Datos recibidos desde catalogo.html
var parametrosContacto = new URLSearchParams(window.location.search);

var tipoSolicitudPagina = obtenerElemento('#tipo-solicitud');
if (tipoSolicitudPagina) {
    var tipoParametro = parametrosContacto.get('tipo');
    var modeloContactoParametro = parametrosContacto.get('modelo');

    if (tipoParametro) {
        tipoSolicitudPagina.value = tipoParametro;
    }

    if (modeloContactoParametro) {
        tipoSolicitudPagina.dataset.model = modeloContactoParametro;
    }
}
