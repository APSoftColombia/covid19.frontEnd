<template>
    <v-dialog v-model="dialog" persistent max-width="920">
        <v-card v-if="aislamiento">
            <v-toolbar dark color="deep-purple">
                <v-icon left>mdi-door-closed-lock</v-icon>
                <v-toolbar-title>
                    <v-toolbar-title>Orden de Aislamiento {{aislamiento.id ? `No. ${aislamiento.id}` : ''}}</v-toolbar-title>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
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
                                        <v-list-item-subtitle v-if="item.subtitle" class="grey--text fs-12 fw-normal">{{item.subtitle}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action v-if="item.action">
                                        <v-list-item-action-text>{{item.action}}</v-list-item-action-text>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </template>
                </v-row>
                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-toolbar color="white" elevation="0" dense>
                            <v-toolbar-title>
                                <v-toolbar-title>Seguimientos</v-toolbar-title>
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip top v-if="$vuetify.breakpoint.xsOnly">
                                <template v-slot:activator="{on}">
                                    <v-btn @click="agregarSeguimiento" icon color="primary darken-3" v-on="on">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar seguimiento</span>
                            </v-tooltip>
                            <v-btn v-else dark @click="agregarSeguimiento" color="primary darken-3" class="mr-2">
                                <v-icon left>mdi-plus</v-icon>
                                Agregar seguimiento
                            </v-btn>
                        </v-toolbar>
                        <v-divider class="my-0 py-0"></v-divider>
                        <v-simple-table dense class="tablaseguimientoaislamiento" fixed-header>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Fecha</th>
                                    <th>Soportes</th>
                                    <th>Proceso</th>
                                    <th>Usuario</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(seguimiento, seguimientoIndex) in aislamiento.seguimientos">
                                    <tr :key="`seguimientoaislamiento${seguimientoIndex}`">
                                        <td>
                                            <v-avatar color="primary" size="40" class="white--text">
                                                {{aislamiento.seguimientos.length - seguimientoIndex}}
                                            </v-avatar>
                                        </td>
                                        <td>
                                            {{ seguimiento.fecha ? moment(seguimiento.fecha).format('DD/MM/YYYY') : '' }}
                                        </td>
                                        <td>
                                            <v-list-item class="pa-0">
                                                <v-list-item-content class="pa-0">
                                                    <v-list-item-subtitle>
                                                        <v-tooltip top>
                                                            <template v-slot:activator="{on}">
                                                                <a v-on="on" class="primary--text">Venti:</a>
                                                            </template>
                                                            <span>Soporte Ventilatorio</span>
                                                        </v-tooltip>
                                                        {{seguimiento.soporte_ventilatorio}}
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        <v-tooltip top>
                                                            <template v-slot:activator="{on}">
                                                                <a v-on="on" class="primary--text">Hemodi:</a>
                                                            </template>
                                                            <span>Soporte Hemodinámico</span>
                                                        </v-tooltip>
                                                        {{seguimiento.soporte_hemodinamico !== null ? seguimiento.soporte_hemodinamico ? 'SI' : 'NO' : ''}}
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </td>
                                        <td>
                                            <v-list-item class="pa-0">
                                                <v-list-item-content class="pa-0">
                                                    <v-list-item-subtitle>{{ seguimiento.created_at ? `Creado: ${moment(seguimiento.created_at).format('DD/MM/YYYY')}` : '' }}</v-list-item-subtitle>
                                                    <v-list-item-subtitle>{{ seguimiento.updated_at ? `Actualizado: ${moment(seguimiento.updated_at).format('DD/MM/YYYY')}` : '' }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </td>
                                        <td>
                                            <v-list-item class="pa-0">
                                                <v-list-item-content class="pa-0" v-if="seguimiento.user">
                                                    <v-list-item-title>{{ seguimiento.user.name }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ seguimiento.user.email }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider class="mt-0"></v-divider>
            <v-card-actions>
                <v-btn
                        large
                        @click.stop="close"
                >
                    <v-icon>mdi-close</v-icon>
                    Cerrar
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
            <registro-seguimiento-aislamiento
                    :aislamiento="aislamiento"
                    @guardado="val => seguimientoGuardado(val)"
                    ref="registroSeguimientoAislamiento"
            ></registro-seguimiento-aislamiento>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import RegistroSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/RegistroSeguimientoAislamiento'
    import {mapGetters} from "vuex";

    export default {
        name: 'DetalleAislamiento',
        props: {
            aislamiento: {
                type: Object,
                default: null
            }
        },
        components: {
            RegistroSeguimientoAislamiento
        },
        data: () => ({
            datos: [],
            loading: false,
            dialog: false
        }),
      computed: {
        ...mapGetters([
          'causalesNoReportaContactos'
        ]),
      },
        watch: {
            aislamiento: {
                handler () {
                    this.assign()
                },
                immediate: false
            }
        },
        methods: {
            seguimientoGuardado (seguimiento) {
                this.$emit('guardado', seguimiento)
            },
            agregarSeguimiento () {
                this.$refs.registroSeguimientoAislamiento.open()
            },
            assign () {
                this.datos = []
                if (this.aislamiento) {
                    this.datos.push(
                        {
                            label: 'Fecha Ingreso',
                            body: this.aislamiento.fecha_ingreso,
                            icon: 'mdi-calendar-check',
                            iconColor: 'warning',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                            label: 'Fecha Egreso',
                            body: this.aislamiento.fecha_egreso,
                            icon: 'mdi-calendar-remove',
                            iconColor: 'green',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                            label: 'Tipo',
                            body: this.aislamiento.tipo,
                            icon: 'mdi-door-closed',
                            iconColor: 'red',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                            label: 'Habitación Individual',
                            body: this.aislamiento.individual ? 'SI' : 'NO',
                            icon: this.aislamiento.individual ? 'mdi-bed-outline' : 'mdi-bed-king',
                            iconColor: 'purple',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                            label: 'Ambito de Atención',
                            body: this.aislamiento.ambito || this.aislamiento.otro_ambito,
                            icon: 'fas fa-medkit',
                            iconColor: 'info',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                            label: 'Registrado por',
                            body: this.aislamiento.user ? this.aislamiento.user.name : '',
                            subtitle: this.aislamiento.user ? this.aislamiento.user.email : '',
                            icon: 'fas fa-user-md',
                            iconColor: 'pink',
                            colmd: '6',
                            collg: '4'
                        },
                        {
                          label: '¿La persona aislada y el grupo familiar se comprometió a cumplir con el aislamiento?',
                          body: this.aislamiento.CompromisoPersonaAislada !== null ? this.aislamiento.CompromisoPersonaAislada ?  'Si' : 'No' : '',
                          icon: 'fas fa-handshake-alt-slash',
                          iconColor: 'green',
                          colmd: '6',
                          collg: '4'
                        },
                        {
                          label: '¿Reporta contactos?',
                          body: this.aislamiento.ReportaContactos !== null ? this.aislamiento.ReportaContactos ?  'Si' : 'No' : '',
                          icon: 'fas fa-file-signature',
                          iconColor: 'purple',
                          colmd: '6',
                          collg: '4'
                        }
                    )
                  if(!this.aislamiento.ReportaContactos){
                    this.datos.push(
                        {
                          label: 'Causa por la cual no reporta contactos',
                          body: this.causalesNoReportaContactos.find(x => x.value === this.aislamiento.IDCausalNoReporteContactos).text,
                          icon: 'fas fa-question',
                          iconColor: 'blue',
                          colmd: '6',
                          collg: '4'
                        }
                    )
                  }
                }
            },
            open () {
                this.dialog = true
            },
            close () {
                this.dialog = false
                this.loading = false
            }
        }
    }
</script>

<style scoped>
    .tablaseguimientoaislamiento .v-data-table table thead tr td, .v-data-table table thead tr th, .v-data-table table tbody tr td, .v-data-table table tbody tr th, .v-data-table table tfoot tr td, .v-data-table table tfoot tr t {
        height: 2rem !important;
    }

    .tablaseguimientoaislamiento .v-data-table td, .v-data-table th {
        padding: 0 8px !important;
    }
</style>