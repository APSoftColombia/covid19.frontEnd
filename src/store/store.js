import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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
import modelsRCV from '../views/aps/rcv/store/models'
import RCV from '../views/aps/rcv/store/rcv'
import loading from 'Components/loading/store'
import cDataRows from 'Components/cDataRows/store'
import centroRegulador from '../views/centroRegulador/store'
import centroReguladorPersist from '../views/centroRegulador/store/persist'
import laboratorioSaludPublica from '../views/laboratorioSaludPublica/store'
import atencionMedicaRCVModule from '../modules/atencionMedica/store'

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
        firebase,
        RCV,
        modelsRCV,
        loading,
        cDataRows,
        centroRegulador,
        centroReguladorPersist,
        laboratorioSaludPublica,
        atencionMedicaRCVModule
    },
    plugins: [createPersistedState({
        paths: ['general', 'encuestas', 'formularios', 'cDataRows', 'centroReguladorPersist']
    })]
})
