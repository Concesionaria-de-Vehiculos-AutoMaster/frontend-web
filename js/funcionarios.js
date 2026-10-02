'use strict';

/*
 * ================================================================
 * FUNCIONARIOS Y GESTIÓN INTERNA
 * ================================================================
 * Inicio y cierre de sesión, roles, permisos, dashboard,
 * módulos internos, respaldos y notificaciones.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

// ------------------------------------------------------------------
// RBAC y login
// ------------------------------------------------------------------
const loginModal = obtenerElemento('#login-modal');
const formLogin = obtenerElemento('#form-login');
const loginEmail = obtenerElemento('#login-email');
const loginPassword = obtenerElemento('#login-password');
const loginError = obtenerElemento('#login-error');
const gestionSection = obtenerElemento('#gestion');
const navGestion = obtenerElemento('#nav-gestion');
const navUsuario = obtenerElemento('#nav-usuario');
const usuarioFuncionario = obtenerElemento('#usuario-funcionario');
const roleLabel = obtenerElemento('#role-label');

function obtenerRolPorCorreo(email) {
    var nombreCorreo = email.split('@')[0].toLowerCase();

    if (/admin|gerente/.test(nombreCorreo)) {
        return {key:'admin', label:'Administrador', modules:'*'};
    }
    if (/finanz/.test(nombreCorreo)) {
        return {key:'finanzas', label:'Ejecutivo de Financiamiento', modules:['clientes','finanzas','documentos']};
    }
    if (/repuesto|bodega/.test(nombreCorreo)) {
        return {key:'repuestos', label:'Encargado de Repuestos', modules:['stock','repuestos','postventa']};
    }
    if (/postventa|taller/.test(nombreCorreo)) {
        return {key:'postventa', label:'Postventa / Taller', modules:['clientes','repuestos','garantias','postventa']};
    }
    if (/inventario|stock/.test(nombreCorreo)) {
        return {key:'inventario', label:'Encargado de Inventario', modules:['stock','modelos']};
    }

    return {key:'vendedor', label:'Vendedor', modules:['clientes','vendedores','stock','testdrive','documentos','modelos']};
}

let currentSession = null;
let currentModule = 'clientes';

function puedeAcceder(modulo) {
    if (!currentSession) {
        return false;
    }

    if (currentSession.role.modules === '*') {
        return true;
    }

    return currentSession.role.modules.includes(modulo);
}

function abrirLogin() {
    if (!loginModal) {
        window.location.href = 'funcionarios.html';
        return;
    }

    loginModal.classList.remove('oculto');
    document.body.classList.add('modal-open');

    if (loginError) {
        loginError.classList.add('oculto');
    }

    if (loginEmail) {
        setTimeout(function() {
            loginEmail.focus();
        }, 0);
    }
}

function cerrarLogin() {
    if (!loginModal) {
        return;
    }

    loginModal.classList.add('oculto');
    document.body.classList.remove('modal-open');

    if (formLogin) {
        formLogin.reset();
    }

    if (loginError) {
        loginError.classList.add('oculto');
    }
}

function aplicarSesion(session) {
    currentSession = session;
    var autenticado = Boolean(session);

    if (navGestion) navGestion.classList.toggle('oculto', !autenticado);
    if (navUsuario) navUsuario.classList.toggle('oculto', !autenticado);

    var botonLoginNav = obtenerElemento('#btn-login-funcionario');
    if (botonLoginNav) botonLoginNav.classList.toggle('oculto', autenticado);

    var botonLoginHero = obtenerElemento('#hero-login-funcionario');
    if (botonLoginHero) botonLoginHero.classList.toggle('oculto', autenticado);

    if (gestionSection) {
        gestionSection.classList.toggle('oculto', !autenticado);
        gestionSection.setAttribute('aria-hidden', String(!autenticado));
    }

    if (usuarioFuncionario) {
        usuarioFuncionario.textContent = autenticado
            ? session.email + ' · ' + session.role.label
            : '';
    }

    if (roleLabel) {
        roleLabel.textContent = autenticado ? session.role.label : 'Sin sesión';
    }

    obtenerElementos('.admin-only').forEach(function(elemento) {
        var ocultar = !autenticado || session.role.key !== 'admin';
        elemento.classList.toggle('oculto', ocultar);
    });

    if (autenticado && gestionSection) {
        obtenerElementos('.module-button').forEach(function(boton) {
            boton.classList.toggle('oculto', !puedeAcceder(boton.dataset.module));
        });

        var primerModulo = obtenerElementos('.module-button').find(function(boton) {
            return !boton.classList.contains('oculto');
        });

        if (!puedeAcceder(currentModule) && primerModulo) {
            currentModule = primerModulo.dataset.module;
        }

        obtenerElementos('.module-button').forEach(function(boton) {
            boton.classList.toggle('active', boton.dataset.module === currentModule);
        });

        mostrarModulo(currentModule);
    }
}

obtenerElemento('#btn-login-funcionario')?.addEventListener('click', abrirLogin);
obtenerElemento('#hero-login-funcionario')?.addEventListener('click', abrirLogin);
obtenerElemento('#cerrar-login')?.addEventListener('click', cerrarLogin);
loginModal?.querySelector('[data-close-login]')?.addEventListener('click', cerrarLogin);
obtenerElemento('#btn-logout-funcionario')?.addEventListener('click', function() {
    eliminarStorage('sessionStorage', SESSION_KEY);
    aplicarSesion(null);
    window.location.href = 'index.html';
});

if (formLogin) formLogin.addEventListener('submit', event => {
    event.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;
    if (!/^[^\s@]+@automaster\.cl$/i.test(email)) {
        loginError.textContent = 'Solo se permite el acceso con correos @automaster.cl.';
        loginError.classList.remove('oculto');
        return;
    }
    if (password !== DEMO_PASSWORD) {
        loginError.textContent = 'Contraseña de demostración incorrecta.';
        loginError.classList.remove('oculto');
        return;
    }
    const session = {email, role:obtenerRolPorCorreo(email)};
    guardarStorage('sessionStorage', SESSION_KEY, JSON.stringify(session));
    aplicarSesion(session);
    cerrarLogin();
    gestionSection.scrollIntoView({behavior:'smooth', block:'start'});
    mostrarMensaje(`Bienvenido: ${session.role.label}`);
});

// Centro de gestión: KPIs calculados desde los registros
// ------------------------------------------------------------------
function crearEstadoVisual(texto, tipo) {
    if (tipo == null) {
        tipo = 'ok';
    }
    return '<span class="status ' + tipo + '">' + escaparHTML(texto) + '</span>';
}
const moduleMeta = {
    clientes:{title:'Módulo de Clientes', desc:'Expedientes centralizados, datos personales, cotizaciones, compras e interacciones comerciales.', badge:'CRM Cliente'},
    vendedores:{title:'Módulo de Vendedores', desc:'Cartera, oportunidades, metas mensuales y comisiones comerciales.', badge:'CRM Ventas'},
    stock:{title:'Módulo de Stock e Inventario', desc:'Vehículos nuevos y seminuevos por VIN, ubicación, color, año y estado.', badge:'Inventario'},
    repuestos:{title:'Módulo de Repuestos e Insumos', desc:'Catálogo de piezas, compatibilidad, stock mínimo, pedidos y salidas a taller.', badge:'Repuestos'},
    finanzas:{title:'Módulo de Financiamiento', desc:'Simulación, evaluación de riesgo y gestión de solicitudes financieras.', badge:'Finanzas'},
    testdrive:{title:'Módulo de Test Drive', desc:'Agenda, validación de licencia y asignación de unidades de demostración.', badge:'Agenda'},
    documentos:{title:'Módulo de Documentos y Contratos', desc:'Contratos, pagarés, inscripciones, firma y expediente digital.', badge:'Documental'},
    garantias:{title:'Módulo de Garantías', desc:'Pólizas por VIN, cobertura por tiempo/kilometraje, extensiones y reclamos.', badge:'Garantías'},
    modelos:{title:'Módulo de Modelos y Catálogo', desc:'Versiones, ficha técnica, equipamiento, imágenes y precios vigentes.', badge:'Catálogo'},
    postventa:{title:'Módulo de Postventa y Servicio Técnico', desc:'Recepción a taller, OT, repuestos, mano de obra y seguimiento de reparación.', badge:'Taller'}
};

function obtenerDatosModulo(key) {
    switch(key) {
        case 'clientes': return {
            kpis:[['Clientes',db.clients.length],['Cotizaciones abiertas',db.clients.flatMap(c=>c.quotes||[]).filter(q=>q.status==='Abierta').length],['Interacciones',db.interactions.length]],
            columns:['RUT/ID','Cliente','Interés','Cotizaciones','Última cotización','Estado','Vendedor'],
            rows:db.clients.map(c=>{
                const quotes = Array.isArray(c.quotes) ? c.quotes : [];
                const openQuotes = quotes.filter(q=>q.status==='Abierta').length;
                const latest = [...quotes].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0];
                return [
                    c.rut,
                    c.name,
                    c.interest,
                    quotes.length ? `${quotes.length} total / ${openQuotes} abiertas` : 'Sin cotizaciones',
                    latest ? `${latest.id} · ${latest.model} · ${formatearDinero(latest.amount)}` : '—',
                    crearEstadoVisual(c.status,c.status==='Cotización'?'warn':'ok'),
                    obtenerNombreVendedor(c.sellerId)
                ];
            }),
            actions:['Registrar nuevo cliente','Editar cliente','Crear cotización','Ver historial de cliente','Registrar interacción']};
        case 'vendedores': return {
            kpis:[['Vendedores',db.sellers.length],['Oportunidades',db.opportunities.length],['Ventas registradas',db.sales.length]],
            columns:['Vendedor','Cartera','Ventas','Meta','Comisión estimada'],
            rows:db.sellers.map(s=>{const portfolio=db.clients.filter(c=>c.sellerId===s.id).length; const sales=db.sales.filter(v=>v.sellerId===s.id); const amount=sales.reduce((a,b)=>a+b.amount,0); return [s.name,`${portfolio} clientes`,sales.length,`${s.target} ventas`,formatearDinero(amount*s.commissionRate/100)];}),
            actions:['Asignar cartera','Registrar oportunidad','Revisar comisiones','Actualizar meta de venta']};
        case 'stock': return {
            kpis:[['Disponibles',db.stock.filter(x=>x.status==='Disponible').length],['En tránsito',db.stock.filter(x=>x.status==='En tránsito').length],['Reservados',db.stock.filter(x=>x.status==='Reservado').length],['Vendidos',db.stock.filter(x=>x.status==='Vendido').length]],
            columns:['VIN','Modelo','Ubicación','Color / Año','Estado'],
            rows:db.stock.map(x=>[x.vin,x.model,x.location,`${x.color} / ${x.year}`,crearEstadoVisual(x.status,x.status==='Disponible'?'ok':x.status==='Vendido'?'bad':'warn')]),
            actions:['Ingresar vehículo','Cambiar estado','Buscar por VIN','Registrar reserva']};
        case 'repuestos': return {
            kpis:[['Ítems registrados',db.parts.length],['Stock crítico',db.parts.filter(x=>x.stock<=x.minStock).length],['Unidades en stock',db.parts.reduce((a,b)=>a+b.stock,0)],['Pedidos abiertos',db.partOrders.filter(x=>x.status!=='Recibido').length]],
            columns:['Código','Repuesto','Compatibilidad','Stock','Mínimo'],
            rows:db.parts.map(x=>[x.code,x.name,x.compatibility,crearEstadoVisual(`${x.stock} u.`,x.stock<=x.minStock?'bad':'ok'),`${x.minStock} u.`]),
            actions:['Registrar repuesto','Crear pedido a fábrica','Consultar compatibilidad','Ajustar inventario']};
        case 'finanzas': return {
            kpis:[['Registros',db.finance.length],['Simulaciones web',db.finance.filter(x=>x.origin==='Simulación web' && !x.clientId).length],['Preaprobadas',db.finance.filter(x=>x.status==='Preaprobada').length],['En evaluación',db.finance.filter(x=>x.status==='Evaluación').length]],
            columns:['Solicitud','Cliente','Vehículo / Origen','Monto','Cuotas / VFG','Riesgo','Estado'],
            rows:db.finance.map(x=>[
                x.id,
                x.clientId ? obtenerNombreCliente(x.clientId) : 'Cliente web',
                x.model ? `${x.model} · ${x.origin || 'Solicitud interna'}` : (x.origin || 'Solicitud interna'),
                formatearDinero(x.amount),
                `${x.installments} / ${x.vfg}%`,
                crearEstadoVisual(x.risk || 'Pendiente',x.risk==='Alto'?'bad':x.risk==='Medio' || x.risk==='Pendiente'?'warn':'ok'),
                crearEstadoVisual(x.status,x.status==='Evaluación' || x.status==='Simulación web'?'warn':x.status==='Rechazada'?'bad':'ok')
            ]),
            actions:['Abrir simulador de crédito','Vincular simulación web','Crear solicitud bancaria','Adjuntar antecedentes','Actualizar estado']};
        case 'testdrive': return {
            kpis:[['Agendados',db.testdrives.length],['Confirmados',db.testdrives.filter(x=>x.status==='Confirmado').length],['Vehículos demo',db.stock.filter(x=>x.demo).length]],
            columns:['Cliente','Fecha','Vehículo','VIN demo','Estado'],
            rows:db.testdrives.map(x=>[obtenerNombreCliente(x.clientId),x.date.replace('T',' '),x.model,x.vin,crearEstadoVisual(x.status,x.status==='Confirmado'?'ok':'warn')]),
            actions:['Agendar test drive','Asignar vehículo demo','Registrar licencia','Reprogramar cita']};
        case 'documentos': return {
            kpis:[['Documentos',db.documents.length],['Pendientes firma',db.documents.filter(x=>x.status.includes('Pendiente')).length],['Firmados',db.documents.filter(x=>x.status==='Firmado').length]],
            columns:['ID','Documento','Cliente','Fecha','Estado'],
            rows:db.documents.map(x=>[x.id,x.type,obtenerNombreCliente(x.clientId),x.date,crearEstadoVisual(x.status,x.status==='Firmado'?'ok':x.status.includes('Pendiente')?'warn':'ok')]),
            actions:['Generar contrato','Subir archivo','Solicitar firma','Consultar expediente']};
        case 'garantias': return {
            kpis:[['Garantías',db.warranties.length],['Activas',db.warranties.filter(x=>x.status==='Activa').length],['Reclamos abiertos',db.warranties.filter(x=>x.status==='Reclamo abierto').length]],
            columns:['Póliza','VIN','Vehículo','Cobertura','Vencimiento','Estado'],
            rows:db.warranties.map(x=>[x.policy,x.vin,buscarVehiculo(x.vin)?.model||'Sin vehículo',x.coverage,x.expiry,crearEstadoVisual(x.status,x.status==='Activa'?'ok':'warn')]),
            actions:['Registrar garantía','Validar cobertura','Crear reclamo','Extender garantía']};
        case 'modelos': return {
            kpis:[['Modelos',db.models.length],['Autos/SUV',db.models.filter(x=>x.category!=='moto').length],['Motos',db.models.filter(x=>x.category==='moto').length]],
            columns:['Modelo','Categoría','Versión','Precio','Disponibles'],
            rows:db.models.map(x=>[x.name,x.tag,x.version,formatearDinero(x.price),obtenerStockModelo(x.name)]),
            actions:['Crear modelo','Editar ficha técnica','Gestionar versiones','Actualizar precio']};
        case 'postventa': return {
            kpis:[['OT registradas',db.workorders.length],['Abiertas',db.workorders.filter(x=>!['Listo entrega','Cerrada'].includes(x.status)).length],['Listas entrega',db.workorders.filter(x=>x.status==='Listo entrega').length]],
            columns:['OT','Cliente','Vehículo','Trabajo','Hrs.','Estado'],
            rows:db.workorders.map(x=>[x.id,obtenerNombreCliente(x.clientId),x.vehicle,x.job,x.labourHours,crearEstadoVisual(x.status,x.status==='Listo entrega'?'ok':x.status==='Esperando repuesto'?'warn':'ok')]),
            actions:['Crear orden de trabajo','Registrar recepción','Actualizar reparación','Programar mantención']};
    }
}

function mostrarModulo(key) {
    if (!currentSession || !puedeAcceder(key)) return;
    currentModule=key;
    const meta=moduleMeta[key], data=obtenerDatosModulo(key);
    const panel=obtenerElemento('#module-panel');
    panel.innerHTML=`<div class="module-panel-header"><div><h3>${meta.title}</h3><p>${meta.desc}</p></div><span class="module-badge">${meta.badge}</span></div>
        <div class="module-kpis">${data.kpis.map(([l,v])=>`<div class="module-kpi"><span>${l}</span><strong>${v}</strong></div>`).join('')}</div>
        <div class="module-toolbar"><input type="search" id="module-search" placeholder="Buscar en este módulo..."><button type="button" class="btn btn-secondary btn-compact" id="module-export">Exportar CSV</button></div>
        <div class="module-content-grid"><div class="module-table-card"><h4>Resumen operativo</h4><div class="table-wrap"><table class="module-table"><thead><tr>${data.columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody id="module-tbody">${data.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
        <aside class="module-action-card"><h4>Acciones rápidas</h4><div class="action-list">${data.actions.map(a=>`<button class="action-btn js-module-action" type="button" data-action="${escaparHTML(a)}">${escaparHTML(a)}</button>`).join('')}</div><div class="module-note">Los cambios se guardan en este navegador para la demostración.</div></aside></div>`;
    obtenerElemento('#module-search')?.addEventListener('input', e => {
        const q=e.target.value.toLowerCase();
        obtenerElementos('#module-tbody tr').forEach(tr=>tr.classList.toggle('oculto',!tr.textContent.toLowerCase().includes(q)));
    });
    obtenerElemento('#module-export')?.addEventListener('click',()=>exportModuleCSV(key,data));
    obtenerElementos('.js-module-action',panel).forEach(btn=>btn.addEventListener('click',()=>manejarAccion(key,btn.dataset.action)));
}

obtenerElementos('.module-button').forEach(btn=>btn.addEventListener('click',()=>{
    if (!puedeAcceder(btn.dataset.module)) return;
    obtenerElementos('.module-button').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); mostrarModulo(btn.dataset.module);
}));

function exportModuleCSV(key,data) {
    const strip = html => {const d=document.createElement('div'); d.innerHTML=html; return d.textContent.trim();};
    const lines=[data.columns,...data.rows].map(row=>row.map(cell=>`"${strip(String(cell)).replace(/"/g,'""')}"`).join(';')).join('\n');
    descargarArchivo(new Blob(['\ufeff'+lines],{type:'text/csv;charset=utf-8'}),`AutoMaster_${key}_${obtenerFechaHoy()}.csv`);
}

const options = arr => arr.map(x=>({value:x.id||x.vin||x.policy||x.code||x.name,label:x.name?`${x.name}${x.rut?' · '+x.rut:''}`:x.vin||x.policy||x.code}));
const clientOptions = () => options(db.clients);
const sellerOptions = () => options(db.sellers);
const modelOptions = () => db.models.map(x=>({value:x.name,label:`${x.name} · ${formatearDinero(x.price)}`}));
const stockOptions = filter => db.stock.filter(filter||(()=>true)).map(x=>({value:x.vin,label:`${x.vin} · ${x.model} · ${x.status}`}));


function crearCotizacionCliente(client, model, {notify=true} = {}) {
    if (!client) throw new Error('No se encontró el cliente seleccionado.');
    if (!model) throw new Error('No se encontró el modelo seleccionado.');

    client.quotes = Array.isArray(client.quotes) ? client.quotes : [];
    const quote = {
        id:crearCodigo('COT'),
        model:model.name,
        amount:model.price,
        status:'Abierta',
        date:obtenerFechaHoy()
    };
    client.quotes.unshift(quote);
    client.interest=model.name;
    client.status='Cotización';

    db.documents.unshift({
        id:crearCodigo('DOC'),
        type:'Cotización',
        clientId:client.id,
        quoteId:quote.id,
        date:obtenerFechaHoy(),
        status:'Generado',
        fileName:`Cotizacion_${quote.id}_${client.name.replace(/\s+/g,'_')}.pdf`
    });

    if (notify) agregarNotificacion('Nueva cotización',`${client.name} · ${model.name} · ${formatearDinero(model.price)}`);
    return quote;
}

async function manejarAccion(module, action) {
    if (!puedeAcceder(module)) {mostrarMensaje('No tienes permisos para este módulo.','bad'); return;}
    if (module==='finanzas' && action==='Abrir simulador de crédito') {abrirFinanciamiento(); return;}
    if (module==='clientes') return accionCliente(action);
    if (module==='vendedores') return accionVendedor(action);
    if (module==='stock') return accionStock(action);
    if (module==='repuestos') return accionRepuestos(action);
    if (module==='finanzas') return accionFinanciamiento(action);
    if (module==='testdrive') return accionTestDrive(action);
    if (module==='documentos') return accionDocumentos(action);
    if (module==='garantias') return accionGarantias(action);
    if (module==='modelos') return accionModelos(action);
    if (module==='postventa') return accionPostventa(action);
}

function accionCliente(action) {
    if (action==='Registrar nuevo cliente') abrirFormularioModal({title:action,eyebrow:'Clientes',fields:[
        {name:'rut',label:'RUT / ID',required:true,placeholder:'Ej. 18.345.678-9'},{name:'name',label:'Nombre completo',required:true},{name:'address',label:'Dirección',required:true},{name:'phone',label:'Teléfono',type:'tel',required:true},{name:'email',label:'Correo',type:'email',required:true},{name:'interest',label:'Interés principal',type:'select',options:modelOptions()},{name:'status',label:'Estado',type:'select',options:['Activo','Cotización','Seguimiento']},{name:'sellerId',label:'Vendedor asignado',type:'select',options:sellerOptions()}],onSubmit:d=>{if(db.clients.some(c=>c.rut===d.rut))throw new Error('Ya existe un cliente con ese RUT/ID.');db.clients.push({id:crearCodigo('CLI'),...d,quotes:[],purchases:[]});guardarDatos();mostrarMensaje('Cliente registrado.');}});
    else if(action==='Editar cliente') abrirFormularioModal({title:action,eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'phone',label:'Nuevo teléfono',type:'tel'},{name:'email',label:'Nuevo correo',type:'email'},{name:'address',label:'Nueva dirección'}],onSubmit:d=>{const c=buscarCliente(d.clientId); if(d.phone)c.phone=d.phone;if(d.email)c.email=d.email;if(d.address)c.address=d.address;guardarDatos();mostrarMensaje('Cliente actualizado.');}});
    else if(action==='Crear cotización') abrirFormularioModal({
        title:action,
        eyebrow:'Clientes',
        fields:[
            {name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},
            {name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true}
        ],
        onSubmit:d=>{
            const c=buscarCliente(d.clientId);
            const m=buscarModelo(d.model);
            const quote=crearCotizacionCliente(c,m);
            guardarDatos();
            mostrarMensaje(`Cotización ${quote.id} creada y reflejada en Clientes.`);
        }
    });
    else if(action==='Registrar interacción') abrirFormularioModal({title:action,eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'channel',label:'Canal',type:'select',options:['Teléfono','Correo','WhatsApp','Presencial']},{name:'note',label:'Detalle',type:'textarea',required:true}],onSubmit:d=>{db.interactions.push({id:crearCodigo('INT'),clientId:d.clientId,date:obtenerFechaHoy(),channel:d.channel,note:d.note});guardarDatos();mostrarMensaje('Interacción registrada.');}});
    else {abrirFormularioModal({title:'Historial de cliente',eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],submitLabel:'Ver historial',onSubmit:d=>{const c=buscarCliente(d.clientId), ints=db.interactions.filter(x=>x.clientId===c.id), docs=db.documents.filter(x=>x.clientId===c.id);abrirModalInformacion(`Expediente: ${c.name}`,`<div class="detail-grid"><div><span>RUT/ID</span><strong>${escaparHTML(c.rut)}</strong></div><div><span>Correo</span><strong>${escaparHTML(c.email)}</strong></div><div><span>Teléfono</span><strong>${escaparHTML(c.phone)}</strong></div><div><span>Vendedor</span><strong>${escaparHTML(obtenerNombreVendedor(c.sellerId))}</strong></div></div><div class="detail-block"><h3>Cotizaciones</h3><p>${(c.quotes||[]).map(q=>`${escaparHTML(q.id)} · ${escaparHTML(q.date||'Sin fecha')} · ${escaparHTML(q.model)} · ${formatearDinero(q.amount)} · ${escaparHTML(q.status)}`).join('<br>')||'Sin cotizaciones'}</p></div><div class="detail-block"><h3>Interacciones</h3><p>${ints.map(i=>`${escaparHTML(i.date)} · ${escaparHTML(i.channel)} · ${escaparHTML(i.note)}`).join('<br>')||'Sin interacciones'}</p></div><div class="detail-block"><h3>Documentos</h3><p>${docs.map(x=>`${escaparHTML(x.type)} · ${escaparHTML(x.status)}`).join('<br>')||'Sin documentos'}</p></div>`,'Historial comercial y operativo.','Expediente');return false;}});}
}

function accionVendedor(action) {
    if(action==='Asignar cartera') abrirFormularioModal({title:action,eyebrow:'Vendedores',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true}],onSubmit:d=>{buscarCliente(d.clientId).sellerId=d.sellerId;guardarDatos();mostrarMensaje('Cliente asignado a cartera.');}});
    else if(action==='Registrar oportunidad') abrirFormularioModal({title:action,eyebrow:'Vendedores',fields:[{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true},{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true},{name:'status',label:'Etapa',type:'select',options:['Contacto','Cotización','Negociación','Cierre']}],onSubmit:d=>{db.opportunities.push({id:crearCodigo('OP'),...d,amount:buscarModelo(d.model)?.price||0});guardarDatos();mostrarMensaje('Oportunidad registrada.');}});
    else if(action==='Actualizar meta de venta') abrirFormularioModal({title:action,eyebrow:'Vendedores',fields:[{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true},{name:'target',label:'Meta mensual (unidades)',type:'number',min:1,required:true}],onSubmit:d=>{buscarVendedor(d.sellerId).target=Number(d.target);guardarDatos();mostrarMensaje('Meta actualizada.');}});
    else {const rows=db.sellers.map(s=>{const sales=db.sales.filter(x=>x.sellerId===s.id);const amount=sales.reduce((a,b)=>a+b.amount,0);return `<tr><td>${escaparHTML(s.name)}</td><td>${sales.length}</td><td>${formatearDinero(amount)}</td><td>${formatearDinero(amount*s.commissionRate/100)}</td></tr>`;}).join('');abrirModalInformacion('Comisiones del mes',`<div class="table-wrap"><table class="module-table"><thead><tr><th>Vendedor</th><th>Ventas</th><th>Monto</th><th>Comisión</th></tr></thead><tbody>${rows}</tbody></table></div>`,'Cálculo demostrativo basado en las ventas registradas.','CRM Ventas');}
}

function accionStock(action) {
    if(action==='Ingresar vehículo') abrirFormularioModal({title:action,eyebrow:'Inventario',description:'Según el ERS entregado, el identificador VIN del prototipo se valida con 6 caracteres.',fields:[{name:'vin',label:'VIN / código (6 caracteres)',required:true,placeholder:'Ej. AB1234'},{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true},{name:'location',label:'Ubicación',type:'select',options:['Sucursal Centro','Patio Norte','En traslado']},{name:'color',label:'Color',required:true},{name:'year',label:'Año modelo',type:'number',min:2020,max:2035,value:2026,required:true},{name:'status',label:'Estado',type:'select',options:['Disponible','Reservado','En tránsito','Vendido']},{name:'demo',label:'Unidad demo',type:'select',options:[{value:'false',label:'No'},{value:'true',label:'Sí'}]}],onSubmit:d=>{d.vin=d.vin.toUpperCase().trim();if(!/^[A-Z0-9]{6}$/.test(d.vin))throw new Error('El código debe tener 6 caracteres alfanuméricos según el ERS.');if(db.stock.some(x=>x.vin===d.vin))throw new Error('El VIN/código ya está registrado.');db.stock.push({...d,year:Number(d.year),demo:d.demo==='true'});guardarDatos();mostrarMensaje('Vehículo ingresado al inventario.');}});
    else if(action==='Cambiar estado') abrirFormularioModal({title:action,eyebrow:'Inventario',fields:[{name:'vin',label:'Vehículo',type:'select',options:stockOptions(),required:true},{name:'status',label:'Nuevo estado',type:'select',options:['Disponible','Reservado','En tránsito','Vendido'],required:true},{name:'location',label:'Ubicación',type:'select',options:['Sucursal Centro','Patio Norte','En traslado']}],onSubmit:d=>{const s=buscarVehiculo(d.vin);s.status=d.status;s.location=d.location;guardarDatos();mostrarMensaje('Estado actualizado.');}});
    else if(action==='Registrar reserva') abrirFormularioModal({title:action,eyebrow:'Inventario',fields:[{name:'vin',label:'Vehículo disponible',type:'select',options:stockOptions(x=>x.status==='Disponible'),required:true},{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],onSubmit:d=>{const s=buscarVehiculo(d.vin);s.status='Reservado';s.reservedFor=d.clientId;guardarDatos();mostrarMensaje(`Reserva registrada para ${obtenerNombreCliente(d.clientId)}.`);}});
    else abrirFormularioModal({title:'Buscar por VIN',eyebrow:'Inventario',fields:[{name:'vin',label:'VIN / código',required:true}],submitLabel:'Buscar',onSubmit:d=>{const s=buscarVehiculo(d.vin.toUpperCase().trim());if(!s)throw new Error('No se encontró un vehículo con ese código.');abrirModalInformacion(`Vehículo ${s.vin}`,`<div class="detail-grid"><div><span>Modelo</span><strong>${escaparHTML(s.model)}</strong></div><div><span>Estado</span><strong>${escaparHTML(s.status)}</strong></div><div><span>Ubicación</span><strong>${escaparHTML(s.location)}</strong></div><div><span>Color / Año</span><strong>${escaparHTML(s.color)} / ${s.year}</strong></div></div>`,'Resultado de búsqueda de inventario.','Stock');return false;}});
}

function accionRepuestos(action) {
    if(action==='Registrar repuesto') abrirFormularioModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Código',required:true},{name:'name',label:'Nombre del repuesto',required:true},{name:'compatibility',label:'Modelo compatible',type:'select',options:modelOptions(),required:true},{name:'stock',label:'Stock inicial',type:'number',min:0,required:true},{name:'minStock',label:'Stock mínimo',type:'number',min:0,required:true}],onSubmit:d=>{if(db.parts.some(x=>x.code===d.code))throw new Error('Ese código ya existe.');db.parts.push({...d,stock:Number(d.stock),minStock:Number(d.minStock)});guardarDatos();mostrarMensaje('Repuesto registrado.');}});
    else if(action==='Crear pedido a fábrica') abrirFormularioModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Repuesto',type:'select',options:db.parts.map(x=>({value:x.code,label:`${x.code} · ${x.name}`})),required:true},{name:'qty',label:'Cantidad',type:'number',min:1,required:true}],onSubmit:d=>{db.partOrders.push({id:crearCodigo('PED'),code:d.code,qty:Number(d.qty),status:'Solicitado',date:obtenerFechaHoy()});guardarDatos();mostrarMensaje('Pedido a fábrica creado.');}});
    else if(action==='Ajustar inventario') abrirFormularioModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Repuesto',type:'select',options:db.parts.map(x=>({value:x.code,label:`${x.code} · ${x.name}`})),required:true},{name:'stock',label:'Nuevo stock',type:'number',min:0,required:true}],onSubmit:d=>{db.parts.find(x=>x.code===d.code).stock=Number(d.stock);guardarDatos();mostrarMensaje('Inventario ajustado.');}});
    else abrirFormularioModal({title:'Consultar compatibilidad',eyebrow:'Repuestos',fields:[{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true}],submitLabel:'Consultar',onSubmit:d=>{const list=db.parts.filter(x=>x.compatibility===d.model);abrirModalInformacion(`Repuestos para ${d.model}`,`<p>${list.length?list.map(x=>`${escaparHTML(x.code)} · ${escaparHTML(x.name)} · stock ${x.stock}`).join('<br>'):'No hay repuestos registrados para este modelo.'}</p>`,'Compatibilidad registrada en el catálogo de repuestos.','Repuestos');return false;}});
}

function accionFinanciamiento(action) {
    if(action==='Vincular simulación web') {
        const webSimulations = db.finance.filter(x => x.origin === 'Simulación web' && !x.clientId);
        if (!webSimulations.length) {
            mostrarMensaje('No hay simulaciones web pendientes de vincular.','bad');
            return;
        }
        abrirFormularioModal({
            title:action,
            eyebrow:'Financiamiento',
            description:'Asocia una simulación realizada en la página pública con un cliente registrado para continuar su evaluación.',
            fields:[
                {name:'financeId',label:'Simulación web',type:'select',options:webSimulations.map(x=>({value:x.id,label:`${x.id} · ${x.model || 'Vehículo'} · ${formatearDinero(x.amount)} · ${x.installments} cuotas`})),required:true},
                {name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}
            ],
            submitLabel:'Vincular simulación',
            onSubmit:d=>{
                const fin=db.finance.find(x=>x.id===d.financeId);
                if(!fin) throw new Error('No se encontró la simulación seleccionada.');
                fin.clientId=d.clientId;
                fin.status='Evaluación';
                fin.risk='Pendiente';
                fin.linkedAt=new Date().toISOString();
                guardarDatos();
                mostrarMensaje(`Simulación ${fin.id} vinculada a ${obtenerNombreCliente(d.clientId)}.`);
            }
        });
    }
    else if(action==='Crear solicitud bancaria') abrirFormularioModal({title:action,eyebrow:'Financiamiento',description:'Tasa mensual fija: 2,79% · VFG fijo: 20%. La evaluación de riesgo es demostrativa y usa relación cuota/ingreso.',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vehicleValue',label:'Valor del vehículo',type:'number',min:1000000,required:true},{name:'installments',label:'Cuotas',type:'select',options:[12,24,36,48,60,72].map(String),value:'48'},{name:'income',label:'Ingreso mensual cliente',type:'number',min:1,required:true},{name:'debts',label:'Otros compromisos mensuales',type:'number',min:0,value:'0',required:true}],onSubmit:d=>{const value=Number(d.vehicleValue), result=calcularCredito({value,installments:Number(d.installments),monthlyRate:2.79,vfgPct:20});const ratio=(result.monthlyPayment+Number(d.debts))/Number(d.income);const risk=ratio<=0.30?'Bajo':ratio<=0.45?'Medio':'Alto';db.finance.push({id:crearCodigo('FIN'),clientId:d.clientId,origin:'Solicitud interna',model:db.models.find(m=>Number(m.price)===value)?.name||'Valor ingresado manualmente',vehicleValue:value,amount:result.principal,installments:Number(d.installments),monthlyRate:2.79,vfg:20,risk,status:risk==='Alto'?'Evaluación':'Preaprobada',attachments:[]});guardarDatos();mostrarMensaje(`Solicitud creada. Riesgo: ${risk}.`);}});
    else if(action==='Adjuntar antecedentes') abrirFormularioModal({title:action,eyebrow:'Financiamiento',fields:[{name:'financeId',label:'Solicitud',type:'select',options:db.finance.map(x=>({value:x.id,label:`${x.id} · ${x.clientId ? obtenerNombreCliente(x.clientId) : 'Cliente web'}`})),required:true},{name:'file',label:'Archivo de antecedente',type:'file',required:true}],onSubmit:(d,fd,form)=>{const f=form.querySelector('[name=file]').files[0];if(!f)throw new Error('Selecciona un archivo.');const fin=db.finance.find(x=>x.id===d.financeId);fin.attachments=fin.attachments||[];fin.attachments.push({name:f.name,date:obtenerFechaHoy()});guardarDatos();mostrarMensaje('Antecedente adjuntado al expediente.');}});
    else abrirFormularioModal({title:'Actualizar estado',eyebrow:'Financiamiento',fields:[{name:'financeId',label:'Solicitud',type:'select',options:db.finance.map(x=>({value:x.id,label:`${x.id} · ${x.clientId ? obtenerNombreCliente(x.clientId) : 'Cliente web'}`})),required:true},{name:'status',label:'Estado',type:'select',options:['Simulación web','Evaluación','Preaprobada','Aprobada','Rechazada','Enviada'],required:true}],onSubmit:d=>{db.finance.find(x=>x.id===d.financeId).status=d.status;guardarDatos();mostrarMensaje('Estado de solicitud actualizado.');}});
}

function accionTestDrive(action) {
    if(action==='Agendar test drive') abrirFormularioModal({title:action,eyebrow:'Test Drive',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'date',label:'Fecha y hora',type:'datetime-local',required:true},{name:'vin',label:'Vehículo demo',type:'select',options:stockOptions(x=>x.demo && x.status!=='Vendido'),required:true}],onSubmit:d=>{const c=buscarCliente(d.clientId),s=buscarVehiculo(d.vin);if(!c.licenseExpiry || c.licenseExpiry < d.date.slice(0,10))throw new Error('La licencia del cliente no está vigente para la fecha seleccionada.');if(db.testdrives.some(x=>x.vin===d.vin && x.date===d.date && x.status!=='Cancelado'))throw new Error('Ese vehículo demo ya está reservado en ese horario.');db.testdrives.push({id:crearCodigo('TD'),clientId:d.clientId,date:d.date,model:s.model,vin:s.vin,status:'Confirmado'});agregarNotificacion('Test drive agendado',`${c.name} · ${s.model} · ${d.date.replace('T',' ')}`);guardarDatos();mostrarMensaje('Test drive agendado.');}});
    else if(action==='Asignar vehículo demo') abrirFormularioModal({title:action,eyebrow:'Test Drive',fields:[{name:'tdId',label:'Cita',type:'select',options:db.testdrives.map(x=>({value:x.id,label:`${x.id} · ${obtenerNombreCliente(x.clientId)} · ${x.date.replace('T',' ')}`})),required:true},{name:'vin',label:'Vehículo demo',type:'select',options:stockOptions(x=>x.demo && x.status!=='Vendido'),required:true}],onSubmit:d=>{const td=db.testdrives.find(x=>x.id===d.tdId),s=buscarVehiculo(d.vin);if(!td||!s)throw new Error('No se encontró la cita o el vehículo seleccionado.');if(db.testdrives.some(x=>x.id!==td.id && x.vin===s.vin && x.date===td.date && x.status!=='Cancelado'))throw new Error('Ese vehículo demo ya está asignado a otra cita en el mismo horario.');td.vin=s.vin;td.model=s.model;guardarDatos();mostrarMensaje('Vehículo demo asignado.');}});
    else if(action==='Registrar licencia') abrirFormularioModal({title:action,eyebrow:'Test Drive',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'licenseExpiry',label:'Vencimiento licencia',type:'date',required:true}],onSubmit:d=>{const c=buscarCliente(d.clientId);if(!c)throw new Error('No se encontró el cliente seleccionado.');c.licenseExpiry=d.licenseExpiry;guardarDatos();mostrarMensaje('Licencia registrada.');}});
    else abrirFormularioModal({title:'Reprogramar cita',eyebrow:'Test Drive',fields:[{name:'tdId',label:'Cita',type:'select',options:db.testdrives.map(x=>({value:x.id,label:`${x.id} · ${obtenerNombreCliente(x.clientId)} · ${x.date.replace('T',' ')}`})),required:true},{name:'date',label:'Nueva fecha y hora',type:'datetime-local',required:true}],onSubmit:d=>{const td=db.testdrives.find(x=>x.id===d.tdId);if(!td)throw new Error('No se encontró la cita seleccionada.');const c=buscarCliente(td.clientId);if(c && (!c.licenseExpiry || c.licenseExpiry < d.date.slice(0,10)))throw new Error('La licencia del cliente no está vigente para la nueva fecha.');if(db.testdrives.some(x=>x.id!==td.id && x.vin===td.vin && x.date===d.date && x.status!=='Cancelado'))throw new Error('El vehículo ya tiene una cita en ese horario.');td.date=d.date;guardarDatos();mostrarMensaje('Test drive reprogramado.');}});
}

function accionDocumentos(action) {
    if(action==='Generar contrato') abrirFormularioModal({title:action,eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vin',label:'Vehículo',type:'select',options:stockOptions(x=>x.status!=='Vendido'),required:true},{name:'type',label:'Documento',type:'select',options:['Contrato compraventa','Orden de pedido','Carta de resguardo','Pagaré']}],submitLabel:'Generar documento',onSubmit:d=>{const c=buscarCliente(d.clientId),s=buscarVehiculo(d.vin),m=buscarModelo(s.model);const doc={id:crearCodigo('DOC'),type:d.type,clientId:c.id,date:obtenerFechaHoy(),status:'Pendiente firma',fileName:`${d.type.replace(/\s+/g,'_')}_${c.name.replace(/\s+/g,'_')}.pdf`};db.documents.push(doc);guardarDatos();imprimirDocumento(doc,c,s,m);mostrarMensaje('Documento generado. Usa “Guardar como PDF” en la impresión.');}});
    else if(action==='Subir archivo') abrirFormularioModal({title:action,eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'type',label:'Tipo',type:'select',options:['Cédula identidad','Licencia conducir','Comprobante domicilio','Otro']},{name:'file',label:'Archivo',type:'file',required:true}],onSubmit:(d,fd,form)=>{const f=form.querySelector('[name=file]').files[0];if(!f)throw new Error('Selecciona un archivo.');db.documents.push({id:crearCodigo('DOC'),type:d.type,clientId:d.clientId,date:obtenerFechaHoy(),status:'Recibido',fileName:f.name});guardarDatos();mostrarMensaje('Archivo asociado al expediente.');}});
    else if(action==='Solicitar firma') abrirFormularioModal({title:action,eyebrow:'Documentos',fields:[{name:'docId',label:'Documento',type:'select',options:db.documents.map(x=>({value:x.id,label:`${x.id} · ${x.type} · ${obtenerNombreCliente(x.clientId)}`})),required:true}],onSubmit:d=>{db.documents.find(x=>x.id===d.docId).status='Pendiente firma';agregarNotificacion('Firma pendiente',`Documento ${d.docId} requiere firma.`);guardarDatos();mostrarMensaje('Solicitud de firma registrada.');}});
    else abrirFormularioModal({title:'Consultar expediente',eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],submitLabel:'Consultar',onSubmit:d=>{const docs=db.documents.filter(x=>x.clientId===d.clientId);abrirModalInformacion(`Expediente de ${obtenerNombreCliente(d.clientId)}`,`<div class="table-wrap"><table class="module-table"><thead><tr><th>ID</th><th>Documento</th><th>Archivo</th><th>Estado</th></tr></thead><tbody>${docs.map(x=>`<tr><td>${escaparHTML(x.id)}</td><td>${escaparHTML(x.type)}</td><td>${escaparHTML(x.fileName)}</td><td>${escaparHTML(x.status)}</td></tr>`).join('')}</tbody></table></div>`,'Documentación asociada al cliente.','Expediente');return false;}});
}

function accionGarantias(action) {
    if(action==='Registrar garantía') abrirFormularioModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'N° póliza',required:true},{name:'vin',label:'VIN',type:'select',options:stockOptions(),required:true},{name:'coverage',label:'Cobertura',required:true,value:'Fábrica 3 años'},{name:'expiry',label:'Fecha vencimiento',type:'date',required:true},{name:'mileageLimit',label:'Kilometraje máximo',type:'number',min:1,value:'100000',required:true}],onSubmit:d=>{if(db.warranties.some(x=>x.policy===d.policy))throw new Error('La póliza ya existe.');db.warranties.push({...d,mileageLimit:Number(d.mileageLimit),status:'Activa',claim:''});guardarDatos();mostrarMensaje('Garantía registrada.');}});
    else if(action==='Validar cobertura') abrirFormularioModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:`${x.policy} · ${buscarVehiculo(x.vin)?.model||x.vin}`})),required:true},{name:'mileage',label:'Kilometraje actual',type:'number',min:0,required:true}],submitLabel:'Validar',onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);const validDate=w.expiry>=obtenerFechaHoy(),validKm=Number(d.mileage)<=w.mileageLimit;abrirModalInformacion('Resultado de cobertura',`<div class="coverage-result ${validDate&&validKm?'coverage-ok':'coverage-bad'}"><strong>${validDate&&validKm?'COBERTURA VIGENTE':'FUERA DE COBERTURA'}</strong><p>Fecha: ${validDate?'vigente':'vencida'} · Kilometraje: ${validKm?'dentro del límite':'sobre el límite'}</p></div>`,'Validación por fecha y kilometraje.','Garantías');return false;}});
    else if(action==='Crear reclamo') abrirFormularioModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:x.policy})),required:true},{name:'claim',label:'Descripción del reclamo',type:'textarea',required:true}],onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);w.status='Reclamo abierto';w.claim=d.claim;guardarDatos();mostrarMensaje('Reclamo de garantía abierto.');}});
    else abrirFormularioModal({title:'Extender garantía',eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:x.policy})),required:true},{name:'expiry',label:'Nueva fecha de vencimiento',type:'date',required:true},{name:'coverage',label:'Nueva cobertura',value:'Extensión 2 años',required:true}],onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);w.expiry=d.expiry;w.coverage=d.coverage;w.status='Activa';guardarDatos();mostrarMensaje('Garantía extendida.');}});
}

function accionModelos(action) {
    if(action==='Crear modelo') abrirFormularioModal({title:action,eyebrow:'Catálogo',fields:[{name:'name',label:'Nombre del modelo',required:true},{name:'category',label:'Categoría',type:'select',options:[{value:'auto',label:'Auto'},{value:'suv',label:'SUV / Camioneta'},{value:'moto',label:'Moto'}]},{name:'tag',label:'Etiqueta',required:true},{name:'version',label:'Versión',required:true},{name:'price',label:'Precio',type:'number',min:1,required:true},{name:'motor',label:'Motor / cilindrada',required:true},{name:'power',label:'Potencia',required:true},{name:'transmission',label:'Transmisión',required:true},{name:'fuel',label:'Combustible / energía',required:true},{name:'capacity',label:'Capacidad / plazas',required:true},{name:'warranty',label:'Garantía',required:true},{name:'equipment',label:'Equipamiento',type:'textarea',required:true},{name:'image',label:'URL de imagen',required:true}],onSubmit:d=>{const cleanName=d.name.trim();if(db.models.some(x=>x.name.toLowerCase()===cleanName.toLowerCase()))throw new Error('Ya existe un modelo con ese nombre.');const specs={'Motor':d.motor,'Potencia':d.power,'Transmisión':d.transmission,'Combustible / energía':d.fuel,'Capacidad':d.capacity,'Garantía':d.warranty};db.models.push({name:cleanName,category:d.category,tag:d.tag,version:d.version,price:Number(d.price),equipment:d.equipment,image:d.image,id:crearCodigo('MOD'),specs});guardarDatos();mostrarMensaje('Modelo agregado al catálogo.');}});
    else if(action==='Actualizar precio') abrirFormularioModal({title:action,eyebrow:'Catálogo',fields:[{name:'modelId',label:'Modelo',type:'select',options:db.models.map(x=>({value:x.id,label:x.name})),required:true},{name:'price',label:'Nuevo precio',type:'number',min:1,required:true}],onSubmit:d=>{db.models.find(x=>x.id===d.modelId).price=Number(d.price);guardarDatos();mostrarMensaje('Precio actualizado en catálogo público e interno.');}});
    else abrirFormularioModal({title:action,eyebrow:'Catálogo',fields:[{name:'modelId',label:'Modelo',type:'select',options:db.models.map(x=>({value:x.id,label:x.name})),required:true},{name:'version',label:'Versión / motorización',required:true},{name:'motor',label:'Motor / cilindrada',required:true},{name:'power',label:'Potencia',required:true},{name:'transmission',label:'Transmisión',required:true},{name:'equipment',label:'Equipamiento',type:'textarea',required:true}],onSubmit:d=>{const m=db.models.find(x=>x.id===d.modelId);m.version=d.version;m.equipment=d.equipment;m.specs={...(m.specs||{}),'Motor':d.motor,'Potencia':d.power,'Transmisión':d.transmission};guardarDatos();mostrarMensaje('Ficha técnica actualizada.');}});
}

function accionPostventa(action) {
    if(action==='Crear orden de trabajo' || action==='Registrar recepción' || action==='Programar mantención') abrirFormularioModal({title:action,eyebrow:'Postventa',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vin',label:'Vehículo',type:'select',options:stockOptions(),required:true},{name:'job',label:'Trabajo / motivo',required:true},{name:'parts',label:'Repuestos previstos',required:false},{name:'labourHours',label:'Horas estimadas',type:'number',step:'0.5',min:'0',value:'1'},{name:'date',label:'Fecha',type:'date',value:obtenerFechaHoy(),required:true}],onSubmit:d=>{const s=buscarVehiculo(d.vin);db.workorders.push({id:crearCodigo('OT'),clientId:d.clientId,vin:d.vin,vehicle:s.model,job:d.job,parts:d.parts,labourHours:Number(d.labourHours),date:d.date,status:action==='Programar mantención'?'Agendada':'Recepcionado'});agregarNotificacion('Orden de trabajo',`${obtenerNombreCliente(d.clientId)} · ${s.model} · ${d.job}`);guardarDatos();mostrarMensaje('Orden de trabajo registrada.');}});
    else abrirFormularioModal({title:'Actualizar reparación',eyebrow:'Postventa',fields:[{name:'otId',label:'Orden de trabajo',type:'select',options:db.workorders.map(x=>({value:x.id,label:`${x.id} · ${x.vehicle} · ${x.job}`})),required:true},{name:'status',label:'Estado',type:'select',options:['Recepcionado','En proceso','Esperando repuesto','Listo entrega','Cerrada'],required:true},{name:'labourHours',label:'Horas reales',type:'number',step:'0.5',min:'0',required:true}],onSubmit:d=>{const ot=db.workorders.find(x=>x.id===d.otId);ot.status=d.status;ot.labourHours=Number(d.labourHours);if(d.status==='Listo entrega')agregarNotificacion('Vehículo listo para retiro',`${ot.id} · ${obtenerNombreCliente(ot.clientId)} · ${ot.vehicle}`);guardarDatos();mostrarMensaje('Estado de reparación actualizado.');}});
}

function imprimirDocumento(doc, client, stock, model) {
    const w=window.open('','_blank','width=900,height=700');
    if(!w){mostrarMensaje('El navegador bloqueó la ventana de impresión.','bad');return;}
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escaparHTML(doc.type)}</title><style>body{font-family:Arial;padding:45px;color:#222}h1{color:#d32f2f}.box{border:1px solid #ddd;padding:18px;margin:16px 0}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #eee}.sign{margin-top:70px;display:flex;justify-content:space-between}.line{width:40%;border-top:1px solid #333;padding-top:8px;text-align:center}</style></head><body><h1>AutoMaster</h1><h2>${escaparHTML(doc.type)}</h2><p>Documento: ${escaparHTML(doc.id)} · Fecha: ${escaparHTML(doc.date)}</p><div class="box"><h3>Cliente</h3><table><tr><td>Nombre</td><td>${escaparHTML(client.name)}</td></tr><tr><td>RUT/ID</td><td>${escaparHTML(client.rut)}</td></tr><tr><td>Correo</td><td>${escaparHTML(client.email)}</td></tr></table></div><div class="box"><h3>Vehículo</h3><table><tr><td>Modelo</td><td>${escaparHTML(stock.model)}</td></tr><tr><td>VIN</td><td>${escaparHTML(stock.vin)}</td></tr><tr><td>Versión</td><td>${escaparHTML(model?.version||'')}</td></tr><tr><td>Precio lista</td><td>${formatearDinero(model?.price||0)}</td></tr></table></div><p>Documento generado por el prototipo AutoMaster. Revise los antecedentes antes de firmar.</p><div class="sign"><div class="line">Cliente</div><div class="line">AutoMaster</div></div><script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
}

// ------------------------------------------------------------------
// Respaldos, notificaciones y fiabilidad demostrativa
// ------------------------------------------------------------------
function descargarArchivo(blob, filename) {
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function agregarNotificacion(title,message){db.notifications.unshift({id:crearCodigo('NOT'),date:obtenerFechaHoraLocal(),title,message,read:false});}
function actualizarContadorNotificaciones() {
    var contador = obtenerElemento('#notification-count');

    if (!contador) {
        return;
    }

    var cantidad = db.notifications.filter(function(notificacion) {
        return !notificacion.read;
    }).length;

    contador.textContent = cantidad;
}
obtenerElemento('#btn-notificaciones')?.addEventListener('click',()=>{const items=db.notifications.length?db.notifications.map(n=>`<div class="notification-item ${n.read?'':'unread'}"><strong>${escaparHTML(n.title)}</strong><span>${escaparHTML(n.date.replace('T',' '))}</span><p>${escaparHTML(n.message)}</p></div>`).join(''):'<p>No hay notificaciones.</p>';abrirModalInformacion('Centro de notificaciones',`${items}<div class="modal-actions"><button class="btn btn-secondary" id="mark-read">Marcar todas como leídas</button></div>`,'Avisos internos generados por test drive, documentos y postventa.','Notificaciones');obtenerElemento('#mark-read')?.addEventListener('click',()=>{db.notifications.forEach(n=>n.read=true);guardarDatos();cerrarModal();mostrarMensaje('Notificaciones marcadas como leídas.');});});
obtenerElemento('#btn-exportar-respaldo')?.addEventListener('click',()=>descargarArchivo(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),`AutoMaster_respaldo_${obtenerFechaHoy()}.json`));
obtenerElemento('#btn-importar-respaldo')?.addEventListener('click',()=>obtenerElemento('#backup-file').click());
obtenerElemento('#backup-file')?.addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed || typeof parsed!=='object')throw new Error();db=normalizarDatos(parsed);guardarDatos();mostrarMensaje('Respaldo restaurado y normalizado.');}catch{mostrarMensaje('El respaldo no tiene un formato válido.','bad');}};reader.readAsText(file);event.target.value='';});
obtenerElemento('#btn-reset-demo')?.addEventListener('click',()=>{if(confirm('¿Restablecer todos los datos de demostración?')){db=normalizarDatos(crearDatosIniciales());guardarDatos();mostrarMensaje('Datos demo restablecidos.');}});

// Restaurar la sesión solo cuando todas las definiciones del dashboard ya existen.
try {
    const rawSession = leerStorage('sessionStorage', SESSION_KEY);
    aplicarSesion(rawSession ? JSON.parse(rawSession) : null);
} catch {
    aplicarSesion(null);
}


actualizarContadorNotificaciones();
