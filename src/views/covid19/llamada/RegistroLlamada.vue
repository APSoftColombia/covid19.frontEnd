<template>
    <v-dialog
            v-model="dialog"
            persistent
            max-width="720"
    >
        <v-card>
            <v-toolbar dark color="deep-purple">
                <v-icon left>fas fa-phone-alt</v-icon>
                <v-toolbar-title>{{llamada && llamada.id ? `Llamada No. ${llamada.id}` : `Nueva Llamada`}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip
                        class="elevation-2 mr-2"
                        color="deep-purple darken-3"
                        label
                >
                    <v-icon left>mdi-timer</v-icon>
                    {{time}}
                </v-chip>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <ValidationObserver ref="formLlamada" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row>
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-card-text>
                                    <c-radio
                                            v-model="llamada.tipo"
                                            label="Tipo de llamada: "
                                            rules="required"
                                            name="tipo de llamada"
                                            :items="tiposLlamada"
                                            item-text="nombre"
                                            item-value="id"
                                            :column="!$vuetify.breakpoint.smAndUp"
                                    >
                                    </c-radio>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <template v-if="llamada.tipo !== null">
                            <v-col cols="12">
                                <v-card outlined tile>
                                    <v-card-text>
                                        <c-radio
                                                v-model="llamada.covid"
                                                label="Tema: "
                                                rules="required"
                                                name="tema"
                                                :items="[{id: 1, nombre: 'Covid-19'}, {id: 0, nombre: 'Otro Tema'}]"
                                                item-text="nombre"
                                                item-value="id"
                                                :column="!$vuetify.breakpoint.smAndUp"
                                        >
                                        </c-radio>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <template v-if="!llamada.covid">
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-identificacion
                                            v-model="llamada.identificacion"
                                            label="Identificación"
                                            rules="required"
                                            name="identificación"
                                            @responsepersona="val => resultAfiliado(val)"
                                    >
                                    </c-identificacion>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-select-complete
                                            v-model="llamada.tipo_identificacion"
                                            label="Tipo identificación"
                                            rules="required"
                                            name="tipo identificación"
                                            :items="tiposDocumentoIdentidad"
                                            item-text="descripcion"
                                            item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-texto
                                            v-model="llamada.nombre"
                                            label="Nombre"
                                            rules="required"
                                            name="nombre"
                                            upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-select-complete
                                            v-model="llamada.sexo"
                                            label="Sexo"
                                            rules="required"
                                            name="sexo"
                                            :items="sexosCovid"
                                            item-value="value"
                                            item-text="text"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-date
                                            v-model="llamada.fecha_nacimiento"
                                            label="Fecha nacimiento"
                                            :hint="edad"
                                            :max="moment().format('YYYY-MM-DD')"
                                    >
                                    </c-date>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-texto
                                            v-model="llamada.celular"
                                            label="Celular"
                                            rules="numeric"
                                            name="celular"
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                            v-model="llamada.departamento_id"
                                            label="Departamento"
                                            :items="departamentos"
                                            item-text="nombre"
                                            item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                            :disabled="!llamada.departamento_id"
                                            v-model="llamada.municipio_id"
                                            label="Municipio"
                                            name="municipio"
                                            :rules="llamada.departamento_id ? 'required' : ''"
                                            :items="departamentos.length && llamada.departamento_id ? departamentos.find(x => x.id === llamada.departamento_id).municipios : []"
                                            item-text="nombre"
                                            item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                        v-model="llamada.tipo_poblacion"
                                        label="Tipo población"
                                        rules="required"
                                        name="Tipo población"
                                        :items="tipoPoblaciones"
                                    />
                                </v-col>
                                <!-- <v-col class="pb-0" cols="12" v-if="llamada.tipo_poblacion == 'Población Asegurada'">
                                    <v-checkbox
                                            v-model="llamada.si_eps"
                                            class="shrink mr-2"
                                            label="¿Está afiliado a una EPS?"
                                            :false-value="0"
                                            :true-value="1"
                                    ></v-checkbox>
                                </v-col> -->
                                <template v-if="llamada.si_eps">
                                    <v-col class="pb-0" cols="12" sm="12" md="12">
                                        <c-select-complete
                                                v-model="llamada.eps_id"
                                                label="¿A que EPS está afiliado?"
                                                rules="required"
                                                name="EPS de afiliación"
                                                :items="epss"
                                                item-value="id"
                                                item-text="nombre"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <template v-if="llamada.eps_id">
                                        <v-col class="pb-0" cols="12" sm="12" md="6">
                                            <c-select-complete
                                                    v-model="llamada.tipo_afiliacion"
                                                    label="Régimen"
                                                    rules="required"
                                                    name="régimen"
                                                    :items="tiposAfiliacion"
                                            >
                                            </c-select-complete>
                                        </v-col>
                                        <v-col class="pb-0" cols="12" sm="12" md="6" v-if="llamada.tipo_afiliacion === 'Régimen Especial'">
                                            <c-select-complete
                                                    v-model="llamada.regimen_especial"
                                                    label="Régimen especial"
                                                    rules="required"
                                                    name="régimen especial"
                                                    :items="regimenesEspeciales"
                                            >
                                            </c-select-complete>
                                        </v-col>
                                    </template>
                                </template>
                                <v-col class="pb-0" cols="12">
                                    <c-text-area
                                            v-model="llamada.motivo"
                                            label="Motivo"
                                            rules="required"
                                            name="motivo"
                                    >
                                    </c-text-area>
                                </v-col>
                              <v-col class="pb-0" cols="12">
                                <c-select-complete
                                    v-model="llamada.dependencia_id"
                                    label="Dependencia"
                                    rules="required"
                                    name="dependencia"
                                    item-value="id"
                                    item-text="dependencia"
                                    :items="dependencias"
                                    :hint="llamada.responsable ? `Responsable: ${llamada.responsable}` : ''"
                                />
                              </v-col>
                            </template>
                            <template v-else>
                                <v-col cols="12">
                                    <v-btn
                                            v-if="permisos.tamizajeCrear"
                                            color="primary"
                                            @click.stop="crearTamizaje"
                                    >
                                        <v-icon left>mdi-plus</v-icon>
                                        Crear ERP
                                    </v-btn>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn
                                            v-if="permisos.reporteComunitarioCrear"
                                            color="primary"
                                            @click.stop="crearReporteComunitario"
                                    >
                                        <v-icon left>mdi-plus</v-icon>
                                        Crear Reporte Comunitario
                                    </v-btn>
                                </v-col>
                            </template>
                        </template>
                    </v-row>
                </ValidationObserver>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn
                            large
                            @click.stop="close"
                    >
                        <v-icon>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                            large
                            color="deep-purple"
                            class="white--text"
                            @click.stop="guardarLlamada"
                    >
                        <v-icon left>fas fa-save</v-icon>
                        Guardar Llamada
                    </v-btn>
                </v-card-actions>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
            <registro-reporte-comunitario
                    v-if="permisos.reporteComunitarioCrear"
                    ref="registroReporteComunitario"
                    @guardado="val => reporteGuardado(val)"
            ></registro-reporte-comunitario>
            <registro-tamizaje
                    v-if="permisos.tamizajeCrear"
                    ref="registroTamizaje"
                    @guardado="val => tamizajeGuardado(val)"
            ></registro-tamizaje>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    const RegistroReporteComunitario = () => import('Views/covid19/reporteComunitario/RegistroReporteComunitario')
    const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
    export default {
        name: 'RegistroLlamada',
        components: {
            RegistroReporteComunitario,
            RegistroTamizaje
        },
        data: () => ({
            edad: null,
            loading: false,
            dialog: false,
            llamada: null,
            interval: null,
          dependencias: [],
          loadingDependencias: false
        }),
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            ...mapGetters([
                'modelLlamada',
                'tiposDocumentoIdentidad',
                'tiposLlamada',
                'tiposAfiliacion',
                'epss',
                'regimenesEspeciales',
                'departamentos',
                'sexosCovid',
                'tipoPoblaciones',
            ]),
            time () {
                let h = 0
                let m = 0
                let s = 0
                if (this && this.llamada) {
                    let initime = this.clone(this.llamada.duracion)
                    h = Math.trunc(initime / 3600)
                    initime = initime - (h * 3600)
                    m = Math.trunc(initime / 60)
                    initime = initime - (m * 60)
                    s = initime
                }
                return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
            }
        },
        watch: {
            'llamada.tipo_poblacion': {
                handler(val) {
                    if (val === 'Población Asegurada') {
                        this.llamada.si_eps = 1
                    } else {
                        this.llamada.si_eps = 0
                    }
                },
                immediate: false
            },
            'llamada.departamento_id': {
                handler (val) {
                    if (!val) {
                        this.llamada.municipio_id = null
                    }
                },
                immediate: false
            },
            'llamada.dependencia_id': {
                handler (val) {
                    if (!val) {
                      this.llamada.responsable = null
                    } else {
                      this.llamada.responsable = this.dependencias?.find(x => x.id === val)?.responsable?.name || null
                    }
                },
                immediate: false
            },
            'llamada.covid': {
                handler (val) {
                    if (!val) {
                        this.$nextTick(() => {
                            this.llamada.celular = null
                            this.llamada.nombre = null
                            this.llamada.motivo = null
                            this.llamada.dependencia_id = null
                            this.llamada.responsable = null
                            this.llamada.tipo_identificacion = null
                            this.llamada.identificacion = null
                            this.llamada.fecha_nacimiento = null
                            this.llamada.edad = null
                            this.llamada.municipio_id = null
                            this.llamada.si_eps = 0
                            this.llamada.eps_id = null

                        })
                    }
                },
                immediate: false
            },
            'llamada.fecha_nacimiento': {
                handler(val) {
                  if(this && this.llamada) {
                    let laEdad = this.calculaEdad(val)
                    this.llamada.edad = laEdad.years
                    this.edad = laEdad.stringDate
                  }
                },
                immediate: true
            },
            'llamada.si_eps': {
                handler(val) {
                    !val && (this.llamada.eps_id = null)
                },
                immediate: false
            },
            'llamada.eps_id': {
                handler(val) {
                    !val && (this.llamada.tipo_afiliacion = null)
                    if (val) {
                        this.llamada.tipo_poblacion = 'Población Asegurada'
                    }
                },
                immediate: false
            },
            'llamada.tipo_afiliacion': {
                handler(val) {
                    if (!val || val !== 'Régimen Especial') {
                        this.llamada.regimen_especial = null
                    }
                },
                immediate: false
            }
        },
        created() {
            this.llamada = this.clone(this.modelLlamada)
        },
        methods: {
            guardarLlamada () {
                this.$refs.formLlamada.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.axios.post(`llamadas`, this.llamada)
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `La llamada se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar la llamada.`, error: error})
                            })
                    }
                })
            },
            open (idLlamada = null) {
                if (idLlamada) {
                    this.getLlamada(idLlamada)
                } else {
                    this.goDuracion()
                }
                this.dialog = true
              this.getDependencias()
            },
            close () {
                this.$refs.formLlamada.reset()
                this.dialog = false
                this.loading = false
                this.llamada = this.clone(this.modelLlamada)
                clearInterval(this.interval)
            },
            goDuracion () {
                this.interval = setInterval(() => {
                    this.llamada.duracion ++
                }, 1000)
            },
          getDependencias () {
            this.loadingDependencias = true
            this.axios.get('dependencias').then(response => {
              this.dependencias = response.data
              this.loadingDependencias = false
            }).catch(error => {
              this.loadingDependencias = false
              this.$store.commit('snackbar', {color: "error", message: ` al cargar los resgistros de dependencias`, error: error})
            })
          },
            getLlamada (idLlamada) {
                this.loading = true
                this.axios.get(`llamadas/${idLlamada}`)
                    .then(response => {
                        console.log('response get llamada', response)
                        // this.datos = response.data.filter(x => x.geolocalizacion)
                        this.loading = false
                        setTimeout(() => {
                            this.goDuracion()
                        }, 500)
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar la llamada.`, error: error})
                    })
            },
            reporteGuardado (reporte) {
                console.log('reporte', reporte)
                this.close()
                this.$store.commit('reloadTable', 'tablaLlamadas')
                this.$store.commit('reloadTable', 'tablaReportesComunitarios')
            },
            tamizajeGuardado (tamizaje) {
                console.log('tamizaje', tamizaje)
                this.close()
                this.$store.commit('reloadTable', 'tablaLlamadas')
                this.$store.commit('reloadTable', 'tablaTamizajes')
            },
            crearTamizaje () {
                this.$refs.registroTamizaje.open(null, null, this.llamada)
            },
            crearReporteComunitario () {
                this.$refs.registroReporteComunitario.open(null, null, this.llamada)
            },
            resultAfiliado(response) {
                this.llamada.tipo_identificacion = null
                this.llamada.nombre = null
                this.llamada.fecha_nacimiento = null
                this.llamada.municipio_id = null
                this.llamada.celular = null
                if (response.afiliado) {
                    this.llamada.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
                    this.llamada.identificacion = response.afiliado.numero_documento_identidad
                    this.llamada.nombre = [response.afiliado.nombre1, response.afiliado.nombre2, response.afiliado.apellido1, response.afiliado.apellido2].filter(x => x).join(' ')
                    this.llamada.fecha_nacimiento = response.afiliado.fecha_nacimiento
                    this.llamada.celular = response.afiliado.numero_celular
                    this.llamada.municipio_id = response.afiliado.centro_poblado_id
                    this.llamada.sexo = response.afiliado.sexo
                    this.llamada.celular = response.afiliado.numero_celular
                    this.llamada.departamento_id = response.afiliado.departamento_id
                    this.llamada.municipio_id = response.afiliado.municipio ? response.afiliado.municipio.id : null
                    this.llamada.eps_id = response.afiliado.eps_id
                    this.llamada.tipo_afiliacion = response.afiliado.regimen
                }
            }
        }
    }
</script>

<style scoped>

</style>