<template>
    <v-row>
        <v-col class="pb-0" cols="12" v-if="esTamizaje">
            <v-card outlined tile>
                <v-card-text>
                    <c-radio
                            v-model="tamizaje.tipo_tamizaje"
                            label="Tipo de Encuesta de Riesgo Poblacional: "
                            rules="required"
                            name="tipo de encuesta de riesgo poblacional"
                            :items="tiposTamizaje"
                            item-text="nombre"
                            item-value="id"
                            :column="!$vuetify.breakpoint.smAndUp"
                            :readonly="!!llamada"
                    >
                    </c-radio>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col class="pb-0" cols="12" v-if="esTamizaje && tamizaje.tipo_tamizaje === 'telefónico'">
            <v-card outlined tile>
                <v-card-text>
                    <c-radio
                            v-model="tamizaje.llamada_entrante"
                            label="Tipo de llamada: "
                            rules="required"
                            name="tipo de llamada"
                            :items="[{value: 1, text: 'Entrante'}, {value: 0, text: 'Saliente'}]"
                            item-text="text"
                            item-value="value"
                            :column="!$vuetify.breakpoint.smAndUp"
                            :readonly="!!llamada"
                    >
                    </c-radio>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col class="pb-0" cols="12" v-if="esTamizaje">
            <v-label>¿Dónde se Diligencia la Encuesta de Riesgo Poblacional?</v-label>
            <c-select-complete
                    v-model="tamizaje.tamizador_id"
                    placeholder="Punto contacto"
                    rules="required"
                    name="punto contacto"
                    :items="tamizadores ? tamizadores.filter(x => x.id !== 891) : []"
                    item-text="nombre"
                    item-value="id"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-identificacion
                    v-model="tamizaje.identificacion"
                    label="Identificación"
                    rules="required"
                    name="identificación"
                    @responsepersona="val => resultAfiliado(val)"
                    @keyup="identificacionVerificada = 0"
            >
            </c-identificacion>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-select-complete
                    v-model="tamizaje.tipo_identificacion"
                    label="Tipo identificación"
                    rules="required"
                    name="tipo identificación"
                    :items="tiposDocumentoIdentidad"
                    item-text="descripcion"
                    item-value="id"
                    :disabled="identificacionVerificada < 1"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-texto
                    v-model="tamizaje.nombre1"
                    label="Primer nombre"
                    rules="required"
                    name="primer nombre"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-texto
                    v-model="tamizaje.nombre2"
                    label="Segundo nombre"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-texto
                    v-model="tamizaje.apellido1"
                    label="Primer apellido"
                    rules="required"
                    name="primer apellido"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-texto
                    v-model="tamizaje.apellido2"
                    label="Segundo apellido"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-date
                    v-model="tamizaje.fecha_nacimiento"
                    label="Fecha nacimiento"
                    rules="required"
                    name="fecha nacimiento"
                    :hint="edad"
                    :disabled="identificacionVerificada < 1"
                    :max="moment().format('YYYY-MM-DD')"
            >
            </c-date>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="6">
            <c-select-complete
                    v-model="tamizaje.sexo"
                    label="Sexo"
                    rules="required"
                    name="sexo"
                    :items="sexosCovid"
                    item-text="text"
                    item-value="value"
                    :disabled="identificacionVerificada < 1"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6">
            <c-texto
                    v-model="tamizaje.celular"
                    label="Celular Principal"
                    rules="required|numeric"
                    name="celular principal"
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6">
            <c-texto
                    v-model="tamizaje.celular2"
                    label="Celular Opcional"
                    rules="numeric"
                    name="celular opcional"
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="12">
            <c-texto
                    v-model="tamizaje.email"
                    label="Email"
                    rules="email"
                    name="email"
                    lower-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="12">
            <c-texto
                    v-model="tamizaje.acudiente"
                    label="Acudiente"
                    :rules="tamizaje.edad < 18 ? 'required' : ''"
                    name="acudiente"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <v-col class="pb-0" cols="12" v-if="esTamizaje">
            <c-texto
                    v-model="tamizaje.direccion"
                    label="Dirección"
                    rules="required"
                    name="dirección"
                    upper-case
                    :disabled="identificacionVerificada < 1"
            >
            </c-texto>
        </v-col>
        <template v-if="esTamizaje">
            <v-col class="pb-0" cols="12" sm="12" md="6">
                <c-select-complete
                        v-model="tamizaje.departamento_id"
                        label="Departamento"
                        name="departamento"
                        rules="required"
                        :items="departamentos"
                        item-text="nombre"
                        item-value="id"
                        :disabled="identificacionVerificada < 1"
                >
                </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="6">
                <c-select-complete
                        :disabled="!tamizaje.departamento_id || identificacionVerificada < 1"
                        v-model="tamizaje.municipio_id"
                        label="Municipio"
                        name="municipio"
                        rules="required"
                        :items="departamentos.length && tamizaje.departamento_id ? departamentos.find(x => x.id === tamizaje.departamento_id).municipios : []"
                        item-text="nombre"
                        item-value="id"
                >
                </c-select-complete>
            </v-col>
        </template>
        <v-col class="pb-0" cols="12">
            <v-checkbox
                    v-model="tamizaje.si_eps"
                    class="shrink mr-2"
                    label="¿Está afiliado a una EPS?"
                    :false-value="0"
                    :true-value="1"
                    :disabled="identificacionVerificada < 1"
            ></v-checkbox>
        </v-col>
        <template v-if="tamizaje.si_eps">
            <v-col class="pb-0" cols="12" sm="12" md="12">
                <c-select-complete
                        v-model="tamizaje.eps_id"
                        label="¿A que EPS está afiliado?"
                        rules="required"
                        name="EPS de afiliación"
                        :items="epss"
                        item-value="id"
                        item-text="nombre"
                        :disabled="identificacionVerificada < 1"
                >
                </c-select-complete>
            </v-col>
            <template v-if="tamizaje.eps_id">
                <v-col class="pb-0" cols="12" sm="12" md="6">
                    <c-select-complete
                            v-model="tamizaje.tipo_afiliacion"
                            label="Régimen"
                            rules="required"
                            name="régimen"
                            :items="tiposAfiliacion"
                            :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6" v-if="tamizaje.tipo_afiliacion === 'Régimen Especial'">
                    <c-select-complete
                            v-model="tamizaje.regimen_especial"
                            label="Régimen especial"
                            rules="required"
                            name="régimen especial"
                            :items="regimenesEspeciales"
                            :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                </v-col>
            </template>
        </template>
        <template v-if="identificacionVerificada === 1">
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="tamizaje.riesgo_procedencia"
                                label="Antecedentes de Viaje: ¿Ud realizó algún viaje desde o hacia las zonas donde se presenta el virus o ha tenido cercanía con personas contagiadas en los últimos 14 días?"
                                rules="required"
                                name="riesgo de procedencia"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="tamizaje.riesgo_ocupacional"
                                label="¿Es Trabajador de la salud u otro personal del ámbito hospitalario que haya tenido contacto estrecho* con caso confirmado para enfermedad por nuevo coronavirus (COVID-19)?"
                                rules="required"
                                name="riesgo trabajador de la salud"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="tamizaje.riesgo_contacto"
                                label="¿Ha tenido contacto estrecho* en los últimos 14 días con un caso confirmado con infección respiratoria aguda grave asociada al nuevo coronavirus 2019 (COVID-19)?"
                                rules="required"
                                name="riesgo de contacto"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="tamizaje.diagnosticado_covid"
                                label="¿Ha sido diagnósticado con covid-19?"
                                rules="required"
                                name="diagnósticado"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="tamizaje.diagnosticado_covid">
                <c-date
                        v-model="tamizaje.fecha_diagnostico"
                        rules="required"
                        label="Fecha del diagnóstico"
                        name="fecha del diagnóstico"
                        :max="moment().format('YYYY-MM-DD')"
                >
                </c-date>
            </v-col>
        </template>
        <seguimiento
                ref="seguimiento"
        ></seguimiento>
        <v-dialog v-model="dialog" persistent max-width="420">
            <v-card>
                <v-card-title class="headline text-center" v-if="tamizajeRegistrado">El documento {{tamizajeRegistrado.identificacion}} ya tiene un registro de {{tamizajeRegistrado.medico_id ? 'Caso de estudio' : 'Tamizaje'}}.</v-card-title>
                <v-card-text>Aceptar para ver el registro.</v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialog = false">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1 white--text" @click="verSeguimiento">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import {mapGetters} from 'vuex'
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    export default {
        name: 'FormTamizaje',
        components: {
            Seguimiento
        },
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            llamada: {
                type: Object,
                default: null
            },
            tipo: {
                type: String,
                default: 'tamizaje'
            }
        },
        data: () => ({
            identificacionVerificada: 0,
            loadingidentidad: false,
            edad: null,
            dialog: false,
            tamizajeRegistrado: null
        }),
        computed: {
            esTamizaje() {
                return this.tipo === 'tamizaje'
            },
            ...mapGetters([
                'sexosCovid',
                'tiposDocumentoIdentidad',
                'departamentos',
                'tiposAfiliacion',
                'epss',
                'regimenesEspeciales',
                'tamizadores',
                'tiposTamizaje'
            ])
        },
        watch: {
            'tamizaje.departamento_id': {
                handler (val) {
                    if (!val) {
                        this.tamizaje.municipio_id = null
                    }
                },
                immediate: false
            },
            'identificacionVerificada': {
                handler(val) {
                    if (typeof val !== 'undefined') {
                        this.$emit('verificado', val)
                    }
                },
                immediate: true
            },
            'tamizaje.tipo_tamizaje': {
                handler(val) {
                    val && val === 'presencial' && (this.tamizaje.llamada_entrante = null)
                },
                immediate: false
            },
            'tamizaje.diagnosticado_covid': {
                handler(val) {
                    !val && (this.tamizaje.fecha_diagnostico = null)
                },
                immediate: false
            },
            'tamizaje.fecha_nacimiento': {
                handler(val) {
                    val && this.calculaEdad()
                },
                immediate: true
            },
            'tamizaje.si_eps': {
                handler(val) {
                    !val && (this.tamizaje.eps_id = null)
                },
                immediate: false
            },
            'tamizaje.eps_id': {
                handler(val) {
                    !val && (this.tamizaje.tipo_afiliacion = null)
                },
                immediate: false
            },
            'tamizaje.tipo_afiliacion': {
                handler(val) {
                    if (!val || val !== 'Régimen Especial') {
                        this.tamizaje.regimen_especial = null
                    }
                },
                immediate: false
            }
        },
        methods: {
            calculaEdad() {
                if (this.tamizaje.fecha_nacimiento) {
                    let a = this.moment()
                    let b = this.moment(this.tamizaje.fecha_nacimiento)
                    let years = a.diff(b, 'year');
                    b.add(years, 'years');

                    let months = a.diff(b, 'months');
                    b.add(months, 'months');

                    let days = a.diff(b, 'days');
                    b.add(days, 'days');
                    let stringDate = ``
                    stringDate = stringDate + (years ? `${years} año${years === 1 ? '' : 's'}` : '')
                    stringDate = stringDate + (months ? ` ${months} mes${months === 1 ? '' : 'es'}` : '')
                    stringDate = stringDate + (years || months ? days ? ` ${days} d${days === 1 ? 'ía' : 'ias'}` : '' : `${days} d${days === 1 ? 'ía' : 'ias'}`)
                    this.tamizaje.edad = years
                    this.edad = stringDate
                } else {
                    this.tamizaje.edad = null
                    this.edad = null
                }
            },
            verSeguimiento () {
                this.$refs.seguimiento.open(this.tamizajeRegistrado.id)
                this.dialog = false
            },
            resultAfiliado(response) {
                this.identificacionVerificada = 1
                this.tamizaje.tipo_identificacion = null
                // this.tamizaje.identificacion = null
                this.tamizaje.nombre1 = null
                this.tamizaje.nombre2 = null
                this.tamizaje.apellido1 = null
                this.tamizaje.apellido2 = null
                this.tamizaje.fecha_nacimiento = null
                this.tamizaje.sexo = null
                this.tamizaje.celular = null
                this.tamizaje.email = null
                this.tamizaje.direccion = null
                this.tamizaje.municipio_id = null
                if (response) {
                    if (response.tamizaje) {
                        this.tamizajeRegistrado = response.tamizaje
                        this.identificacionVerificada = -1
                        this.dialog = true

                    } else if (response.afiliado) {
                        this.tamizaje.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
                        this.tamizaje.identificacion = response.afiliado.numero_documento_identidad
                        this.tamizaje.nombre1 = response.afiliado.nombre1
                        this.tamizaje.nombre2 = response.afiliado.nombre2
                        this.tamizaje.apellido1 = response.afiliado.apellido1
                        this.tamizaje.apellido2 = response.afiliado.apellido2
                        this.tamizaje.fecha_nacimiento = response.afiliado.fecha_nacimiento
                        this.tamizaje.sexo = response.afiliado.sexo
                        this.tamizaje.celular = response.afiliado.numero_celular
                        this.tamizaje.email = response.afiliado.email
                        this.tamizaje.direccion = response.afiliado.direccion
                        this.tamizaje.municipio_id = response.afiliado.centro_poblado_id
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>