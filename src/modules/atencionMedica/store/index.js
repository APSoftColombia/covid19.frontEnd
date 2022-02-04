// state
const state = {
    attentionsChangeCounter: 0,
    loadsChangeCounter: 0,
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
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
