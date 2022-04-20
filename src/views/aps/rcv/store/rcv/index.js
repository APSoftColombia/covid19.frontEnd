// state
import Vue from 'vue'

const state = {
    complementos: []
}

// getters
const getters = {
    complementosRCV: state => {
        return state.complementos
    }
}

// actions
const actions = {
    getComplementosRCV(context) {
        Vue.axios.get(`complementos-rcv`)
            .then(response => {
                context.commit('assignComplementos', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los complementos para la encuesta.`,
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    assignComplementos(state, complementos) {
        state.complementos = complementos
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
