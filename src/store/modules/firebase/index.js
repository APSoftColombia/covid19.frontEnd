import {db} from '../../../plugins/firebase'
// state
const state = {
    versionFirebase: localStorage.getItem('version_firebase'),
    reloadComplementos: localStorage.getItem('reload_complementos'),
    versionF5: localStorage.getItem('versionF5'),
    rF5: localStorage.getItem('rF5')
}

// getters
const getters = {
    reloadComplementos: state => {
        return ((typeof state.reloadComplementos !== 'undefined') && (state.reloadComplementos !== null)) ? parseInt(state.reloadComplementos) : 1
    },
    rF5: state => {
        return ((typeof state.rF5 !== 'undefined') && (state.rF5 !== null)) ? parseInt(state.rF5) : 1
    }
}

// actions
const actions = {
    async getReloadFirebase (context) {
        db.collection('versiones').doc('4aUoNgJxWiPvy7SEusZX').onSnapshot(convo => {
            console.log('seaaaaa')
            let source = convo && convo.data() ? convo.data() : null
            context.commit('onReloadF5', source ? source.versionF5 : null)
            context.commit('onReload', source ? source.version : null)
        })
    }
}

// mutations
const mutations = {
    onReload (state, version) {
        if (!version || (state.versionFirebase !== version.toString())) {
            localStorage.setItem('version_firebase',version)
            state.reloadComplementos = 1
            localStorage.setItem('reload_complementos',1)
        }
    },
    onReloadF5 (state, version) {
        if (!version || (state.versionF5 !== version.toString())) {
            state.rF5 = 1
            localStorage.setItem('versionF5',version)
        }
    },
    offReload (state) {
        state.reloadComplementos = 0
        localStorage.setItem('reload_complementos',0)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
