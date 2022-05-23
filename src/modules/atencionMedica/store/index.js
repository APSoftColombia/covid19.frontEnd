// state
import Vue from 'vue'

const state = {
    attentionsChangeCounter: 0,
    loadsChangeCounter: 0,
    complementosLoads: {
        prestadores: [],
        usuarios: [],
        estados: [
            {text: 'Exitoso', value: 'Exitoso'},
            {text: 'Fallido', value: 'Fallido'},
            {text: 'En Proceso', value: 'En Proceso'},
        ]
    },
    complementos: {
        prestadores: [],
        usuarios: [],
        estados: [
            {text: 'Activo', value: 'Activo'},
            {text: 'Inasistente', value: 'Inasistente'},
            {text: 'Fallecido', value: 'Fallecido'},
            {text: 'Desafiliado', value: 'Desafiliado'}
        ],
        pertenenciasEtnicas: [
            {text: 'Indígena', value: 1},
            {text: 'ROM (gitano)', value: 2},
            {text: 'Raizal del archipiélago de San Andrés y Providencia', value: 3},
            {text: 'Palenquero de San Basilio', value: 4},
            {text: 'Negro(a), mulato(a), afro colombiano(a) o afro descendiente', value: 5},
            {text: 'Ninguna de las anteriores', value: 6}
        ],
        gruposPoblacionales: [
            {text: 'Indigentes', value: 1},
            {text: 'Población infantil a cargo del ICBF', value: 2},
            {text: 'Madres comunitarias', value: 3},
            {text: 'Artistas, autores, compositores', value: 4},
            {text: 'Otro grupo poblacional', value: 5},
            {text: 'Recién nacidos', value: 6},
            {text: 'Desmovilizados', value: 8},
            {text: 'Desplazados', value: 9},
            {text: 'Población ROM', value: 10},
            {text: 'Población raizal', value: 11},
            {text: 'Población en centros psiquiátricos', value: 12},
            {text: 'Migratorio', value: 13},
            {text: 'Población en centros carcelarios', value: 14},
            {text: 'Población rural no migratoria', value: 15},
            {text: 'Afrocolombiano', value: 16},
            {text: 'Adulto mayor', value: 31},
            {text: 'Cabeza de familia', value: 32},
            {text: 'Mujer embarazada', value: 33},
            {text: 'Mujer lactante', value: 34},
            {text: 'Trabajador urbano', value: 35},
            {text: 'Trabajador rural', value: 36},
            {text: 'Víctima de violencia armada', value: 37},
            {text: 'Jóvenes vulnerables rurales', value: 38},
            {text: 'Jóvenes vulnerables urbanos', value: 39},
            {text: 'Discapacitado del sistema nervioso', value: 50},
            {text: 'Discapacitado de los ojos', value: 51},
            {text: 'Discapacitado de los oídos', value: 52},
            {text: 'Discapacitado de los demás órganos de los sentidos (olfato, tacto y gusto)', value: 53},
            {text: 'Discapacitado de la voz y el habla', value: 54},
            {text: 'Discapacitado del sistema cardiorrespiratorio y las defensas', value: 55},
            {text: 'Discapacitado de la digestión, el metabolismo, las hormonas', value: 56},
            {text: 'Discapacitado del sistema genital y reproductivo', value: 57},
            {text: 'Discapacitado del movimiento del cuerpo, manos, brazos, piernas', value: 58},
            {text: 'Discapacitado de la piel', value: 59},
            {text: 'Discapacitado de otro tipo', value: 60},
            {text: 'No definido', value: 61},
            {text: 'Comunidad indígena', value: 62},
            {text: 'Comunidad migrante de la República de Venezuela', value: 63}
        ]
    }
}

// getters
const getters = {
}

// actions
const actions = {
    getComplementsLoads(context) {
        Vue.axios.get('archivos-atencion-data-filters')
            .then(response => {
                context.commit('SET_COMPLEMENTS_LOADS', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los complementos de cargues masivos.`,
                    error: error
                })
            })
    },
    getComplements(context) {
        Vue.axios.get('seguimientos/data-filters')
            .then(response => {
                console.log('response.data', response.data)
                context.commit('SET_COMPLEMENTS', response.data)
            })
            .catch(error => {
                context.commit('snackbar', {
                    color: 'error',
                    message: `al recuperar los complementos de atenciones médicas.`,
                    error: error
                })
            })
    }
}

// mutations
const mutations = {
    SET_COMPLEMENTS_LOADS (state, complementos) {
        state.complementosLoads.prestadores = complementos.prestadores
        state.complementosLoads.usuarios = complementos.usuarios
    },
    SET_COMPLEMENTS (state, complementos) {
        state.complementos.prestadores = complementos.prestadores
        // state.complementos.usuarios = complementos.usuarios
        // state.complementos.gruposPoblacionales = complementos.gruposPoblacionales
        // state.complementos.pertenenciasEtnicas = complementos.pertenenciasEtnicas
    },
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
