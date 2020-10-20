<template>
  <v-container fluid>
    <page-title-bar title="Nexos"></page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <data-table
              ref="tablaNexos"
              v-model="dataTable"
              @resetOption="item => resetOptions(item)"
              @seguimiento="item => verSeguimiento(item)"
              @crearERP="item => crearTamizaje(item)"
              @Editar="item => editarNexo(item)"
              @detalleNexo="item => detalleNexo(item)"
              @eliminarNexo="item => eliminarNexo(item)"
              @apply-filters="$refs && $refs.filtrosNexos && $refs.filtrosNexos.aplicaFiltros()"
          >
            <filtros
                slot="filters"
                ref="filtrosNexos"
                :ruta-base="rutaBase"
                @filtra="val => goDatos(val)"
            ></filtros>
          </data-table>
        </v-card>
      </v-col>
    </v-row>
    <seguimiento
        ref="seguimiento"
    ></seguimiento>
    <registro-tamizaje
        v-if="permisos.tamizajeCrear"
        ref="registroTamizaje"
        @guardado="item => reloadTable()"
    ></registro-tamizaje>
    <registro-reporte-comunitario
        ref="registroNexo"
        @editado="val => nexoEditado(val)"
    ></registro-reporte-comunitario>
    <detalle-nexo
          ref="detalleNexo"
    ></detalle-nexo>
    <eliminar-nexos-o-convivientes
        ref="eliminarNexoConviviente"
        :sonNexos="true"
        @nexoOConvivienteEliminado="reloadTable"
    ></eliminar-nexos-o-convivientes>
    <app-section-loader :status="loading"></app-section-loader>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla"
import Filtros from './Filtros/Filtros'

const EliminarNexosOConvivientes = () => import('Views/covid19/tamizaje/nexo/EliminarNexosOConvivientes.vue')
const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
const DetalleNexo = () => import('Views/covid19/tamizaje/nexo/DetalleNexo.vue')
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
const RegistroReporteComunitario = () => import('Views/covid19/Nexos/EditarNexo')
export default {
  name: "NexosView",
  data: (vm) => ({
    loading: false,
    rutaBase: "nexos",
    dataTable: {
      advanceFilters: true,
      buttonZone: true,
      nameItemState: 'tablaNexos',
      route: null,
      makeHeaders: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value
                  ? createElement(
                      PersonaItemTabla,
                      {
                        props: {
                          value: context.props.value,
                          isNotFromNexos: false
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Parentesco',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`, {
                    domProps: {
                      innerHTML: `
                                              <p style="max-width: 150px; white-space: normal">
                                                  ${vm.parentescos && vm.parentescos.length && vm.parentescos.find(x => x.id === this.value.parentesco_id) ? vm.parentescos.find(x => x.id === this.value.parentesco_id).descripcion : ''}
                                              </p>
                                            `
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Origen',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value
                  ? createElement(
                      PersonaItemTabla,
                      {
                        props: {
                          value: {
                            sexo: context.props.value.sexo_origen,
                            nombre: context.props.value.nombre_origen,
                            identificacion: context.props.value.identificacion_origen,
                            celular: context.props.value.celular_origen,
                            tipoIdentificacion: vm.tiposDocumentoIdentidad.find(x => x.id === context.props.value.tipo_identificacion_origen).tipo,
                            showButton: true,
                            erp_origen: context.props.value.tamizaje_id_origen
                          },
                        },
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Muestra',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`, {
                    domProps: {
                      innerHTML: `
                                                <span>
                                                    ${this.value.estado_prueba ? this.value.estado_prueba : 'N/A'}
                                                </span>
                                            `
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Dirección',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.direccion}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
														${vm.municipiosTotal && vm.municipiosTotal.length && this.value.municipio_id && vm.municipiosTotal.find(x => x.id === this.value.municipio_id)
                          ? `${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).nombre}, ${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).departamento.nombre}`
                          : ''}
                                                        </v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Opciones',
          align: 'center',
          sortable: false,
          actions: true,
          singlesActions: true
        }
      ]
    }
  }),
  methods: {
    goDatos(ruta) {
      this.dataTable.route = ruta
    },
    resetOptions(item) {
      item.options = []
      if (item.erp_generado_id) item.options.push({
        event: 'seguimiento',
        icon: 'mdi-file-find',
        tooltip: 'Detalle ERP',
        color: 'success'
      })
      if (!item.erp_generado_id && this.permisos.tamizajeCrear) item.options.push({
        event: 'crearERP',
        icon: 'fas fa-file-medical',
        tooltip: 'Crear ERP'
      })
      if (this.permisos.nexoCrear) item.options.push({
        event: 'Editar',
        icon: 'mdi-pencil',
        tooltip: 'Editar',
        color: 'warning'
      })
      item.options.push({
        event: 'detalleNexo',
        icon: 'fas fa-info',
        tooltip: 'Ver Detalle',
        color: 'info'
      })
      if(this.permisos.eliminarNexo){
        item.options.push({
          event: 'eliminarNexo',
          icon: 'fas fa-trash-alt',
          tooltip: 'Eliminar Nexo',
          color: 'error'
        })
      }
    },
    verSeguimiento(item) {
      this.$refs.seguimiento.open(item.erp_generado_id)
    },
    crearTamizaje(item) {
      this.$refs.registroTamizaje.open(null, item.id)
    },
    reloadTable() {
      this.$store.commit('reloadTable', 'tablaNexos')
    },
    editarNexo(nexo) {
      this.$refs.registroNexo.open(nexo)
    },
    nexoEditado() {
      this.reloadTable()
    },
    detalleNexo(item){
      this.$refs.detalleNexo.open(item, true)
    },
    eliminarNexo(item){
      this.$refs.eliminarNexoConviviente.open(item)
    }
  },
  components: {
    Seguimiento,
    RegistroTamizaje,
    Filtros,
    RegistroReporteComunitario,
    DetalleNexo,
    EliminarNexosOConvivientes
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'municipiosTotal',
      'parentescos'
    ]),
    isEmit() {
      return this.$on('seguimiento', this.verSeguimiento)
    }
  },
  watch: {
    isEmit: {
      handler(val) {
        val
      },
      immediate: true
    }
  },
  created() {
    this.dataTable.route = this.rutaBase
  }
}
</script>

<style scoped>

</style>