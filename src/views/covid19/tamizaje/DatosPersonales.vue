<template>
    <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
        <v-expansion-panel>
            <v-expansion-panel-header class="py-1 pl-0">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon color="teal" large>{{tamizaje.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face'}}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                        <v-list-item-title v-if="tipo"><h6 class="mb-0">{{tipo}}</h6></v-list-item-title>
                        <v-list-item-title class="grey--text fs-12 fw-normal">
                            <h4 class="ma-0">
                                {{[tamizaje.nombre1, tamizaje.nombre2, tamizaje.apellido1, tamizaje.apellido2].filter(x => x).join(' ')}}
                            </h4>
                        </v-list-item-title>
                        <v-list-item-title><h6 class="mb-0">{{tiposDocumentoIdentidad && tamizaje.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === tamizaje.tipo_identificacion).tipo : ''}} {{tamizaje.identificacion}}</h6></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-divider class="ma-0"></v-divider>
                <v-row no-gutters>
                    <template v-for="(item, indexItem) in datos">
                        <v-col cols="12" :md="item.colmd" :lg="item.collg" :key="`col${indexItem}`">
                            <v-list two-line class="notification-wrap">
                                <v-list-item ripple>
                                    <v-list-item-avatar class="my-1">
                                        <v-icon :color="item.iconColor">{{item.icon}}</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{item.label}}</v-list-item-subtitle>
                                        <v-list-item-title><h6 class="mb-0">{{item.body}}</h6></v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action v-if="item.action">
                                        <v-list-item-action-text>{{item.action}}</v-list-item-action-text>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </template>
                </v-row>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'DatosPersonales',
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            abierto: {
                type: Boolean,
                default: true
            },
            tipo: {
                type: String,
                default: null
            }
        },
        data: () => ({
            datos: [],
            panel: [0]
        }),
        watch: {
            abierto: {
                handler (val) {
                    if (this) {
                        this.panel = val ? [0] : []
                    }
                },
                immediate: true
            },
            tamizaje: {
                handler (val) {
                    val && this.assign()
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            ...mapGetters([
                'tiposDocumentoIdentidad'
            ])
        },
        methods: {
            assign () {
                this.datos = []
                this.datos.push(
                    {
                        label: 'Fecha Nacimiento',
                        body: this.tamizaje.fecha_nacimiento,
                        icon: 'mdi-calendar-month',
                        iconColor: 'warning',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Sexo',
                        body: this.tamizaje.sexo ? this.tamizaje.sexo === 'M' ? 'Masculino' : 'Femenino' : '',
                        icon: 'mdi-human-male-female',
                        iconColor: 'primary',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Celular',
                        body: [this.tamizaje.celular, this.tamizaje.celular2].filter(x => x).join(' - '),
                        icon: 'mdi-cellphone-iphone',
                        iconColor: 'info',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Email',
                        body: this.tamizaje.email,
                        icon: 'mdi-email',
                        iconColor: 'error',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Acudiente',
                        body: this.tamizaje.acudiente,
                        icon: 'mdi-account-child',
                        iconColor: 'green',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Dirección',
                        body: this.tamizaje.direccion,
                        icon: 'fas fa-map-signs',
                        iconColor: 'purple',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Municipio',
                        body: this.tamizaje.municipio ? `${this.tamizaje.municipio.nombre}, ${this.tamizaje.municipio.departamento.nombre}` : '',
                        icon: 'mdi-map-marker-radius',
                        iconColor: 'blue',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'EPS',
                        body: this.tamizaje.eps ? this.tamizaje.eps.nombre : '',
                        icon: 'fas fa-hospital',
                        iconColor: 'pink',
                        colmd: '6',
                        collg: '4'
                    },
                    {
                        label: 'Régimen',
                        body: [this.tamizaje.tipo_afiliacion, this.tamizaje.regimen_especial].filter(x => x).join(' - '),
                        icon: 'mdi-medical-bag',
                        iconColor: 'indigo',
                        colmd: '6',
                        collg: '4'
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>