<template>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        persistent
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-clipboard-list</v-icon>
                <v-list-item-content class="pa-0">
                    <v-list-item-title class="mb-0"><h6 class="mb-0 title">{{encuesta ? `Encuesta No. ${encuesta.di_encuestas.id}` : `Encuesta`}}</h6></v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        {{encuesta ? moment(encuesta.di_encuestas.created_at).format('DD/MM/YYYY HH:mm') : ''}}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container>
              <datos-personales :afiliado="encuesta"></datos-personales>
              <datos-precargados class="mt-4" :datosPrecargados="encuesta" :edad="encuesta && encuesta.fecha_nacimiento ? calculaEdad(encuesta && encuesta.fecha_nacimiento).years : 0"></datos-precargados>
              <v-card class="mt-4 mx-auto" outlined tile v-if="encuesta && encuesta.di_encuestas">
                <v-card-text>
                    <v-row align="center">                            
                            <v-col class="pb-0" cols="12">
                                <c-radio
                                    v-model="encuesta.di_encuestas.modo_encuesta"
                                    label="Tipo de Encuesta:"
                                    rules="required"
                                    name="tipo de encuesta de induccion a la demanda"
                                    :items="medioEncuesta"
                                    item-text="nombre"
                                    item-value="id"
                                    :column="!$vuetify.breakpoint.smAndUp"
                                    disabled
                                >
                                </c-radio>
                            </v-col>
                            <!-- <v-col class="pb-0" cols="6">
                                <c-radio
                                    v-model="encuesta.di_encuestas.encuesta_efectiva"
                                    label="¿Encuesta efectiva?"
                                    rules="required"
                                    name="encuesta efectiva"
                                    :items="single"
                                    item-text="nombre"
                                    item-value="id"
                                    :column="!$vuetify.breakpoint.smAndUp"
                                >
                                </c-radio>
                            </v-col> -->
                            <!-- <v-col class="pb-0" cols="8" v-if="encuesta.di_encuestas.encuesta_efectiva == 0 && encuesta.di_encuestas.modo_encuesta == 'Telefonico'">
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
                            </v-col> -->
                            <template v-if="encuesta.di_encuestas.modo_encuesta">
                                <!-- <v-col class="pb-0" cols="2">
                                    <c-select-complete
                                        v-model="tipo_tel_efectivo"
                                        label="Tipo"
                                        :items="tipoTel"
                                        item-text="nombre"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col> -->
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.di_encuestas.tel_efectivo"
                                        label="Telefono efectivo"
                                        name="telefono efectivo"
                                        upper-case
                                        disabled
                                    >
                                    </c-texto>
                                </v-col>
                                <!-- <v-col class="pb-0" cols="2">
                                    <c-select-complete
                                        v-model="tipo_tel_alterno"
                                        label="Tipo"
                                        :items="tipoTel"
                                        item-text="nombre"
                                        item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col> -->
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.di_encuestas.tel_alterno"
                                        label="Telefono alterno"
                                        name="telefono alterno"
                                        upper-case
                                        disabled
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.di_encuestas.direccion_hogar"
                                        label="Direccion de vivienda"
                                        name="direccion hogar"
                                        upper-case
                                        disabled
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-texto
                                        v-model="encuesta.di_encuestas.email"
                                        label="Correo electrónico"
                                        name="correo electrónico"
                                        rules="email"
                                        upper-case
                                        disabled
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.departamento_id"
                                        label="Departamento"
                                        name="departamento"
                                        :items="departamentos"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.municipio_id"
                                        label="Municipio"
                                        name="municipio"
                                        :rules="encuesta.di_encuestas.departamento_id ? 'required' : ''"
                                        :items="departamentos.length && encuesta.di_encuestas.departamento_id ? departamentos.find(x => x.id === encuesta.di_encuestas.departamento_id).municipios : []"
                                        item-text="nombre"
                                        item-value="id"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="4">
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.zona"
                                        placeholder="Zona"
                                        name="zona"
                                        :items="zona ? zona: []"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" v-if="encuesta.di_encuestas.zona == 'CP'">
                                    <c-texto
                                        v-model="encuesta.di_encuestas.centro_poblado"
                                        label="Nombre del centro poblado"
                                        name="centro poblado"
                                        upper-case
                                        rules="required"
                                        disabled
                                    >
                                    </c-texto>
                                </v-col>
                            
                                <v-col class="pb-0" cols="12" v-if="encuesta.di_encuestas.observacion_2">
                                    <v-label>Observacion 2:</v-label>
                                    <template v-for="(obs, index) in encuesta.di_encuestas.observacion_2">
                                        <v-chip class="ma-2" :key="index">
                                            {{ obs }}
                                        </v-chip>
                                    </template>
                                </v-col>
                                <v-col 
                                    class="pb-0" 
                                    cols="6" 
                                    v-if="
                                        (encuesta.gestante_inasistente_control == 'X' || 
                                        encuesta.gestante_inasistente_vacuna == 'X' ||
                                        encuesta.maternoperinatal == 'X'
                                        ) && encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')
                                        "
                                >
                                    <v-label>Estado RIAMP</v-label>
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.estado_riamp"
                                        placeholder="Seleccione"
                                        name="estado riamp"
                                        :items="riamp ? riamp : []"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <template v-if="encuesta.di_encuestas.estado_riamp">
                                    <v-col class="pb-0" cols="6">
                                        <c-date
                                            v-model="encuesta.di_encuestas.fecha_atencion_riamp"
                                            placeholder="Fecha de atencion de Salida RIAMP"
                                            :max="moment().format('YYYY-MM-DD')"
                                            rules="required"
                                            disabled
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                            v-model="encuesta.di_encuestas.ips_atencion"
                                            label="IPS de atencion Posparto, legrado, aborto"
                                            name="ips atencion estado riamp"
                                            rules="required"
                                            upper-case
                                            disabled
                                        >
                                        </c-texto>
                                    </v-col>
                                </template>
                                <v-col 
                                    class="pb-0" 
                                    cols="12"
                                    v-if="
                                        (encuesta.gestante_inasistente_control == 'X' || 
                                        encuesta.gestante_inasistente_vacuna == 'X' ||
                                        encuesta.maternoperinatal == 'X' ||
                                        encuesta.di_encuestas.observacion_2.includes('Nueva gestante')) && !encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')
                                    "
                                    >
                                    <v-card outlined tile>
                                        <v-card-text>
                                            <c-radio
                                                v-model="encuesta.di_encuestas.embarazo_riesgo"
                                                label="¿Embarazo de alto riesgo?"
                                                name="embarazo de alto riesgo"
                                                :items="riesgoEmbarazo"
                                                item-text="nombre"
                                                item-value="id"
                                                rules="required"
                                                :column="!$vuetify.breakpoint.smAndUp"
                                                disabled
                                            >
                                            </c-radio>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <template 
                                    v-if="
                                        (
                                            encuesta.maternoperinatal == 'X' || 
                                            encuesta.gestante_inasistente_control == 'X' || 
                                            encuesta.gestante_inasistente_vacuna == 'X'
                                        ) &&
                                        encuesta.di_encuestas.observacion_2 && !encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')
                                    "
                                >
                                    <v-col class="pb-0" cols="6">
                                        <c-date
                                            v-model="encuesta.di_encuestas.fecha_ultima_menst"
                                            placeholder="Fecha de ultima menstruacion"
                                            :max="moment().format('YYYY-MM-DD')"
                                            disabled
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="6">
                                        <c-texto
                                            v-model="encuesta.di_encuestas.edad_gestacional"
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
                                    v-if="encuesta.gestante_inasistente_vacuna == 'X' && encuesta.di_encuestas.observacion_2 && !encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')"
                                >
                                    <v-label>Seleccione la observación de vacunación:</v-label>
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.selec_obs_vacunacion"
                                        placeholder="Seleccione"
                                        name="observacion de vacunacion"
                                        :items="opciones ? opciones.selec_obs_vacunacion: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <template v-if="encuesta.gestante_inasistente_control == 'X' && encuesta.di_encuestas.observacion_2 && !encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')">
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.pendiente_lab"
                                            label="¿Tiene pendiente laboratorios?"
                                            name="pendiente laboratorios"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.pendiente_eco"
                                            label="¿Tiene pendiente ecografias?"
                                            name="pendiente ecografias"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="4">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.pendiente_consulta"
                                            label="¿Tiene pendiente consultas?"
                                            name="pendiente consultas"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Seleccione el motivo de Inasistencia al control prenatal:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_inasistencia_prenatal"
                                            placeholder="Seleccione"
                                            name="razon no asistio al control prenatal"
                                            :items="opciones ? opciones.selec_inasistencia_prenatal: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Seleccione algunas observaciones importantes:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_obs_importante_1"
                                            placeholder="Seleccione"
                                            name="observaciones importantes"
                                            :items="opciones ? opciones.selec_obs_importante_1: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <template v-if="encuesta.cronico == 'X' || encuesta.di_encuestas.observacion_2.includes('Cronico')">
                                    <v-col class="pb-0" cols="12">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.asiste_control"
                                            label="¿Asiste al control?"
                                            name="asiste al control"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.di_encuestas.asiste_control == 0 || encuesta.cronico_inasistente == 'X'">
                                        <v-label>Cuáles son las razones por las que no asiste al control médico de su enfermedad crónica con la ips:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_inasistencia_control"
                                            placeholder="Seleccione"
                                            name="inasistencia de control enfermadad cronica"
                                            :items="opciones ? opciones.selec_inasistencia_control: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <template v-if="(edadMeses >= edad_minima_embarazo && edadMeses <= edad_maxima_embarazo)">
                                    <v-col class="pb-0" cols="6" v-if="encuesta.maternoperinatal != 'X' && !encuesta.di_encuestas.observacion_2.includes('Nueva gestante') || encuesta.di_encuestas.observacion_2.includes('Embarazo terminado')">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.planifica"
                                            label="¿Planifica?"
                                            name="planifica"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.di_encuestas.planifica == 0">
                                        <v-label>Seleccione el motivo por el cual no planifica:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_motivo_noplan"
                                            placeholder="Seleccione"
                                            name="motivos no planifica"
                                            :items="opciones ? opciones.selec_motivo_noplan: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="encuesta.di_encuestas.planifica == 1">
                                        <v-label>Seleccione el metodo de planificacion:</v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_metodo_plan"
                                            placeholder="Seleccione"
                                            name="metodo de planificacion"
                                            :items="opciones ? opciones.selec_metodo_plan: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            rules="required"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <v-col class="pb-0" cols="6" 
                                    v-if="
                                        (encuesta.maternoperinatal != 'X' && !encuesta.di_encuestas.observacion_2.includes('Nueva gestante') && encuesta.genero == 'F' && ageIsBetweenRange(edadMeses, 216, 588)) || 
                                        encuesta.di_encuestas.observacion_2.includes('Embarazo terminado') && ageIsBetweenRange(edadMeses, 216, 588)
                                    "
                                >
                                    <c-radio
                                        v-model="encuesta.di_encuestas.desea_embarazo"
                                        label="¿Desea quedar en embarazo?"
                                        name="deseo de embarazo"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <template 
                                    v-if="
                                        encuesta.niño_inasistente_vacuna == 'X' ||
                                        encuesta.cronico_inasistente == 'X' ||
                                        encuesta.gestante_inasistente_vacuna == 'X' ||
                                        encuesta.gestante_inasistente_control == 'X'
                                    "
                                    >
                                    <v-col class="pb-0" cols="6">
                                        <c-radio
                                            v-model="encuesta.di_encuestas.agendo"
                                            label="¿Agendo cita?"
                                            name="agendo cita"
                                            :items="single"
                                            item-text="nombre"
                                            item-value="id"
                                            rules="required"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                            disabled
                                        >
                                        </c-radio>
                                    </v-col>
                                    <v-col class="pb-0" cols="6" v-if="encuesta.di_encuestas.agendo">
                                        <c-date
                                            v-model="encuesta.di_encuestas.fecha_agendamiento"
                                            placeholder="Fecha de agendamiento"
                                            :max="moment().format('YYYY-MM-DD')"
                                            rules="required"
                                            disabled
                                        >
                                        </c-date>
                                    </v-col>
                                    <v-col class="pb-0" cols="6" v-if="encuesta.di_encuestas.agendo == 0">
                                        <v-label>Seleccione el motivo por que no agenda: </v-label>
                                        <c-select-complete
                                            v-model="encuesta.di_encuestas.selec_no_agenda"
                                            placeholder="Seleccione"
                                            name="razon no agenda"
                                            :items="opciones ? opciones.selec_no_agenda: []"
                                            item-text="opcion"
                                            item-value="codigo"
                                            disabled
                                        >
                                        </c-select-complete>
                                    </v-col>
                                </template>
                                <v-col class="pb-0" cols="12" v-if="encuesta.niño_inasistente_vacuna == 'X'">
                                    <v-label>Seleccione el motivo de Inasistencia a vacunación del menor: </v-label>
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.selec_inasistencia_vacuna_niño"
                                        placeholder="Seleccione"
                                        name="razon inasistencia del menor a vacunacion"
                                        :items="opciones ? opciones.selec_inasistencia_vacuna_niño: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.familia_afiliada"
                                        label="¿Todo el grupo familiar se encuentra afiliado a capresoca?"
                                        name="afiliacion grupo familiar"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.sintomas_covid"
                                        label="¿Ha tenido síntomas relacionados con Covid 19 en los ultimos 14 dias?"
                                        name="sintomas covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.contacto_covid"
                                        label="¿Ha tenido contacto con alguna persona diagnosticada con COVID 19?"
                                        name="contacto covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.paciente_estudio_covid"
                                        label="¿Es paciente en estudio o le han realizado prueba para COVID 19?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.riesgo_tbc"
                                        label="¿Presenta lesiones o manchas en la piel sin dolor o rasquiña?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="6">
                                    <c-radio
                                        v-model="encuesta.di_encuestas.riesgo_hansen"
                                        label="¿Ha presentado tos con expectoración igual o mayor a 15 dias?"
                                        name="paciente covid"
                                        :items="single"
                                        item-text="nombre"
                                        item-value="id"
                                        rules="required"
                                        :column="!$vuetify.breakpoint.smAndUp"
                                        disabled
                                    >
                                    </c-radio>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.demanda_covid"
                                        placeholder="Seleccione la demanda inducida COVID 19"
                                        name="demanda covid"
                                        :items="demandaCovid"
                                        item-text="nombre"
                                        rules="required"
                                        item-value="id"
                                        disabled
                                    >
                                    </c-select-complete>
                                    
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <v-label>Seleccione algunas de las observaciones importantes:</v-label>
                                    <c-select-complete
                                        v-model="encuesta.di_encuestas.selec_obs_importante_2"
                                        placeholder="Seleccione"
                                        name="razones importantes"
                                        :items="opciones ? opciones.selec_obs_importante_2: []"
                                        item-text="opcion"
                                        item-value="codigo"
                                        disabled
                                    >
                                    </c-select-complete>
                                </v-col>

                                <v-col class="pb-0" cols="12">
                                    <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">

                                        <v-expansion-panel>
                                            <v-expansion-panel-header>Inducciones aplicadas</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row v-if="encuesta.di_inducciones_encuesta.length">
                                                    <template v-for="(induccion, index) in encuesta.di_inducciones_encuesta">
                                                        <v-chip
                                                            class="ma-2"
                                                            color="blue"
                                                            label
                                                            text-color="white"
                                                            :key="index"
                                                            >
                                                            <v-icon left>
                                                                mdi-label
                                                            </v-icon>
                                                            {{ `${induccion.di_edades ? induccion.di_edades.tipo_atencion : ''} 
                                                                ${induccion.di_edades ? induccion.di_edades.grupo_etario : ''} 
                                                                ${induccion.di_edades ? induccion.di_edades.frecuencia : ''}` }}
                                                        </v-chip>
                                                        <!-- <v-col class="pb-0" cols="12">
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
                                                        </v-col> -->
                                                    </template>
                                                </v-row>
                                                <v-row v-else>No se le aplicaron inducciones</v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    
                                </v-col>

                                <v-col class="pb-0" cols="12">
                                    <c-text-area
                                        label="Describa la razon por la cual no selecciono ninguna induccion a la demanda"
                                        v-model="encuesta.di_encuestas.obs_no_induccion"
                                        name="observaciones no selecciono inducciones"
                                        disabled
                                    ></c-text-area>
                                </v-col>

                                <v-col class="pb-0" cols="12">
                                    <c-text-area
                                        label="Observaciones finales"
                                        v-model="encuesta.di_encuestas.obs_final"
                                        name="observaciones finales"
                                        disabled
                                    ></c-text-area>
                                </v-col>
                            </template>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-container>
          <v-divider class="pa-0 ma-0"></v-divider>
          <v-card-actions class="justify-center">
            <v-btn block text @click="close">Cerrar</v-btn>
          </v-card-actions>
          <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
