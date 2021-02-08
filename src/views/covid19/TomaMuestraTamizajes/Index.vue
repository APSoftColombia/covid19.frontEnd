<template>
  <v-container fluid>
    <page-title-bar title="Toma de Muestras"></page-title-bar>
    <data-table
        ref="tablaMuestras"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @tomarmuestra="item => tomarmuestra(item)"
        @apply-filters="$refs && $refs.filtrosMuestras && $refs.filtrosMuestras.aplicaFiltros()"
        @clear-filters="$refs && $refs.filtrosMuestras && $refs.filtrosMuestras.limpiarFiltros()"
    >
      <filtros
          slot="filters"
          ref="filtrosMuestras"
          :ruta-base="rutaBase"
          @filtra="val => goDatos(val)"
      ></filtros>
    </data-table>
    <tomar-muestra
        ref="tomadormuestra"
        @guardado="tomaRegistrada"
    />
    <seguimiento
        ref="seguimiento"
    />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import PersonaItemTabla from '../../../components/Tamizaje/PersonaItemTabla'
import TomarMuestra from "./TomarMuestra";
import BotonTooltip from "../../../components/Tamizaje/BotonTooltip";
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
const Filtros = () => import('Views/covid19/TomaMuestraTamizajes/filtros.vue')
export default {
  name: 'TomaMuestrasTamizajes',
  components: {
    TomarMuestra,
    Seguimiento,
    Filtros
  },
  data: (vm) => ({
    rutaBase: 'pruebas-asignacion-user',
    dataTable: {
      advanceFilters: true,
      buttonZone: true,
      nameItemState: 'tablaTomaMuestrasIPS',
      route: 'pruebas-asignacion-user',
      makeHeaders: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'prueba_id'
        },
        {
          text: 'Asignación',
          align: 'center',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item style="text-align: center">
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-1">${this.value.created_at && this.value.user ? 'Asignada: ' + this.moment(this.value.created_at).format('DD/MM/YYYY HH:mm') : ''}</v-list-item-title>
														<v-list-item-title class="body-2">${this.value.created_at && this.value.user ? this.value.user.name : ''}</v-list-item-title>
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
          text: 'ERP',
          align: 'center',
          sortable: false,
          value: 'id',
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.id
                  ? createElement(
                      BotonTooltip,
                      {
                        props: {
                          tooltip: `Ver ERP No. ${context.props.value.id}`,
                          text: `ERP ${context.props.value.id}`,
                          color: 'purple',
                          textColor: 'white',
                          value: context.props.value
                        },
                        on: {
                          click: (item) => {
                            vm.verTamizaje(item)
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }

        },
        {
          text: 'Persona',
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
                            nombre: context.props.value.nombre,
                            positivo_covid: context.props.value.positivo_covid,
                            sexo: context.props.value.sexo,
                            tipoIdentificacion: vm.tiposDocumentoIdentidad.find(x => x.id === context.props.value.tipo_identificacion).tipo,
                            identificacion: context.props.value.identificacion,
                            celular: context.props.value.celular,
                            nombre_eps: context.props.value.nombre_eps
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Dirección Persona',
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
														<v-list-item-title class="body-2">${this.value.direccion || ''}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
														${vm.municipiosTotal && vm.municipiosTotal.length && this.value.municipio_id && vm.municipiosTotal.find(x => x.id === this.value.municipio_id)
                          ?  `${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).nombre}, ${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).departamento.nombre}`
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
          text: 'IPS',
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
														<v-list-item-title class="body-2">${this.value.prestador ? this.value.prestador.nombre : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-1">${ this.value.prestador ? [this.value.prestador.codigohabilitacion ? 'CH: ' + this.value.prestador.codigohabilitacion : null, this.value.prestador.telefono ? 'Tel: ' + this.value.prestador.telefono : null].filter(x => x).join(', ') : '' }</v-list-item-subtitle>
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
          text: 'Estado',
          align: 'center',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item style="text-align: center">
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-1">${this.value.toma_prueba ? 'Tomada: ' + this.moment(this.value.fecha_toma_prueba).format('DD/MM/YYYY HH:mm') : !this.value.toma_prueba && this.value.toma_prueba !== null ? 'No Tomada: ' + this.moment(this.value.updated_at).format('DD/MM/YYYY HH:mm') : 'Pendiente'}</v-list-item-title>
														<v-list-item-title class="body-2">${this.value.toma_prueba && this.value.usuario_prueba ? this.value.usuario_prueba.name : !this.value.toma_prueba && this.value.toma_prueba !== null ? this.value.razon_no_toma : ''}</v-list-item-title>
														<v-list-item-title class="body-2">${ !this.value.toma_prueba && this.value.toma_prueba === 0 ? this.value.usuario_prueba.name : ''}</v-list-item-title>
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
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'getUser'
    ]),
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    }
  },
  methods: {
    resetOptions(item) {
      item.options = []
      if(!item.toma_prueba && item.toma_prueba === null && this.permisos.tomaMuestraCrear && (item.cod_habilitacion_ips === this.getUser.cod_ips)) item.options.push({event: 'tomarmuestra', icon: 'mdi-calendar-plus', tooltip: 'Marcar Fecha Toma', color:'red'})
    },
    goDatos(val){
      this.dataTable.route = val;
    },
    verTamizaje (item) {
      this.$refs.seguimiento.open(item.id)
    },
    tomarmuestra(item) {
      this.$refs.tomadormuestra.open(item)
    },
    tomaRegistrada() {
      this.$store.commit('reloadTable', 'tablaTomaMuestrasIPS')
    },
  }
}
</script>

<style scoped>

</style>