/**
 * Header Module
 */
import { itemsMenu } from './data'

const state = {
    itemsMenu
}

// getters
const getters = {
    itemsMenu: (state, getters) => {
        let menuPrincipal = []
        // if (getters.getPermission('inicio')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 1))
        menuPrincipal.push(state.itemsMenu.find(x => x.id === 1))
        if (getters.getPermission('formulario-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 3))
        if (getters.getPermission('encuesta-index')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 5))
        if (getters.getPermission('fuenteDatos-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 6))
        if (getters.getPermission('indicadores-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 7))
        if (getters.getPermission('mapa-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 13))
        if (getters.getPermission('poblacion-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 9))
        // if (getters.getPermission('covid-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 14))
        if (getters.getPermission('covid-tamizajeVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 18))
        if (getters.getPermission('hogaresCovid-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 23))
        if (getters.getPermission('covid-reporteComunitarioVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 19))
        if (getters.getPermission('covid-autopsiaVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 20))
        if (getters.getPermission('covid-llamadaVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 21))
        if (getters.getPermission('covid-vehiculoVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 22))
        if (getters.getPermission('indicadoresCovid-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 15))
        if (getters.getPermission('reportesCovid-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 16))
        if (getters.getPermission('mapaCovid-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 17))
        // if (getters.getPermission('complementos-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 2))
        if (getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 2))
        if (getters.getPermission('covid-nexosVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 24))
        if (getters.getPermission('covid-muestrasVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 26))
        if (getters.getPermission('covid-parametrosVer') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 25))
        if (getters.getPermission('usuario-index') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 4))
        // RCV
        if (getters.getPermission('aps-encuestasRCVIndex') && getters.onLine) menuPrincipal.push(state.itemsMenu.find(x => x.id === 27))
        // menuPrincipal.push(state.itemsMenu.find(x => x.id === 8))
        // menuPrincipal.push(state.itemsMenu.find(x => x.id === 10))
        // menuPrincipal.push(state.itemsMenu.find(x => x.id === 11))
        // menuPrincipal.push(state.itemsMenu.find(x => x.id === 12))
        return menuPrincipal
    }
}

// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
    state,
    getters,
    actions,
    mutations
}
