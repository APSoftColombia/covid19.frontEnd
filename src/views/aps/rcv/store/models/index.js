// state
const state = {
    modelEncuestaRCV: {
        id: null,
        afiliado_id: null,
        id_afiliado: null,
        conoce_pesotalla: null,
        talla: null,
        peso: null,
        imc: null,
        conoce_datostension: null,
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
        proxima_entrega_medicamentos: null,
        interrumpe_tto: null,
        a_tiempo_tto: null,
        suspende_mejora_tto: null,
        suspende_adverso_tto: null,
        observaciones: null,
        user_id: null,
        duracion: 0,
        sintomas: [],
        responde_paciente: 1,
        afiliado_actualizado: {
            id: null,
            direccion: null,
            numero_celular: null,
            telefono_opcional: null,
            email: null,
        },
        acudiente: {
            identificacion: null,
            tipo_identificacion: null,
            nombre_completo: null,
            celular: null,
            email: null
        },
        paciente_hospitalizado: null,
        codigo_ips_hospitalizacion: null,
        ips_hospitalizacion: null,
        dispuesto: 1,
        glucometro: null,
        tensiometro: null,
        fallida: 0,
        no_efectividad: null,
        otros_medicamentos: null,
        /////
        especialidad: [],
        laboratorio: [],
        medicamentos: [],
        /////
        consulta_por_urgencias: null,
        motivo_hospitalizacion: null,
        enfermedad_cv: [],
        otra_enfermedad_cv: null,
        otro_examen: null,
        otra_especialidad: null,
        /////
        reps: null,
        sede: null
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
