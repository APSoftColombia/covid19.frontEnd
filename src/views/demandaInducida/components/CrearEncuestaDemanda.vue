<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
        <!-- <v-chip
            :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
            color="primary darken-3"
            label
        >
        <v-icon left>mdi-timer</v-icon>
        {{ time }}
        </v-chip> -->
        <v-toolbar dark color="primary">
            <v-icon left>fas fa-edit</v-icon>
            <v-toolbar-title id="inicio">{{ encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Nueva encuesta` }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <datos-personales :afiliado="infoGeneral"></datos-personales>
            <datos-precargados class="mt-4" :datosPrecargados="infoGeneral" :edad="calculaEdad(infoGeneral && infoGeneral.fecha_nacimiento).years"></datos-precargados>
            <ValidationObserver ref="formDemandaInducida" v-slot="{ invalid, validated, passes, validate }">
            <v-card class="mt-4 mx-auto" outlined tile>
                <v-card-text>
                    <v-row align="center">                            
                            <v-col class="pb-0" cols="6">
                                <c-radio
                                    v-model="encuesta.modo_encuesta"
                                    label="Tipo de Encuesta:"
                                    rules="required"
                                    name="tipo de encuesta de induccion a la demanda"
                                    :items="medioEncuesta"
                                    item-text="nombre"
                                    item-value="id"
                                    :column="!$vuetify.breakpoint.smAndUp"
                                >
                                </c-radio>
                            </v-col>
                            <v-col class="pb-0" cols="6">
                                <c-radio
                                    v-model="encuesta.encuesta_efectiva"
                                    label="¿Encuesta efectiva?"
                                    rules="required"
                                    name="encuesta efectiva"
                                    :items="single"
                                    item-text="nombre"
                                    item-value="id"
                                    :column="!$vuetify.breakpoint.smAndUp"
                                >
                                </c-radio>
                            </v-col>
                            <v-col class="pb-0" cols="8" v-if="encuesta.encuesta_efectiva == 0 && encuesta.modo_encuesta == 'Telefonico'">
                                <v-label>Seleccione la razón por la que no pudo ponerse en contacto vía telefónica:</v-label>
                                <c-select-complete
                                    v-model="encuesta.razon_no_tel"
                                    placeholder="Seleccione"
                                    name="razon no contesto celular"
                                    :items="opciones ? opciones.razon_no_tel: []"
                                    item-text="opcion"
                                    item-value="codigo"
                                >
                                </c-select-complete>
                            </v-col>
                            <v-col class="pb-0" cols="8" v-if="encuesta.encuesta_efectiva == 0 && encuesta.modo_encuesta == 'Presencial'">
                                <v-label>Seleccione la razón por la que no pudo ponerse en contacto presencialmente:</v-label>
                                <c-select-complete
                                    v-model="encuesta.razon_no_presencial"
                                    placeholder="Seleccione"
                                    name="razon no contesto celular"
                                    :items="opciones ? opciones.razon_no_presencial: []"
                                    item-text="opcion"
                                    item-value="codigo"
                                >
                                </c-select-complete>
                            </v-col>
                            <v-col class="pb-0" cols="4" v-if="encuesta.razon_no_tel == 5">
                                <label>Fecha de fallecimiento:</label>
                                <c-date
                                    v-model="encuesta.fecha_fallecimiento"
                                    placeholder="Fecha de fallecimiento"
                                    :max="moment().format('YYYY-MM-DD')"
                                >
                                </c-date>
                            </v-col>
                            <template v-if="encuesta.encuesta_efectiva == 1 && encuesta.modo_encuesta">
                                <v-col class="pb-0" cols="2">
                                    <c-select-complete
                                        v-model="tipo_tel_efectivo"
                                        label="Tipo"
                                        :items="tipoTel"
                                        item-text="nombre"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-texto
                                        v-model="encuesta.tel_efectivo"
                                        label="Telefono efectivo"
                                        name="telefono efectivo"
                                        :rules="`required|numeric|minlength:${tipo_tel_efectivo == 'Movil' ? 10 : 7}|maxlength:${tipo_tel_efectivo == 'Movil' ? 10 : 7}`"
                                        upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="2">
                                    <c-select-complete
                                        v-model="tipo_tel_alterno"
                                        label="Tipo"
                                        :items="tipoTel"
                                        item-text="nombre"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-texto
                                        v-model="encuesta.tel_alterno"
                                        label="Telefono alterno"
                                        name="telefono alterno"
                                        :rules="`numeric|minlength:${tipo_tel_alterno == 'Movil' ? 10 : 7}|maxlength:${tipo_tel_efectivo == 'Movil' ? 10 : 7}`"
                                        upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.direccion_hogar"
                                        label="Direccion de vivienda"
                                        name="direccion hogar"
                                        upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.email"
                                        label="Correo electrónico"
                                        name="correo electrónico"
                                        rules="email"
                                        upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        v-model="encuesta.departamento_id"
                                        label="Departamento"
                                        name="departamento"
                                        :items="departamentos"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        :disabled="!encuesta.departamento_id"
                                        v-model="encuesta.municipio_id"
                                        label="Municipio"
                                        name="municipio"
                                        :rules="encuesta.departamento_id ? 'required' : ''"
                                        :items="departamentos.length && encuesta.departamento_id ? departamentos.find(x => x.id === encuesta.departamento_id).municipios : []"
                                        item-text="nombre"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        v-model="encuesta.zona"
                                        placeholder="Zona"
                                        name="zona"
                                        :items="zona ? zona: []"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" v-if="encuesta.zona == 'CP'">
                                    <c-texto
                                        v-model="encuesta.centro_poblado"
                                        label="Nombre del centro poblado"
                                        name="centro poblado"
                                        upper-case
                                        rules="required"
                                    >
                                    </c-texto>
                                </v-col>
                            
                                <v-col class="pb-0" cols="12">
                                    <v-label>Observacion 2:</v-label>
                                    <c-check
                                        v-model="encuesta.observacion_2"
                                        name="observaciones 2"
                                        :items="opcionesObservacion2"
                                        itemText="nombre"
                                        itemValue="id"
                                    >
                                    </c-check>
                                    
                                </v-col>
                                <v-col 
                                    class="pb-0" 
                                    cols="6" 
                                    v-if="
                                        (infoGeneral.gestante_inasistente_control == 'X' || 
                                        infoGeneral.gestante_inasistente_vacuna == 'X' ||
                                        infoGeneral.maternoperinatal == 'X'
                                        ) && encuesta.observacion_2.includes('Embarazo terminado')
                                        "
                                >
                                    <v-label>Estado RIAMP</v-label>
                                    <c-select-complete
                                        v-model="encuesta.estado_riamp"
                                        placeholder="Seleccione"
                                        name="estado riamp"
                                        :items="riamp ? riamp : []"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <template v-if="encuesta.estado_riamp">
                                    <v-col class="pb-0" cols="6">
                                        <c-date
                                            v-model="encuesta.fecha_atencion_riamp"
                                            placeholder="Fecha de atencion de Salida RIAMP"
                                            :max="moment().format('YYYY-MM-DD')"
                                            rules="required"
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                            v-model="encuesta.ips_atencion"
                                            label="IPS de atencion Posparto, legrado, aborto"
                                            name="ips atencion estado riamp"
                                            rules="required"
                                            upper-case
                                        >
                                        </c-texto>
                                    </v-col>
                                </template>
                                <v-col 
                                    class="pb-0" 
                                    cols="12"
                                    v-if="
                                        (infoGeneral.gestante_inasistente_control == 'X' || 
                                        infoGeneral.gestante_inasistente_vacuna == 'X' ||
                                        infoGeneral.maternoperinatal == 'X' ||
                                        encuesta.observacion_2.includes('Nueva gestante')) && !encuesta.observacion_2.includes('Embarazo terminado')
                                    "
                                    >
                                    <v-card outlined tile>
                                        <v-card-text>
                                            <c-radio
                                                v-model="encuesta.embarazo_riesgo"
                                                label="¿Embarazo de alto riesgo?"
                                                name="embarazo de alto riesgo"
                                                :items="riesgoEmbarazo"
                                                item-text="nombre"
                                                item-value="id"
                                                rules="required"
                                                :column="!$vuetify.breakpoint.smAndUp"
                                            >
                                            </c-radio>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <template 
                                    v-if="
                                        (
                                            infoGeneral.maternoperinatal == 'X' || 
                                            infoGeneral.gestante_inasistente_control == 'X' || 
                                            infoGeneral.gestante_inasistente_vacuna == 'X'
                                        ) &&
                                        encuesta.observacion_2 && !encuesta.observacion_2.includes('Embarazo terminado')
                                    "
                                >
                                    <v-col class="pb-0" cols="6">
                                        <c-date
                                            v-model="encuesta.fecha_ultima_menst"
                                            placeholder="Fecha de ultima menstruacion"
                                            :max="moment().format('YYYY-MM-DD')"
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="6">
                                        <c-texto
                                            v-model="encuesta.edad_gestacional"
                                            label="Edad gestacional (semanas)"
                                            name="edad gestacional"
                                            upper-case
                                            :disabled="true"
                                        >
                                        </c-texto>
                                    </v-col>
                                </template>
                                <v-col 
                                    class="pb-0" 
                                    cols="12" 
                                    v-if="infoGeneral.gestante_inasistente_vacuna == 'X' && encuesta.observacion_2 && !encuesta.observacion_2.includes('Embarazo terminado')"
                                >
                                    <v-label>Seleccione la observación de vacunación:</v-label>
                                    <c-select-complete
                                        v-model="encuesta.selec_obs_vacunacion"
                                        placeholder="Seleccione"
                                        name="observacion de vacunacion"
                                        :items="opciones ? opciones.selec_obs_vacunacion: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <template v-if="infoGeneral.gestante_inasistente_control == 'X' && encuesta.observacion_2 && !encuesta.observacion_2.includes('Embarazo terminado')">
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.pendiente_lab"
                                            label="¿Tiene pendiente laboratorios?"
                                            name="pendiente laboratorios"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.pendiente_eco"
                                            label="¿Tiene pendiente ecografias?"
                                            name="pendiente ecografias"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.pendiente_consulta"
                                            label="¿Tiene pendiente consultas?"
                                            name="pendiente consultas"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Seleccione el motivo de Inasistencia al control prenatal:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_inasistencia_prenatal"
                                            placeholder="Seleccione"
                                            name="razon no asistio al control prenatal"
                                            :items="opciones ? opciones.selec_inasistencia_prenatal: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Seleccione algunas observaciones importantes:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_obs_importante_1"
                                            placeholder="Seleccione"
                                            name="observaciones importantes"
                                            :items="opciones ? opciones.selec_obs_importante_1: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <template v-if="infoGeneral.cronico == 'X' || encuesta.observacion_2.includes('Cronico')">
                                    <v-col class="pb-0" cols="12">
                                        <c-radio
                                            v-model="encuesta.asiste_control"
                                            label="¿Asiste al control?"
                                            name="asiste al control"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.asiste_control == 0 || infoGeneral.cronico_inasistente == 'X'">
                                        <v-label>Cuáles son las razones por las que no asiste al control médico de su enfermedad crónica con la ips:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_inasistencia_control"
                                            placeholder="Seleccione"
                                            name="inasistencia de control enfermadad cronica"
                                            :items="opciones ? opciones.selec_inasistencia_control: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <template v-if="(edadMeses >= edad_minima_embarazo && edadMeses <= edad_maxima_embarazo)">
                                    <v-col class="pb-0" cols="6" v-if="infoGeneral.maternoperinatal != 'X' && !encuesta.observacion_2.includes('Nueva gestante') || encuesta.observacion_2.includes('Embarazo terminado')">
                                        <c-radio
                                            v-model="encuesta.planifica"
                                            label="¿Planifica?"
                                            name="planifica"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.planifica == 0">
                                        <v-label>Seleccione el motivo por el cual no planifica:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_motivo_noplan"
                                            placeholder="Seleccione"
                                            name="motivos no planifica"
                                            :items="opciones ? opciones.selec_motivo_noplan: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.planifica == 1">
                                        <v-label>Seleccione el metodo de planificacion:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_metodo_plan"
                                            placeholder="Seleccione"
                                            name="metodo de planificacion"
                                            :items="opciones ? opciones.selec_metodo_plan: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <v-col class="pb-0" cols="6" 
                                    v-if="
                                        (infoGeneral.maternoperinatal != 'X' && !encuesta.observacion_2.includes('Nueva gestante') && infoGeneral.genero == 'F' && ageIsBetweenRange(edadMeses, 216, 588)) || 
                                        encuesta.observacion_2.includes('Embarazo terminado') && ageIsBetweenRange(edadMeses, 216, 588)
                                    "
                                >
                                    <c-radio
                                        v-model="encuesta.desea_embarazo"
                                        label="¿Desea quedar en embarazo?"
                                        name="deseo de embarazo"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <template 
                                    v-if="
                                        infoGeneral.niño_inasistente_vacuna == 'X' ||
                                        encuesta.asiste_control == 0 || 
                                        infoGeneral.cronico_inasistente == 'X' ||
                                        infoGeneral.gestante_inasistente_vacuna == 'X' ||
                                        infoGeneral.gestante_inasistente_control == 'X'
                                    "
                                    >
                                    <v-col class="pb-0" cols="6">
                                        <c-radio
                                            v-model="encuesta.agendo"
                                            label="¿Agendo cita?"
                                            name="agendo cita"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="6" v-if="encuesta.agendo">
                                        <c-date
                                            v-model="encuesta.fecha_agendamiento"
                                            placeholder="Fecha de agendamiento"
                                            :max="moment().format('YYYY-MM-DD')"
                                            rules="required"
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="6" v-if="encuesta.agendo == 0">
                                        <v-label>Seleccione el motivo por que no agenda: </v-label>
                                        <c-select-complete
                                            v-model="encuesta.selec_no_agenda"
                                            placeholder="Seleccione"
                                            name="razon no agenda"
                                            :items="opciones ? opciones.selec_no_agenda: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <v-col class="pb-0" cols="12" v-if="infoGeneral.niño_inasistente_vacuna == 'X'">
                                    <v-label>Seleccione el motivo de Inasistencia a vacunación del menor: </v-label>
                                    <c-select-complete
                                        v-model="encuesta.selec_inasistencia_vacuna_niño"
                                        placeholder="Seleccione"
                                        name="razon inasistencia del menor a vacunacion"
                                        :items="opciones ? opciones.selec_inasistencia_vacuna_niño: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.familia_afiliada"
                                        label="¿Todo el grupo familiar se encuentra afiliado a capresoca?"
                                        name="afiliacion grupo familiar"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.sintomas_covid"
                                        label="¿Ha tenido síntomas relacionados con Covid 19 en los ultimos 14 dias?"
                                        name="sintomas covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.contacto_covid"
                                        label="¿Ha tenido contacto con alguna persona diagnosticada con COVID 19?"
                                        name="contacto covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.paciente_estudio_covid"
                                        label="¿Es paciente en estudio o le han realizado prueba para COVID 19?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.riesgo_hansen"
                                        label="¿Presenta lesiones o manchas en la piel sin dolor o rasquiña?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.riesgo_tbc"
                                        label="¿Ha presentado tos con expectoración igual o mayor a 15 dias?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                        v-model="encuesta.demanda_covid"
                                        placeholder="Seleccione la demanda inducida COVID 19"
                                        name="demanda covid"
                                        :items="demandaCovid"
                                        item-text="nombre"
                                        rules="required"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                    
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <v-label>Selecciona posible barrera de acceso en la atención:</v-label>
                                    <c-select-complete
                                        v-model="encuesta.selec_obs_importante_2"
                                        placeholder="Seleccione"
                                        name="barrera de acceso"
                                        :items="opciones ? opciones.selec_obs_importante_2: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                    >
                                    </c-select-complete>
                                </v-col>
                            
                                <v-col class="pb-0" cols="12">
                                    <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">

                                        <v-expansion-panel>
                                            <v-expansion-panel-header>Inducciones generales</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 0, 71)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de primera infancia"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Primera Infancia'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 72, 143)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de infancia"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Infancia'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 144, 215)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de adolescencia"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Adolescencia'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 216, 347)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de juventud"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Juventud'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima) && (!x.genero || infoGeneral.genero == x.genero)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 348, 719)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de adultez"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Adultez'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima) && (!x.genero || infoGeneral.genero == x.genero)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="ageIsBetweenRange(edadMeses, 720, 2400)">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="inducciones_aplica"
                                                                name="Inducciones de vejez"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Vejez'].filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima) && (!x.genero || infoGeneral.genero == x.genero)) : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="encuesta.riesgo_tbc">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="induccion_tbc"
                                                                name="Inducciones sin curso de vida"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Sin curso vida'].filter(x => x.tipo_atencion == 'Consulta medica TBC') : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                    <template v-if="encuesta.riesgo_hansen">
                                                        <v-col class="pb-0" cols="12">
                                                            <c-check-component
                                                                v-model="induccion_hansen"
                                                                name="Inducciones sin curso de vida"
                                                                :items="inducciones && inducciones.inducciones_generales ? inducciones.inducciones_generales['Sin curso vida'].filter(x => x.tipo_atencion != 'Consulta medica TBC') : []"
                                                                itemText="tipo_atencion"
                                                                itemText1="grupo_etario"
                                                                itemText2="frecuencia"
                                                                itemValue="id"
                                                            >
                                                            </c-check-component>
                                                        </v-col>
                                                    </template>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>

                                        <v-expansion-panel v-if="encuesta.desea_embarazo == 1">
                                            <v-expansion-panel-header>Inducciones Preconcepcionales</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row>
                                                    <v-col class="pb-0" cols="12">
                                                        <c-check-component
                                                            v-model="inducciones_preconcepcional"
                                                            name="Inducciones preconcepcional"
                                                            :items="inducciones && inducciones.preconcepcional ? inducciones.preconcepcional.filter(x => ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima) && (!x.genero || infoGeneral.genero == x.genero)) : []"
                                                            itemText="tipo_atencion"
                                                            itemText1="grupo_etario"
                                                            itemText2="frecuencia"
                                                            itemValue="id"
                                                        >
                                                        </c-check-component>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>

                                        <v-expansion-panel 
                                            v-if="
                                                infoGeneral.maternoperinatal == 'X' ||
                                                infoGeneral.gestante_inasistente_vacuna == 'X' ||
                                                infoGeneral.gestante_inasistente_control == 'X' ||
                                                encuesta.observacion_2.includes('Nueva gestante')
                                                "
                                        >
                                            <v-expansion-panel-header>Inducciones Maternoperinatales</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row>
                                                    <v-col class="pb-0" cols="12">
                                                        <c-check-component
                                                            v-model="inducciones_maternoperinatal"
                                                            name="Inducciones maternoperinatales"
                                                            :items="inducciones && inducciones.maternoperinatal ? 
                                                                inducciones.maternoperinatal.filter(x => 
                                                                    (
                                                                        ageIsBetweenRange(edadMeses, x.edad_minima, x.edad_maxima) && 
                                                                        (!x.genero || infoGeneral.genero == x.genero)
                                                                    ) && 
                                                                    (
                                                                        encuesta.observacion_2.includes('Embarazo terminado') ? [95, 96, 97].includes(x.id) : true)
                                                                    ) : []
                                                                "
                                                            itemText="tipo_atencion"
                                                            itemText1="grupo_etario"
                                                            itemText2="frecuencia"
                                                            itemValue="id"
                                                        >
                                                        </c-check-component>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    
                                </v-col>
                                <v-col class="pb-0" cols="12" v-if="!verifyInducciones">
                                    <c-text-area
                                        label="Describa la razon por la cual no selecciono ninguna induccion a la demanda"
                                        v-model="encuesta.obs_no_induccion"
                                        name="observaciones no selecciono inducciones"
                                    ></c-text-area>
                                </v-col>
                            </template>
                            <v-col class="pb-0" cols="12">
                                <c-text-area
                                    label="Observaciones finales"
                                    v-model="encuesta.obs_final"
                                    name="observaciones finales"
                                ></c-text-area>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            large
                            @click.stop="close"
                        >
                            <v-icon>mdi-close</v-icon>
                            Cerrar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                        <v-btn
                            large
                            color="primary"
                            @click.stop="guardarEncuesta"
                        >
                            <v-icon left>fas fa-save</v-icon>
                            Guardar encuesta
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-container>
        <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
const DatosPersonales = () => import('../components/DatosPersonalesAfiliado')
const DatosPrecargados = () => import('../components/DatosPrecargadosAfiliado')
const CCheckComponent = () => import('../components/CheckComponent')

var intervalo
export default {
    name: 'CrearEncuestaDemanda',
    components: {
        DatosPersonales,
        DatosPrecargados,
        CCheckComponent
    },
    data: () => ({
        panel: [0,1,2],
        edad_minima_embarazo: 120,
        edad_maxima_embarazo: 660,
        tipo_tel_efectivo: 'Movil',
        tipo_tel_alterno: 'Movil',
        inducciones_aplica: [],
        inducciones_preconcepcional: [],
        inducciones_maternoperinatal: [],
        induccion_tbc: [],
        induccion_hansen: [],
        inducciones: null,
        opciones: null,
        complementos: [],
        loading: false,
        dialog: false,
        infoGeneral: null,
        encuesta: null,
        encuestaModel: {
            di_precargados_id: null,
            modo_encuesta: null,
            encuesta_efectiva: null,
            direccion_hogar: null,
            email: null,
            departamento_id: null,
            municipio_id: null,
            zona: null,
            centro_poblado: null,
            razon_no_tel: null,
            razon_no_presencial: null,
            fecha_fallecimiento: null,
            tel_efectivo: null,
            tel_alterno: null,
            observacion_2: [],
            estado_riamp: null,
            fecha_atencion_riamp: null,
            ips_atencion: null,
            embarazo_riesgo: null,
            fecha_ultima_menst: null,
            edad_gestacional: null,
            pendiente_lab: null,
            pendiente_eco: null,
            pendiente_consulta: null,
            asiste_control: null,
            planifica: null,
            desea_embarazo: null,
            familia_afiliada: null,
            sintomas_covid: null,
            contacto_covid: null,
            paciente_estudio_covid: null,
            demanda_covid: 2,
            selec_obs_vacunacion: null,
            selec_inasistencia_prenatal: null,
            selec_obs_importante_1: null,
            selec_inasistencia_control: null,
            selec_motivo_noplan: null,
            selec_metodo_plan: null,
            selec_inasistencia_vacuna_niño: null,
            selec_obs_importante_2: null,
            obs_final: null,
            obs_no_induccion: null,
            duracion: 0,
            riesgo_tbc: null,
            riesgo_hansen: null,
            agendo: null,
            fecha_agendamiento: null,
            selec_no_agenda: null,
        },
        medioEncuesta: [
            {'id': 'Telefonico', 'nombre': 'Telefonico'},
            {'id': 'Presencial', 'nombre': 'Presencial'}
        ],
        zona: [
            {'id': 'U', 'nombre': 'Urbana'},
            {'id': 'R', 'nombre': 'Rural'},
            {'id': 'CP', 'nombre': 'Centro poblado'}
        ],
        tipo: [
            {'id': 'Nueva gestante', 'nombre': 'Nueva gestante'},
            {'id': 'Alto costo', 'nombre': 'Alto costo'},
            {'id': 'Embarazo terminado', 'nombre': 'Embarazo terminado'},
            {'id': 'Cronico', 'nombre': 'Cronico'}
        ],
        riamp: [
            {'id': 'Aborto', 'nombre': 'Aborto'},
            {'id': 'Posparto', 'nombre': 'Posparto'}
        ],
        riesgoEmbarazo: [
            {'id': 'Si', 'nombre': 'Si'},
            {'id': 'No', 'nombre': 'No'},
            {'id': 'No sabe', 'nombre': 'No sabe'},
        ],
        single: [
            {'id': 1, 'nombre': 'Si'},
            {'id': 0, 'nombre': 'No'},
        ],
        tipoTel: [
            {'id': 'Movil', 'nombre': 'Movil'},
            {'id': 'Fijo', 'nombre': 'Fijo'}
        ],
        demandaCovid: [
            {'id': 1, 'nombre': 'Canalizacion al Call Center - probable caso COVID 19 '},
            {'id': 2, 'nombre': 'Se orienta al Usuario en cuidados generados prevencion COVID 19'}
        ]
    }),
    computed: {
        ...mapGetters([
            'departamentos'
        ]),
        opcionesObservacion2(){
            return this.tipo ? this.infoGeneral.genero == 'F'
                                    ? this.edadMeses >= this.edad_minima_embarazo && this.edadMeses <= this.edad_maxima_embarazo
                                        ? this.infoGeneral.maternoperinatal != 'X' 
                                            ? this.tipo.filter(x => x.id != 'Embarazo terminado') 
                                            : this.infoGeneral.maternoperinatal == 'X' 
                                                ? this.tipo.filter(x => x.id != 'Nueva gestante') 
                                                : this.tipo 
                                        : this.infoGeneral.maternoperinatal == 'X'
                                            ? this.tipo.filter(x => x.id != 'Nueva gestante')
                                            : this.tipo.filter(x => !['Embarazo terminado', 'Nueva gestante'].includes(x.id))
                                    : this.tipo.filter(x => !['Embarazo terminado', 'Nueva gestante'].includes(x.id))
                            : []
                    
                        
        },
        edadMeses(){
            let meses = null
            if(this.infoGeneral && this.infoGeneral.fecha_nacimiento && this.moment(this.infoGeneral.fecha_nacimiento).isValid()){
				let a = this.moment()
				let b = this.moment(this.infoGeneral.fecha_nacimiento)
				meses = a.diff(b, 'months')
            }
            return meses
        },
        infoInduccion(){
            let text = null
            if(this.inducciones){
                text = `
                    ${this.inducciones.inducciones_generales['Primera Infancia'].tipo_atencion} 
                    ${this.inducciones.inducciones_generales['Primera Infancia'].grupo_etario} 
                    ${this.inducciones.inducciones_generales['Primera Infancia'].frecuencia}
                    `
            }
            return text
        },
        time() {
            let h = 0
            let m = 0
            let s = 0
            if (this && this.encuesta) {
                let initime = this.clone(this.encuesta.duracion)
                h = Math.trunc(initime / 3600)
                initime = initime - (h * 3600)
                m = Math.trunc(initime / 60)
                initime = initime - (m * 60)
                s = initime
            }
            return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
        },
        verifyInducciones(){
            let longitud = this.inducciones_aplica.concat(
                this.inducciones_preconcepcional, 
                this.inducciones_maternoperinatal, 
                this.induccion_hansen, this.induccion_tbc).length
            return longitud;
        }
    },
    watch: {
        'encuesta.agendo': {
            handler(value) {
                value ? this.encuesta.selec_no_agenda = null : this.encuesta.fecha_agendamiento = null
            },
            inmediate: false
        },
        'verifyInducciones': {
            handler(value){
                if(value) this.encuesta.obs_no_induccion = null
            },
            inmediate: false
        },
        'encuesta.riesgo_tbc': {
            handler(value){
                if(!value) this.induccion_tbc = []
            },
            inmediate: false
        },
        'encuesta.riesgo_hansen': {
            handler(value){
                if(!value) this.induccion_hansen = []
            },
            inmediate: false
        },
        'encuesta.contacto_covid': {
            handler(value){
                if(!value) {
                    this.encuesta.demanda_covid = 2
                }else{
                    this.encuesta.demanda_covid = 1
                }
            },
            inmediate: false
        },
        'encuesta.paciente_estudio_covid': {
            handler(value){
                if(!value) {
                    this.encuesta.demanda_covid = 2
                }else{
                    this.encuesta.demanda_covid = 1
                }
            },
            inmediate: false
        },
        'encuesta.sintomas_covid': {
            handler(value){
                if(!value) {
                    this.encuesta.demanda_covid = 2
                }else{
                    this.encuesta.demanda_covid = 1
                }
            },
            inmediate: false
        },
        'encuesta.desea_embarazo': {
            handler(value){
                if(!value) this.inducciones_preconcepcional = []
            },
            inmediate: false
        },
        'encuesta.fecha_ultima_menst':{
            handler(value){
                if(value && this.moment(value).isValid()){
                    let a = this.moment()
                    let b = this.moment(value)
                    let days = a.diff(b, 'days')
                    this.encuesta.edad_gestacional = days/7
                }
            },
            inmediate: false
        },
        'encuesta.razon_no_tel': {
            handler(value){
                if(value != 5) this.encuesta.fecha_fallecimiento = null
            },
            immediate: false
        },
        'encuesta.modo_encuesta': {
            handler(value){
                if (value) value == 'Telefonico' ? this.encuesta.razon_no_presencial = null : this.encuesta.razon_no_tel = null
            },
            immediate: false
        },
        'encuesta.encuesta_efectiva': {
            handler(value){
                if (value) {
                    this.encuesta.razon_no_presencial = null
                    this.encuesta.razon_no_tel = null
                }
            },
            inmediate: false
        },
        'encuesta.zona': {
            handler(value){
                if (value != 'CP') {
                    this.encuesta.centro_poblado = null
                }
            },
            inmediate: false
        },
        'encuesta.planifica': {
            handler(value){
                if(value) value == 1 ? this.encuesta.selec_motivo_noplan = null : this.encuesta.selec_metodo_plan = null
            },
            inmediate: false
        },
        'encuesta.asiste_control':{
            handler(value){
                if(value != 0){
                    this.encuesta.selec_inasistencia_control = null
                    this.encuesta.agendo = null
                    this.encuesta.fecha_agendamiento = null
                    this.encuesta.selec_no_agenda = null
                }
            },
            inmediate: false
        },
        'encuesta.observacion_2': {
            handler(value){
                if(!value.includes('Embarazo terminado')){
                    this.encuesta.estado_riamp = null
                    this.encuesta.fecha_atencion_riamp = null
                    this.encuesta.ips_atencion = null
                    this.encuesta.desea_embarazo = null
                }
                if(!value.includes('Nueva gestante')){
                    this.encuesta.embarazo_riesgo = null
                    this.inducciones_maternoperinatal = []
                    this.encuesta.planifica = null
                }
                if(value.includes('Embarazo terminado')){
                    this.encuesta.fecha_ultima_menst = null
                    this.encuesta.edad_gestacional = null
                    this.encuesta.selec_obs_vacunacion = null
                    this.encuesta.pendiente_lab = null
                    this.encuesta.pendiente_consulta = null
                    this.encuesta.pendiente_eco = null
                    this.encuesta.selec_inasistencia_prenatal = null
                    this.encuesta.selec_obs_importante_1 = null
                    this.inducciones_maternoperinatal = []
                    this.encuesta.embarazo_riesgo = null
                    this.encuesta.planifica = null
                }
                if(!value.includes('Cronico')){
                    this.encuesta.asiste_control = null
                    this.encuesta.selec_inasistencia_control = null
                }
                if(!value.length){
                    this.encuesta.asiste_control = null
                    this.encuesta.selec_inasistencia_control = null
                    this.encuesta.fecha_ultima_menst = null
                    this.encuesta.edad_gestacional = null
                    this.encuesta.selec_obs_vacunacion = null
                    this.encuesta.pendiente_lab = null
                    this.encuesta.pendiente_consulta = null
                    this.encuesta.pendiente_eco = null
                    this.encuesta.selec_inasistencia_prenatal = null
                    this.encuesta.selec_obs_importante_1 = null
                    this.encuesta.embarazo_riesgo = null
                    this.encuesta.estado_riamp = null
                    this.encuesta.fecha_atencion_riamp = null
                    this.encuesta.ips_atencion = null
                }
            },
            inmediate: false
        }
    },
    created(){
        this.encuesta = this.clone(this.encuestaModel)
    },
    methods: {
        open(encuesta = null) {
            this.inducciones_aplica = []
            this.inducciones_preconcepcional = []
            this.inducciones_maternoperinatal = []
            this.induccion_tbc = []
            this.induccion_hansen = []
            this.infoGeneral = encuesta
            this.getOpcionesSelectores()
            this.getInducciones()
            this.dialog = true
            intervalo = setInterval(() => {
            this.encuesta.duracion++
            }, 1000)
        },
        close() {
            this.dialog = false
            this.loading = false
            this.inducciones_aplica = []
            this.$refs.formDemandaInducida.reset()
            this.encuesta = this.clone(this.encuestaModel)
            clearInterval(intervalo)
            this.$emit('close')
        },
        guardarEncuesta(){
            this.$refs.formDemandaInducida.validate().then(result => {
                if (result) {
                    this.loading = true
                    let data = null
                    if (this.encuesta.encuesta_efectiva == 0) {
                        data = {
                            di_precargados_id: this.infoGeneral.id,
                            encuesta_efectiva: this.encuesta.encuesta_efectiva,
                            modo_encuesta: this.encuesta.modo_encuesta,
                            razon_no_tel: this.encuesta.razon_no_tel,
                            razon_no_presencial: this.encuesta.razon_no_presencial,
                            fecha_fallecimiento: this.encuesta.fecha_fallecimiento,
                            obs_final: this.encuesta.obs_final,
                            duracion: this.encuesta.duracion
                        }
                    }else {
                        data = this.clone(this.encuesta)
                        delete data.razon_no_tel
                        delete data.razon_no_presencial
                        delete data.fecha_fallecimiento
                        delete data.encuesta_efectiva
                        data.observacion_2 = this.encuesta.observacion_2.length ? this.encuesta.observacion_2.join(',') : ''
                        data.inducciones = this.inducciones_aplica.concat(this.inducciones_preconcepcional, this.inducciones_maternoperinatal, this.induccion_hansen, this.induccion_tbc)
                        data.di_precargados_id = this.infoGeneral.id
                    }
                    this.axios.post(`demanda-inducida`, data).then(response => {
                        this.$emit('guardado', response.data)
                        this.$store.commit('snackbar', {color: 'success', message: `La encuesta Demanda inducida se guardo correctamente.`})
                        this.close()
                    }).catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al guardar el encuesta demanda inducida.`, error: error})
                    })
                }
            })
        },
        getOpcionesSelectores(){
            this.loading = true
            this.axios.get(`opciones-demanda-inducida`).then(response => {
                if(response.data && response.data.opciones){
                    this.opciones = this.clone(response.data.opciones)
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al recuperar las opciones de los selectores.`, error: error})
            })
        },
        getInducciones(){
            this.loading = true
            this.axios.get(`complementos-demanda-inducida`).then(response => {
                if(response.data){
                    this.inducciones = this.clone(response.data)
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al recuperar el listado de inducciones`, error: error})
            })
        },
        ageIsBetweenRange(edad, range1, range2){
            return edad >= range1 && edad <= range2
        }
    }
}
</script>
/**
    Requerimientos
        **-EPS = IPS ->done
        **-tel_efectivo = required -> done
        **-especificar tel fijo length=7 o tel celular length=10 -> done
        **-observacion_2 type set y en front de radios a checks -> done
        **-si observacion_2 == embarazo terminado entonces no pregunte embarazo alto riesgo -> done
        
        **-si observacion_2 es nueva gestante habilitar ruta maternoperinatal ->done
        **-observacion_2 cambiar a radio buttons listado vertical->done
        **-si es observacion_2 es embarazo terminado habilitar las de postparto, preconcepcional ->done
        **-Si se guarda las encuestas fallidas en otra tabla o en la misma RTA. Sacarlas a parte -> done

        * *ToAsk: edad minima para habilitar la ruta maternoperinatal y desea embarazo,
        * *teniendo en cuenta que la opcion Nueva gestante de observacion_2 RTA. 18 años

        *! ToAsk: planifica se pregunta a que edad?

        **falta input de demanda inducida COVID -> done
        **si es materno o nueva gestante no pregunte planifica
        **el deseo embarazo solo 18 años
        **planifica para masculinos
        **arreglar el rango de inducciones a las que aplica un usuario
        **hacer un alerta de ERP en la tabla (id erp)
        **asignacion de afiliados a encuestadores/gestores

        **validaciones(required) para campos de unica respuesta SI/NO
        **validaciones(required) para departamento, municipio, zona y nombre del centro poblado,
        **tambien para asiste_control y las razones por las que NO asiste
        **al guardar demandaI redirigir a ERP
        **agregar las preguntas e inducciones para tuberculosis aplica todos los rangos de edades
        **filtro por grupos de edad
        **filtro por fecha de creacion
        **filtro por Encuestas efectivas y No efectivas
        **filtro por Require ERP
        **vista de detalle de encuesta cuando es efectiva
        **demanda inducida covid, si las preguntas covid son No, inducir al cuidado y si alguna es si, inducir al call center
        **filtro para rol Admin, SuperAdmin, Coordinador, por usuario encuestador
        ** Inasistentes (cualquier inasistente) nuevas preguntas: agendo cito, fecha agendamiento, motivo no agendo
        ** 4. Agregar campo DiEncuestas de numeroCamapaña y actualizar numeroCampaña para diEncuestas actuales = 1
        ** 1. Cargador de excel .csv demanda inducida nueva (borrar di_asigna) - probar con excel que ya existe
        ** 2. Cargador de excel .csv para marcar inasistentes gestante, vacunacion, control cronico 
        ** 3. Asignacion de registros por usuario
        ** Inconsistencia en info del paciente, ej: se filtra por alto costo, per en el detalle
        ** del paciente, aparece que No es alto costo



 */