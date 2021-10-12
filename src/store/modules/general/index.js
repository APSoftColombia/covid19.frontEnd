/**
 * Settings Module
 */
import Vue from 'vue'

const state = {
    loadingIndicadores: false,
    datosEmpresa: null,
    snackbar: null,
    // onLine: window.navigator.onLine,
    onLine: true,
    divipol: [],
    divipolx: [],
    municipiosTotal: [],
    identidadesSexuales: [],
    sexos: [],
    estadosCiviles: [],
    tiposSangre: [],
    tiposDocumentoIdentidad: [],
    tiposCampoCalculado: [],
    causalesVisitaFallida: [],
    direccionamientos: [],
    camposUbicacion: [
        {id: 'urbano', nombre: 'Urbano'}
    ],
    ////
    tiposAfiliacion: [
        'Régimen Contributivo',
        'Régimen Subsidiado',
        'Régimen Especial'
    ],
    causasHospitalizacion: [
        'IRA',
        'IRAG',
        'IRAGi'
    ],
    regimenesEspeciales: [
        'Fuerzas Militares',
        'Policia Nacional',
        'ECOPETROL',
        'Magisterio (Docentes)',
        'Universidades Públicas'
    ],
    clasificacionesCovid: [
        ////VI
        {
            version: 1,
            idShow: 'VI1',
            id: '1',
            selectable: false,
            text: '1',
            nombre: 'V1 Definición 1',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI2',
            id: '2',
            selectable: false,
            text: '2',
            nombre: 'V1 Definición 2',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI3',
            id: '3',
            selectable: false,
            text: '3',
            nombre: 'V1 Definición 3',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI3.1',
            id: '3.1',
            selectable: false,
            text: '3.1',
            nombre: 'V1 Definición 3.1',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI3.2',
            id: '3.2',
            selectable: false,
            text: '3.2',
            nombre: 'V1 Definición 3.2',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI4',
            id: '4',
            selectable: false,
            text: '4',
            nombre: 'V1 Definición 4',
            modal: true,
            help: true
        },
        {
            version: 1,
            idShow: 'VI5',
            id: '5',
            selectable: false,
            text: '5',
            nombre: 'V1 Definición 5',
            modal: true,
            help: true
        },
        ///VII
        {
            version: 2,
            idShow: 'VIIP1',
            id: '1',
            selectable: true,
            text: 'CP1',
            nombre: 'V2 Caso Probable 1',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIP2',
            id: '2',
            selectable: true,
            text: 'CP2',
            nombre: 'V2 Caso Probable 2',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIP4',
            id: '4',
            selectable: true,
            text: 'CP4',
            nombre: 'V2 Caso Probable 4',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIP5',
            id: '5',
            selectable: true,
            text: 'CP5',
            nombre: 'V2 Caso Probable 5',
            modal: true,
            help: true
        },
        //
        {
            version: 2,
            idShow: 'VIIC1',
            id: '1',
            selectable: true,
            text: 'CC1',
            nombre: 'V2 Caso Confirmado 1',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIC2',
            id: '2',
            selectable: true,
            text: 'CC2',
            nombre: 'V2 Caso Confirmado 2',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIC4',
            id: '4',
            selectable: true,
            text: 'CC4',
            nombre: 'V2 Caso Confirmado 4',
            modal: true,
            help: true
        },
        {
            version: 2,
            idShow: 'VIIC5',
            id: '5',
            selectable: true,
            text: 'CC5',
            nombre: 'V2 Caso Confirmado 5',
            modal: true,
            help: true
        },
        ///////////////
        {
            version: 1,
            id: '6',
            selectable: true,
            text: 'NC',
            nombre: 'No clasificado en ninguna de las definiciones.',
            modal: false,
            help: false
        }
    ],
    tiposTamizaje: [
        {id: 'telefónico', nombre: 'Telefónico'},
        {id: 'presencial', nombre: 'Presencial'}
    ],
    tiposLlamada: [
        {id: 'entrante', nombre: 'Entrante'},
        {id: 'saliente', nombre: 'Saliente'}
    ],
    tiposResultadosCovid: [
        {value: 0, text: 'Negativo', color: 'green'},
        {value: 1, text: 'Positivo', color: 'red'},
        {value: 2, text: 'No Procesado | Falla Preanalítica', color: 'blue-grey'}
    ],
    sintomas: [],
    tamizadores: [],
    epss: [],
    lugarEncuestas: [],
    mediosTransporte: [],
    paises: [],
    departamentos: [],
    comorbilidades: [],
    ordenesMedicas: [],
    tiposEvolucion: [],
    tiposMuestra: [],
    sintomasAutopsia: [],
    resultadosPCR: [],
    comorbAutopsias: [],
    clasificacionesAutopsia: [],
    causasExternas: [],
    laboratorios: [],
    tomadores: [],
    tiposAislamiento: [],
    ambitosAtencion: [],
    tiposSoporteVentilatorio: [],
    estadosAfectacion: [],
    gruposAtencionEspecial: [],
    parentescos: [],
    tiposNoEfectiva: [],
    tiposOrdenador: [],
    entidadesFinancieras: [],
    lugaresTomaMuestra: [],
    ambitosMuestras: [],
    causalesNoReportaContactos: [
        {value: 1, text: 'No los conoce'},
        {value: 2, text: 'Los conoce pero no tiene los datos de contacto'},
        {value: 3, text: 'No quiso relacionar contactos'},
        {value: 4, text: 'Ya relacionó contactos'}
    ],
    respuestasPsicologicas: [],
    protocolosBioseguridad: [],
    alteracionesEmocionales: [],
    municipiosPruebas: [],
    departamentosPruebas: [],
    razonesNoTomaMuestra: [],
    ipssPruebas: [],
    ipssVacunas: [],
    priorizacionesVacunas: [],
    estadosAfiliacion: [
        { value: 'AC', text: 'Activo', icon: 'mdi-file-check', color: 'green' },
        { value: 'AF', text: 'Fallecido', icon: 'mdi-file-plus', color: 'black' },
        { value: 'RE', text: 'Retirado', icon: 'mdi-file-cancel', color: 'orange' },
    ],
    dosisVacunas: [],
    ultimoVacunadorId: null,
    tipoPoblaciones: [],
    lastDptoAplicacionVacuna: null,
    lastMpioAplicacionVacuna: null,
    comorbilidadesVacunas: [],
    comorbilidadesCaracterizacion: [],
}

