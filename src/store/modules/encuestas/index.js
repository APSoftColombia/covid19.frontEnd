/**
 * Header Module
 */
import Vue from 'vue'
import { motivosNoEncuesta } from './data'
const state = {
    itemsFormularios: [],
    encuestas: [],
    encuestasLite: [],
    encuestaEnCurso: false,
    motivosNoEncuesta
}

// getters
const getters = {
    itemsFormularios: state => {
        return state.itemsFormularios
    },
    encuestas: state => {
        return state.encuestas
    },
    encuestasLite: state => {
        return state.encuestasLite
    },
    encuestaEnCurso: state => {
        return state.encuestaEnCurso
    },
    encuestaByUUID: state => uuid => {
        return state.encuestas.find(x => x.uuid === uuid)
    },
    formularioById: state => id => {
        return state.itemsFormularios.find(x => x.id === Number(id))
    }
}

// actions
const actions = {
    async newEncuesta (context, formulariouuid = null){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`formulario/${formulariouuid}`)
                    .then(response => {
                        context.commit('assignFormulario', response.data.data)
                        context.commit('assignEncuestaEnCurso')
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al traer los datos para una nueva encuesta.`, error: error})
                        resolve(false)
                    })
            } else {
                context.commit('assignEncuestaEnCurso')
                resolve(true)
            }
        })
    },
    async obtenerEncuesta (context, uuid){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`recuperar-encuesta/${uuid}`)
                    .then(response => {
                        // context.commit('assignEncuesta', response.data)
                        // context.commit('assignEncuestaEnCurso')
                        resolve(response.data)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al traer los datos de la encuesta.`, error: error})
                        resolve(false)
                    })
            } else {
                context.commit('assignEncuestaEnCurso')
                resolve(true)
            }
        })
    },
    async guardarEncuesta (context, encuesta){
        return await new Promise(resolve => {
            encuesta.fecha_sincronizado = null
            if (!encuesta.created_at) encuesta.created_at = Vue.prototype.moment().format('YYYY-MM-DD HH:mm:ss')
            encuesta.updated_at = Vue.prototype.moment().format('YYYY-MM-DD HH:mm:ss')
            if (context.getters.onLine) {
                Vue.axios.post(`guardar-encuesta`, encuesta)
                    .then(() => {
                        encuesta.fecha_sincronizado = Vue.prototype.moment().format('YYYY-MM-DD HH:mm:ss')
                        context.commit('assignEncuesta', encuesta)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al guardar el formulario. ${error.response ? error.response.data.message : ''}`})
                        resolve(false)
                    })
            } else {
                context.commit('assignEncuesta', encuesta)
                resolve(true)
            }
        })
    },
    async getEncuestasFormulario (context, formulariouuid) {
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                Vue.axios.get(`recuperar-encuestas?formulario_uuid=${formulariouuid}`)
                    .then(response => {
                        context.commit('assignEncuestasLite', response.data)
                        resolve(true)
                    })
                    .catch(error => {
                        context.commit('snackbar', {color: 'error', message: `al recuperar las encuestas.`, error: error.response.data})
                        resolve(false)
                    })
            } else {
                resolve(true)
            }
        })
    },
    async startDBEncuestas (context) {
        return await new Promise(resolve => {
            let db = window.indexedDB.open('encuestas', 1)
            db.onsuccess = function(event) {
                let active = event.target.result
                if (active.objectStoreNames.contains('registros')) {
                    resolve(true)
                }
            }
            db.onupgradeneeded = (event) => {
                let active = event.target.result
                let objectStore = active.createObjectStore("registros", { keyPath: "uuid" })
                objectStore.createIndex("uuid", "uuid", { unique: true })
                resolve(true)
            }
            db.onerror = function(event) {
                context.commit('snackbar', {color: 'error', message: `No se pudo hacer la comprobación de la base de datos de encuestas. ${event.target.result}`})
                resolve(false)
            }
        })
    },
    async getEncuestasIndexDB (context, uuidFormulario) {
        return await new Promise(resolve => {
            let db = window.indexedDB.open('encuestas', 1)
            db.onsuccess = function(event) {
                let active = event.target.result
                let data = active.transaction('registros', 'readonly')
                let object = data.objectStore('registros')
                let elementos = []
                object.openCursor().onsuccess = function (event) {
                    let result = event.target.result
                    if (!result) return
                    elementos.push(result.value)
                    result.continue()
                }
                data.oncomplete = function () {
                    resolve(elementos.filter(x => x.formulario_uuid === uuidFormulario))
                }
                data.onerror = () => {
                    resolve([])
                }
            }
            db.onerror = function(event) {
                context.commit('snackbar', {color: 'error', message: `No se pudierón recuperar los registros de las encuestas. ${event.target.result}`})
                resolve(false)
            }
        })
    }
    // async obtenerEncuesta (context, uuid) {
    //     return await new Promise(resolve => {
    //         let db = window.indexedDB.open('encuestas', 1)
    //         db.onsuccess = function(event) {
    //             let active = event.target.result
    //             let data = active.transaction('registros', 'readonly')
    //             let object = data.objectStore('registros').index("uuid").get(uuid)
    //             object.onsuccess = function (event) {
    //                 if (!event.target.result) {
    //                     context.commit('snackbar', {color: 'warning', message: `No se encontró la encuesta.`})
    //                 }
    //                 resolve(event.target.result || null)
    //             }
    //             object.onerror = function() {
    //                 context.commit('snackbar', {color: 'warning', message: `Error al realizar la búsqueda de la encuesta.`})
    //                 resolve(null)
    //             }
    //         }
    //         db.onerror = function(event) {
    //             context.commit('snackbar', {color: 'error', message: `No se pudo recuperar el registro de la encuesta. ${event.target.result}`})
    //             resolve(null)
    //         }
    //     })
    // }
}

// mutations
const mutations = {
    assignEncuesta (state, encuesta) {
        let db = window.indexedDB.open('encuestas', 1)
        db.onsuccess = function(event) {
            let active = event.target.result
            let object = active.transaction('registros', 'readwrite').objectStore('registros')
            object.put(encuesta)
        }

    },
    assignEncuestasLite (state, encuestas) {
        state.encuestasLite = encuestas
    },
    assignEncuestaEnCurso (state, estado = true) {
        state.encuestaEnCurso = estado
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
