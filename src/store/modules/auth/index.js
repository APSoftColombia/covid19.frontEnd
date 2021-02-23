/**
 * Auth Module
 */
import Vue from 'vue'
import Nprogress from 'nprogress'
import router from '../../../router'

const state = {
    token_type: JSON.parse(localStorage.getItem('token_type')),
    access_token: JSON.parse(localStorage.getItem('access_token')),
    refresh_token: JSON.parse(localStorage.getItem('refresh_token')),
    user: JSON.parse(localStorage.getItem('user')),
    permisos: JSON.parse(localStorage.getItem('permisos')),
    hostPort: '9000',
    packageVersion: JSON.parse(JSON.stringify(require('../../../../package.json').version))
}

// getters
const getters = {
    appVersion: (state) => {
        let v = state.packageVersion.split('.')
        return [v[0], v[1]].join('.')
    },
    getUser: state => {
        return state.user
    },
    getUrlAvatar: state => {
        return state.user && state.user.avatar ? `${window.location.origin}/${state.user.avatar.imagen}` : '/static/avatars/default.png'
    },
    getPermission: state => namePermission => {
        return state.permisos && !!state.permisos.find(x => x.nombre === namePermission)
    },
    roles: state => {
        if (state.user && state.user.roles && state.user.roles.length) {
            return state.user.roles
        }
        return []
    },
    getPermissionModule: state => modulo => {
        if (state.user && state.permisos && state.permisos.length) {
            return state.permisos.filter(x => x.nombre.toString().toLowerCase().indexOf(modulo.toString().toLowerCase()) > -1).map(x => x.nombre.split(`${modulo}-`)[1]).reduce((value, key) => {
                value[key] = value[key] || true
                return value
            }, {})
        } else {
            return {}
        }
    }
}

// actions
const actions = {
    reloadUsuario(context) {
        Vue.axios.get('user-fresh')
            .then(response => {
                context.commit('refreshUser', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {color: 'error', message: `al recuperar los datos del usuario.`, error: error})
            })
    },
    async signIn(context, user){
        Vue.axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:${context.state.hostPort}`
        // Vue.axios.defaults.baseURL = `https://sosaludaps.tk:9000`
        Nprogress.start()
        await new Promise(resolve => {
            Vue.axios.post('/api/login', user)
                .then(response => {
                    let dataToken = {
                        grant_type: response.data.grant_type,
                        client_id: response.data.client_id,
                        client_secret: response.data.client_secret,
                        username: response.data.user.email,
                        password: user.password,
                        scope: ''
                    }
                    let responseUser = response.data.user
                    let permisosUsuario = response.data.permisos
                    Vue.axios.post('/oauth/token', dataToken)
                        .then(response => {
                            let dataSuccess = {
                                token_type: response.data.token_type,
                                access_token: response.data.access_token,
                                refresh_token: response.data.refresh_token,
                                user: responseUser,
                                permisos: permisosUsuario
                            }
                            Nprogress.done()
                            resolve(true)
                            setTimeout(() => {
                                context.commit('loginUserSuccess', dataSuccess)
                                context.commit('assignTokenAxios')
                                resolve(true)
                            }, 500)
                        })
                        .catch(error => {
                            setTimeout(() => {
                                Nprogress.done()
                                context.commit('snackbar', {color: 'error', message: `al iniciar sesión.`, error: error})
                                resolve(false)
                            }, 500)
                        })
                })
                .catch(error => {
                    setTimeout(() => {
                        Nprogress.done()
                        context.commit('snackbar', {color: 'error', message: `al iniciar sesión.`, error: error})
                        resolve(false)
                    }, 500)
                })
        })
    },
}

// mutations
const mutations = {
    refreshUser (state, data) {
        state.user = data.user
        state.permisos = data.permisos
        localStorage.setItem('user',JSON.stringify(state.user))
        localStorage.setItem('permisos',JSON.stringify(state.permisos))
    },
    loginUserSuccess (state, data) {
        state.user = data.user
        state.token_type = data.token_type
        state.access_token = data.access_token
        state.refresh_token = data.refresh_token
        state.permisos = data.permisos
        localStorage.setItem('user',JSON.stringify(state.user))
        localStorage.setItem('token_type',JSON.stringify(state.token_type))
        localStorage.setItem('access_token',JSON.stringify(state.access_token))
        localStorage.setItem('refresh_token',JSON.stringify(state.refresh_token))
        localStorage.setItem('permisos',JSON.stringify(state.permisos))
        router.push({name: 'Home'})
    },
    changeAvatar (state, data) {
        state.user.avatar = data
        localStorage.setItem('user',JSON.stringify(state.user))
    },
    assignTokenAxios (state) {
        Vue.axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:${state.hostPort}`
        // Vue.axios.defaults.baseURL = `https://sosaludaps.tk:9000`
        if (state.access_token && state.token_type) {
            Vue.axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:${state.hostPort}/api`
            // Vue.axios.defaults.baseURL = `https://sosaludaps.tk:9000/api`
            Vue.axios.defaults.headers.common['Authorization'] = `${state.token_type} ${state.access_token}`
        }
    },
    logoutUser (state) {
        Nprogress.start()
        setTimeout(() => {
            Nprogress.done()
            router.push({name: 'Login'})
            Vue.axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:${state.hostPort}`
            // Vue.axios.defaults.baseURL = `https://sosaludaps.tk:9000`
            localStorage.removeItem('user')
            localStorage.removeItem('token_type')
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('permisos')
            state.user = null
            state.token_type = null
            state.access_token = null
            state.refresh_token = null
            state.permisos = null
        }, 500)
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}
