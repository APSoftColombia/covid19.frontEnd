// state
import Vue from 'vue'

const state = {
    ref_epss: [],
    ref_ipss: [],
    ref_medios: [],
    ref_especialidades: [],
    ref_estadosEgreso: [],
    ref_modalidadesServicio: [],
    ref_tiposAmbulancia: [],
    ref_tiposTraslados: [],
    ref_cr_tiposPoblacion: [],
    ref_estados: [
        { key: 'Solicitud', color: 'red' },
        { key: 'Presentado', color: 'light-blue lighten-1' },
        { key: 'Aceptado', color: 'blue' },
        { key: 'Ips Seleccionada', color: 'indigo' },
        { key: 'Transporte Seleccionado', color: 'yellow darken-1' },
        { key: 'En Traslado', color: 'amber' },
        { key: 'Traslado Finalizado', color: 'orange' },
        { key: 'Proceso Terminado', color: 'green' },
        { key: 'Cancelado', color: 'grey' },
    ],
    ref_motivos_anulacion: []
}

// getters
const getters = {
    ref_epss: state => state.ref_epss,
    ref_ipss: state => state.ref_ipss,
    ref_medios: state => state.ref_medios,
    ref_especialidades: state => state.ref_especialidades,
    ref_estadosEgreso: state => state.ref_estadosEgreso,
    ref_modalidadesServicio: state => state.ref_modalidadesServicio,
    ref_tiposAmbulancia: state => state.ref_tiposAmbulancia,
    ref_tiposTraslados: state => state.ref_tiposTraslados,
    ref_cr_tiposPoblacion: state => state.ref_cr_tiposPoblacion,
    ref_estados: state => state.ref_estados,
    ref_motivos_anulacion: state => state.ref_motivos_anulacion,
}


// actions
const actions = {
    getComplementosReferencias(context) {
        Vue.axios.get(`complementos-centro-regulador`)
            .then(response => {
                context.commit('assignComplementosReferencias', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los complementos de referencias.`,
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    assignComplementosReferencias (state, complementos) {
        state.ref_epss = complementos.epss
        state.ref_ipss = complementos.ipss
        state.ref_medios = complementos.medios
        state.ref_especialidades = complementos.especialidades
        state.ref_estadosEgreso = complementos.estados_egreso
        state.ref_modalidadesServicio = complementos.mod_servicios
        state.ref_tiposAmbulancia = complementos.tipos_ambulancias
        state.ref_tiposTraslados = complementos.tipos_traslados
        state.ref_cr_tiposPoblacion = complementos.tipoPoblaciones
        state.ref_motivos_anulacion = complementos.motivos_anulacion
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}