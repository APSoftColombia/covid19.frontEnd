// state
import Vue from 'vue'

const state = {
    labspDestinos: [],
    labspEpss: [],
    labspEstadosProceso: [],
    labspEventos: [],
    labspIpss: [],
    labspJustificaciones: [],
    labspProgramas: [],
    labspTiposAfiliacion: [],
    labspTiposDocumento: [],
    labspTiposMuestras: [],
    labspTiposPoblacion: [],
    labspEstadosIngresoMuestra: []
}

// getters
const getters = {
    labspDestinos: state => state.labspDestinos,
    labspEpss: state => state.labspEpss,
    labspEstadosProceso: state => state.labspEstadosProceso,
    labspEventos: state => state.labspEventos,
    labspIpss: state => state.labspIpss,
    labspJustificaciones: state => state.labspJustificaciones,
    labspProgramas: state => state.labspProgramas,
    labspTiposAfiliacion: state => state.labspTiposAfiliacion,
    labspTiposDocumento: state => state.labspTiposDocumento,
    labspTiposMuestras: state => state.labspTiposMuestras,
    labspTiposPoblacion: state => state.labspTiposPoblacion,
    labspEstadosIngresoMuestra: state => state.labspEstadosIngresoMuestra
}


// actions
const actions = {
    getComplementosEstudiosLDSP(context) {
        Vue.axios.get('lab-complementos-estudios')
            .then(response => {
                context.commit('assignComplementosEstudiosLDSP', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: 'al recuperar los complementos del módulo de Laboratorio de Salud Pública.',
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    assignComplementosEstudiosLDSP (state, complementos) {
        state.labspDestinos = complementos.destinos
        state.labspEpss = complementos.epss
        state.labspEstadosProceso = complementos.estadosProceso
        state.labspEventos = complementos.eventos
        state.labspIpss = complementos.ipss
        state.labspJustificaciones = complementos.justificaciones
        state.labspProgramas = complementos.programas
        state.labspTiposAfiliacion = complementos.tiposAfiliacion
        state.labspTiposDocumento = complementos.tiposDocumento
        state.labspTiposMuestras = complementos.tiposMuestras
        state.labspTiposPoblacion = complementos.tiposPoblacion
        state.labspEstadosIngresoMuestra = complementos.estadosIngresoMuestra
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}