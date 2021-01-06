// state
const state = {
    tables: {
        tablaTamizajes: 0,
        tablaTamizajesVersion: 7,
        tablaTamizajesLight: 0,
        tablaTamizajesLightVersion: 4,
        tablaReportesComunitarios: 0,
        tablaReportesComunitariosVersion: 4,
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
        tablaBitacorasRcvVersion: 0
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
