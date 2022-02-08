// state
import Vue from 'vue'

const state = {
    attentionsChangeCounter: 0,
    loadsChangeCounter: 0,
    complementos: {
        prestadores: [],
        usuarios: [],
        estadosLoads: [
            {text: 'Exitoso', value: 'Exitoso'},
            {text: 'Fallido', value: 'Fallido'},
        ]
        // estados: [
        //     {text: 'Activo', value: 'Activo'},
        //     {text: 'Inasistente', value: 'Inasistente'},
        //     {text: 'Fallecido', value: 'Fallecido'},
        //     {text: 'Desafiliado', value: 'Desafiliado'}
        // ]
    }
}

// getters
const getters = {
}

// actions
const actions = {
    getComplements(context) {
        Vue.axios.get('archivos-atencion-data-filters')
            .then(response => {
                context.commit('SET_COMPLENTES', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los complementos de cargues masivos.`,
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    SET_COMPLENTES (state, complementos) {
        state.complementos.prestadores = complementos.prestadores
        state.complementos.usuarios = complementos.usuarios
    },
    SET_COUNTER (state) {
        state.attentionsChangeCounter++
        state.loadsChangeCounter++
    },
    SET_ATTENTIONS_COUNTER (state) {
        state.attentionsChangeCounter++
    },
    SET_LOADS_COUNTER (state) {
        state.loadsChangeCounter++
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
