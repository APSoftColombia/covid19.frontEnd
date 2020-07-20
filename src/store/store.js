import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// import VuexPersistence from 'vuex-persist'

// modules
import auth from './modules/auth'
import chat from './modules/chat'
import general from './modules/general'
import settings from './modules/settings'
import header from './modules/header'
import encuestas from './modules/encuestas'
import formularios from './modules/formularios'
import encuestado from './modules/encuestado'
import afiliados from './modules/afiliados'
import dataTable from './modules/dataTable'
import models from './modules/models'
import firebase from './modules/firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        auth,
        chat,
        general,
        settings,
        header,
        encuestas,
        formularios,
        encuestado,
        afiliados,
        dataTable,
        models,
        firebase
    },
    // plugins: [new VuexPersistence().plugin]
    plugins: [createPersistedState({
        paths: ['general', 'encuestas', 'formularios']
    })]
})
