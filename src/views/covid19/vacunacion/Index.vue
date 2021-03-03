<template>
  <v-container fluid>
    <page-title-bar title="Vacunación">
      <template slot="actions">
        <v-tooltip
            v-if="permisos.crear"
            top
            :disabled="$vuetify.breakpoint.smAndUp"
        >
          <template v-slot:activator="{on}">
            <v-btn
                v-on="on"
                :fab="$vuetify.breakpoint.xsOnly"
                small
                color="primary"
                @click.stop="crearPersona"
                class="white--text"
            >
              <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-account-plus</v-icon>
              {{$vuetify.breakpoint.smAndUp ? 'Nuevo Registro' : ''}}
            </v-btn>
          </template>
          <span>Nuevo Registro</span>
        </v-tooltip>
      </template>
    </page-title-bar>
    <data-table
        ref="tablaVacunacion"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @verdetalle="item => verdetalle(item)"
        @editar="item => editarDatos(item)"
        @vacunasFallidas="item => vacunasFallidas(item)"
        @apply-filters="$refs && $refs.filtrosVacunas && $refs.filtrosVacunas.aplicaFiltros()"
        @clear-filters="$refs && $refs.filtrosVacunas && $refs.filtrosVacunas.limpiarFiltros()"
    >
      <filtros
          slot="filters"
          ref="filtrosVacunas"
          :ruta-base="rutaBase"
          @filtra="val => goDatos(val)"
      ></filtros>
    </data-table>
    <detalle-vacunacion
        ref="detalleVacunacion"
        @guardado="actualizarRegistros"
    />
    <registro-vacunacion
        ref="registroVacunacion"
        @guardado="val => vacunaRegistrada(val)"
    />
    <seguimiento
        ref="seguimiento"
    />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import PersonaItemTabla from 'Views/covid19/vacunacion/components/PersonaItemTabla'
import BotonTooltip from '../../../components/Tamizaje/BotonTooltip'
import RegistroVacunacion from 'Views/covid19/vacunacion/components/RegistroVacunacion'
import DetalleVacunacion from 'Views/covid19/vacunacion/components/DetalleVacunacion'
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
const Filtros = () => import('Views/covid19/vacunacion/components/filtros')
export default {
  name: 'Vacunacion',
  components: {
    RegistroVacunacion,
    DetalleVacunacion,
    Seguimiento,
    Filtros
  },
  data: (vm) => ({
    rutaBase: 'vacunaciones',
    dataTable: {
      advanceFilters: false,
      buttonZone: false,
      nameItemState: 'tablaVacunacion',
      route: 'vacunaciones',
      makeHeaders: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        {
          text: 'ERP',
          align: 'center',
          sortable: false,
          value: 'id',
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.tamizaje_id
                  ? createElement(
                      BotonTooltip,
                      {
                        props: {
                          tooltip: `Ver ERP No. ${context.props.value.tamizaje_id}`,
                          text: `ERP ${context.props.value.tamizaje_id}`,
                          color: 'purple',
                          textColor: 'white',
                          value: context.props.value.tamizaje_id
                        },
                        on: {
                          click: (id) => {
                            vm.verTamizaje(id)
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
                          value: context.props.value
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Priorización',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.priorizacion ? this.value.priorizacion.descripcion : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
														${[(this.value.priorizacion ? this.value.priorizacion.fase : null), (this.value.priorizacion ? this.value.priorizacion.etapa : null)].filter(x => x).join(', ')}
                            </v-list-item-subtitle>
													</v-list-item-content>
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
          text: 'EPS',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          value: 'eps_id',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<span>${this.value.eps ? this.value.eps.nombre : ''}</span>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Usuario Registra',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.user ? this.value.user.name : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.user && this.value.user.telefono ? `Telefono: ${this.value.user.telefono}` : ''}</v-list-item-subtitle>
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
      'municipiosTotal'
    ]),
    permisos () {
      return this.$store.getters.getPermissionModule('covidVacunacion')
    }
  },
  methods: {
    resetOptions(item) {
      item.options = []
      if(this.permisos.editar) item.options.push({event: 'editar', icon: 'mdi-pencil', tooltip: 'Editar Datos', color:'warning'})
      if(this.permisos.verDetalle) item.options.push({event: 'verdetalle', icon: 'mdi-file-search', tooltip: 'Ver Detalle', color:'green'})
      if(item.fallidas && item.fallidas.length) item.options.push({event: 'vacunasFallidas', icon: 'mdi-alert-box-outline', tooltip: 'Vacunas Fallidas', color:'warning'})
    },
    goDatos(val){
      this.dataTable.route = val;
    },
    verTamizaje (id) {
      this.$refs.seguimiento.open(id)
    },
    verdetalle(item) {
      this.$refs.detalleVacunacion.open(item)
    },
    crearPersona() {
      this.$refs.registroVacunacion.open()
    },
    editarDatos(item) {
      this.$refs.registroVacunacion.open(item)
    },
    vacunaRegistrada(val) {
      if(this.permisos.verDetalle) this.verdetalle(val)
      this.actualizarRegistros()
    },
    actualizarRegistros() {
      this.$store.commit('reloadTable', 'tablaVacunacion')
    }
  }
}
</script>

<style scoped>

</style>