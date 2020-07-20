import Vue from 'vue'
import { operadores, tiposPreguntasPadre, anchosPantallaPreguntas, nombresCalles, cardinales, adicionalesRural, adicionalesUrbana, ABCDario } from './data'
/**
 * Header Module
 */

const state = {
    formularios: [],
    tiposRespuesta: [],
    tiposFormulario: [],
    fuentesDatos: [],
    operadores,
    tiposPreguntasPadre,
    anchosPantallaPreguntas,
    // state direcciones
    nombresCalles,
    cardinales,
    adicionalesRural,
    adicionalesUrbana,
    ABCDario
}

// getters
const getters = {
    ABCDario (state) {
        return state.ABCDario
    },
    adicionalesUrbana (state) {
        return state.adicionalesUrbana
    },
    adicionalesRural (state) {
        return state.adicionalesRural
    },
    cardinales (state) {
        return state.cardinales
    },
    nombresCalles (state) {
        return state.nombresCalles
    },
    fuentesDatos (state) {
        return state.fuentesDatos
    },
    formularios (state) {
        return state.formularios
    },
    formularioByUUID: state => uuid => {
        return state.formularios.find(x => x.uuid === uuid)
    },
    tiposRespuesta (state) {
        return state.tiposRespuesta
    },
    tiposFormulario (state) {
        return state.tiposFormulario
    },
    operadores (state) {
        return state.operadores
    },
    tiposPreguntasPadre (state) {
        return state.tiposPreguntasPadre
    },
    anchosPantallaPreguntas (state) {
        return state.anchosPantallaPreguntas
    }
}

// actions
const actions = {
    getFuentesDatos (context){
        return new Promise(resolve => {
            Vue.axios.get(`fuente-datos`)
                .then(response => {
                    context.commit('assignFuentesDatos', response.data)
                    resolve(true)
                })
                .catch(error => {
                    setTimeout(() => {
                        context.commit('snackbar', {color: 'error', message: `al traer las fuentes de datos.`, error: error})
                        resolve(false)
                    }, 500)
                })
        })
    },
    async guardarFuenteDatos (context, fuente){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                let request = fuente.id ? Vue.axios.put(`fuente-datos/${fuente.id}`, fuente) : Vue.axios.post(`fuente-datos`, fuente)
                request
                    .then(response => {
                        console.log('respose fuente', response)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al guardar la fuente de datos.`, error: error.response.data})
                        resolve(false)
                    })
            } else {
                context.commit('snackbar', {color: 'warning', message: `no hay conexión a internet para realizar ésta operación.`})
                resolve(false)
            }
        })
    },
    async getFormularios (context){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`formulario`)
                    .then(response => {
                        context.commit('assignFormularios', response.data)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al traer los formularios registrados.`, error: error})
                        resolve(false)
                    })
            } else {
                resolve(true)
            }
        })
    },
    async eliminarFormulario (context, uuid){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.delete(`formulario/${uuid}`)
                    .then(() => {
                        context.commit('deleteFormulario', uuid)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: error.response.data.message})
                        resolve(false)
                    })
            } else {
                context.commit('snackbar', {color: 'warning', message: `no hay conexión a internet para realizar ésta operación.`})
                resolve(true)
            }
        })
    },
    async getFormulario (context, uuid = null){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`formulario/${uuid ? uuid : 'new'}`)
                    .then(response => {
                        context.commit('assignTiposFormulario', response.data.parametros.tipos_formulario)
                        context.commit('assignTiposRespuesta', response.data.parametros.tipos_respuesta)
                        if (response.data.data) {
                            context.commit('assignFormulario', response.data.data)
                        }
                        resolve(true)
                    })
                    .catch(error => {
                        setTimeout(() => {
                            context.commit('snackbar', {color: 'error', message: `al traer la datos del formulario.`, error: error})
                            resolve(false)
                        }, 500)
                    })
            } else {
                resolve(true)
            }
        })
    },
    async guardarFormulario (context, formulario){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                let request = formulario.id ? Vue.axios.put(`formulario/${formulario.id}`, formulario) : Vue.axios.post(`formulario`, formulario)
                request
                    .then(response => {
                        context.commit('assignFormulario', response.data)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al guardar el formulario.`, error: error.response.data})
                        resolve(false)
                    })
            } else {
                context.commit('snackbar', {color: 'warning', message: `no hay conexión a internet para realizar ésta operación.`})
                resolve(true)
            }
        })
    }
}

// mutations
const mutations = {
    assignFuentesDatos (state, fuentes) {
        state.fuentesDatos = fuentes
    },
    assignFormularios (state, formularios) {
        state.formularios = formularios
    },
    assignFormulario (state, formulario) {
        let indexFormularios = state.formularios.findIndex(x => x.uuid === formulario.uuid)
        state.formularios.splice(indexFormularios > -1 ? indexFormularios : 0, indexFormularios > -1 ? 1 : 0, formulario)
    },
    assignTiposRespuesta (state, tipos) {
        state.tiposRespuesta = tipos
    },
    assignTiposFormulario (state, tipos) {
        state.tiposFormulario = tipos
    },
    deleteFormulario (state, uuid) {
        let indexFormularios = state.formularios.findIndex(x => x.uuid === uuid)
        if (indexFormularios > -1) state.formularios.splice(indexFormularios, 1)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
