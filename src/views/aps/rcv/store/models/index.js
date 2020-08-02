// state
const state = {
    modelEncuestaRCV: {
        id: null,
        afiliado_id: null,
        id_afiliado: null,
        talla: null,
        peso: null,
        imc: null,
        diastolica: null,
        sistolica: null,
        actividad_fisica: null,
        frutas_verduras: null,
        medicacion_hta: null,
        antecedente_glucosa: null,
        familiares_diabetes: null,
        diabetes: null,
        tipo_diabetes: null,
        fumador: null,
        diagnosticado_rcv: null,
        consulta_medicina_g: null,
        consulta_medicina_i: null,
        laboratorios: null,
        formula_hta_dm: null,
        tiene_medicamentos: null,
        entrega_medicamentos: null,
        interrumpe_tto: null,
        a_tiempo_tto: null,
        suspende_mejora_tto: null,
        suspende_adverso_tto: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        duracion: 0,
        sintomas: [],
        afiliado_actualizado: {
            id: null,
            direccion: null,
            numero_celular: null,
            email: null,
        },
    }
}

// getters
const getters = {
    modelEncuestaRCV: state => {
        return state.modelEncuestaRCV
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
