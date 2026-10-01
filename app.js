document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const money = value => '$' + Math.round(Number(value) || 0).toLocaleString('es-CL');
    const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    const todayISO = () => new Date().toISOString().slice(0, 10);
    const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,5).toUpperCase()}`;

    const DATA_KEY = 'automaster_ers_db_v1';
    const SESSION_KEY = 'automaster_ers_session_v1';
    const DEMO_PASSWORD = 'AutoMaster2026!';

    const MODEL_IMAGES = {
        x500: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
        sedan: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
        city: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
        pickup: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80',
        cross: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
        sport: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
        moto1: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
        moto2: 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=900&q=80',
        moto3: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
        moto4: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=900&q=80'
    };

    const MODEL_DETAILS = {
        'MOD-001': {
            pdf:'fichas/AutoMaster_SUV_X500.pdf',
            specs:{
                'Carrocería':'SUV 5 puertas','Motor':'2.0 Turbo gasolina','Potencia':'190 HP','Torque':'320 Nm',
                'Transmisión':'Automática 8 velocidades','Tracción':'AWD inteligente','Consumo mixto':'12,8 km/l',
                'Capacidad':'5 pasajeros','Maletero':'520 litros','Seguridad':'6 airbags, ABS, ESP, ADAS, cámara 360°',
                'Conectividad':'Pantalla 12,3”, Apple CarPlay y Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-002': {
            pdf:'fichas/AutoMaster_Sedan_Exec.pdf',
            specs:{
                'Carrocería':'Sedán 4 puertas','Motor':'1.6 Hybrid','Potencia combinada':'165 HP','Torque':'265 Nm',
                'Transmisión':'Automática e-CVT','Tracción':'Delantera','Consumo mixto':'22 km/l',
                'Capacidad':'5 pasajeros','Maletero':'475 litros','Seguridad':'6 airbags, frenado autónomo, alerta de carril',
                'Conectividad':'Pantalla 10”, Bluetooth, CarPlay/Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-003': {
            pdf:'fichas/AutoMaster_City_C200.pdf',
            specs:{
                'Carrocería':'Hatchback 5 puertas','Motor':'1.4 gasolina','Potencia':'105 HP','Torque':'138 Nm',
                'Transmisión':'Manual 6 velocidades','Tracción':'Delantera','Consumo mixto':'17,5 km/l',
                'Capacidad':'5 pasajeros','Maletero':'330 litros','Seguridad':'6 airbags, ABS, control de estabilidad',
                'Conectividad':'Pantalla 8”, CarPlay/Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-004': {
            pdf:'fichas/AutoMaster_PickUp_T900.pdf',
            specs:{
                'Carrocería':'PickUp doble cabina','Motor':'2.4 Turbo Diesel','Potencia':'205 HP','Torque':'470 Nm',
                'Transmisión':'Automática 8 velocidades','Tracción':'4x4 con reductora','Consumo mixto':'11,2 km/l',
                'Capacidad':'5 pasajeros','Carga útil':'1.000 kg','Seguridad':'7 airbags, control descenso, cámara reversa',
                'Capacidad de remolque':'3.200 kg','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-005': {
            pdf:'fichas/AutoMaster_Cross_H700.pdf',
            specs:{
                'Carrocería':'Crossover 5 puertas','Motor':'1.8 Hybrid','Potencia combinada':'180 HP','Torque':'300 Nm',
                'Transmisión':'Automática e-CVT','Tracción':'AWD electrónico','Consumo mixto':'19,5 km/l',
                'Capacidad':'5 pasajeros','Maletero':'505 litros','Seguridad':'7 airbags, ADAS, cámara 360°',
                'Confort':'Techo panorámico, climatizador bizona','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-006': {
            pdf:'fichas/AutoMaster_Sport_R8.pdf',
            specs:{
                'Carrocería':'Coupé deportivo','Motor':'2.0 Turbo gasolina','Potencia':'280 HP','Torque':'400 Nm',
                'Transmisión':'DCT 7 velocidades','Tracción':'Delantera con diferencial electrónico','0-100 km/h':'5,8 s',
                'Capacidad':'4 pasajeros','Frenos':'Discos ventilados de alto desempeño','Seguridad':'8 airbags, ESP Sport, control de tracción',
                'Modos de manejo':'Eco, Normal, Sport y Track','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-007': {
            pdf:'fichas/AutoMaster_Moto_Street_250.pdf',
            specs:{
                'Tipo':'Naked / Street','Motor':'Monocilíndrico 249 cc','Potencia':'27 HP','Torque':'23 Nm',
                'Transmisión':'Manual 6 velocidades','Refrigeración':'Líquida','Estanque':'13 litros','Peso en orden de marcha':'158 kg',
                'Altura de asiento':'795 mm','Frenos':'Disco delantero y trasero con ABS','Iluminación':'Full LED','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-008': {
            pdf:'fichas/AutoMaster_Moto_Adventure_500.pdf',
            specs:{
                'Tipo':'Adventure / Touring','Motor':'Bicilíndrico 471 cc','Potencia':'47 HP','Torque':'43 Nm',
                'Transmisión':'Manual 6 velocidades','Refrigeración':'Líquida','Estanque':'18 litros','Peso en orden de marcha':'198 kg',
                'Altura de asiento':'830 mm','Frenos':'ABS doble canal','Equipamiento touring':'Parabrisas, cubremanos y maletas laterales','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-009': {
            pdf:'fichas/AutoMaster_Moto_Sport_600.pdf',
            specs:{
                'Tipo':'Sport','Motor':'4 cilindros 599 cc','Potencia':'118 HP','Torque':'64 Nm',
                'Transmisión':'Manual 6 velocidades con quickshifter','Refrigeración':'Líquida','Estanque':'17 litros','Peso en orden de marcha':'189 kg',
                'Altura de asiento':'820 mm','Frenos':'Doble disco delantero con ABS','Electrónica':'Control de tracción y modos de manejo','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-010': {
            pdf:'fichas/AutoMaster_Moto_Cruiser_800.pdf',
            specs:{
                'Tipo':'Cruiser','Motor':'V-Twin 799 cc','Potencia':'72 HP','Torque':'82 Nm',
                'Transmisión':'Manual 6 velocidades','Refrigeración':'Líquida','Estanque':'16 litros','Peso en orden de marcha':'235 kg',
                'Altura de asiento':'720 mm','Frenos':'ABS doble canal','Confort':'Control crucero y tablero digital','Garantía':'2 años o 30.000 km'
            }
        }
    };

    const seedDB = () => ({
        clients: [
            {id:'CLI-001', rut:'18.345.678-9', name:'Camila Rojas', address:'Av. Central 1240', phone:'+56 9 6123 4567', email:'camila@email.cl', interest:'AutoMaster SUV X500', status:'Activo', sellerId:'VEN-001', licenseExpiry:'2028-05-20', quotes:[{id:'COT-001', model:'AutoMaster SUV X500', amount:18990000, status:'Abierta', date:'2026-10-01'}], purchases:['AutoMaster City C200']},
            {id:'CLI-002', rut:'17.654.321-2', name:'Felipe Soto', address:'Los Alerces 833', phone:'+56 9 7234 5512', email:'felipe@email.cl', interest:'AutoMaster Sedan Exec', status:'Cotización', sellerId:'VEN-002', licenseExpiry:'2027-11-08', quotes:[{id:'COT-002', model:'AutoMaster Sedan Exec', amount:14490000, status:'Abierta', date:'2026-09-30'}], purchases:[]},
            {id:'CLI-003', rut:'19.875.442-1', name:'Daniela Pérez', address:'El Molino 440', phone:'+56 9 6544 1188', email:'daniela@email.cl', interest:'AutoMaster Cross H700', status:'Seguimiento', sellerId:'VEN-003', licenseExpiry:'2029-01-10', quotes:[], purchases:['AutoMaster Sedan Exec']},
            {id:'CLI-004', rut:'16.332.110-5', name:'Antonia Vera', address:'Las Palmas 221', phone:'+56 9 8822 4100', email:'antonia@email.cl', interest:'AutoMaster Moto Adventure 500', status:'Activo', sellerId:'VEN-001', licenseExpiry:'2028-09-14', quotes:[{id:'COT-003', model:'AutoMaster Moto Adventure 500', amount:5990000, status:'Cerrada', date:'2026-09-28'}], purchases:[]},
            {id:'CLI-005', rut:'20.115.932-7', name:'Lucas Méndez', address:'Los Copihues 982', phone:'+56 9 7001 3133', email:'lucas@email.cl', interest:'AutoMaster PickUp T900', status:'Activo', sellerId:'VEN-002', licenseExpiry:'2027-06-18', quotes:[], purchases:[]}
        ],
        sellers: [
            {id:'VEN-001', name:'Valentina Díaz', email:'vendedor@automaster.cl', target:14, commissionRate:1.2},
            {id:'VEN-002', name:'Matías López', email:'matias@automaster.cl', target:14, commissionRate:1.2},
            {id:'VEN-003', name:'Josefa Silva', email:'josefa@automaster.cl', target:14, commissionRate:1.2}
        ],
        opportunities: [
            {id:'OP-001', sellerId:'VEN-001', clientId:'CLI-001', model:'AutoMaster SUV X500', status:'Cierre', amount:18990000},
            {id:'OP-002', sellerId:'VEN-002', clientId:'CLI-002', model:'AutoMaster Sedan Exec', status:'Negociación', amount:14490000},
            {id:'OP-003', sellerId:'VEN-003', clientId:'CLI-003', model:'AutoMaster Cross H700', status:'Contacto', amount:20490000}
        ],
        sales: [
            {id:'VTA-001', sellerId:'VEN-001', clientId:'CLI-001', amount:11990000, date:'2026-09-05'},
            {id:'VTA-002', sellerId:'VEN-001', clientId:'CLI-004', amount:5990000, date:'2026-09-17'},
            {id:'VTA-003', sellerId:'VEN-002', clientId:'CLI-003', amount:14490000, date:'2026-09-12'},
            {id:'VTA-004', sellerId:'VEN-003', clientId:'CLI-005', amount:9490000, date:'2026-09-22'}
        ],
        stock: [
            {vin:'AX8241', model:'AutoMaster SUV X500', location:'Sucursal Centro', color:'Gris', year:2026, status:'Disponible', demo:false},
            {vin:'AX8242', model:'AutoMaster SUV X500', location:'Sucursal Centro', color:'Negro', year:2026, status:'Reservado', demo:true},
            {vin:'SE1732', model:'AutoMaster Sedan Exec', location:'Patio Norte', color:'Blanco', year:2026, status:'Disponible', demo:true},
            {vin:'SE1733', model:'AutoMaster Sedan Exec', location:'Sucursal Centro', color:'Azul', year:2026, status:'Vendido', demo:false},
            {vin:'CT2001', model:'AutoMaster City C200', location:'Sucursal Centro', color:'Rojo', year:2026, status:'Disponible', demo:false},
            {vin:'PK9001', model:'AutoMaster PickUp T900', location:'Patio Norte', color:'Negro', year:2026, status:'En tránsito', demo:false},
            {vin:'CR7001', model:'AutoMaster Cross H700', location:'Sucursal Centro', color:'Plata', year:2026, status:'Disponible', demo:true},
            {vin:'SP8001', model:'AutoMaster Sport R8', location:'Patio Norte', color:'Rojo', year:2026, status:'Reservado', demo:false},
            {vin:'M25001', model:'AutoMaster Moto Street 250', location:'Sucursal Centro', color:'Negro', year:2026, status:'Disponible', demo:true},
            {vin:'M50001', model:'AutoMaster Moto Adventure 500', location:'Sucursal Centro', color:'Gris', year:2026, status:'Disponible', demo:true},
            {vin:'M60001', model:'AutoMaster Moto Sport 600', location:'Patio Norte', color:'Azul', year:2026, status:'En tránsito', demo:false},
            {vin:'M80001', model:'AutoMaster Moto Cruiser 800', location:'Sucursal Centro', color:'Negro', year:2026, status:'Disponible', demo:true}
        ],
        parts: [
            {code:'REP-00182', name:'Pastillas de freno', compatibility:'AutoMaster SUV X500', stock:24, minStock:6},
            {code:'REP-00431', name:'Filtro de aceite', compatibility:'AutoMaster Sedan Exec', stock:5, minStock:8},
            {code:'REP-00802', name:'Sensor ABS', compatibility:'AutoMaster SUV X500', stock:1, minStock:3},
            {code:'REP-01045', name:'Filtro de aire', compatibility:'AutoMaster City C200', stock:14, minStock:5},
            {code:'REP-01220', name:'Kit transmisión', compatibility:'AutoMaster Moto Adventure 500', stock:4, minStock:4}
        ],
        partOrders: [{id:'PED-001', code:'REP-00431', qty:20, status:'Solicitado', date:'2026-10-01'}],
        finance: [
            {id:'FIN-1048', clientId:'CLI-001', amount:13500000, installments:48, monthlyRate:2.79, vfg:20, risk:'Bajo', status:'Preaprobada', attachments:[]},
            {id:'FIN-1049', clientId:'CLI-002', amount:16200000, installments:60, monthlyRate:2.79, vfg:20, risk:'Medio', status:'Evaluación', attachments:[]},
            {id:'FIN-1050', clientId:'CLI-003', amount:9800000, installments:36, monthlyRate:2.79, vfg:20, risk:'Bajo', status:'Enviada', attachments:[]}
        ],
        testdrives: [
            {id:'TD-001', clientId:'CLI-002', date:'2026-10-01T15:00', model:'AutoMaster Sedan Exec', vin:'SE1732', status:'Confirmado'},
            {id:'TD-002', clientId:'CLI-004', date:'2026-10-01T17:30', model:'AutoMaster Moto Adventure 500', vin:'M50001', status:'Pendiente'},
            {id:'TD-003', clientId:'CLI-005', date:'2026-10-02T11:00', model:'AutoMaster Cross H700', vin:'CR7001', status:'Confirmado'},
            {id:'TD-004', clientId:'CLI-001', date:'2026-10-03T12:00', model:'AutoMaster SUV X500', vin:'AX8242', status:'Confirmado'}
        ],
        documents: [
            {id:'DOC-001', type:'Contrato compraventa', clientId:'CLI-001', date:'2026-10-01', status:'Firmado', fileName:'Contrato_Camila_Rojas.pdf'},
            {id:'DOC-002', type:'Pagaré', clientId:'CLI-002', date:'2026-10-01', status:'Pendiente firma', fileName:'Pagare_Felipe_Soto.pdf'},
            {id:'DOC-003', type:'Inscripción', clientId:'CLI-003', date:'2026-09-30', status:'Recibido', fileName:'Inscripcion_Daniela.pdf'},
            {id:'DOC-004', type:'Carta de resguardo', clientId:'CLI-004', date:'2026-09-29', status:'Firmado', fileName:'Carta_Antonia.pdf'}
        ],
        warranties: [
            {policy:'GAR-8042', vin:'AX8241', coverage:'Fábrica 3 años', expiry:'2029-01-15', mileageLimit:100000, status:'Activa', claim:''},
            {policy:'GAR-8121', vin:'SE1733', coverage:'Extensión 2 años', expiry:'2030-03-20', mileageLimit:120000, status:'Activa', claim:''},
            {policy:'GAR-7994', vin:'CT2001', coverage:'Fábrica 3 años', expiry:'2028-06-10', mileageLimit:100000, status:'Reclamo abierto', claim:'Ruido de motor'}
        ],
        models: [
            {id:'MOD-001', name:'AutoMaster SUV X500', category:'suv', tag:'SUV', version:'2.0 Turbo AT', price:18990000, equipment:'6 airbags, cámara 360°, control crucero adaptativo', image:MODEL_IMAGES.x500},
            {id:'MOD-002', name:'AutoMaster Sedan Exec', category:'auto', tag:'Sedán', version:'1.6 Hybrid AT', price:14490000, equipment:'Pantalla 10”, climatizador, ADAS', image:MODEL_IMAGES.sedan},
            {id:'MOD-003', name:'AutoMaster City C200', category:'auto', tag:'Hatchback', version:'1.4 MT', price:11990000, equipment:'6 airbags, CarPlay/Android Auto', image:MODEL_IMAGES.city},
            {id:'MOD-004', name:'AutoMaster PickUp T900', category:'suv', tag:'PickUp', version:'2.4 Diesel 4x4 AT', price:24990000, equipment:'4x4, control descenso, cámara reversa', image:MODEL_IMAGES.pickup},
            {id:'MOD-005', name:'AutoMaster Cross H700', category:'suv', tag:'Crossover', version:'1.8 Hybrid AT', price:20490000, equipment:'Techo panorámico, ADAS, cámara 360°', image:MODEL_IMAGES.cross},
            {id:'MOD-006', name:'AutoMaster Sport R8', category:'auto', tag:'Sport', version:'2.0 Turbo DCT', price:29990000, equipment:'Modo Sport, asientos deportivos, 8 airbags', image:MODEL_IMAGES.sport},
            {id:'MOD-007', name:'AutoMaster Moto Street 250', category:'moto', tag:'Moto', version:'250 cc', price:3490000, equipment:'ABS, tablero digital, iluminación LED', image:MODEL_IMAGES.moto1},
            {id:'MOD-008', name:'AutoMaster Moto Adventure 500', category:'moto', tag:'Moto Adventure', version:'500 cc', price:5990000, equipment:'ABS doble canal, parabrisas, maletas laterales', image:MODEL_IMAGES.moto2},
            {id:'MOD-009', name:'AutoMaster Moto Sport 600', category:'moto', tag:'Moto Sport', version:'600 cc', price:7490000, equipment:'Control tracción, modos de manejo, quickshifter', image:MODEL_IMAGES.moto3},
            {id:'MOD-010', name:'AutoMaster Moto Cruiser 800', category:'moto', tag:'Moto Cruiser', version:'800 cc', price:9490000, equipment:'ABS, control crucero, iluminación LED', image:MODEL_IMAGES.moto4}
        ],
        workorders: [
            {id:'OT-018', clientId:'CLI-001', vin:'AX8241', vehicle:'AutoMaster SUV X500', job:'Mantención 20.000 km', status:'En proceso', parts:'Filtro aceite', labourHours:2.5, date:'2026-10-01'},
            {id:'OT-019', clientId:'CLI-002', vin:'SE1732', vehicle:'AutoMaster Sedan Exec', job:'Diagnóstico frenos', status:'Esperando repuesto', parts:'Pastillas freno', labourHours:1.5, date:'2026-10-01'},
            {id:'OT-020', clientId:'CLI-003', vin:'CT2001', vehicle:'AutoMaster City C200', job:'Revisión garantía', status:'Listo entrega', parts:'Sensor ABS', labourHours:1, date:'2026-09-30'},
            {id:'OT-021', clientId:'CLI-004', vin:'M50001', vehicle:'AutoMaster Moto Adventure 500', job:'Mantención 10.000 km', status:'Agendada', parts:'Kit transmisión', labourHours:2, date:'2026-10-04'}
        ],
        interactions: [
            {id:'INT-001', clientId:'CLI-001', date:'2026-10-01', channel:'Teléfono', note:'Solicita simulación SUV X500'},
            {id:'INT-002', clientId:'CLI-002', date:'2026-09-30', channel:'Correo', note:'Se envió cotización Sedan Exec'}
        ],
        notifications: [
            {id:'NOT-001', date:'2026-10-01T09:00', title:'Test drive confirmado', message:'Felipe Soto - Sedan Exec - 01/10 15:00', read:false},
            {id:'NOT-002', date:'2026-10-01T10:00', title:'OT actualizada', message:'OT-020 lista para entrega', read:false}
        ]
    });

    let db;
    try { db = JSON.parse(localStorage.getItem(DATA_KEY)) || seedDB(); }
    catch { db = seedDB(); }
    // Migración de catálogo y reglas financieras: conserva registros existentes y completa nuevas fichas.
    db.models.forEach(model => {
        const detail = MODEL_DETAILS[model.id];
        if (detail) {
            model.pdf = detail.pdf;
            model.specs = {...detail.specs, ...(model.specs || {})};
        }
    });
    db.finance.forEach(item => {
        item.monthlyRate = 2.79;
        item.vfg = 20;
        item.attachments = item.attachments || [];
        item.origin = item.origin || 'Solicitud interna';
        item.risk = item.risk || 'Pendiente';
    });
    localStorage.setItem(DATA_KEY, JSON.stringify(db));
    const saveDB = () => {
        localStorage.setItem(DATA_KEY, JSON.stringify(db));
        renderSummary();
        renderPublicCatalog();
        updateNotificationCount();
        if (currentModule && currentSession) renderModule(currentModule);
    };

    const getClient = id => db.clients.find(x => x.id === id);
    const getSeller = id => db.sellers.find(x => x.id === id);
    const getModel = name => db.models.find(x => x.name === name);
    const getStock = vin => db.stock.find(x => x.vin === vin);
    const clientName = id => getClient(id)?.name || 'Sin cliente';
    const sellerName = id => getSeller(id)?.name || 'Sin vendedor';

    // ------------------------------------------------------------------
    // Navegación móvil
    // ------------------------------------------------------------------
    const menuToggle = $('#menu-toggle');
    const mainNav = $('#main-nav');
    menuToggle?.addEventListener('click', () => {
        const open = mainNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    $$('#main-nav a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

    // ------------------------------------------------------------------
    // Modales y mensajes
    // ------------------------------------------------------------------
    const appModal = $('#app-modal');
    const appModalTitle = $('#app-modal-title');
    const appModalDescription = $('#app-modal-description');
    const appModalEyebrow = $('#app-modal-eyebrow');
    const appModalContent = $('#app-modal-content');

    const closeAppModal = () => {
        appModal.classList.add('oculto');
        document.body.classList.remove('modal-open');
        appModalContent.innerHTML = '';
    };
    $('#app-modal-close')?.addEventListener('click', closeAppModal);
    appModal?.querySelector('[data-close-app-modal]')?.addEventListener('click', closeAppModal);

    const openInfoModal = (title, html, description = '', eyebrow = 'AutoMaster') => {
        appModalEyebrow.textContent = eyebrow;
        appModalTitle.textContent = title;
        appModalDescription.textContent = description;
        appModalContent.innerHTML = html;
        appModal.classList.remove('oculto');
        document.body.classList.add('modal-open');
    };

    const fieldHTML = field => {
        const required = field.required ? 'required' : '';
        const value = field.value != null ? `value="${esc(field.value)}"` : '';
        const placeholder = field.placeholder ? `placeholder="${esc(field.placeholder)}"` : '';
        if (field.type === 'select') {
            return `<label class="modal-field"><span>${esc(field.label)}</span><select name="${esc(field.name)}" ${required}>${(field.options || []).map(o => {
                const val = typeof o === 'string' ? o : o.value;
                const label = typeof o === 'string' ? o : o.label;
                return `<option value="${esc(val)}" ${String(field.value)===String(val)?'selected':''}>${esc(label)}</option>`;
            }).join('')}</select></label>`;
        }
        if (field.type === 'textarea') {
            return `<label class="modal-field modal-field-wide"><span>${esc(field.label)}</span><textarea name="${esc(field.name)}" ${required} ${placeholder}>${esc(field.value || '')}</textarea></label>`;
        }
        if (field.type === 'file') {
            return `<label class="modal-field modal-field-wide"><span>${esc(field.label)}</span><input type="file" name="${esc(field.name)}" ${field.accept ? `accept="${esc(field.accept)}"` : ''} ${required}></label>`;
        }
        return `<label class="modal-field ${field.wide ? 'modal-field-wide' : ''}"><span>${esc(field.label)}</span><input type="${esc(field.type || 'text')}" name="${esc(field.name)}" ${required} ${value} ${placeholder} ${field.min != null ? `min="${field.min}"` : ''} ${field.max != null ? `max="${field.max}"` : ''} ${field.step != null ? `step="${field.step}"` : ''}></label>`;
    };

    const openFormModal = ({title, description='', eyebrow='Acción', fields=[], submitLabel='Guardar', onSubmit}) => {
        openInfoModal(title, `<form class="app-action-form" id="app-action-form"><div class="modal-form-grid">${fields.map(fieldHTML).join('')}</div><p class="modal-form-error oculto" id="modal-form-error"></p><div class="modal-actions"><button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button><button type="submit" class="btn btn-primary">${esc(submitLabel)}</button></div></form>`, description, eyebrow);
        $('#modal-cancel')?.addEventListener('click', closeAppModal);
        $('#app-action-form')?.addEventListener('submit', async event => {
            event.preventDefault();
            const error = $('#modal-form-error');
            const form = event.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try {
                const result = await onSubmit(data, formData, form);
                if (result !== false) closeAppModal();
            } catch (e) {
                error.textContent = e.message || 'No se pudo completar la acción.';
                error.classList.remove('oculto');
            }
        });
    };

    const toast = (message, type='ok') => {
        const container = $('#toast-container');
        const item = document.createElement('div');
        item.className = `toast toast-${type}`;
        item.textContent = message;
        container.appendChild(item);
        setTimeout(() => item.remove(), 3600);
    };

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            if (!appModal.classList.contains('oculto')) closeAppModal();
            if (!$('#login-modal').classList.contains('oculto')) closeLogin();
        }
    });

    // ------------------------------------------------------------------
    // RBAC y login
    // ------------------------------------------------------------------
    const loginModal = $('#login-modal');
    const formLogin = $('#form-login');
    const loginEmail = $('#login-email');
    const loginPassword = $('#login-password');
    const loginError = $('#login-error');
    const gestionSection = $('#gestion');
    const navGestion = $('#nav-gestion');
    const navUsuario = $('#nav-usuario');
    const usuarioFuncionario = $('#usuario-funcionario');
    const roleLabel = $('#role-label');

    const roleByEmail = email => {
        const local = email.split('@')[0].toLowerCase();
        if (/admin|gerente/.test(local)) return {key:'admin', label:'Administrador', modules:'*'};
        if (/finanz/.test(local)) return {key:'finanzas', label:'Ejecutivo de Financiamiento', modules:['clientes','finanzas','documentos']};
        if (/repuesto|bodega/.test(local)) return {key:'repuestos', label:'Encargado de Repuestos', modules:['stock','repuestos','postventa']};
        if (/postventa|taller/.test(local)) return {key:'postventa', label:'Postventa / Taller', modules:['clientes','repuestos','garantias','postventa']};
        if (/inventario|stock/.test(local)) return {key:'inventario', label:'Encargado de Inventario', modules:['stock','modelos']};
        return {key:'vendedor', label:'Vendedor', modules:['clientes','vendedores','stock','testdrive','documentos','modelos']};
    };

    let currentSession = null;
    let currentModule = 'clientes';

    const canAccess = module => currentSession && (currentSession.role.modules === '*' || currentSession.role.modules.includes(module));

    function openLogin() {
        loginModal.classList.remove('oculto');
        document.body.classList.add('modal-open');
        loginError.classList.add('oculto');
        setTimeout(() => loginEmail.focus(), 0);
    }
    function closeLogin() {
        loginModal.classList.add('oculto');
        document.body.classList.remove('modal-open');
        formLogin.reset();
        loginError.classList.add('oculto');
    }

    const applySession = session => {
        currentSession = session;
        const authenticated = Boolean(session);
        navGestion.classList.toggle('oculto', !authenticated);
        navUsuario.classList.toggle('oculto', !authenticated);
        $('#btn-login-funcionario').classList.toggle('oculto', authenticated);
        $('#hero-login-funcionario').classList.toggle('oculto', authenticated);
        gestionSection.classList.toggle('oculto', !authenticated);
        gestionSection.setAttribute('aria-hidden', String(!authenticated));
        usuarioFuncionario.textContent = authenticated ? `${session.email} · ${session.role.label}` : '';
        roleLabel.textContent = authenticated ? session.role.label : 'Sin sesión';
        $$('.admin-only').forEach(el => el.classList.toggle('oculto', !authenticated || session.role.key !== 'admin'));

        if (authenticated) {
            $$('.module-button').forEach(btn => btn.classList.toggle('oculto', !canAccess(btn.dataset.module)));
            const first = $$('.module-button').find(btn => !btn.classList.contains('oculto'));
            if (!canAccess(currentModule) && first) currentModule = first.dataset.module;
            $$('.module-button').forEach(btn => btn.classList.toggle('active', btn.dataset.module === currentModule));
            renderModule(currentModule);
        }
    };

    $('#btn-login-funcionario')?.addEventListener('click', openLogin);
    $('#hero-login-funcionario')?.addEventListener('click', openLogin);
    $('#cerrar-login')?.addEventListener('click', closeLogin);
    loginModal.querySelector('[data-close-login]')?.addEventListener('click', closeLogin);
    $('#btn-logout-funcionario')?.addEventListener('click', () => {
        sessionStorage.removeItem(SESSION_KEY);
        applySession(null);
        location.hash = '#inicio';
        toast('Sesión cerrada.');
    });

    formLogin.addEventListener('submit', event => {
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
        const session = {email, role:roleByEmail(email)};
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        applySession(session);
        closeLogin();
        gestionSection.scrollIntoView({behavior:'smooth', block:'start'});
        toast(`Bienvenido: ${session.role.label}`);
    });

    // ------------------------------------------------------------------
    // Catálogo público dinámico
    // ------------------------------------------------------------------
    const catalogGrid = $('#catalog-grid');
    const catalogSearch = $('#catalog-search');
    let catalogFilter = 'todos';

    function modelStock(name) {
        return db.stock.filter(s => s.model === name && s.status === 'Disponible').length;
    }

    function renderPublicCatalog() {
        if (!catalogGrid) return;
        const query = (catalogSearch?.value || '').trim().toLowerCase();
        const list = db.models.filter(m => (catalogFilter === 'todos' || m.category === catalogFilter) && (!query || `${m.name} ${m.version} ${m.tag}`.toLowerCase().includes(query)));
        $('#catalog-empty')?.classList.toggle('oculto', list.length > 0);
        catalogGrid.innerHTML = list.map(m => {
            const specs = Object.entries(m.specs || {});
            const summarySpecs = specs.slice(0, 4).map(([label, value]) => `<li><strong>${esc(label)}:</strong> ${esc(value)}</li>`).join('');
            const pdfButton = m.pdf ? `<a class="btn btn-secondary js-pdf-modelo" href="${esc(m.pdf)}" download>Descargar ficha PDF</a>` : '';
            return `
            <article class="vehicle-card">
                <img src="${esc(m.image)}" alt="${esc(m.name)}">
                <div class="vehicle-content">
                    <div class="vehicle-topline"><span class="vehicle-tag">${esc(m.tag)}</span><span>Disponibles: ${modelStock(m.name)}</span></div>
                    <h3>${esc(m.name)}</h3>
                    <ul class="vehicle-spec-list">
                        <li><strong>Versión:</strong> ${esc(m.version)}</li>
                        ${summarySpecs}
                        <li><strong>Precio:</strong> ${money(m.price)}</li>
                    </ul>
                    <div class="vehicle-actions">
                        <button type="button" class="btn btn-primary js-simular-modelo" data-valor="${m.price}" data-model="${esc(m.name)}">Simular financiamiento</button>
                        <button type="button" class="btn btn-secondary js-ficha-modelo" data-model="${esc(m.id)}">Ver ficha técnica</button>
                        ${pdfButton}
                        <a href="#contacto" class="btn btn-secondary js-test-public" data-model="${esc(m.name)}">Solicitar test drive</a>
                    </div>
                </div>
            </article>`;
        }).join('');
        $$('.js-simular-modelo', catalogGrid).forEach(btn => btn.addEventListener('click', () => {
            selectedFinanceModelName = btn.dataset.model || '';
            $('#valor-vehiculo').value = btn.dataset.valor;
            updateFinancePreview();
            openFinancing();
        }));
        $$('.js-ficha-modelo', catalogGrid).forEach(btn => btn.addEventListener('click', () => {
            const m = db.models.find(x => x.id === btn.dataset.model);
            const units = db.stock.filter(x => x.model === m.name);
            const specHtml = Object.entries(m.specs || {}).map(([label,value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');
            const pdfHtml = m.pdf ? `<div class="detail-block"><a class="btn btn-primary btn-full" href="${esc(m.pdf)}" download>Descargar ficha técnica PDF</a></div>` : '';
            openInfoModal(m.name, `<div class="detail-grid"><div><span>Versión</span><strong>${esc(m.version)}</strong></div><div><span>Precio lista</span><strong>${money(m.price)}</strong></div><div><span>Disponibles</span><strong>${modelStock(m.name)}</strong></div><div><span>Unidades registradas</span><strong>${units.length}</strong></div>${specHtml}</div><div class="detail-block"><h3>Equipamiento destacado</h3><p>${esc(m.equipment)}</p></div>${pdfHtml}`, 'Ficha técnica completa y disponibilidad del catálogo AutoMaster.', 'Catálogo técnico');
        }));
        $$('.js-test-public', catalogGrid).forEach(link => link.addEventListener('click', () => {
            $('#tipo-solicitud').value = 'test-drive';
            $('#tipo-solicitud').dataset.model = link.dataset.model;
        }));
    }

    $$('.catalog-filter').forEach(btn => btn.addEventListener('click', () => {
        $$('.catalog-filter').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        catalogFilter = btn.dataset.filter;
        renderPublicCatalog();
    }));
    catalogSearch?.addEventListener('input', renderPublicCatalog);

    // ------------------------------------------------------------------
    // Simulador de financiamiento: pie, tasa, VFG y seguros
    // ------------------------------------------------------------------
    const financeSection = $('#financiamiento');
    const valueInput = $('#valor-vehiculo');
    const installmentsSelect = $('#plazo-cuotas');
    const PUBLIC_MONTHLY_RATE = 2.79;
    const PUBLIC_VFG_PERCENT = 20;
    let selectedFinanceModelName = '';
    for (let i=6; i<=72; i+=6) {
        const opt = document.createElement('option'); opt.value=i; opt.textContent=`${i} cuotas`; if (i===48) opt.selected=true; installmentsSelect.appendChild(opt);
    }
    const updateFinancePreview = () => {
        const value = Number(valueInput.value)||0;
        $('#monto-pie').textContent = money(value*0.10);
        $('#monto-financiar-preview').textContent = money(value*0.90);
    };
    const openFinancing = () => { financeSection.classList.remove('oculto'); financeSection.setAttribute('aria-hidden','false'); financeSection.scrollIntoView({behavior:'smooth',block:'start'}); };
    $$('.js-abrir-financiamiento').forEach(el => el.addEventListener('click', e => {e.preventDefault(); openFinancing();}));
    $('#cerrar-simulador')?.addEventListener('click', () => {financeSection.classList.add('oculto'); financeSection.setAttribute('aria-hidden','true');});
    valueInput.addEventListener('input', () => {
        updateFinancePreview();
        const selectedModel = getModel(selectedFinanceModelName);
        if (!selectedModel || Number(valueInput.value) !== Number(selectedModel.price)) selectedFinanceModelName = '';
    });
    $('.js-ejemplo')?.addEventListener('click', e => {
        valueInput.value=e.currentTarget.dataset.valor;
        installmentsSelect.value=e.currentTarget.dataset.cuotas;
        selectedFinanceModelName = db.models.find(m => Number(m.price) === Number(e.currentTarget.dataset.valor))?.name || 'AutoMaster SUV X500';
        updateFinancePreview();
        openFinancing();
    });

    const calcCredit = ({value, installments, monthlyRate, vfgPct, desgravamen=false, cesantia=false}) => {
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

    const showSimulationCode = code => {
        let target = $('#res-codigo-simulacion');
        if (!target) {
            const resultCard = $('#tarjeta-resultado');
            const title = $('#res-titulo-cuotas');
            if (resultCard && title) {
                const row = document.createElement('div');
                row.className = 'result-row';
                row.innerHTML = '<span>Código de simulación</span><strong id="res-codigo-simulacion"></strong>';
                title.insertAdjacentElement('afterend', row);
                target = $('#res-codigo-simulacion');
            }
        }
        if (target) target.textContent = code;
    };

    $('#form-simulador').addEventListener('submit', event => {
        event.preventDefault();
        const value = Number(valueInput.value);
        const error = $('#error-simulador');
        error.classList.add('oculto');
        if (!value || value < 1000000) {error.textContent='Ingresa un valor de vehículo válido desde $1.000.000.'; error.classList.remove('oculto'); return;}
        const installments=Number(installmentsSelect.value), monthlyRate=PUBLIC_MONTHLY_RATE, vfgPct=PUBLIC_VFG_PERCENT;
        const hasDesgravamen = $('#seguro-desgravamen').checked;
        const hasCesantia = $('#seguro-cesantia').checked;
        const result = calcCredit({value, installments, monthlyRate, vfgPct, desgravamen:hasDesgravamen, cesantia:hasCesantia});

        const matchedModel = getModel(selectedFinanceModelName) || db.models.find(m => Number(m.price) === value);
        const simulation = {
            id: uid('SIM'),
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
        saveDB();

        showSimulationCode(simulation.id);
        $('#res-titulo-cuotas').textContent=`Simulación en ${installments} cuotas`;
        $('#res-valor-vehiculo').textContent=money(value);
        $('#res-pie').textContent=money(result.pie);
        $('#res-monto-solicitado').textContent=money(result.principal);
        $('#res-tasa-mensual').textContent=`${monthlyRate.toLocaleString('es-CL')}%`;
        $('#res-vfg').textContent=money(result.balloon);
        $('#res-costo-base').textContent=money(result.baseTotal);
        $('#res-costo-desgravamen').textContent=money(result.insurance1);
        $('#res-costo-cesantia').textContent=money(result.insurance2);
        $('#res-cuota-mensual').textContent=money(result.monthlyPayment);
        $('#res-costo-total').textContent=money(result.total);
        $('#resultado-placeholder').classList.add('oculto');
        $('#tarjeta-resultado').classList.remove('oculto');
    });

    // ------------------------------------------------------------------
    // Centro de gestión: KPIs calculados desde los registros
    // ------------------------------------------------------------------
    const status = (text, kind='ok') => `<span class="status ${kind}">${esc(text)}</span>`;
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

    function moduleData(key) {
        switch(key) {
            case 'clientes': return {
                kpis:[['Clientes',db.clients.length],['Cotizaciones abiertas',db.clients.flatMap(c=>c.quotes||[]).filter(q=>q.status==='Abierta').length],['Interacciones',db.interactions.length]],
                columns:['RUT/ID','Cliente','Interés','Estado','Vendedor'],
                rows:db.clients.map(c=>[c.rut,c.name,c.interest,status(c.status,c.status==='Cotización'?'warn':'ok'),sellerName(c.sellerId)]),
                actions:['Registrar nuevo cliente','Editar cliente','Crear cotización','Ver historial de cliente','Registrar interacción']};
            case 'vendedores': return {
                kpis:[['Vendedores',db.sellers.length],['Oportunidades',db.opportunities.length],['Ventas registradas',db.sales.length]],
                columns:['Vendedor','Cartera','Ventas','Meta','Comisión estimada'],
                rows:db.sellers.map(s=>{const portfolio=db.clients.filter(c=>c.sellerId===s.id).length; const sales=db.sales.filter(v=>v.sellerId===s.id); const amount=sales.reduce((a,b)=>a+b.amount,0); return [s.name,`${portfolio} clientes`,sales.length,`${s.target} ventas`,money(amount*s.commissionRate/100)];}),
                actions:['Asignar cartera','Registrar oportunidad','Revisar comisiones','Actualizar meta de venta']};
            case 'stock': return {
                kpis:[['Disponibles',db.stock.filter(x=>x.status==='Disponible').length],['En tránsito',db.stock.filter(x=>x.status==='En tránsito').length],['Reservados',db.stock.filter(x=>x.status==='Reservado').length],['Vendidos',db.stock.filter(x=>x.status==='Vendido').length]],
                columns:['VIN','Modelo','Ubicación','Color / Año','Estado'],
                rows:db.stock.map(x=>[x.vin,x.model,x.location,`${x.color} / ${x.year}`,status(x.status,x.status==='Disponible'?'ok':x.status==='Vendido'?'bad':'warn')]),
                actions:['Ingresar vehículo','Cambiar estado','Buscar por VIN','Registrar reserva']};
            case 'repuestos': return {
                kpis:[['Ítems registrados',db.parts.length],['Stock crítico',db.parts.filter(x=>x.stock<=x.minStock).length],['Unidades en stock',db.parts.reduce((a,b)=>a+b.stock,0)],['Pedidos abiertos',db.partOrders.filter(x=>x.status!=='Recibido').length]],
                columns:['Código','Repuesto','Compatibilidad','Stock','Mínimo'],
                rows:db.parts.map(x=>[x.code,x.name,x.compatibility,status(`${x.stock} u.`,x.stock<=x.minStock?'bad':'ok'),`${x.minStock} u.`]),
                actions:['Registrar repuesto','Crear pedido a fábrica','Consultar compatibilidad','Ajustar inventario']};
            case 'finanzas': return {
                kpis:[['Registros',db.finance.length],['Simulaciones web',db.finance.filter(x=>x.origin==='Simulación web' && !x.clientId).length],['Preaprobadas',db.finance.filter(x=>x.status==='Preaprobada').length],['En evaluación',db.finance.filter(x=>x.status==='Evaluación').length]],
                columns:['Solicitud','Cliente','Vehículo / Origen','Monto','Cuotas / VFG','Riesgo','Estado'],
                rows:db.finance.map(x=>[
                    x.id,
                    x.clientId ? clientName(x.clientId) : 'Cliente web',
                    x.model ? `${x.model} · ${x.origin || 'Solicitud interna'}` : (x.origin || 'Solicitud interna'),
                    money(x.amount),
                    `${x.installments} / ${x.vfg}%`,
                    status(x.risk || 'Pendiente',x.risk==='Alto'?'bad':x.risk==='Medio' || x.risk==='Pendiente'?'warn':'ok'),
                    status(x.status,x.status==='Evaluación' || x.status==='Simulación web'?'warn':x.status==='Rechazada'?'bad':'ok')
                ]),
                actions:['Abrir simulador de crédito','Vincular simulación web','Crear solicitud bancaria','Adjuntar antecedentes','Actualizar estado']};
            case 'testdrive': return {
                kpis:[['Agendados',db.testdrives.length],['Confirmados',db.testdrives.filter(x=>x.status==='Confirmado').length],['Vehículos demo',db.stock.filter(x=>x.demo).length]],
                columns:['Cliente','Fecha','Vehículo','VIN demo','Estado'],
                rows:db.testdrives.map(x=>[clientName(x.clientId),x.date.replace('T',' '),x.model,x.vin,status(x.status,x.status==='Confirmado'?'ok':'warn')]),
                actions:['Agendar test drive','Asignar vehículo demo','Registrar licencia','Reprogramar cita']};
            case 'documentos': return {
                kpis:[['Documentos',db.documents.length],['Pendientes firma',db.documents.filter(x=>x.status.includes('Pendiente')).length],['Firmados',db.documents.filter(x=>x.status==='Firmado').length]],
                columns:['ID','Documento','Cliente','Fecha','Estado'],
                rows:db.documents.map(x=>[x.id,x.type,clientName(x.clientId),x.date,status(x.status,x.status==='Firmado'?'ok':x.status.includes('Pendiente')?'warn':'ok')]),
                actions:['Generar contrato','Subir archivo','Solicitar firma','Consultar expediente']};
            case 'garantias': return {
                kpis:[['Garantías',db.warranties.length],['Activas',db.warranties.filter(x=>x.status==='Activa').length],['Reclamos abiertos',db.warranties.filter(x=>x.status==='Reclamo abierto').length]],
                columns:['Póliza','VIN','Vehículo','Cobertura','Vencimiento','Estado'],
                rows:db.warranties.map(x=>[x.policy,x.vin,getStock(x.vin)?.model||'Sin vehículo',x.coverage,x.expiry,status(x.status,x.status==='Activa'?'ok':'warn')]),
                actions:['Registrar garantía','Validar cobertura','Crear reclamo','Extender garantía']};
            case 'modelos': return {
                kpis:[['Modelos',db.models.length],['Autos/SUV',db.models.filter(x=>x.category!=='moto').length],['Motos',db.models.filter(x=>x.category==='moto').length]],
                columns:['Modelo','Categoría','Versión','Precio','Disponibles'],
                rows:db.models.map(x=>[x.name,x.tag,x.version,money(x.price),modelStock(x.name)]),
                actions:['Crear modelo','Editar ficha técnica','Gestionar versiones','Actualizar precio']};
            case 'postventa': return {
                kpis:[['OT registradas',db.workorders.length],['Abiertas',db.workorders.filter(x=>!['Listo entrega','Cerrada'].includes(x.status)).length],['Listas entrega',db.workorders.filter(x=>x.status==='Listo entrega').length]],
                columns:['OT','Cliente','Vehículo','Trabajo','Hrs.','Estado'],
                rows:db.workorders.map(x=>[x.id,clientName(x.clientId),x.vehicle,x.job,x.labourHours,status(x.status,x.status==='Listo entrega'?'ok':x.status==='Esperando repuesto'?'warn':'ok')]),
                actions:['Crear orden de trabajo','Registrar recepción','Actualizar reparación','Programar mantención']};
        }
    }

    function renderModule(key) {
        if (!currentSession || !canAccess(key)) return;
        currentModule=key;
        const meta=moduleMeta[key], data=moduleData(key);
        const panel=$('#module-panel');
        panel.innerHTML=`<div class="module-panel-header"><div><h3>${meta.title}</h3><p>${meta.desc}</p></div><span class="module-badge">${meta.badge}</span></div>
            <div class="module-kpis">${data.kpis.map(([l,v])=>`<div class="module-kpi"><span>${l}</span><strong>${v}</strong></div>`).join('')}</div>
            <div class="module-toolbar"><input type="search" id="module-search" placeholder="Buscar en este módulo..."><button type="button" class="btn btn-secondary btn-compact" id="module-export">Exportar CSV</button></div>
            <div class="module-content-grid"><div class="module-table-card"><h4>Resumen operativo</h4><div class="table-wrap"><table class="module-table"><thead><tr>${data.columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody id="module-tbody">${data.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
            <aside class="module-action-card"><h4>Acciones rápidas</h4><div class="action-list">${data.actions.map(a=>`<button class="action-btn js-module-action" type="button" data-action="${esc(a)}">${esc(a)}</button>`).join('')}</div><div class="module-note">Los cambios se guardan en este navegador para la demostración.</div></aside></div>`;
        $('#module-search')?.addEventListener('input', e => {
            const q=e.target.value.toLowerCase();
            $$('#module-tbody tr').forEach(tr=>tr.classList.toggle('oculto',!tr.textContent.toLowerCase().includes(q)));
        });
        $('#module-export')?.addEventListener('click',()=>exportModuleCSV(key,data));
        $$('.js-module-action',panel).forEach(btn=>btn.addEventListener('click',()=>handleAction(key,btn.dataset.action)));
    }

    $$('.module-button').forEach(btn=>btn.addEventListener('click',()=>{
        if (!canAccess(btn.dataset.module)) return;
        $$('.module-button').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); renderModule(btn.dataset.module);
    }));

    function exportModuleCSV(key,data) {
        const strip = html => {const d=document.createElement('div'); d.innerHTML=html; return d.textContent.trim();};
        const lines=[data.columns,...data.rows].map(row=>row.map(cell=>`"${strip(String(cell)).replace(/"/g,'""')}"`).join(';')).join('\n');
        downloadBlob(new Blob(['\ufeff'+lines],{type:'text/csv;charset=utf-8'}),`AutoMaster_${key}_${todayISO()}.csv`);
    }

    const options = arr => arr.map(x=>({value:x.id||x.vin||x.policy||x.code||x.name,label:x.name?`${x.name}${x.rut?' · '+x.rut:''}`:x.vin||x.policy||x.code}));
    const clientOptions = () => options(db.clients);
    const sellerOptions = () => options(db.sellers);
    const modelOptions = () => db.models.map(x=>({value:x.name,label:`${x.name} · ${money(x.price)}`}));
    const stockOptions = filter => db.stock.filter(filter||(()=>true)).map(x=>({value:x.vin,label:`${x.vin} · ${x.model} · ${x.status}`}));

    async function handleAction(module, action) {
        if (!canAccess(module)) {toast('No tienes permisos para este módulo.','bad'); return;}
        if (module==='finanzas' && action==='Abrir simulador de crédito') {openFinancing(); return;}
        if (module==='clientes') return clientAction(action);
        if (module==='vendedores') return sellerAction(action);
        if (module==='stock') return stockAction(action);
        if (module==='repuestos') return partsAction(action);
        if (module==='finanzas') return financeAction(action);
        if (module==='testdrive') return testDriveAction(action);
        if (module==='documentos') return documentsAction(action);
        if (module==='garantias') return warrantyAction(action);
        if (module==='modelos') return modelAction(action);
        if (module==='postventa') return postSaleAction(action);
    }

    function clientAction(action) {
        if (action==='Registrar nuevo cliente') openFormModal({title:action,eyebrow:'Clientes',fields:[
            {name:'rut',label:'RUT / ID',required:true,placeholder:'Ej. 18.345.678-9'},{name:'name',label:'Nombre completo',required:true},{name:'address',label:'Dirección',required:true},{name:'phone',label:'Teléfono',type:'tel',required:true},{name:'email',label:'Correo',type:'email',required:true},{name:'interest',label:'Interés principal',type:'select',options:modelOptions()},{name:'status',label:'Estado',type:'select',options:['Activo','Cotización','Seguimiento']},{name:'sellerId',label:'Vendedor asignado',type:'select',options:sellerOptions()}],onSubmit:d=>{if(db.clients.some(c=>c.rut===d.rut))throw new Error('Ya existe un cliente con ese RUT/ID.');db.clients.push({id:uid('CLI'),...d,quotes:[],purchases:[]});saveDB();toast('Cliente registrado.');}});
        else if(action==='Editar cliente') openFormModal({title:action,eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'phone',label:'Nuevo teléfono',type:'tel'},{name:'email',label:'Nuevo correo',type:'email'},{name:'address',label:'Nueva dirección'}],onSubmit:d=>{const c=getClient(d.clientId); if(d.phone)c.phone=d.phone;if(d.email)c.email=d.email;if(d.address)c.address=d.address;saveDB();toast('Cliente actualizado.');}});
        else if(action==='Crear cotización') openFormModal({title:action,eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true}],onSubmit:d=>{const c=getClient(d.clientId),m=getModel(d.model);c.quotes.push({id:uid('COT'),model:m.name,amount:m.price,status:'Abierta',date:todayISO()});c.status='Cotización';db.documents.push({id:uid('DOC'),type:'Cotización',clientId:c.id,date:todayISO(),status:'Generado',fileName:`Cotizacion_${c.name.replace(/\s+/g,'_')}.pdf`});saveDB();toast('Cotización creada.');}});
        else if(action==='Registrar interacción') openFormModal({title:action,eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'channel',label:'Canal',type:'select',options:['Teléfono','Correo','WhatsApp','Presencial']},{name:'note',label:'Detalle',type:'textarea',required:true}],onSubmit:d=>{db.interactions.push({id:uid('INT'),clientId:d.clientId,date:todayISO(),channel:d.channel,note:d.note});saveDB();toast('Interacción registrada.');}});
        else {openFormModal({title:'Historial de cliente',eyebrow:'Clientes',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],submitLabel:'Ver historial',onSubmit:d=>{const c=getClient(d.clientId), ints=db.interactions.filter(x=>x.clientId===c.id), docs=db.documents.filter(x=>x.clientId===c.id);openInfoModal(`Expediente: ${c.name}`,`<div class="detail-grid"><div><span>RUT/ID</span><strong>${esc(c.rut)}</strong></div><div><span>Correo</span><strong>${esc(c.email)}</strong></div><div><span>Teléfono</span><strong>${esc(c.phone)}</strong></div><div><span>Vendedor</span><strong>${esc(sellerName(c.sellerId))}</strong></div></div><div class="detail-block"><h3>Cotizaciones</h3><p>${(c.quotes||[]).map(q=>`${esc(q.id)} · ${esc(q.model)} · ${money(q.amount)} · ${esc(q.status)}`).join('<br>')||'Sin cotizaciones'}</p></div><div class="detail-block"><h3>Interacciones</h3><p>${ints.map(i=>`${esc(i.date)} · ${esc(i.channel)} · ${esc(i.note)}`).join('<br>')||'Sin interacciones'}</p></div><div class="detail-block"><h3>Documentos</h3><p>${docs.map(x=>`${esc(x.type)} · ${esc(x.status)}`).join('<br>')||'Sin documentos'}</p></div>`,'Historial comercial y operativo.','Expediente');return false;}});}
    }

    function sellerAction(action) {
        if(action==='Asignar cartera') openFormModal({title:action,eyebrow:'Vendedores',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true}],onSubmit:d=>{getClient(d.clientId).sellerId=d.sellerId;saveDB();toast('Cliente asignado a cartera.');}});
        else if(action==='Registrar oportunidad') openFormModal({title:action,eyebrow:'Vendedores',fields:[{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true},{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true},{name:'status',label:'Etapa',type:'select',options:['Contacto','Cotización','Negociación','Cierre']}],onSubmit:d=>{db.opportunities.push({id:uid('OP'),...d,amount:getModel(d.model)?.price||0});saveDB();toast('Oportunidad registrada.');}});
        else if(action==='Actualizar meta de venta') openFormModal({title:action,eyebrow:'Vendedores',fields:[{name:'sellerId',label:'Vendedor',type:'select',options:sellerOptions(),required:true},{name:'target',label:'Meta mensual (unidades)',type:'number',min:1,required:true}],onSubmit:d=>{getSeller(d.sellerId).target=Number(d.target);saveDB();toast('Meta actualizada.');}});
        else {const rows=db.sellers.map(s=>{const sales=db.sales.filter(x=>x.sellerId===s.id);const amount=sales.reduce((a,b)=>a+b.amount,0);return `<tr><td>${esc(s.name)}</td><td>${sales.length}</td><td>${money(amount)}</td><td>${money(amount*s.commissionRate/100)}</td></tr>`;}).join('');openInfoModal('Comisiones del mes',`<div class="table-wrap"><table class="module-table"><thead><tr><th>Vendedor</th><th>Ventas</th><th>Monto</th><th>Comisión</th></tr></thead><tbody>${rows}</tbody></table></div>`,'Cálculo demostrativo basado en las ventas registradas.','CRM Ventas');}
    }

    function stockAction(action) {
        if(action==='Ingresar vehículo') openFormModal({title:action,eyebrow:'Inventario',description:'Según el ERS entregado, el identificador VIN del prototipo se valida con 6 caracteres.',fields:[{name:'vin',label:'VIN / código (6 caracteres)',required:true,placeholder:'Ej. AB1234'},{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true},{name:'location',label:'Ubicación',type:'select',options:['Sucursal Centro','Patio Norte','En traslado']},{name:'color',label:'Color',required:true},{name:'year',label:'Año modelo',type:'number',min:2020,max:2035,value:2026,required:true},{name:'status',label:'Estado',type:'select',options:['Disponible','Reservado','En tránsito','Vendido']},{name:'demo',label:'Unidad demo',type:'select',options:[{value:'false',label:'No'},{value:'true',label:'Sí'}]}],onSubmit:d=>{d.vin=d.vin.toUpperCase().trim();if(!/^[A-Z0-9]{6}$/.test(d.vin))throw new Error('El código debe tener 6 caracteres alfanuméricos según el ERS.');if(db.stock.some(x=>x.vin===d.vin))throw new Error('El VIN/código ya está registrado.');db.stock.push({...d,year:Number(d.year),demo:d.demo==='true'});saveDB();toast('Vehículo ingresado al inventario.');}});
        else if(action==='Cambiar estado') openFormModal({title:action,eyebrow:'Inventario',fields:[{name:'vin',label:'Vehículo',type:'select',options:stockOptions(),required:true},{name:'status',label:'Nuevo estado',type:'select',options:['Disponible','Reservado','En tránsito','Vendido'],required:true},{name:'location',label:'Ubicación',type:'select',options:['Sucursal Centro','Patio Norte','En traslado']}],onSubmit:d=>{const s=getStock(d.vin);s.status=d.status;s.location=d.location;saveDB();toast('Estado actualizado.');}});
        else if(action==='Registrar reserva') openFormModal({title:action,eyebrow:'Inventario',fields:[{name:'vin',label:'Vehículo disponible',type:'select',options:stockOptions(x=>x.status==='Disponible'),required:true},{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],onSubmit:d=>{const s=getStock(d.vin);s.status='Reservado';s.reservedFor=d.clientId;saveDB();toast(`Reserva registrada para ${clientName(d.clientId)}.`);}});
        else openFormModal({title:'Buscar por VIN',eyebrow:'Inventario',fields:[{name:'vin',label:'VIN / código',required:true}],submitLabel:'Buscar',onSubmit:d=>{const s=getStock(d.vin.toUpperCase().trim());if(!s)throw new Error('No se encontró un vehículo con ese código.');openInfoModal(`Vehículo ${s.vin}`,`<div class="detail-grid"><div><span>Modelo</span><strong>${esc(s.model)}</strong></div><div><span>Estado</span><strong>${esc(s.status)}</strong></div><div><span>Ubicación</span><strong>${esc(s.location)}</strong></div><div><span>Color / Año</span><strong>${esc(s.color)} / ${s.year}</strong></div></div>`,'Resultado de búsqueda de inventario.','Stock');return false;}});
    }

    function partsAction(action) {
        if(action==='Registrar repuesto') openFormModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Código',required:true},{name:'name',label:'Nombre del repuesto',required:true},{name:'compatibility',label:'Modelo compatible',type:'select',options:modelOptions(),required:true},{name:'stock',label:'Stock inicial',type:'number',min:0,required:true},{name:'minStock',label:'Stock mínimo',type:'number',min:0,required:true}],onSubmit:d=>{if(db.parts.some(x=>x.code===d.code))throw new Error('Ese código ya existe.');db.parts.push({...d,stock:Number(d.stock),minStock:Number(d.minStock)});saveDB();toast('Repuesto registrado.');}});
        else if(action==='Crear pedido a fábrica') openFormModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Repuesto',type:'select',options:db.parts.map(x=>({value:x.code,label:`${x.code} · ${x.name}`})),required:true},{name:'qty',label:'Cantidad',type:'number',min:1,required:true}],onSubmit:d=>{db.partOrders.push({id:uid('PED'),code:d.code,qty:Number(d.qty),status:'Solicitado',date:todayISO()});saveDB();toast('Pedido a fábrica creado.');}});
        else if(action==='Ajustar inventario') openFormModal({title:action,eyebrow:'Repuestos',fields:[{name:'code',label:'Repuesto',type:'select',options:db.parts.map(x=>({value:x.code,label:`${x.code} · ${x.name}`})),required:true},{name:'stock',label:'Nuevo stock',type:'number',min:0,required:true}],onSubmit:d=>{db.parts.find(x=>x.code===d.code).stock=Number(d.stock);saveDB();toast('Inventario ajustado.');}});
        else openFormModal({title:'Consultar compatibilidad',eyebrow:'Repuestos',fields:[{name:'model',label:'Modelo',type:'select',options:modelOptions(),required:true}],submitLabel:'Consultar',onSubmit:d=>{const list=db.parts.filter(x=>x.compatibility===d.model);openInfoModal(`Repuestos para ${d.model}`,`<p>${list.length?list.map(x=>`${esc(x.code)} · ${esc(x.name)} · stock ${x.stock}`).join('<br>'):'No hay repuestos registrados para este modelo.'}</p>`,'Compatibilidad registrada en el catálogo de repuestos.','Repuestos');return false;}});
    }

    function financeAction(action) {
        if(action==='Vincular simulación web') {
            const webSimulations = db.finance.filter(x => x.origin === 'Simulación web' && !x.clientId);
            if (!webSimulations.length) {
                toast('No hay simulaciones web pendientes de vincular.','bad');
                return;
            }
            openFormModal({
                title:action,
                eyebrow:'Financiamiento',
                description:'Asocia una simulación realizada en la página pública con un cliente registrado para continuar su evaluación.',
                fields:[
                    {name:'financeId',label:'Simulación web',type:'select',options:webSimulations.map(x=>({value:x.id,label:`${x.id} · ${x.model || 'Vehículo'} · ${money(x.amount)} · ${x.installments} cuotas`})),required:true},
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
                    saveDB();
                    toast(`Simulación ${fin.id} vinculada a ${clientName(d.clientId)}.`);
                }
            });
        }
        else if(action==='Crear solicitud bancaria') openFormModal({title:action,eyebrow:'Financiamiento',description:'Tasa mensual fija: 2,79% · VFG fijo: 20%. La evaluación de riesgo es demostrativa y usa relación cuota/ingreso.',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vehicleValue',label:'Valor del vehículo',type:'number',min:1000000,required:true},{name:'installments',label:'Cuotas',type:'select',options:[12,24,36,48,60,72].map(String),value:'48'},{name:'income',label:'Ingreso mensual cliente',type:'number',min:1,required:true},{name:'debts',label:'Otros compromisos mensuales',type:'number',min:0,value:'0',required:true}],onSubmit:d=>{const value=Number(d.vehicleValue), result=calcCredit({value,installments:Number(d.installments),monthlyRate:2.79,vfgPct:20});const ratio=(result.monthlyPayment+Number(d.debts))/Number(d.income);const risk=ratio<=0.30?'Bajo':ratio<=0.45?'Medio':'Alto';db.finance.push({id:uid('FIN'),clientId:d.clientId,origin:'Solicitud interna',model:db.models.find(m=>Number(m.price)===value)?.name||'Valor ingresado manualmente',vehicleValue:value,amount:result.principal,installments:Number(d.installments),monthlyRate:2.79,vfg:20,risk,status:risk==='Alto'?'Evaluación':'Preaprobada',attachments:[]});saveDB();toast(`Solicitud creada. Riesgo: ${risk}.`);}});
        else if(action==='Adjuntar antecedentes') openFormModal({title:action,eyebrow:'Financiamiento',fields:[{name:'financeId',label:'Solicitud',type:'select',options:db.finance.map(x=>({value:x.id,label:`${x.id} · ${x.clientId ? clientName(x.clientId) : 'Cliente web'}`})),required:true},{name:'file',label:'Archivo de antecedente',type:'file',required:true}],onSubmit:(d,fd,form)=>{const f=form.querySelector('[name=file]').files[0];if(!f)throw new Error('Selecciona un archivo.');const fin=db.finance.find(x=>x.id===d.financeId);fin.attachments=fin.attachments||[];fin.attachments.push({name:f.name,date:todayISO()});saveDB();toast('Antecedente adjuntado al expediente.');}});
        else openFormModal({title:'Actualizar estado',eyebrow:'Financiamiento',fields:[{name:'financeId',label:'Solicitud',type:'select',options:db.finance.map(x=>({value:x.id,label:`${x.id} · ${x.clientId ? clientName(x.clientId) : 'Cliente web'}`})),required:true},{name:'status',label:'Estado',type:'select',options:['Simulación web','Evaluación','Preaprobada','Aprobada','Rechazada','Enviada'],required:true}],onSubmit:d=>{db.finance.find(x=>x.id===d.financeId).status=d.status;saveDB();toast('Estado de solicitud actualizado.');}});
    }

    function testDriveAction(action) {
        if(action==='Agendar test drive') openFormModal({title:action,eyebrow:'Test Drive',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'date',label:'Fecha y hora',type:'datetime-local',required:true},{name:'vin',label:'Vehículo demo',type:'select',options:stockOptions(x=>x.demo && x.status!=='Vendido'),required:true}],onSubmit:d=>{const c=getClient(d.clientId),s=getStock(d.vin);if(!c.licenseExpiry || c.licenseExpiry < d.date.slice(0,10))throw new Error('La licencia del cliente no está vigente para la fecha seleccionada.');if(db.testdrives.some(x=>x.vin===d.vin && x.date===d.date && x.status!=='Cancelado'))throw new Error('Ese vehículo demo ya está reservado en ese horario.');db.testdrives.push({id:uid('TD'),clientId:d.clientId,date:d.date,model:s.model,vin:s.vin,status:'Confirmado'});addNotification('Test drive agendado',`${c.name} · ${s.model} · ${d.date.replace('T',' ')}`);saveDB();toast('Test drive agendado.');}});
        else if(action==='Asignar vehículo demo') openFormModal({title:action,eyebrow:'Test Drive',fields:[{name:'tdId',label:'Cita',type:'select',options:db.testdrives.map(x=>({value:x.id,label:`${x.id} · ${clientName(x.clientId)} · ${x.date.replace('T',' ')}`})),required:true},{name:'vin',label:'Vehículo demo',type:'select',options:stockOptions(x=>x.demo && x.status!=='Vendido'),required:true}],onSubmit:d=>{const td=db.testdrives.find(x=>x.id===d.tdId),s=getStock(d.vin);td.vin=s.vin;td.model=s.model;saveDB();toast('Vehículo demo asignado.');}});
        else if(action==='Registrar licencia') openFormModal({title:action,eyebrow:'Test Drive',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'licenseExpiry',label:'Vencimiento licencia',type:'date',required:true}],onSubmit:d=>{getClient(d.clientId).licenseExpiry=d.licenseExpiry;saveDB();toast('Licencia registrada.');}});
        else openFormModal({title:'Reprogramar cita',eyebrow:'Test Drive',fields:[{name:'tdId',label:'Cita',type:'select',options:db.testdrives.map(x=>({value:x.id,label:`${x.id} · ${clientName(x.clientId)} · ${x.date.replace('T',' ')}`})),required:true},{name:'date',label:'Nueva fecha y hora',type:'datetime-local',required:true}],onSubmit:d=>{const td=db.testdrives.find(x=>x.id===d.tdId);if(db.testdrives.some(x=>x.id!==td.id && x.vin===td.vin && x.date===d.date))throw new Error('El vehículo ya tiene una cita en ese horario.');td.date=d.date;saveDB();toast('Test drive reprogramado.');}});
    }

    function documentsAction(action) {
        if(action==='Generar contrato') openFormModal({title:action,eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vin',label:'Vehículo',type:'select',options:stockOptions(x=>x.status!=='Vendido'),required:true},{name:'type',label:'Documento',type:'select',options:['Contrato compraventa','Orden de pedido','Carta de resguardo','Pagaré']}],submitLabel:'Generar documento',onSubmit:d=>{const c=getClient(d.clientId),s=getStock(d.vin),m=getModel(s.model);const doc={id:uid('DOC'),type:d.type,clientId:c.id,date:todayISO(),status:'Pendiente firma',fileName:`${d.type.replace(/\s+/g,'_')}_${c.name.replace(/\s+/g,'_')}.pdf`};db.documents.push(doc);saveDB();printDocument(doc,c,s,m);toast('Documento generado. Usa “Guardar como PDF” en la impresión.');}});
        else if(action==='Subir archivo') openFormModal({title:action,eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'type',label:'Tipo',type:'select',options:['Cédula identidad','Licencia conducir','Comprobante domicilio','Otro']},{name:'file',label:'Archivo',type:'file',required:true}],onSubmit:(d,fd,form)=>{const f=form.querySelector('[name=file]').files[0];if(!f)throw new Error('Selecciona un archivo.');db.documents.push({id:uid('DOC'),type:d.type,clientId:d.clientId,date:todayISO(),status:'Recibido',fileName:f.name});saveDB();toast('Archivo asociado al expediente.');}});
        else if(action==='Solicitar firma') openFormModal({title:action,eyebrow:'Documentos',fields:[{name:'docId',label:'Documento',type:'select',options:db.documents.map(x=>({value:x.id,label:`${x.id} · ${x.type} · ${clientName(x.clientId)}`})),required:true}],onSubmit:d=>{db.documents.find(x=>x.id===d.docId).status='Pendiente firma';addNotification('Firma pendiente',`Documento ${d.docId} requiere firma.`);saveDB();toast('Solicitud de firma registrada.');}});
        else openFormModal({title:'Consultar expediente',eyebrow:'Documentos',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true}],submitLabel:'Consultar',onSubmit:d=>{const docs=db.documents.filter(x=>x.clientId===d.clientId);openInfoModal(`Expediente de ${clientName(d.clientId)}`,`<div class="table-wrap"><table class="module-table"><thead><tr><th>ID</th><th>Documento</th><th>Archivo</th><th>Estado</th></tr></thead><tbody>${docs.map(x=>`<tr><td>${esc(x.id)}</td><td>${esc(x.type)}</td><td>${esc(x.fileName)}</td><td>${esc(x.status)}</td></tr>`).join('')}</tbody></table></div>`,'Documentación asociada al cliente.','Expediente');return false;}});
    }

    function warrantyAction(action) {
        if(action==='Registrar garantía') openFormModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'N° póliza',required:true},{name:'vin',label:'VIN',type:'select',options:stockOptions(),required:true},{name:'coverage',label:'Cobertura',required:true,value:'Fábrica 3 años'},{name:'expiry',label:'Fecha vencimiento',type:'date',required:true},{name:'mileageLimit',label:'Kilometraje máximo',type:'number',min:1,value:'100000',required:true}],onSubmit:d=>{if(db.warranties.some(x=>x.policy===d.policy))throw new Error('La póliza ya existe.');db.warranties.push({...d,mileageLimit:Number(d.mileageLimit),status:'Activa',claim:''});saveDB();toast('Garantía registrada.');}});
        else if(action==='Validar cobertura') openFormModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:`${x.policy} · ${getStock(x.vin)?.model||x.vin}`})),required:true},{name:'mileage',label:'Kilometraje actual',type:'number',min:0,required:true}],submitLabel:'Validar',onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);const validDate=w.expiry>=todayISO(),validKm=Number(d.mileage)<=w.mileageLimit;openInfoModal('Resultado de cobertura',`<div class="coverage-result ${validDate&&validKm?'coverage-ok':'coverage-bad'}"><strong>${validDate&&validKm?'COBERTURA VIGENTE':'FUERA DE COBERTURA'}</strong><p>Fecha: ${validDate?'vigente':'vencida'} · Kilometraje: ${validKm?'dentro del límite':'sobre el límite'}</p></div>`,'Validación por fecha y kilometraje.','Garantías');return false;}});
        else if(action==='Crear reclamo') openFormModal({title:action,eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:x.policy})),required:true},{name:'claim',label:'Descripción del reclamo',type:'textarea',required:true}],onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);w.status='Reclamo abierto';w.claim=d.claim;saveDB();toast('Reclamo de garantía abierto.');}});
        else openFormModal({title:'Extender garantía',eyebrow:'Garantías',fields:[{name:'policy',label:'Póliza',type:'select',options:db.warranties.map(x=>({value:x.policy,label:x.policy})),required:true},{name:'expiry',label:'Nueva fecha de vencimiento',type:'date',required:true},{name:'coverage',label:'Nueva cobertura',value:'Extensión 2 años',required:true}],onSubmit:d=>{const w=db.warranties.find(x=>x.policy===d.policy);w.expiry=d.expiry;w.coverage=d.coverage;w.status='Activa';saveDB();toast('Garantía extendida.');}});
    }

    function modelAction(action) {
        if(action==='Crear modelo') openFormModal({title:action,eyebrow:'Catálogo',fields:[{name:'name',label:'Nombre del modelo',required:true},{name:'category',label:'Categoría',type:'select',options:[{value:'auto',label:'Auto'},{value:'suv',label:'SUV / Camioneta'},{value:'moto',label:'Moto'}]},{name:'tag',label:'Etiqueta',required:true},{name:'version',label:'Versión',required:true},{name:'price',label:'Precio',type:'number',min:1,required:true},{name:'motor',label:'Motor / cilindrada',required:true},{name:'power',label:'Potencia',required:true},{name:'transmission',label:'Transmisión',required:true},{name:'fuel',label:'Combustible / energía',required:true},{name:'capacity',label:'Capacidad / plazas',required:true},{name:'warranty',label:'Garantía',required:true},{name:'equipment',label:'Equipamiento',type:'textarea',required:true},{name:'image',label:'URL de imagen',required:true}],onSubmit:d=>{const specs={'Motor':d.motor,'Potencia':d.power,'Transmisión':d.transmission,'Combustible / energía':d.fuel,'Capacidad':d.capacity,'Garantía':d.warranty};db.models.push({name:d.name,category:d.category,tag:d.tag,version:d.version,price:Number(d.price),equipment:d.equipment,image:d.image,id:uid('MOD'),specs});saveDB();toast('Modelo agregado al catálogo.');}});
        else if(action==='Actualizar precio') openFormModal({title:action,eyebrow:'Catálogo',fields:[{name:'modelId',label:'Modelo',type:'select',options:db.models.map(x=>({value:x.id,label:x.name})),required:true},{name:'price',label:'Nuevo precio',type:'number',min:1,required:true}],onSubmit:d=>{db.models.find(x=>x.id===d.modelId).price=Number(d.price);saveDB();toast('Precio actualizado en catálogo público e interno.');}});
        else openFormModal({title:action,eyebrow:'Catálogo',fields:[{name:'modelId',label:'Modelo',type:'select',options:db.models.map(x=>({value:x.id,label:x.name})),required:true},{name:'version',label:'Versión / motorización',required:true},{name:'motor',label:'Motor / cilindrada',required:true},{name:'power',label:'Potencia',required:true},{name:'transmission',label:'Transmisión',required:true},{name:'equipment',label:'Equipamiento',type:'textarea',required:true}],onSubmit:d=>{const m=db.models.find(x=>x.id===d.modelId);m.version=d.version;m.equipment=d.equipment;m.specs={...(m.specs||{}),'Motor':d.motor,'Potencia':d.power,'Transmisión':d.transmission};saveDB();toast('Ficha técnica actualizada.');}});
    }

    function postSaleAction(action) {
        if(action==='Crear orden de trabajo' || action==='Registrar recepción' || action==='Programar mantención') openFormModal({title:action,eyebrow:'Postventa',fields:[{name:'clientId',label:'Cliente',type:'select',options:clientOptions(),required:true},{name:'vin',label:'Vehículo',type:'select',options:stockOptions(),required:true},{name:'job',label:'Trabajo / motivo',required:true},{name:'parts',label:'Repuestos previstos',required:false},{name:'labourHours',label:'Horas estimadas',type:'number',step:'0.5',min:'0',value:'1'},{name:'date',label:'Fecha',type:'date',value:todayISO(),required:true}],onSubmit:d=>{const s=getStock(d.vin);db.workorders.push({id:uid('OT'),clientId:d.clientId,vin:d.vin,vehicle:s.model,job:d.job,parts:d.parts,labourHours:Number(d.labourHours),date:d.date,status:action==='Programar mantención'?'Agendada':'Recepcionado'});addNotification('Orden de trabajo',`${clientName(d.clientId)} · ${s.model} · ${d.job}`);saveDB();toast('Orden de trabajo registrada.');}});
        else openFormModal({title:'Actualizar reparación',eyebrow:'Postventa',fields:[{name:'otId',label:'Orden de trabajo',type:'select',options:db.workorders.map(x=>({value:x.id,label:`${x.id} · ${x.vehicle} · ${x.job}`})),required:true},{name:'status',label:'Estado',type:'select',options:['Recepcionado','En proceso','Esperando repuesto','Listo entrega','Cerrada'],required:true},{name:'labourHours',label:'Horas reales',type:'number',step:'0.5',min:'0',required:true}],onSubmit:d=>{const ot=db.workorders.find(x=>x.id===d.otId);ot.status=d.status;ot.labourHours=Number(d.labourHours);if(d.status==='Listo entrega')addNotification('Vehículo listo para retiro',`${ot.id} · ${clientName(ot.clientId)} · ${ot.vehicle}`);saveDB();toast('Estado de reparación actualizado.');}});
    }

    function printDocument(doc, client, stock, model) {
        const w=window.open('','_blank','width=900,height=700');
        if(!w){toast('El navegador bloqueó la ventana de impresión.','bad');return;}
        w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(doc.type)}</title><style>body{font-family:Arial;padding:45px;color:#222}h1{color:#d32f2f}.box{border:1px solid #ddd;padding:18px;margin:16px 0}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #eee}.sign{margin-top:70px;display:flex;justify-content:space-between}.line{width:40%;border-top:1px solid #333;padding-top:8px;text-align:center}</style></head><body><h1>AutoMaster</h1><h2>${esc(doc.type)}</h2><p>Documento: ${esc(doc.id)} · Fecha: ${esc(doc.date)}</p><div class="box"><h3>Cliente</h3><table><tr><td>Nombre</td><td>${esc(client.name)}</td></tr><tr><td>RUT/ID</td><td>${esc(client.rut)}</td></tr><tr><td>Correo</td><td>${esc(client.email)}</td></tr></table></div><div class="box"><h3>Vehículo</h3><table><tr><td>Modelo</td><td>${esc(stock.model)}</td></tr><tr><td>VIN</td><td>${esc(stock.vin)}</td></tr><tr><td>Versión</td><td>${esc(model?.version||'')}</td></tr><tr><td>Precio lista</td><td>${money(model?.price||0)}</td></tr></table></div><p>Documento generado por el prototipo AutoMaster. Revise los antecedentes antes de firmar.</p><div class="sign"><div class="line">Cliente</div><div class="line">AutoMaster</div></div><script>window.onload=()=>window.print()<\/script></body></html>`);
        w.document.close();
    }

    // ------------------------------------------------------------------
    // Respaldos, notificaciones y fiabilidad demostrativa
    // ------------------------------------------------------------------
    function downloadBlob(blob, filename) {
        const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    }
    function addNotification(title,message){db.notifications.unshift({id:uid('NOT'),date:new Date().toISOString().slice(0,16),title,message,read:false});}
    function updateNotificationCount(){const n=db.notifications.filter(x=>!x.read).length;$('#notification-count').textContent=n;}
    $('#btn-notificaciones')?.addEventListener('click',()=>{const items=db.notifications.length?db.notifications.map(n=>`<div class="notification-item ${n.read?'':'unread'}"><strong>${esc(n.title)}</strong><span>${esc(n.date.replace('T',' '))}</span><p>${esc(n.message)}</p></div>`).join(''):'<p>No hay notificaciones.</p>';openInfoModal('Centro de notificaciones',`${items}<div class="modal-actions"><button class="btn btn-secondary" id="mark-read">Marcar todas como leídas</button></div>`,'Avisos internos generados por test drive, documentos y postventa.','Notificaciones');$('#mark-read')?.addEventListener('click',()=>{db.notifications.forEach(n=>n.read=true);saveDB();closeAppModal();toast('Notificaciones marcadas como leídas.');});});
    $('#btn-exportar-respaldo')?.addEventListener('click',()=>downloadBlob(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),`AutoMaster_respaldo_${todayISO()}.json`));
    $('#btn-importar-respaldo')?.addEventListener('click',()=>$('#backup-file').click());
    $('#backup-file')?.addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed.clients||!parsed.stock)throw new Error();db=parsed;saveDB();toast('Respaldo restaurado.');}catch{toast('El respaldo no tiene un formato válido.','bad');}};reader.readAsText(file);event.target.value='';});
    $('#btn-reset-demo')?.addEventListener('click',()=>{if(confirm('¿Restablecer todos los datos de demostración?')){db=seedDB();saveDB();toast('Datos demo restablecidos.');}});

    // ------------------------------------------------------------------
    // Contacto público
    // ------------------------------------------------------------------
    $('#formulario-cliente').addEventListener('submit',event=>{
        event.preventDefault();
        const name=$('#nombre').value.trim(), email=$('#email').value.trim(), phone=$('#telefono').value.trim(), reason=$('#tipo-solicitud').value;
        $('#error-nombre').classList.add('oculto');$('#error-email').classList.add('oculto');
        let valid=true;
        if(name.length<3){$('#error-nombre').textContent='Ingresa un nombre válido.';$('#error-nombre').classList.remove('oculto');valid=false;}
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){$('#error-email').textContent='Ingresa un correo válido.';$('#error-email').classList.remove('oculto');valid=false;}
        if(!valid)return;
        addNotification('Nueva solicitud pública',`${name} · ${reason}${$('#tipo-solicitud').dataset.model?' · '+$('#tipo-solicitud').dataset.model:''}`);
        saveDB();
        $('#mensaje-exito').classList.remove('oculto');
        event.currentTarget.reset();delete $('#tipo-solicitud').dataset.model;
    });

    // ------------------------------------------------------------------
    // Resumen público sincronizado
    // ------------------------------------------------------------------
    function renderSummary(){
        $('#stat-disponibles').textContent=db.stock.filter(x=>x.status==='Disponible').length;
        $('#stat-cotizaciones').textContent=db.clients.flatMap(c=>c.quotes||[]).filter(q=>q.status==='Abierta').length;
        $('#stat-testdrive').textContent=db.testdrives.filter(x=>x.status!=='Cancelado').length;
        $('#stat-ot').textContent=db.workorders.filter(x=>!['Cerrada','Listo entrega'].includes(x.status)).length;
    }

    // Restaurar la sesión solo cuando todas las definiciones del dashboard ya existen.
    try {
        const rawSession = sessionStorage.getItem(SESSION_KEY);
        applySession(rawSession ? JSON.parse(rawSession) : null);
    } catch {
        applySession(null);
    }

    renderSummary();
    renderPublicCatalog();
    updateNotificationCount();
    updateFinancePreview();