// getters
const getters = {
    tiposResultadosCovid: state => {
        return state.tiposResultadosCovid
    },
    loadingIndicadores: state => {
        return state.loadingIndicadores
    },
    datosEmpresa: state => {
        return state.datosEmpresa
    },
    onLine: state => {
        return state.onLine
    },
    divipol: state => {
        return state.divipol
    },
    divipolx: state => {
        return state.divipolx
    },
    municipiosTotal: state => {
        return state.municipiosTotal
    },
    identidadesSexuales: state => {
        return state.identidadesSexuales
    },
    sexos: state => {
        return state.sexos
    },
    sexosCovid: state => {
        return state.sexos.map(x => {
            return {value: x, text: x === 'F' ? 'Femenino' : 'Masculino'}
        })
    },
    estadosCiviles: state => {
        return state.estadosCiviles
    },
    tiposSangre: state => {
        return state.tiposSangre
    },
    tiposDocumentoIdentidad: state => {
        return state.tiposDocumentoIdentidad
    },
    tiposCampoCalculado: state => {
        return state.tiposCampoCalculado
    },
    causalesVisitaFallida: state => {
        return state.causalesVisitaFallida
    },
    direccionamientos: state => {
        return state.direccionamientos
    },
    camposUbicacion: state => {
        return state.camposUbicacion
    },
    ////
    tiposAfiliacion: state => {
        return state.tiposAfiliacion
    },
    causasHospitalizacion: state => {
        return state.causasHospitalizacion
    },
    sintomas: state => {
        return state.sintomas
    },
    //////
    sintomasFecha: state => {
        return state.sintomas.filter(x => x.solicita_fecha)
    },
    signosAlarma: state => {
        return state.sintomas.filter(x => !x.solicita_fecha)
    },
    tamizadores: state => {
        return state.tamizadores
    },
    epss: state => {
        return state.epss
    },
    lugarEncuestas: state => {
        return state.lugarEncuestas
    },
    mediosTransporte: state => {
        return state.mediosTransporte.map(x => {
            return {value: x, text: x}
        })
    },
    paises: state => {
        return state.paises
    },
    departamentos: state => {
        return state.departamentos
    },
    comorbilidades: state => {
        return state.comorbilidades
    },
    clasificacionesCovid: state => {
        return state.clasificacionesCovid
    },
    regimenesEspeciales: state => {
        return state.regimenesEspeciales
    },
    ordenesMedicas: state => {
        return state.ordenesMedicas
    },
    tiposTamizaje: state => {
        return state.tiposTamizaje
    },
    tiposLlamada: state => {
        return state.tiposLlamada
    },
    tiposEvolucion: state => {
        return state.tiposEvolucion
    },
    tiposMuestra: state => {
        return state.tiposMuestra
    },
    sintomasAutopsia: state => {
        return state.sintomasAutopsia
    },
    resultadosPCR: state => {
        return state.resultadosPCR
    },
    comorbAutopsias: state => {
        return state.comorbAutopsias
    },
    clasificacionesAutopsia: state => {
        return state.clasificacionesAutopsia
    },
    causasExternas: state => {
        return state.causasExternas
    },
    laboratorios: state => {
        return state.laboratorios
    },
    tomadores: state => {
        return state.tomadores
    },
    //////
    tiposAislamiento: state => {
        return state.tiposAislamiento
    },
    ambitosAtencion: state => {
        return state.ambitosAtencion
    },
    tiposSoporteVentilatorio: state => {
        return state.tiposSoporteVentilatorio
    },
    estadosAfectacion: state => {
        return state.estadosAfectacion
    },
    gruposAtencionEspecial: state => {
        return state.gruposAtencionEspecial
    },
    parentescos: state => {
        return state.parentescos
    },
    tiposNoEfectiva: state => {
        return state.tiposNoEfectiva
    },
    tiposOrdenador: state => {
        return state.tiposOrdenador
    },
    entidadesFinancieras: state => {
        return state.entidadesFinancieras
    },
    causalesNoReportaContactos: state => {
        return state.causalesNoReportaContactos
    },
    lugaresTomaMuestra: state => {
        return state.lugaresTomaMuestra
    },
    ambitosMuestras: state => {
        return state.ambitosMuestras.map(x => {
            return { value: x, text: x }
        })
    },
    respuestasPsicologicas: state => {
        return state.respuestasPsicologicas.map(x => {
            return { value: x, text: x }
        })
    },
    protocolosBioseguridad: state => {
        return state.protocolosBioseguridad
    },
    alteracionesEmocionales: state => {
        return state.alteracionesEmocionales
    },
    municipiosPruebas: state => {
      return state.municipiosPruebas
    },
    departamentosPruebas: state => {
      return state.departamentosPruebas
    },
    razonesNoTomaMuestra: state => {
      return state.razonesNoTomaMuestra
    },
    ipssPruebas: state => {
      return state.ipssPruebas
    },
    ipssVacunas: state => {
      return state.ipssVacunas
    },
    priorizacionesVacunas: state => {
      return state.priorizacionesVacunas
    },
    estadosAfiliacion: state => {
      return state.estadosAfiliacion
    },
    dosisVacunas: state => {
        return state.dosisVacunas
    },
    ultimoVacunadorId: state => {
        return state.ultimoVacunadorId
    },
    tipoPoblaciones: state => {
        return state.tipoPoblaciones
    },
    lastDptoAplicacionVacuna: state => {
        return state.lastDptoAplicacionVacuna
    },
    lastMpioAplicacionVacuna: state => {
        return state.lastMpioAplicacionVacuna
    },
    comorbilidadesVacunas: state => {
        return state.comorbilidadesVacunas
    },
    comorbilidadesCaracterizacion: state => {
        return state.comorbilidadesCaracterizacion
    },
}
// actions
const actions = {
    reloadOnline(context) {
        fetch('https://google.com')
            .then(response => {
                context.commit('onLine', response.ok)
            }).catch(() => {
            context.commit('onLine', true)
        })
    },
    async getDatosEmpresa(context) {
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`configuraciones`)
                    .then(response => {
                        response.data.departamento_id = parseInt(response.data.departamento_id)
                        context.commit('assignDatosEmpresa', response.data)
                        resolve(true)
                    })
                    .catch(error => {
                        resolve(false)
                        context.commit('snackbar', {
                            color: 'error',
                            message: 'al recuperar los datos de empresa.',
                            error: error
                        })
                    })
            } else {
                resolve(true)
                context.commit('snackbar', {
                    color: 'warning',
                    message: `no hay conexión al servidor para realizar ésta operación.`
                })
            }
        })
    },
    reloadStorage() {
        localStorage.removeItem('vuex')
        setTimeout(() => {
            location.reload()
        }, 1000)
    },
    async getAjustesGenerales(context, force = false) {
        return await new Promise(resolve => {
            if (!context.getters.divipol.length || force) {
                if (context.getters.onLine) {
                    context.commit('offReload')
                    Vue.axios.get(`ajustes-generales/iniciales`)
                        .then(response => {
                            context.commit('assignDivipol', response.data.parametros.departamentos.find(x => x.id === context.getters.datosEmpresa.departamento_id).municipios)
                            context.commit('assignDivipolx', response.data.parametros.divipol)
                            context.commit('assignMunicipiosTotal', response.data.parametros.departamentos)
                            context.commit('assignEstadosCiviles', response.data.parametros.estados_civiles)
                            context.commit('assignIdentidadesSexuales', response.data.parametros.identidades_sexuales)
                            context.commit('assignSexos', response.data.parametros.sexos)
                            context.commit('assignTiposSangre', response.data.parametros.tipos_sangre)
                            context.commit('assignTiposDocumentoIdentidad', response.data.parametros.tipos_documento_identidad)
                            context.commit('assignTiposCampoCalculado', response.data.parametros.tipos_campo_calculado)
                            context.commit('assignCausalesVisitaFallida', response.data.parametros.causal_visita_fallidas)
                            context.commit('assignDireccionamientos', response.data.parametros.direccionamientos)
                            ////
                            context.commit('assignTiposFormulario', response.data.parametros.tipos_formulario)
                            context.commit('assignTiposRespuesta', response.data.parametros.tipos_respuesta)
                            ////
                            context.commit('assignSintomas', response.data.parametros.sintomas)
                            context.commit('assignTamizadores', response.data.parametros.tamizadores)
                            context.commit('assignEpss', response.data.parametros.eps)
                            context.commit('assignLugarEncuestas', response.data.parametros.lugar_encuestas)
                            context.commit('assignMediosTransporte', response.data.parametros.medios_transporte)
                            context.commit('assignPaises', response.data.parametros.paises)
                            context.commit('assignDepartamentos', response.data.parametros.departamentos)
                            context.commit('assignComorbilidades', response.data.parametros.comorbilidades)
                            context.commit('assignOrdenesMedicas', response.data.parametros.ordenes_medicas)
                            context.commit('assignTiposEvolucion', response.data.parametros.tipevoluciones)
                            context.commit('assignTiposMuestra', response.data.parametros.tipmuestras)
                            /////
                            context.commit('assignSintomasAutopsia', response.data.parametros.sintomas_autopsia)
                            context.commit('assignResultadosPCR', response.data.parametros.resultado_pcr)
                            context.commit('assignComorbAutopsias', response.data.parametros.comorbautopsias)
                            context.commit('assignClasificacionesAutopsia', response.data.parametros.clasificacion_autopsia)
                            context.commit('assignCausasExternas', response.data.parametros.causasexternas)
                            context.commit('assignLaboratorios', response.data.parametros.laboratorios.concat([{
                                id: 0,
                                laboratorio: 'Otro'
                            }]))
                            context.commit('assignTomadores', response.data.parametros.tomadores.concat([{
                                id: 0,
                                institucion: 'Otro'
                            }]))
                            //////
                            context.commit('assignAmbitosAtencion', response.data.parametros.ambitos)
                            context.commit('assignTiposAislamiento', response.data.parametros.tipo_aislamiento)
                            context.commit('assignTiposSoporteVentilatorio', response.data.parametros.soporte_ventilatorios)
                            context.commit('assignEstadosAfectacion', response.data.parametros.estados_afectacion)
                            context.commit('assignGruposAtencionEspecial', response.data.parametros.grupos_atencion_especial_covid)
                            context.commit('assignParentescos', response.data.parametros.parentescos)
                            context.commit('assignTiposNoEfectiva', response.data.parametros.no_efectividad)
                            context.commit('assignTiposOrdenador', response.data.parametros.ordenadores)
                            context.commit('assignEntidadesFinancieras', response.data.parametros.entidadesFinancieras)
                            context.commit('assignLugaresTomaMuestra', response.data.parametros.lugares_toma_muestra)
                            context.commit('assignAmbitosMuestras', response.data.parametros.ambitos_muestras)

                            context.commit('assignRespuestasPsicologicas', response.data.parametros.respuestas_seguimientos)
                            context.commit('assignProtocolosBioseguridad', response.data.parametros.protocolos_bioseguridad_respuestas)
                            context.commit('assignAlteracionesEmocionales', response.data.parametros.alteraciones_emocionales_respuestas)
                            context.commit('assignMunicipiosPruebas', response.data.parametros.municipios_pruebas)
                            context.commit('assignDepartamentosPruebas', response.data.parametros.departamentos_pruebas)
                            context.commit('assignRazonesNoTomaMuestra', response.data.parametros.razones_no_toma_muestra)
                            context.commit('assignIpssPruebas', response.data.parametros.ipss_pruebas)
                            context.commit('assignIpssVacunas', response.data.parametros.ipss_vacunas)
                            context.commit('assignPriorizacionesVacunas', response.data.parametros.priorizaciones_vacunas)
                            context.commit('assignDosisVacunas', response.data.parametros.dosisVacunas)
                            context.commit('assignTipoPoblaciones', response.data.parametros.tipo_poblaciones)
                            context.commit('assignComorbilidadesVacunas', response.data.parametros.dosisVacunas ? response.data.parametros.dosisVacunas.comorbilidadesVacunas : [])
                            context.commit('assignComorbilidadesCaracterizacion', response.data.parametros.comorboCaracterizacion ? response.data.parametros.comorboCaracterizacion : [])
                            resolve(true)
                        })
                        .catch(error => {
                            context.commit('onReload')
                            resolve(false)
                            context.commit('snackbar', {
                                color: 'error',
                                message: 'al recuperar los ajustes generales.',
                                error: error
                            })
                        })
                } else {
                    resolve(true)
                    context.commit('snackbar', {
                        color: 'warning',
                        message: `no hay conexión a internet para realizar ésta operación.`
                    })
                }
            }
        })
    },
    setUltimoVacunadorId(context, payload) {
        context.commit('assignUltimoVacunadorId', payload.ultimoVacunadorId)
    },
    setLastDptoAplicacionVacuna(context, payload) {
        context.commit('assignLastDptoAplicacionVacuna', payload.cod_dpto_aplicacion)
    },
    setLastMpioAplicacionVacuna(context, payload) {
        context.commit('assignLastMpioAplicacionVacuna', payload.cod_mpio_aplicacion)
    }
}

