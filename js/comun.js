'use strict';

/*
 * ================================================================
 * FUNCIONES Y DATOS COMPARTIDOS
 * ================================================================
 * Funciones básicas, almacenamiento, datos iniciales, navegación,
 * modales y mensajes utilizados por varias páginas.
 *
 * Archivo separado para mantener AutoMaster más ordenado y fácil
 * de estudiar.
 */

/*
     * VERSIÓN CON FUNCIONES MÁS SIMPLES
     * ----------------------------------
     * La lógica es la misma que en el archivo original, pero las funciones
     * principales usan nombres más descriptivos y una sintaxis clásica:
     *
     * function nombreFuncion(parametro) {
     *     // instrucciones
     *     return resultado;
     * }
     *
     * Esto se parece más a la forma de trabajar que normalmente se enseña
     * al comenzar con Java, aunque este archivo sigue siendo JavaScript.
     */


    // ================================================================
    // FUNCIONES BÁSICAS DE APOYO
    // ================================================================

    function obtenerElemento(selector, raiz) {
        if (raiz == null) {
            raiz = document;
        }
        return raiz.querySelector(selector);
    }

    function obtenerElementos(selector, raiz) {
        if (raiz == null) {
            raiz = document;
        }
        return Array.from(raiz.querySelectorAll(selector));
    }

    function formatearDinero(valor) {
        var numero = Number(valor);
        if (isNaN(numero)) {
            numero = 0;
        }
        return '$' + Math.round(numero).toLocaleString('es-CL');
    }

    function escaparHTML(valor) {
        var texto = String(valor == null ? '' : valor);
        var reemplazos = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };

        return texto.replace(/[&<>'"]/g, function(caracter) {
            return reemplazos[caracter];
        });
    }

    function convertirFechaLocal(fecha) {
        var d;
        if (fecha instanceof Date) {
            d = fecha;
        } else {
            d = new Date(fecha);
        }

        var diferencia = d.getTimezoneOffset() * 60000;
        var fechaLocal = new Date(d.getTime() - diferencia);
        return fechaLocal.toISOString().slice(0, 10);
    }

    function obtenerFechaHoy() {
        return convertirFechaLocal(new Date());
    }

    function obtenerFechaHoraLocal() {
        var d = new Date();
        var diferencia = d.getTimezoneOffset() * 60000;
        var fechaLocal = new Date(d.getTime() - diferencia);
        return fechaLocal.toISOString().slice(0, 16);
    }

    function crearCodigo(prefijo) {
        var parteFecha = Date.now().toString(36).toUpperCase();
        var parteAleatoria = Math.random().toString(36).slice(2, 5).toUpperCase();
        return prefijo + '-' + parteFecha + parteAleatoria;
    }

    const DATA_KEY = 'automaster_ers_db_v1';
    const SESSION_KEY = 'automaster_ers_session_v1';
    const DEMO_PASSWORD = 'AutoMaster2026!';

    function leerStorage(nombreStorage, clave) {
        try {
            return window[nombreStorage].getItem(clave);
        } catch (error) {
            return null;
        }
    }

    function guardarStorage(nombreStorage, clave, valor) {
        try {
            window[nombreStorage].setItem(clave, valor);
            return true;
        } catch (error) {
            return false;
        }
    }

    function eliminarStorage(nombreStorage, clave) {
        try {
            window[nombreStorage].removeItem(clave);
        } catch (error) {
            // El programa puede seguir funcionando aunque el navegador bloquee el storage.
        }
    }

    const MODEL_IMAGES = {
        x500: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_X3_%28G01%29_Washington_DC_Metro_Area%2C_USA.jpg?width=1200',
        sedan: 'https://commons.wikimedia.org/wiki/Special:FilePath/TOYOTA_COROLLA_SEDAN_HYBRID_%28E210%29_China_%286%29.jpg?width=1200',
        city: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kia_Rio_%28front%29.jpg?width=1200',
        pickup: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mitsubishi_L200_%2850017014592%29.jpg?width=1200',
        cross: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Corolla_Cross_Hybrid_%28XG10%29.jpg?width=1200',
        sport: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_i30_N_1.jpg?width=1200',
        moto1: 'https://commons.wikimedia.org/wiki/Special:FilePath/Suzuki_Gixxer_SF_250_FFV.jpg?width=1200',
        moto2: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Honda_CB500X.jpg?width=1200',
        moto3: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yamaha_YZF_R6.jpg?width=1200',
        moto4: 'https://commons.wikimedia.org/wiki/Special:FilePath/2007_Boulevard_m50.jpg?width=1200'
    };

    const MODEL_DETAILS = {
        'MOD-001': {
            pdf:'fichas/AutoMaster_SUV_X500.pdf',
            specs:{
                'Carrocería':'SUV 5 puertas','Motor':'2.0 Turbo gasolina','Potencia':'184 HP','Torque':'300 Nm',
                'Transmisión':'Automática 8 velocidades','Tracción':'AWD inteligente','Consumo mixto':'12,8 km/l',
                'Capacidad':'5 pasajeros','Maletero':'550 litros','Seguridad':'6 airbags, ABS, ESP, ADAS, cámara 360°',
                'Conectividad':'Pantalla 12,3”, Apple CarPlay y Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-002': {
            pdf:'fichas/AutoMaster_Sedan_Exec.pdf',
            specs:{
                'Carrocería':'Sedán 4 puertas','Motor':'1.8 Hybrid','Potencia combinada':'122 HP','Torque':'142 Nm',
                'Transmisión':'Automática e-CVT','Tracción':'Delantera','Consumo mixto':'21,4 km/l',
                'Capacidad':'5 pasajeros','Maletero':'475 litros','Seguridad':'6 airbags, frenado autónomo, alerta de carril',
                'Conectividad':'Pantalla 10”, Bluetooth, CarPlay/Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-003': {
            pdf:'fichas/AutoMaster_City_C200.pdf',
            specs:{
                'Carrocería':'Hatchback 5 puertas','Motor':'1.4 MPI gasolina','Potencia':'100 HP','Torque':'133 Nm',
                'Transmisión':'Manual 6 velocidades','Tracción':'Delantera','Consumo mixto':'17,5 km/l',
                'Capacidad':'5 pasajeros','Maletero':'325 litros','Seguridad':'6 airbags, ABS, control de estabilidad',
                'Conectividad':'Pantalla 8”, CarPlay/Android Auto','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-004': {
            pdf:'fichas/AutoMaster_PickUp_T900.pdf',
            specs:{
                'Carrocería':'PickUp doble cabina','Motor':'2.4 Turbo Diesel','Potencia':'205 HP','Torque':'470 Nm',
                'Transmisión':'Automática 6 velocidades','Tracción':'4x4 con reductora','Consumo mixto':'11,2 km/l',
                'Capacidad':'5 pasajeros','Carga útil':'1.000 kg','Seguridad':'7 airbags, control descenso, cámara reversa',
                'Capacidad de remolque':'3.200 kg','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-005': {
            pdf:'fichas/AutoMaster_Cross_H700.pdf',
            specs:{
                'Carrocería':'Crossover 5 puertas','Motor':'1.8 Hybrid','Potencia combinada':'122 HP','Torque':'142 Nm',
                'Transmisión':'Automática e-CVT','Tracción':'Delantera','Consumo mixto':'20 km/l',
                'Capacidad':'5 pasajeros','Maletero':'436 litros','Seguridad':'7 airbags, ADAS, cámara 360°',
                'Confort':'Techo panorámico, climatizador bizona','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-006': {
            pdf:'fichas/AutoMaster_Sport_R8.pdf',
            specs:{
                'Carrocería':'Coupé deportivo','Motor':'2.0 T-GDi turbo gasolina','Potencia':'280 HP','Torque':'392 Nm',
                'Transmisión':'DCT 8 velocidades','Tracción':'Delantera con diferencial electrónico','0-100 km/h':'5,4 s',
                'Capacidad':'5 pasajeros','Frenos':'Discos ventilados de alto desempeño','Seguridad':'8 airbags, ESP Sport, control de tracción',
                'Modos de manejo':'Eco, Normal, Sport y Track','Garantía':'3 años o 100.000 km'
            }
        },
        'MOD-007': {
            pdf:'fichas/AutoMaster_Moto_Street_250.pdf',
            specs:{
                'Tipo':'Naked / Street','Motor':'Monocilíndrico 249 cc','Potencia':'26,5 HP','Torque':'22,2 Nm',
                'Transmisión':'Manual 6 velocidades','Refrigeración':'Aceite','Estanque':'12 litros','Peso en orden de marcha':'156 kg',
                'Altura de asiento':'800 mm','Frenos':'Disco delantero y trasero con ABS','Iluminación':'Full LED','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-008': {
            pdf:'fichas/AutoMaster_Moto_Adventure_500.pdf',
            specs:{
                'Tipo':'Adventure / Touring','Motor':'Bicilíndrico 471 cc','Potencia':'47 HP','Torque':'43 Nm',
                'Transmisión':'Manual 6 velocidades','Refrigeración':'Líquida','Estanque':'17,7 litros','Peso en orden de marcha':'199 kg',
                'Altura de asiento':'830 mm','Frenos':'ABS doble canal','Equipamiento touring':'Parabrisas, cubremanos y maletas laterales','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-009': {
            pdf:'fichas/AutoMaster_Moto_Sport_600.pdf',
            specs:{
                'Tipo':'Sport','Motor':'4 cilindros 599 cc','Potencia':'118 HP','Torque':'61,7 Nm',
                'Transmisión':'Manual 6 velocidades con quickshifter','Refrigeración':'Líquida','Estanque':'17 litros','Peso en orden de marcha':'190 kg',
                'Altura de asiento':'850 mm','Frenos':'Doble disco delantero con ABS','Electrónica':'Control de tracción y modos de manejo','Garantía':'2 años o 30.000 km'
            }
        },
        'MOD-010': {
            pdf:'fichas/AutoMaster_Moto_Cruiser_800.pdf',
            specs:{
                'Tipo':'Cruiser','Motor':'V-Twin 805 cc','Potencia':'53 HP','Torque':'69 Nm',
                'Transmisión':'Manual 5 velocidades','Refrigeración':'Líquida','Estanque':'15,5 litros','Peso en orden de marcha':'269 kg',
                'Altura de asiento':'700 mm','Frenos':'ABS doble canal','Confort':'Control crucero y tablero digital','Garantía':'2 años o 30.000 km'
            }
        }
    };


    // ================================================================
    // MIGRACIÓN DE NOMBRES DEL CATÁLOGO
    // ================================================================
    const NOMBRES_MODELOS_ANTIGUOS = {
        'AutoMaster SUV X500':'BMW X3 xDrive20i',
        'AutoMaster Sedan Exec':'Toyota Corolla Hybrid',
        'AutoMaster City C200':'Kia Rio 1.4',
        'AutoMaster PickUp T900':'Mitsubishi L200 2.4 DI-D',
        'AutoMaster Cross H700':'Toyota Corolla Cross Hybrid',
        'AutoMaster Sport R8':'Hyundai i30 N',
        'AutoMaster Moto Street 250':'Suzuki Gixxer 250',
        'AutoMaster Moto Adventure 500':'Honda CB500X',
        'AutoMaster Moto Sport 600':'Yamaha YZF-R6',
        'AutoMaster Moto Cruiser 800':'Suzuki Boulevard M50'
    };

    const CATALOGO_ACTUAL = {
        'MOD-001': {name:'BMW X3 xDrive20i', tag:'BMW · SUV', version:'2.0 Turbo xDrive AT', image:MODEL_IMAGES.x500},
        'MOD-002': {name:'Toyota Corolla Hybrid', tag:'Toyota · Sedán', version:'1.8 Hybrid e-CVT', image:MODEL_IMAGES.sedan},
        'MOD-003': {name:'Kia Rio 1.4', tag:'Kia · Hatchback', version:'1.4 MPI MT', image:MODEL_IMAGES.city},
        'MOD-004': {name:'Mitsubishi L200 2.4 DI-D', tag:'Mitsubishi · PickUp', version:'2.4 Turbo Diesel 4x4 AT', image:MODEL_IMAGES.pickup},
        'MOD-005': {name:'Toyota Corolla Cross Hybrid', tag:'Toyota · Crossover', version:'1.8 Hybrid e-CVT', image:MODEL_IMAGES.cross},
        'MOD-006': {name:'Hyundai i30 N', tag:'Hyundai · Sport', version:'2.0 T-GDi DCT', image:MODEL_IMAGES.sport},
        'MOD-007': {name:'Suzuki Gixxer 250', tag:'Suzuki · Street', version:'249 cc', image:MODEL_IMAGES.moto1},
        'MOD-008': {name:'Honda CB500X', tag:'Honda · Adventure', version:'471 cc', image:MODEL_IMAGES.moto2},
        'MOD-009': {name:'Yamaha YZF-R6', tag:'Yamaha · Sport', version:'599 cc', image:MODEL_IMAGES.moto3},
        'MOD-010': {name:'Suzuki Boulevard M50', tag:'Suzuki · Cruiser', version:'805 cc', image:MODEL_IMAGES.moto4}
    };

    function actualizarNombreModelo(nombre) {
        if (NOMBRES_MODELOS_ANTIGUOS[nombre]) {
            return NOMBRES_MODELOS_ANTIGUOS[nombre];
        }
        return nombre;
    }

    function reemplazarNombreEnTexto(texto) {
        if (typeof texto !== 'string') {
            return texto;
        }

        Object.keys(NOMBRES_MODELOS_ANTIGUOS).forEach(function(nombreAntiguo) {
            texto = texto.split(nombreAntiguo).join(NOMBRES_MODELOS_ANTIGUOS[nombreAntiguo]);
        });

        return texto;
    }

    function migrarNombresDelCatalogo(data) {
        data.clients.forEach(function(cliente) {
            cliente.interest = actualizarNombreModelo(cliente.interest);

            if (Array.isArray(cliente.quotes)) {
                cliente.quotes.forEach(function(cotizacion) {
                    cotizacion.model = actualizarNombreModelo(cotizacion.model);
                });
            }

            if (Array.isArray(cliente.purchases)) {
                cliente.purchases = cliente.purchases.map(actualizarNombreModelo);
            }
        });

        data.models.forEach(function(modelo) {
            var actual = CATALOGO_ACTUAL[modelo.id];

            if (actual) {
                modelo.name = actual.name;
                modelo.tag = actual.tag;
                modelo.version = actual.version;
                modelo.image = actual.image;
            }
        });

        data.stock.forEach(function(item) {
            item.model = actualizarNombreModelo(item.model);
        });

        data.opportunities.forEach(function(item) {
            item.model = actualizarNombreModelo(item.model);
        });

        data.parts.forEach(function(item) {
            item.compatibility = actualizarNombreModelo(item.compatibility);
        });

        data.finance.forEach(function(item) {
            item.model = actualizarNombreModelo(item.model);
        });

        data.testdrives.forEach(function(item) {
            item.model = actualizarNombreModelo(item.model);
        });

        data.workorders.forEach(function(item) {
            item.vehicle = actualizarNombreModelo(item.vehicle);
        });

        data.publicRequests.forEach(function(item) {
            item.model = actualizarNombreModelo(item.model);
        });

        data.interactions.forEach(function(item) {
            item.note = reemplazarNombreEnTexto(item.note);
        });

        data.notifications.forEach(function(item) {
            item.message = reemplazarNombreEnTexto(item.message);
        });

        return data;
    }

    function crearDatosIniciales() {
        return {
        clients: [
            {id:'CLI-001', rut:'18.345.678-9', name:'Camila Rojas', address:'Av. Central 1240', phone:'+56 9 6123 4567', email:'camila@email.cl', interest:'BMW X3 xDrive20i', status:'Activo', sellerId:'VEN-001', licenseExpiry:'2028-05-20', quotes:[{id:'COT-001', model:'BMW X3 xDrive20i', amount:18990000, status:'Abierta', date:'2026-10-01'}], purchases:['Kia Rio 1.4']},
            {id:'CLI-002', rut:'17.654.321-2', name:'Felipe Soto', address:'Los Alerces 833', phone:'+56 9 7234 5512', email:'felipe@email.cl', interest:'Toyota Corolla Hybrid', status:'Cotización', sellerId:'VEN-002', licenseExpiry:'2027-11-08', quotes:[{id:'COT-002', model:'Toyota Corolla Hybrid', amount:14490000, status:'Abierta', date:'2026-09-30'}], purchases:[]},
            {id:'CLI-003', rut:'19.875.442-1', name:'Daniela Pérez', address:'El Molino 440', phone:'+56 9 6544 1188', email:'daniela@email.cl', interest:'Toyota Corolla Cross Hybrid', status:'Seguimiento', sellerId:'VEN-003', licenseExpiry:'2029-01-10', quotes:[], purchases:['Toyota Corolla Hybrid']},
            {id:'CLI-004', rut:'16.332.110-5', name:'Antonia Vera', address:'Las Palmas 221', phone:'+56 9 8822 4100', email:'antonia@email.cl', interest:'Honda CB500X', status:'Activo', sellerId:'VEN-001', licenseExpiry:'2028-09-14', quotes:[{id:'COT-003', model:'Honda CB500X', amount:5990000, status:'Cerrada', date:'2026-09-28'}], purchases:[]},
            {id:'CLI-005', rut:'20.115.932-7', name:'Lucas Méndez', address:'Los Copihues 982', phone:'+56 9 7001 3133', email:'lucas@email.cl', interest:'Mitsubishi L200 2.4 DI-D', status:'Activo', sellerId:'VEN-002', licenseExpiry:'2027-06-18', quotes:[], purchases:[]}
        ],
        sellers: [
            {id:'VEN-001', name:'Valentina Díaz', email:'vendedor@automaster.cl', target:14, commissionRate:1.2},
            {id:'VEN-002', name:'Matías López', email:'matias@automaster.cl', target:14, commissionRate:1.2},
            {id:'VEN-003', name:'Josefa Silva', email:'josefa@automaster.cl', target:14, commissionRate:1.2}
        ],
        opportunities: [
            {id:'OP-001', sellerId:'VEN-001', clientId:'CLI-001', model:'BMW X3 xDrive20i', status:'Cierre', amount:18990000},
            {id:'OP-002', sellerId:'VEN-002', clientId:'CLI-002', model:'Toyota Corolla Hybrid', status:'Negociación', amount:14490000},
            {id:'OP-003', sellerId:'VEN-003', clientId:'CLI-003', model:'Toyota Corolla Cross Hybrid', status:'Contacto', amount:20490000}
        ],
        sales: [
            {id:'VTA-001', sellerId:'VEN-001', clientId:'CLI-001', amount:11990000, date:'2026-09-05'},
            {id:'VTA-002', sellerId:'VEN-001', clientId:'CLI-004', amount:5990000, date:'2026-09-17'},
            {id:'VTA-003', sellerId:'VEN-002', clientId:'CLI-003', amount:14490000, date:'2026-09-12'},
            {id:'VTA-004', sellerId:'VEN-003', clientId:'CLI-005', amount:9490000, date:'2026-09-22'}
        ],
        stock: [
            {vin:'AX8241', model:'BMW X3 xDrive20i', location:'Sucursal Centro', color:'Gris', year:2026, status:'Disponible', demo:false},
            {vin:'AX8242', model:'BMW X3 xDrive20i', location:'Sucursal Centro', color:'Negro', year:2026, status:'Reservado', demo:true},
            {vin:'SE1732', model:'Toyota Corolla Hybrid', location:'Patio Norte', color:'Blanco', year:2026, status:'Disponible', demo:true},
            {vin:'SE1733', model:'Toyota Corolla Hybrid', location:'Sucursal Centro', color:'Azul', year:2026, status:'Vendido', demo:false},
            {vin:'CT2001', model:'Kia Rio 1.4', location:'Sucursal Centro', color:'Rojo', year:2026, status:'Disponible', demo:false},
            {vin:'PK9001', model:'Mitsubishi L200 2.4 DI-D', location:'Patio Norte', color:'Negro', year:2026, status:'En tránsito', demo:false},
            {vin:'CR7001', model:'Toyota Corolla Cross Hybrid', location:'Sucursal Centro', color:'Plata', year:2026, status:'Disponible', demo:true},
            {vin:'SP8001', model:'Hyundai i30 N', location:'Patio Norte', color:'Rojo', year:2026, status:'Reservado', demo:false},
            {vin:'M25001', model:'Suzuki Gixxer 250', location:'Sucursal Centro', color:'Negro', year:2026, status:'Disponible', demo:true},
            {vin:'M50001', model:'Honda CB500X', location:'Sucursal Centro', color:'Gris', year:2026, status:'Disponible', demo:true},
            {vin:'M60001', model:'Yamaha YZF-R6', location:'Patio Norte', color:'Azul', year:2026, status:'En tránsito', demo:false},
            {vin:'M80001', model:'Suzuki Boulevard M50', location:'Sucursal Centro', color:'Negro', year:2026, status:'Disponible', demo:true}
        ],
        parts: [
            {code:'REP-00182', name:'Pastillas de freno', compatibility:'BMW X3 xDrive20i', stock:24, minStock:6},
            {code:'REP-00431', name:'Filtro de aceite', compatibility:'Toyota Corolla Hybrid', stock:5, minStock:8},
            {code:'REP-00802', name:'Sensor ABS', compatibility:'BMW X3 xDrive20i', stock:1, minStock:3},
            {code:'REP-01045', name:'Filtro de aire', compatibility:'Kia Rio 1.4', stock:14, minStock:5},
            {code:'REP-01220', name:'Kit transmisión', compatibility:'Honda CB500X', stock:4, minStock:4}
        ],
        partOrders: [{id:'PED-001', code:'REP-00431', qty:20, status:'Solicitado', date:'2026-10-01'}],
        finance: [
            {id:'FIN-1048', clientId:'CLI-001', amount:13500000, installments:48, monthlyRate:2.79, vfg:20, risk:'Bajo', status:'Preaprobada', attachments:[]},
            {id:'FIN-1049', clientId:'CLI-002', amount:16200000, installments:60, monthlyRate:2.79, vfg:20, risk:'Medio', status:'Evaluación', attachments:[]},
            {id:'FIN-1050', clientId:'CLI-003', amount:9800000, installments:36, monthlyRate:2.79, vfg:20, risk:'Bajo', status:'Enviada', attachments:[]}
        ],
        testdrives: [
            {id:'TD-001', clientId:'CLI-002', date:'2026-10-01T15:00', model:'Toyota Corolla Hybrid', vin:'SE1732', status:'Confirmado'},
            {id:'TD-002', clientId:'CLI-004', date:'2026-10-01T17:30', model:'Honda CB500X', vin:'M50001', status:'Pendiente'},
            {id:'TD-003', clientId:'CLI-005', date:'2026-10-02T11:00', model:'Toyota Corolla Cross Hybrid', vin:'CR7001', status:'Confirmado'},
            {id:'TD-004', clientId:'CLI-001', date:'2026-10-03T12:00', model:'BMW X3 xDrive20i', vin:'AX8242', status:'Confirmado'}
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
            {id:'MOD-001', name:'BMW X3 xDrive20i', category:'suv', tag:'SUV', version:'2.0 Turbo AT', price:18990000, equipment:'6 airbags, cámara 360°, control crucero adaptativo', image:MODEL_IMAGES.x500},
            {id:'MOD-002', name:'Toyota Corolla Hybrid', category:'auto', tag:'Sedán', version:'1.6 Hybrid AT', price:14490000, equipment:'Pantalla 10”, climatizador, ADAS', image:MODEL_IMAGES.sedan},
            {id:'MOD-003', name:'Kia Rio 1.4', category:'auto', tag:'Hatchback', version:'1.4 MT', price:11990000, equipment:'6 airbags, CarPlay/Android Auto', image:MODEL_IMAGES.city},
            {id:'MOD-004', name:'Mitsubishi L200 2.4 DI-D', category:'suv', tag:'PickUp', version:'2.4 Diesel 4x4 AT', price:24990000, equipment:'4x4, control descenso, cámara reversa', image:MODEL_IMAGES.pickup},
            {id:'MOD-005', name:'Toyota Corolla Cross Hybrid', category:'suv', tag:'Crossover', version:'1.8 Hybrid AT', price:20490000, equipment:'Techo panorámico, ADAS, cámara 360°', image:MODEL_IMAGES.cross},
            {id:'MOD-006', name:'Hyundai i30 N', category:'auto', tag:'Sport', version:'2.0 Turbo DCT', price:29990000, equipment:'Modo Sport, asientos deportivos, 8 airbags', image:MODEL_IMAGES.sport},
            {id:'MOD-007', name:'Suzuki Gixxer 250', category:'moto', tag:'Moto', version:'250 cc', price:3490000, equipment:'ABS, tablero digital, iluminación LED', image:MODEL_IMAGES.moto1},
            {id:'MOD-008', name:'Honda CB500X', category:'moto', tag:'Moto Adventure', version:'500 cc', price:5990000, equipment:'ABS doble canal, parabrisas, maletas laterales', image:MODEL_IMAGES.moto2},
            {id:'MOD-009', name:'Yamaha YZF-R6', category:'moto', tag:'Moto Sport', version:'600 cc', price:7490000, equipment:'Control tracción, modos de manejo, quickshifter', image:MODEL_IMAGES.moto3},
            {id:'MOD-010', name:'Suzuki Boulevard M50', category:'moto', tag:'Moto Cruiser', version:'800 cc', price:9490000, equipment:'ABS, control crucero, iluminación LED', image:MODEL_IMAGES.moto4}
        ],
        workorders: [
            {id:'OT-018', clientId:'CLI-001', vin:'AX8241', vehicle:'BMW X3 xDrive20i', job:'Mantención 20.000 km', status:'En proceso', parts:'Filtro aceite', labourHours:2.5, date:'2026-10-01'},
            {id:'OT-019', clientId:'CLI-002', vin:'SE1732', vehicle:'Toyota Corolla Hybrid', job:'Diagnóstico frenos', status:'Esperando repuesto', parts:'Pastillas freno', labourHours:1.5, date:'2026-10-01'},
            {id:'OT-020', clientId:'CLI-003', vin:'CT2001', vehicle:'Kia Rio 1.4', job:'Revisión garantía', status:'Listo entrega', parts:'Sensor ABS', labourHours:1, date:'2026-09-30'},
            {id:'OT-021', clientId:'CLI-004', vin:'M50001', vehicle:'Honda CB500X', job:'Mantención 10.000 km', status:'Agendada', parts:'Kit transmisión', labourHours:2, date:'2026-10-04'}
        ],
        interactions: [
            {id:'INT-001', clientId:'CLI-001', date:'2026-10-01', channel:'Teléfono', note:'Solicita simulación SUV X500'},
            {id:'INT-002', clientId:'CLI-002', date:'2026-09-30', channel:'Correo', note:'Se envió cotización Sedan Exec'}
        ],
        notifications: [
            {id:'NOT-001', date:'2026-10-01T09:00', title:'Test drive confirmado', message:'Felipe Soto - Sedan Exec - 01/10 15:00', read:false},
            {id:'NOT-002', date:'2026-10-01T10:00', title:'OT actualizada', message:'OT-020 lista para entrega', read:false}
        ],
        publicRequests: []
        };
    }

    function normalizarDatos(source) {
        const seed = crearDatosIniciales();
        const data = source && typeof source === 'object' ? source : seed;
        const arrayKeys = ['clients','sellers','opportunities','sales','stock','parts','partOrders','finance','testdrives','documents','warranties','models','workorders','interactions','notifications','publicRequests'];

        migrarNombresDelCatalogo(data);

        arrayKeys.forEach(key => {
            if (!Array.isArray(data[key])) data[key] = seed[key] || [];
        });

        data.clients.forEach(client => {
            client.quotes = Array.isArray(client.quotes) ? client.quotes : [];
            client.purchases = Array.isArray(client.purchases) ? client.purchases : [];
            client.status = client.status || 'Seguimiento';
            client.interest = client.interest || 'Sin interés definido';
        });

        data.models.forEach(model => {
            const detail = MODEL_DETAILS[model.id];
            if (detail) {
                model.pdf = model.pdf || detail.pdf;
                model.specs = {...(model.specs || {}), ...detail.specs};
            } else {
                model.specs = model.specs || {};
            }
        });

        data.finance.forEach(item => {
            item.monthlyRate = 2.79;
            item.vfg = 20;
            item.attachments = Array.isArray(item.attachments) ? item.attachments : [];
            item.origin = item.origin || 'Solicitud interna';
            item.risk = item.risk || 'Pendiente';
            item.status = item.status || 'Evaluación';
        });

        return data;
    }

    let db;
    try {
        const stored = leerStorage('localStorage', DATA_KEY);
        db = normalizarDatos(stored ? JSON.parse(stored) : crearDatosIniciales());
    } catch {
        db = normalizarDatos(crearDatosIniciales());
    }
    guardarStorage('localStorage', DATA_KEY, JSON.stringify(db));

    function guardarDatos() {
        db = normalizarDatos(db);
        guardarStorage('localStorage', DATA_KEY, JSON.stringify(db));

        // Después de guardar, actualizamos lo que ve el usuario.
        actualizarResumen();
        mostrarCatalogoPublico();
        actualizarContadorNotificaciones();

        if (currentModule && currentSession) {
            mostrarModulo(currentModule);
        }
    }

    function buscarCliente(id) {
        return db.clients.find(function(cliente) {
            return cliente.id === id;
        });
    }

    function buscarVendedor(id) {
        return db.sellers.find(function(vendedor) {
            return vendedor.id === id;
        });
    }

    function buscarModelo(nombre) {
        return db.models.find(function(modelo) {
            return modelo.name === nombre;
        });
    }

    function buscarVehiculo(vin) {
        return db.stock.find(function(vehiculo) {
            return vehiculo.vin === vin;
        });
    }

    function obtenerNombreCliente(id) {
        var cliente = buscarCliente(id);
        if (cliente) {
            return cliente.name;
        }
        return 'Sin cliente';
    }

    function obtenerNombreVendedor(id) {
        var vendedor = buscarVendedor(id);
        if (vendedor) {
            return vendedor.name;
        }
        return 'Sin vendedor';
    }

    // ------------------------------------------------------------------
    // Navegación móvil
    // ------------------------------------------------------------------
    const menuToggle = obtenerElemento('#menu-toggle');
    const mainNav = obtenerElemento('#main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            var abierto = mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(abierto));
        });

        obtenerElementos('#main-nav a').forEach(function(enlace) {
            enlace.addEventListener('click', function() {
                mainNav.classList.remove('open');
            });
        });
    }

    // ------------------------------------------------------------------
    // Modales y mensajes
    // ------------------------------------------------------------------
    const appModal = obtenerElemento('#app-modal');
    const appModalTitle = obtenerElemento('#app-modal-title');
    const appModalDescription = obtenerElemento('#app-modal-description');
    const appModalEyebrow = obtenerElemento('#app-modal-eyebrow');
    const appModalContent = obtenerElemento('#app-modal-content');

    function cerrarModal() {
        if (!appModal) {
            return;
        }

        appModal.classList.add('oculto');
        document.body.classList.remove('modal-open');

        if (appModalContent) {
            appModalContent.innerHTML = '';
        }
    }
    obtenerElemento('#app-modal-close')?.addEventListener('click', cerrarModal);
    appModal?.querySelector('[data-close-app-modal]')?.addEventListener('click', cerrarModal);

    function abrirModalInformacion(title, html, description, eyebrow) {
        if (!appModal) {
            return;
        }

        if (description == null) {
            description = '';
        }

        if (eyebrow == null) {
            eyebrow = 'AutoMaster';
        }

        if (appModalEyebrow) appModalEyebrow.textContent = eyebrow;
        if (appModalTitle) appModalTitle.textContent = title;
        if (appModalDescription) appModalDescription.textContent = description;
        if (appModalContent) appModalContent.innerHTML = html;

        appModal.classList.remove('oculto');
        document.body.classList.add('modal-open');
    }

    const crearCampoFormulario = field => {
        const required = field.required ? 'required' : '';
        const value = field.value != null ? `value="${escaparHTML(field.value)}"` : '';
        const placeholder = field.placeholder ? `placeholder="${escaparHTML(field.placeholder)}"` : '';
        if (field.type === 'select') {
            return `<label class="modal-field"><span>${escaparHTML(field.label)}</span><select name="${escaparHTML(field.name)}" ${required}>${(field.options || []).map(o => {
                const val = typeof o === 'string' ? o : o.value;
                const label = typeof o === 'string' ? o : o.label;
                return `<option value="${escaparHTML(val)}" ${String(field.value)===String(val)?'selected':''}>${escaparHTML(label)}</option>`;
            }).join('')}</select></label>`;
        }
        if (field.type === 'textarea') {
            return `<label class="modal-field modal-field-wide"><span>${escaparHTML(field.label)}</span><textarea name="${escaparHTML(field.name)}" ${required} ${placeholder}>${escaparHTML(field.value || '')}</textarea></label>`;
        }
        if (field.type === 'file') {
            return `<label class="modal-field modal-field-wide"><span>${escaparHTML(field.label)}</span><input type="file" name="${escaparHTML(field.name)}" ${field.accept ? `accept="${escaparHTML(field.accept)}"` : ''} ${required}></label>`;
        }
        return `<label class="modal-field ${field.wide ? 'modal-field-wide' : ''}"><span>${escaparHTML(field.label)}</span><input type="${escaparHTML(field.type || 'text')}" name="${escaparHTML(field.name)}" ${required} ${value} ${placeholder} ${field.min != null ? `min="${field.min}"` : ''} ${field.max != null ? `max="${field.max}"` : ''} ${field.step != null ? `step="${field.step}"` : ''}></label>`;
    };

    const abrirFormularioModal = ({title, description='', eyebrow='Acción', fields=[], submitLabel='Guardar', onSubmit}) => {
        abrirModalInformacion(title, `<form class="app-action-form" id="app-action-form"><div class="modal-form-grid">${fields.map(crearCampoFormulario).join('')}</div><p class="modal-form-error oculto" id="modal-form-error"></p><div class="modal-actions"><button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button><button type="submit" class="btn btn-primary">${escaparHTML(submitLabel)}</button></div></form>`, description, eyebrow);
        obtenerElemento('#modal-cancel')?.addEventListener('click', cerrarModal);
        obtenerElemento('#app-action-form')?.addEventListener('submit', async event => {
            event.preventDefault();
            const error = obtenerElemento('#modal-form-error');
            const form = event.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try {
                const result = await onSubmit(data, formData, form);
                if (result !== false) cerrarModal();
            } catch (e) {
                error.textContent = e.message || 'No se pudo completar la acción.';
                error.classList.remove('oculto');
            }
        });
    };


    function mostrarMensaje(mensaje, tipo) {
        if (tipo == null) {
            tipo = 'ok';
        }

        var contenedor = obtenerElemento('#toast-container');

        if (!contenedor) {
            return;
        }

        var aviso = document.createElement('div');
        aviso.className = 'toast toast-' + tipo;
        aviso.textContent = mensaje;
        contenedor.appendChild(aviso);

        setTimeout(function() {
            aviso.remove();
        }, 3600);
    }

    document.addEventListener('keydown'
, event => {
        if (event.key === 'Escape') {
            if (appModal && !appModal.classList.contains('oculto')) {
                cerrarModal();
            }

            var modalLoginActual = obtenerElemento('#login-modal');
            if (modalLoginActual && !modalLoginActual.classList.contains('oculto')) {
                cerrarLogin();
            }
        }
    });
