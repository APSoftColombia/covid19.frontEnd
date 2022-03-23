import lodash from 'lodash'
import Vue from 'vue'

const state = {
    ref_nuevasRerefencias: [],
    ref_nuevasRerefenciasKeys: [],
    ref_showAlert: false,
    ref_nuevasNotificar: [],
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
    notificadoNuevasReferenciaId (state, id) {
        const index = state.ref_nuevasNotificar.findIndex(x => x === id)
        if (index > -1) state.ref_nuevasNotificar.splice(index, 1)
    },
    notificadoNuevasReferencias (state) {
        state.ref_showAlert = false
        state.ref_nuevasNotificar = []
    },
    assignNuevasReferencias (state, referencias) {
        let count = 0
        let paraNotificar = []
        referencias.forEach(x => {
            const esta = (lodash.includes(state.ref_nuevasRerefenciasKeys, x.id) ? 0 : 1)
            if(esta) {
                count++
                paraNotificar.push(x.id)
            }
        })
        state.ref_nuevasRerefencias = referencias
        state.ref_nuevasRerefenciasKeys = referencias.map(x => x.id)
        if (count) {
            state.ref_showAlert = true
            state.ref_nuevasNotificar = paraNotificar
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}