// mutations
const mutations = {
    setLoadingIndicadores(state, loading) {
        state.loadingIndicadores = loading
    },
    onLine(state, online) {
        state.onLine = online
    },
    assignDatosEmpresa(state, datosEmpresa) {
        state.datosEmpresa = datosEmpresa
    },
    assignDivipol(state, divipol) {
        state.divipol = divipol
    },
    assignDivipolx(state, divipolx) {
        console.log('divipolx', divipolx)
        state.divipolx = divipolx[0].municipios
    },
    assignMunicipiosTotal(state, departamentos) {
        state.municipiosTotal = []
        departamentos.forEach(x => {
            state.municipiosTotal = state.municipiosTotal.concat(x.municipios)
        })
    },
    assignIdentidadesSexuales(state, identidadesSexuales) {
        state.identidadesSexuales = identidadesSexuales
    },
    assignSexos(state, sexos) {
        state.sexos = sexos
    },
    assignEstadosCiviles(state, estadosCiviles) {
        state.estadosCiviles = estadosCiviles
    },
    assignTiposSangre(state, tiposSangre) {
        state.tiposSangre = tiposSangre
    },
    assignTiposDocumentoIdentidad(state, tiposDocumentoIdentidad) {
        state.tiposDocumentoIdentidad = tiposDocumentoIdentidad
    },
    assignTiposCampoCalculado(state, tiposCampoCalculado) {
        state.tiposCampoCalculado = tiposCampoCalculado
    },
    assignCausalesVisitaFallida(state, causalesVisitaFallida) {
        state.causalesVisitaFallida = causalesVisitaFallida
    },
    assignDireccionamientos(state, direccionamientos) {
        state.direccionamientos = direccionamientos
    },
    assignSintomas(state, sintomas) {
        state.sintomas = sintomas
    },
    assignTamizadores(state, tamizadores) {
        state.tamizadores = tamizadores
    },
    assignEpss(state, epss) {
        state.epss = epss
    },
    assignLugarEncuestas(state, lugarEncuestas) {
        state.lugarEncuestas = lugarEncuestas
    },
    assignMediosTransporte(state, mediosTransporte) {
        state.mediosTransporte = mediosTransporte
    },
    assignPaises(state, paises) {
        state.paises = paises
    },
    assignDepartamentos(state, departamentos) {
        state.departamentos = departamentos
    },
    assignComorbilidades(state, comorbilidades) {
        state.comorbilidades = comorbilidades
    },
    assignOrdenesMedicas(state, ordenesMedicas) {
        state.ordenesMedicas = ordenesMedicas
    },
    assignTiposEvolucion(state, tiposEvolucion) {
        state.tiposEvolucion = tiposEvolucion
    },
    assignSintomasAutopsia(state, sintomasAutopsia) {
        state.sintomasAutopsia = sintomasAutopsia
    },
    assignResultadosPCR(state, resultadosPCR) {
        state.resultadosPCR = resultadosPCR
    },
    assignComorbAutopsias(state, comorbAutopsias) {
        state.comorbAutopsias = comorbAutopsias
    },
    assignClasificacionesAutopsia(state, clasificacionesAutopsia) {
        state.clasificacionesAutopsia = clasificacionesAutopsia
    },
    assignCausasExternas(state, causasExternas) {
        state.causasExternas = causasExternas
    },
    assignTiposMuestra(state, tiposMuestra) {
        state.tiposMuestra = tiposMuestra
    },
    assignLaboratorios(state, laboratorios) {
        state.laboratorios = laboratorios
    },
    assignTomadores(state, tomadores) {
        state.tomadores = tomadores
    },
    assignAmbitosAtencion(state, ambitosAtencion) {
        state.ambitosAtencion = ambitosAtencion
    },
    assignTiposAislamiento(state, tiposAislamiento) {
        state.tiposAislamiento = tiposAislamiento
    },
    assignTiposSoporteVentilatorio(state, tiposSoporteVentilatorio) {
        state.tiposSoporteVentilatorio = tiposSoporteVentilatorio
    },
    assignEstadosAfectacion(state, estadosAfectacion) {
        state.estadosAfectacion = estadosAfectacion
    },
    assignGruposAtencionEspecial(state, gruposAtencionEspecial) {
        state.gruposAtencionEspecial = gruposAtencionEspecial
    },
    assignParentescos(state, parentescos) {
        state.parentescos = parentescos
    },
    assignTiposNoEfectiva(state, tiposNoEfectiva) {
        state.tiposNoEfectiva = tiposNoEfectiva
    },
    assignTiposOrdenador(state, tiposOrdenador) {
        state.tiposOrdenador = tiposOrdenador
    },
    assignEntidadesFinancieras(state, entidadesFinancieras) {
        state.entidadesFinancieras = entidadesFinancieras
    },
    assignLugaresTomaMuestra(state, lugaresTomaMuestra) {
        state.lugaresTomaMuestra = lugaresTomaMuestra
    },
    assignAmbitosMuestras(state, ambitosMuestras) {
        state.ambitosMuestras = ambitosMuestras
    },
    assignRespuestasPsicologicas(state, respuestasPsicologicas) {
        state.respuestasPsicologicas = respuestasPsicologicas
    },
    assignProtocolosBioseguridad(state, protocolosBioseguridad) {
        state.protocolosBioseguridad = protocolosBioseguridad
    },
    assignAlteracionesEmocionales(state, alteracionesEmocionales) {
        state.alteracionesEmocionales = alteracionesEmocionales
    },
    assignMunicipiosPruebas(state, municipiosPruebas){
      state.municipiosPruebas = municipiosPruebas
    },
    assignDepartamentosPruebas(state, departamentosPruebas){
      state.departamentosPruebas = departamentosPruebas
    },
    assignRazonesNoTomaMuestra(state, razonesNoTomaMuestra) {
      state.razonesNoTomaMuestra = razonesNoTomaMuestra
    },
    assignIpssPruebas(state, ipssPruebas){
      state.ipssPruebas = ipssPruebas
    },
    assignIpssVacunas(state, ipssVacunas){
      state.ipssVacunas = ipssVacunas
    },
    assignPriorizacionesVacunas(state, priorizacionesVacunas){
      state.priorizacionesVacunas = priorizacionesVacunas
    },
    assignDosisVacunas(state, dosisVacunas){
        state.dosisVacunas = dosisVacunas
    },
    assignTipoPoblaciones(state, tipoPoblaciones){
        state.tipoPoblaciones = tipoPoblaciones
    },
    assignComorbilidadesVacunas(state, comorbilidadesVacunas){
        state.comorbilidadesVacunas = comorbilidadesVacunas
    },
    assignLastDptoAplicacionVacuna(state, lastDptoAplicacionVacuna){
        state.lastDptoAplicacionVacuna = lastDptoAplicacionVacuna
    },
    assignLastMpioAplicacionVacuna(state, lastMpioAplicacionVacuna){
        state.lastMpioAplicacionVacuna = lastMpioAplicacionVacuna
    },
    assignUltimoVacunadorId(state, ultimoVacunadorId) {
        state.ultimoVacunadorId = ultimoVacunadorId
    },
    assignComorbilidadesCaracterizacion(state, comorbilidadesCaracterizacion) {
      state.comorbilidadesCaracterizacion = comorbilidadesCaracterizacion
    },
    snackbar(state, data) {
        let timeout = 8000
        let message = ''
        if (data.error) {
            if (data.error.response) {
                if (data.error.response.status === 401 || data.error.response.status === 412) {
                    data.color = 'warning'
                    message = 'La sesión ha expirado, por favor ingresar nuevamente las credenciales de usuario.'
                    this.commit('logoutUser')
                } else {
                    if (data.error.response && data.error.response.data && (data.error.response.data.errors || data.error.response.data.message)) {
                        if (data.error.response.data.message) {
                            message = data.error.response.data.message
                        } else if (typeof data.error.response.data.errors === 'string') {
                            message = data.error.response.data.errors
                        } else {
                            let errorList = data.error.response.data.errors
                            let items = []
                            errorList && Object.values(errorList).forEach((value, index) => {
                                items.push((index + 1) + `: ${value}`)
                            })
                            timeout = Object.keys(errorList).length * timeout
                            message = (`Hay ${Object.keys(errorList).length} ${Object.keys(errorList).length !== 1 ? 'errores' : 'error'}${data.message} <br> ${items.join('<br>')}`)
                        }
                    } else if (data.error.response && data.error.response.data && (data.error.response.data.error || (data.error.response.data.message && typeof data.error.response.data.message === 'string'))) {
                        message = `Hay un error ${data.message} => ${data.error.response.data.error ? data.error.response.data.error : data.error.response.data.message} `
                    } else {
                        message = `Hay un error ${data.message} => ${data.error.response.status}: ` + (data.error.response.data && data.error.response.data.message && data.error.response.data.message.Message ? data.error.response.data.message.Message : data.error.response.statusText)
                    }
                }
            } else {
                message = `Hay un error ${data.message}.`
            }
        } else {
            message = data.message
        }
        state.snackbar = {
            timeout: timeout,
            message: message,
            color: data.color
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
