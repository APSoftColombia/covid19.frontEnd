<template>
    <v-expansion-panels v-if="afiliado" v-model="panel" multiple style="z-index: 0 !important;">
        <v-expansion-panel>
            <v-expansion-panel-header class="py-1 pl-0">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon color="teal" large>{{afiliado.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face'}}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                        <v-list-item-title class="grey--text fs-12 fw-normal">
                            <h4 class="ma-0">
                                {{afiliado.nombre}}
                            </h4>
                        </v-list-item-title>
                        <v-list-item-title>
                          <h6 class="mb-0">
                            {{tiposDocumentoIdentidad && afiliado.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === afiliado.tipo_documento_identidad_id).tipo : ''}} {{afiliado.numero_documento_identidad}}
                          </h6>
                        </v-list-item-title>
                      <v-list-item-subtitle>
                        {{calculaEdad(afiliado && afiliado.fecha_nacimiento).stringDate}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-divider class="ma-0"></v-divider>
                <v-row no-gutters>
                    <template v-for="(item, indexItem) in datos">
                        <v-col cols="12" :md="item.colmd" :lg="item.collg" xl="3" :key="`col${indexItem}`">
                            <v-list two-line class="notification-wrap">
                                <v-list-item>
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
    import {mapGetters} from 'vuex'

    export default {
        name: 'DatosAfiliado',
        props: {
            afiliado: {
                type: Object,
                default: null
            },
            abierto: {
                type: Boolean,
                default: true
            },
          dense: {
            type: Boolean,
            default: false
          }
        },
        data: () => ({
            datos: [],
            panel: []
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
            afiliado: {
                handler (val) {
                    val && this.assign()
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            ...mapGetters([
                'tiposDocumentoIdentidad',
                'municipiosTotal'
            ])
        },
        methods: {
            assign () {
                this.datos = []
                let municipio = this.municipiosTotal && this.afiliado.centro_poblado_id ? this.municipiosTotal.find(x => x.id === this.afiliado.centro_poblado_id) : null
                this.datos.push(
                    {
                        label: 'Fecha Nacimiento',
                        body: this.afiliado && this.afiliado.fecha_nacimiento ? this.moment(this.afiliado.fecha_nacimiento).format('DD/MM/YYYY') : '',
                        icon: 'mdi-calendar-month',
                        iconColor: 'warning',
                        colmd: '6',
                        collg: this.dense ? '6' : '4'
                    },
                    {
                        label: 'Sexo',
                        body: this.afiliado.sexo ? this.afiliado.sexo === 'M' ? 'Masculino' : 'Femenino' : '',
                        icon: 'mdi-human-male-female',
                        iconColor: 'primary',
                        colmd: '6',
                      collg: this.dense ? '6' : '4'
                    },
                    {
                        label: 'Celular',
                        body: this.afiliado.numero_celular,
                        icon: 'mdi-cellphone-iphone',
                        iconColor: 'info',
                        colmd: '6',
                      collg: this.dense ? '6' : '4'
                    },
                    {
                        label: 'Email',
                        body: this.afiliado.email,
                        icon: 'mdi-email',
                        iconColor: 'error',
                        colmd: '6',
                      collg: this.dense ? '6' : '4'
                    },
                    // {
                    //     label: 'Acudiente',
                    //     body: this.afiliado.acudiente,
                    //     icon: 'mdi-account-child',
                    //     iconColor: 'green',
                    //     colmd: '6',
                    //     collg: '4'
                    // },
                    {
                        label: 'Dirección',
                        body: this.afiliado.direccion,
                        icon: 'fas fa-map-signs',
                        iconColor: 'purple',
                        colmd: '6',
                      collg: this.dense ? '6' : '4'
                    },
                    {
                        label: 'Municipio',
                        body: municipio ? `${municipio.nombre}, ${municipio.departamento.nombre}` : '',
                        icon: 'mdi-map-marker-radius',
                        iconColor: 'blue',
                        colmd: '6',
                      collg: this.dense ? '6' : '4'
                    }
                    // {
                    //     label: 'EPS',
                    //     body: this.afiliado.eps ? this.afiliado.eps.nombre : '',
                    //     icon: 'fas fa-hospital',
                    //     iconColor: 'pink',
                    //     colmd: '6',
                    //     collg: '4'
                    // },
                    // {
                    //     label: 'Régimen',
                    //     body: [this.afiliado.tipo_afiliacion, this.afiliado.regimen_especial].filter(x => x).join(' - '),
                    //     icon: 'mdi-medical-bag',
                    //     iconColor: 'indigo',
                    //     colmd: '6',
                    //     collg: '4'
                    // }
                )
            }
        }
    }
</script>

<style scoped>

</style>