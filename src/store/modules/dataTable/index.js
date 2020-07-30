// state
const state = {
    tables: {
        tablaTamizajes: 0,
        tablaTamizajesVersion: 5,
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
        tablaNexosVersion: 2,
        tablaBarriosVeredas: 0,
        tablaBarriosVeredasVersion: 1,
        tablaMuestras: 0,
        tablaMuestrasVersion: 1
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
