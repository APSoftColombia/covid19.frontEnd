import Vue from "vue";

const state = {
}

// getters
const getters = {
}

// actions
const actions = {
    async searchAfiliadoVacunacionIdentidadServer (context, identificacion) {
        return await new Promise(resolve => {
            Vue.axios.get(`dosis-persona/${identificacion}`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    context.commit('snackbar', {color: 'error', message: `al hacer la búsqueda del afiliado.`, error: error})
                    resolve(null)
                })
        })
    },
    async searchAfiliadoIdentidadServer (context, identificacion) {
        return await new Promise(resolve => {
            Vue.axios.get(`afiliado_tamizaje/${identificacion}`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    context.commit('snackbar', {color: 'error', message: `al hacer la búsqueda del afiliado.`, error: error})
                    resolve(null)
                })
        })
    },
    async searchAfiliadoIdentidad (context, identidad) {
        return await new Promise(resolve => {
            let request = window.indexedDB.open('afiliados', 1)
            request.onsuccess = function(event) {
                var db = event.target.result
                if (db.objectStoreNames.contains('personas')) {
                    var getData = db.transaction("personas", "readonly").objectStore("personas").index("numero_documento_identidad").get(identidad)
                    getData.onsuccess = function(event) {
                        if (!event.target.result) {
                            context.commit('snackbar', {color: 'warning', message: `No se encontró un afiliado con éste número de identificación.`})
                        }
                        resolve(event.target.result || null)
                    }
                    getData.onerror = function() {
                        context.commit('snackbar', {color: 'warning', message: `Error en la búsqueda de afiliado por éste número de identificación.`})
                        resolve(null)
                    }
                } else {
                    resolve(null)
                }
            }
        })
    },
    async getAllAfiliados (context, force = false){
        return await new Promise(resolve => {
            if (context.getters.onLine) {
                let request = window.indexedDB.open('afiliados', 1)
                request.onsuccess = function(event) {
                    var db = event.target.result
                    if (db.objectStoreNames.contains('personas')) {
                        if (force) {
                            let datos = []
                            Vue.axios.get(`tabla/maestroAfiliados`)
                                .then(response => {
                                    datos = response.data
                                    let deletex = window.indexedDB.deleteDatabase('afiliados')
                                    deletex.onsuccess = function() {
                                        let request = window.indexedDB.open('afiliados', 1)
                                        request.onupgradeneeded = function(event) {
                                            var db = event.target.result;
                                            var objectStore = db.createObjectStore("personas", { keyPath: "id" });
                                            objectStore.createIndex("numero_documento_identidad", "numero_documento_identidad", { unique: false })

                                            objectStore.transaction.oncomplete = function() {
                                                var customerObjectStore = db.transaction("personas", "readwrite").objectStore("personas");
                                                datos.forEach(x => customerObjectStore.add(x))
                                                resolve(true)
                                            }
                                        }
                                    }
                                })
                                .catch(error => {
                                    context.commit('snackbar', {color: 'error', message: `al traer los datos de los afiliados.`, error: error})
                                    resolve(false)
                                })
                        }
                    } else {
                        let datos = []
                        Vue.axios.get(`tabla/maestroAfiliados`)
                            .then(response => {
                                datos = response.data
                                let deletex = window.indexedDB.deleteDatabase('afiliados')
                                deletex.onsuccess = function() {
                                    let request = window.indexedDB.open('afiliados', 1)
                                    request.onupgradeneeded = function(event) {
                                        var db = event.target.result;
                                        var objectStore = db.createObjectStore("personas", { keyPath: "id" });
                                        objectStore.createIndex("numero_documento_identidad", "numero_documento_identidad", { unique: false })

                                        objectStore.transaction.oncomplete = function() {
                                            var customerObjectStore = db.transaction("personas", "readwrite").objectStore("personas");
                                            datos.forEach(x => customerObjectStore.add(x))
                                            resolve(true)
                                        }
                                    }
                                }
                            })
                            .catch(error => {
                                context.commit('snackbar', {color: 'error', message: `al traer los datos de los afiliados.`, error: error})
                                resolve(false)
                            })
                    }
                }
            } else {
                resolve(true)
                context.commit('snackbar', {color: 'warning', message: `no hay conexión a internet para realizar ésta operación.`})
            }
        })
    }
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
