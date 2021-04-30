// state
import Vue from 'vue'

const state = {
    ref_epss: [],
    ref_ipss: [],
    ref_estadosEgreso: [],
    ref_modalidadesServicio: [],
    ref_tiposAmbulancia: [],
    ref_tiposTraslados: []
}

// getters
const getters = {
    ref_epss: state => state.ref_epss,
    ref_ipss: state => state.ref_ipss,
    ref_estadosEgreso: state => state.ref_estadosEgreso,
    ref_modalidadesServicio: state => state.ref_modalidadesServicio,
    ref_tiposAmbulancia: state => state.ref_tiposAmbulancia,
    ref_tiposTraslados: state => state.ref_tiposTraslados
}


// actions
const actions = {
    getComplementosReferencias(context) {
        Vue.axios.get(`complementos-centro-regulador`)
            .then(response => {
                console.log('response.data', response.data)
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
        console.log('complementos', complementos)
        state.ref_epss = complementos.epss
        state.ref_ipss = complementos.ipss
        state.ref_estadosEgreso = complementos.estados_egreso
        state.ref_modalidadesServicio = complementos.mod_servicios
        state.ref_tiposAmbulancia = complementos.tipos_ambulancias
        state.ref_tiposTraslado = complementos.tipos_traslados
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}