const DatosPersonales = () => import('../components/DatosPersonalesAfiliado')
const DatosPrecargados = () => import('../components/DatosPrecargadosAfiliado')
    export default {
      name: 'DetalleEncuesta',
      components: {
        DatosPersonales,
        DatosPrecargados
      },
        data: () => ({
          dialog: false,
          loading: false,
          click: null,
          encuesta: null,
          opciones: null,
          edad_minima_embarazo: 120,
          edad_maxima_embarazo: 660,
          panel: [0],
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
              {'id': 2, 'nombre': 'Se orienta al Usuario en cuidado generados prevencion COVID 19'}
          ]
        }),
        computed: {
          ...mapGetters([
            'departamentos'
          ]),
          opcionesObservacion2(){
              return this.tipo ? this.encuesta.genero == 'F'
                                      ? this.edadMeses >= this.edad_minima_embarazo && this.edadMeses <= this.edad_maxima_embarazo
                                          ? this.encuesta.maternoperinatal != 'X' 
                                              ? this.tipo.filter(x => x.id != 'Embarazo terminado') 
                                              : this.encuesta.maternoperinatal == 'X' 
                                                  ? this.tipo.filter(x => x.id != 'Nueva gestante') 
                                                  : this.tipo 
                                          : this.encuesta.maternoperinatal == 'X'
                                              ? this.tipo.filter(x => x.id != 'Nueva gestante')
                                              : this.tipo.filter(x => !['Embarazo terminado', 'Nueva gestante'].includes(x.id))
                                      : this.tipo.filter(x => !['Embarazo terminado', 'Nueva gestante'].includes(x.id))
                              : []
                      
                          
          },
          edadMeses(){
              let meses = null
              if(this.encuesta && this.encuesta.fecha_nacimiento && this.moment(this.encuesta.fecha_nacimiento).isValid()){
                let a = this.moment()
                let b = this.moment(this.encuesta.fecha_nacimiento)
                meses = a.diff(b, 'months')
              }
              return meses
          }
        },
        methods: {
            open(item = null, autoDetalle = false) {
                if (item && item.id) {
                    this.getOpcionesSelectores()
                    console.log("afterCallMethod");
                    autoDetalle ? this.getencuesta(item.di_precargados_id) : this.getencuesta(item.id)
                }
                this.dialog = true
                console.log("beforeCallMethod");
            },
            close() {
                this.dialog = false
                this.encuesta = null
            },
            getencuesta (di_precargados_id) {
                this.loading = true
                this.axios.get(`demanda-inducida/${di_precargados_id}`)
                    .then(response => {
                    this.encuesta = this.clone(response.data)
                    console.log("getEncuesta");
                    this.encuesta.di_encuestas.observacion_2 = this.encuesta.di_encuestas.observacion_2 != null ? this.encuesta.di_encuestas.observacion_2.split(',') : []
                    this.loading = false
                    })
                    .catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
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
            ageIsBetweenRange(edad, range1, range2){
                return edad >= range1 && edad <= range2
            }
        }
    }
</script>

<style scoped>

</style>