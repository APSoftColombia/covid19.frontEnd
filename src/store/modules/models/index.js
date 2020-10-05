// state
const state = {
    modelTamizaje: {
        id: null,
        tipo_tamizaje: null,
        llamada_entrante: null,
        reporte_id: null,
        tamizador_id: null,
        afiliado_id: null,
        tipo_identificacion: null,
        identificacion: null,
        nombre1: null,
        nombre2: null,
        apellido1: null,
        apellido2: null,
        fecha_nacimiento: null,
        acudiente: null,
        sexo: null,
        celular: null,
        celular2: null,
        email: null,
        si_eps: 1,
        eps_id: null,
        tipo_afiliacion: null,
        direccion: null,
        departamento_id: null,
        municipio_id: null,
        barrio_id: null,
        persona_id: null,
        regimen_especial: null,
        observaciones: null,
        localiza_persona: null,
        contesta_encuesta: null,
        duracion: 0,
        infoviajero: null,
        //////////
        riesgo_procedencia: null,
        riesgo_ocupacional: null,
        riesgo_contacto: null,
        diagnosticado_covid: null,
        positivo_covid: null,
        fecha_diagnostico: null,
        coordenadas: null,
        fecha_ultima_evolucion: null,
        orden_medica_id: null,
        reasignar: null,
        evoluciones: [],
        sintomas: [],
        fecha_sintomas: null,
        nexos: [],
        muestras: [],
        tamizador: null,
        evolucion: null,
        prueba_rapida: null,
        resultado_prueba_rapida: null,
        estado_prueba: null,
        entidad_reporta_sivigila: null,
        hospitalizado: null,
        grupo_atencion_especial_id: null,
        grupo_atencion_especial: null,
        solicitud_prueba: 0,
        clasificacion: null,
        frecuencia_pulso: null,
        saturacion_oxigeno: null,
        temperatura: null,
        no_efectividad: null,
        ////
        user_id: null,
        created_at: null,
        updated_at: null,
    },
    modelPersona: {
        id: null,
        afiliado_id: null,
        tipo_identificacion: null,
        identificacion: null,
        nombre1: null,
        nombre2: null,
        apellido1: null,
        apellido2: null,
        fecha_nacimiento: null,
        acudiente: null,
        sexo: null,
        celular: null,
        celular2: null,
        email: null,
        eps_id: null,
        tipo_afiliacion: null,
        direccion: null,
        departamento_id: null,
        municipio_id: null,
        regimen_especial: null,
        si_eps: 1,
        barrio_id: null
    },
    modelAislamiento: {
        id: null,
        tamizaje_id: null,
        fecha_ingreso: null,
        fecha_egreso: null,
        tipo: null,
        individual: null,
        ambito: null,
        ordenado_por: null,
        codigo_habilitacion: null,
        otro_ambito: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        seguimientos: []
    },
    modelSeguimientoAislamiento: {
        id: null,
        aislamiento_id: null,
        fecha: null,
        registra_egreso: 0,
        fecha_egreso: null,
        soporte_ventilatorio: null,
        soporte_hemodinamico: null,
        evolucion_id: null,
        user_id: null,
        created_at: null,
        updated_at: null
    },
    modelReporte: {
        id: null,
        descripcion: null,
        columns: [],
        query: '',
        nombre: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        roles: [],
        variables: [],
        items: [
            { header: 'Seleccionar o Crear un item' }
        ]
    },
    modelAutopsia: {
        id: null,
        fallecido_id: null,
        encuestado_id: null,
        es_causa_externa: null,
        covid_causaexterna_id: null,
        cercano_hospitalizado: null,
        contacto_covid: null,
        contacto_sitio_covid: null,
        familiar_profesional_salud: null,
        habitacion_compartida: null,
        transporte_publico: null,
        presenta_sintomas: null,
        otro_sintoma: null,
        embarazada: null,
        puerperio: null,
        aborto: null,
        tenia_comorbilidades: null,
        inmunosupresores: null,
        fumaba: null,
        tenia_otros_problemas_salud: null,
        otros_problemas_salud: null,
        atencion_medica_reciente: null,
        aislamiento_preventivo: null,
        examen: null,
        reporte_sivigila: null,
        pcr: null,
        resultado_pcr: null,
        fecha_resultado: null,
        radiografia_torax: null,
        clasificacion: null,
        causa_segun_informante: null,
        resumen_sintomas: null,
        causa_segun_analisis: null,
        created_at: null,
        updated_at: null,
        user_id: null,
        fallecido: null,
        encuestado: null,
        sintomas: [],
        comorbilidades: [],
        archivo: null,
        path_autopsia: null
    },
    modelEvolucion: {
        id: null,
        tamizaje_id: null,
        fecha_sintomas: null,
        antinflamatorios: null,
        ibuprofeno: null,
        hospitalizado: null,
        causa_hospitalizacion: null,
        lugar_hospitalizacion: null,
        fecha_ingreso: null,
        // fecha_muestra: null,
        // muestra_covid: null,
        // probable_muerte_covid19: null,
        observaciones: null,
        clasificacion: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        sintomas: [],
        signos_alarma: [],
        comorbilidades: [],
        lugar_atencion: null,
        motivo_consulta: null,
        anamnesis: null,
        cie10_id: null,
        cie10: null,
        tratamiento: null,
        examen_fisico: null,
        orden_medica_id: null,
        evolucion: null,
        fallida: 0,
        lugar_evolucion: null,
        orden_medica: null,
        evolucion_diaria_hospitalaria: null,
        sivigila: null,
        ssc: null,
        crue: null,
        justificacion_no_clasificado: null,
        solicitud_prueba: 0,
        aislamiento: null,
        seguimiento_aislamiento: null,
        estado_afectacion: null,
        seguimiento_telefonico: 0,
        entidad_reporta_sivigila: null,
        tipo: null,
        frecuencia_pulso: null,
        saturacion_oxigeno: null,
        temperatura: null,
        duracion: 0,
        no_efectividad: null

    },
    modelReporteComunitario: {
        id: null,
        tamizaje_id: null,
        nombre_reportante: null,
        celular_reportante: null,
        edad: null,
        sexo: null,
        direccion: null,
        nombres: null,
        tipo_identificacion: null,
        identificacion: null,
        nombre1: null,
        nombre2: null,
        apellido1: null,
        apellido2: null,
        coordenadas: null,
        departamento_id: null,
        municipio_id: null,
        celular: null,
        observaciones: null,
        user_id: null,
        duracion: null,
        tipo_reporte: null,
        llamada_entrante: null,
        eps_id: null,
        created_at: null,
        updated_at: null
    },
    modelViajero: {
        id: null,
        tamizaje_id: null,
        lugar: null,
        municipio_control: null,
        pais_procedencia: 44,
        municipio_procedencia: null,
        transporte_llegada: null,
        placa: null,
        empresa: null,
        numero_vuelo: null,
        municipio_destino: null,
        transporte_destino: null,
        direccion_permanencia: null,
        aislamiento: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        temperatura: null,
        departamento_procedencia: null,
        departamento_destino: null,
        punto_conteo_id: null
    },
    modelMuestra: {
        id: null,
        tamizaje_id: null,
        fecha_toma: null,
        tomado_por: null,
        lugar_toma: null,
        resultado: null,
        laboratorio: null,
        fecha_resultado: null,
        created_at: null,
        updated_at: null,
        tipo: null,
        archivo: null,
        path_resultado: null,
        tomador_muestra_id: null,
        laboratorio_id: null,
        nombre_tomador: null,
        ///////
        fecha_recepcion_procesamiento: null,
        fecha_procesamiento: null,
        fecha_notificacion_eps: null,
        fecha_notificacion_afiliado: null
    },
    modelLlamada: {
        id: null,
        tipo: null,
        celular: null,
        nombre: null,
        motivo: null,
        responsable: null,
        tamizaje_id: null,
        created_at: null,
        updated_at: null,
        user_id: null,
        covid: 0,
        duracion: null,
        tipo_identificacion: null,
        identificacion: null,
        fecha_nacimiento: null,
        edad: null,
        eps_id: null,
        tipo_afiliacion: null,
        regimen_especial: null,
        si_eps: 1,
        municipio_id: null,
        departamento_id: null,
        sexo: null,
        direccion: null
    }
}

// getters
const getters = {
    modelTamizaje: state => {
        return state.modelTamizaje
    },
    modelPersona: state => {
        return state.modelPersona
    },
    modelAislamiento: state => {
        return state.modelAislamiento
    },
    modelSeguimientoAislamiento: state => {
        return state.modelSeguimientoAislamiento
    },
    modelAutopsia: state => {
        return state.modelAutopsia
    },
    modelEvolucion: state => {
        return state.modelEvolucion
    },
    modelReporteComunitario: state => {
        return state.modelReporteComunitario
    },
    modelViajero: state => {
        return state.modelViajero
    },
    modelMuestra: state => {
        return state.modelMuestra
    },
    modelLlamada: state => {
        return state.modelLlamada
    },
    modelReporte: state => {
        return state.modelReporte
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
