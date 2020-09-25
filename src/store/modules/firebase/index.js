import {db} from '../../../plugins/firebase'
// state
const state = {
    versionFirebase: localStorage.getItem('version_firebase'),
    reloadComplementos: localStorage.getItem('reload_complementos'),
    rF5: 0
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
        // db.collection('versiones').doc('4aUoNgJxWiPvy7SEusZX').onSnapshot(convo => {
        console.log('context.getters.datosEmpresa', context.getters.datosEmpresa)
        db.collection('versiones').doc(context.getters.datosEmpresa.datos_firebase).onSnapshot(convo => {
            console.log('seaaaaa')
            let source = convo && convo.data() ? convo.data() : null
            context.commit('onReload', source ? source.version : null)
        })
    }
}

// mutations
const mutations = {
    assingRF5 (state, reload) {
        console.log('asignando', reload)
        state.rF5 = reload
    },
    onReload (state, version) {
        if (!version || (state.versionFirebase !== version.toString())) {
            localStorage.setItem('version_firebase',version)
            state.reloadComplementos = 1
            localStorage.setItem('reload_complementos',1)
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
