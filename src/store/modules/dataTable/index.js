// state
const state = {
    tables: {
        tablaTamizajes: 0,
        tablaTamizajesVersion: 9,
        tablaTamizajesLight: 0,
        tablaTamizajesLightVersion: 5,
        tablaReportesComunitarios: 0,
        tablaReportesComunitariosVersion: 6,
        tablaLlamadas: 0,
        tablaLlamadasVersion: 2,
        tablaAutopsias: 0,
        tablaAutopsiasVersion: 2,
        tablaHogares: 0,
        tablaHogaresVersion: 2,
        tablaPersonasSinHogar: 0,
        tablaPersonasSinHogarVersion: 2,
        tablaNexos: 0,
        tablaNexosVersion: 3,
        tablaBarriosVeredas: 0,
        tablaBarriosVeredasVersion: 2,
        tablaMuestras: 0,
        tablaMuestrasVersion: 1,
        tablaEncuestasRCV: 0,
        tablaEncuestasRCVVersion: 7,
        tablaUsers: 0,
        tablaUsersVersion: 0,
        tablaCets: 0,
        tablaCetsVersion: 1,
        tablaDemandaInducida: 0,
        tablaDemandaInducidaVersion: 9,
        tablaBitacorasRcv: 0,
        tablaBitacorasRcvVersion: 1,
        tablaTomaMuestrasIPS: 0,
        tablaTomaMuestrasIPSVersion: 3,
        tablaVacunacion: 0,
        tablaVacunacionVersion: 4
    }
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
    reloadTable(state, table) {
        state.tables[table] = state.tables[table] + 1
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
