import lodash from 'lodash'
import Vue from 'vue'

const state = {
    ref_nuevasRerefencias: [],
    ref_nuevasRerefenciasKeys: [],
    ref_showAlert: false
}

// getters
const getters = {
}


// actions
const actions = {
    getNuevasReferencias(context) {
        Vue.axios.get(`nuevas-referencias`)
            .then(response => {
                context.commit('assignNuevasReferencias', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los registros de nuevas referencias.`,
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    notificadoNuevasReferencias (state) {
        state.ref_showAlert = false
    },
    assignNuevasReferencias (state, referencias) {
        let count = 0
        referencias.forEach(x => {
            count = count + (lodash.includes(state.ref_nuevasRerefenciasKeys, x.id) ? 0 : 1)
        })
        state.ref_nuevasRerefencias = referencias
        state.ref_nuevasRerefenciasKeys = referencias.map(x => x.id)
        if (count) state.ref_showAlert = true
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}