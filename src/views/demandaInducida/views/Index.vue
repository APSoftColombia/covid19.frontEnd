<template>
  <v-container fluid>
		<page-title-bar title="Encuestas Demanda Inducida"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
          <data-table
            ref="tablaDemandaInducida"
            v-model="dataTable"
            @resetOption="item => resetOptions(item)"
            @crearEncuesta="item => crearEncuesta(item)"
            @verEncuesta="item => verEncuesta(item)"
            @editarEncuesta="item => editarEncuesta(item)"
            @apply-filters="$refs && $refs.filtrosDemandaInducida && $refs.filtrosDemandaInducida.aplicaFiltros()"
        >
          <filtros
              slot="filters"
              ref="filtrosDemandaInducida"
              :ruta-base="rutaBase"
              @filtra="val => goDatos(val)"
          ></filtros>
        </data-table>
				</v-card>
			</v-col>
		</v-row>
    <registro-encuesta
        v-if="permisos.crear"
        ref="registroEncuesta"
        @guardado="val => encuestaGuardada(val)"
        @close="loading = false"
    ></registro-encuesta>
    <seguimiento ref="detalleerp" />
    <registro-tamizaje
        ref="registroTamizaje"
        @guardado="item => tamizajeGuardado(item)"
        @close="loading = false"
    />
    <!-- <detalle-encuesta
        ref="detalleEncuesta"
    ></detalle-encuesta> -->
    <app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import AlertErpRequired from '../components/AlertErpRequired.vue'
import ItemListDataAfiliado from '../components/ItemListDataAfiliado'

const RegistroEncuesta = () => import('../components/CrearEncuestaDemanda')
const Filtros = () => import('../components/FiltrosDemandaInducida')
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
import RegistroTamizaje from 'Views/covid19/tamizaje/RegistroTamizaje'
// const DetalleEncuesta = () => import('Views/aps/rcv/encuestas/components/DetalleEncuesta')
// import IconTooltip from '../../../components/Inputs/IconTooltip'

export default {
  name: 'Encuestas',
  components: {
    RegistroEncuesta,
    Filtros,
    Seguimiento,
    RegistroTamizaje
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('demandaInducida')
    },
    ...mapGetters([
      'modelTamizaje',
      'municipiosTotal',
      'tiposDocumentoIdentidad'
    ]),
    returnDataTableTotal() {
      return this.dataTable
    }
  },
  data: (vm) => ({
    rutaBase: 'demanda-inducida',
    lengthData: null,
    loading: false,
    loadingButton: false,
    dataTable: {
      buttonZone: true,
      advanceFilters: true,
      nameItemState: 'tablaDemandaInducida',
      route: 'demanda-inducida',
      total: null,
      makeHeaders: [
        {
          text: 'Identificador',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.id ? `ID: ${this.value.id}` : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.id && this.value.updated_at ? this.moment(this.value.updated_at).format('DD/MM/YYYY HH:mm') : ''}</v-list-item-subtitle>
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
          text: 'Afiliado',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value
                  ? createElement(
                      ItemListDataAfiliado,
                      {
                        props: {
                          sexo: context.props.value.genero,
                          nombre: `${context.props.value.primer_nombre} ${context.props.value.segundo_nombre} ${context.props.value.primer_apellido} ${context.props.value.segundo_apellido}`,
                          tipo_identificacion: context.props.value.tipo_identificacion,
                          numero_identificacion: context.props.value.numero_identificacion
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Ubicación',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item style="white-space: initial !important;">
													<v-list-item-content style="display: grid !important; min-width: 220px !important;">
														<v-list-item-title class="body-2">${this.value.municipio || ''}</v-list-item-title>
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
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            functional: true,
            render: function (createElement, context) {
              return createElement(
                      AlertErpRequired,
                      {
                        props: {
                          value: context.props.value
                        },
                        on: {
                          detalleTamizaje: () => {
                            vm.verDetalleTamizaje(context.props.value)
                          },
                          crearTamizaje: () => {
                            vm.crearTamizaje(context.props.value)
                          }
                        }
                      })
            }
          }
        },
        {
          text: 'Diagnostico',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.diagnostico_febrero || '-'}</v-list-item-title>
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
          text: 'Cronico',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.cronico || '-'}</v-list-item-title>
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
          text: 'Maternoperinatal',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.maternoperinatal || '-'}</v-list-item-title>
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
          text: 'Alto costo',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.alto_costo || '-'}</v-list-item-title>
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
    encuestaGuardada() {
      this.$store.commit('reloadTable', 'tablaDemandaInducida')
      // this.$refs.detalleEncuesta.open(item, false, true)
    },
    crearEncuesta(item) {
      this.loading = true
      this.$refs.registroEncuesta.open(item)
    },
    editarEncuesta(item) {
      this.loading = true
      this.$refs.registroEncuesta.open(item)
    },
    verEncuesta(item) {
      this.$refs.detalleEncuesta.open(item, true, false)
    },
    verDetalleTamizaje(item) {
      this.$refs.detalleerp.open(item.erp_id)
    },
    crearTamizaje(item) {
      console.log('item', item)
      this.loading = true
      let data = this.clone(this.modelTamizaje)
      this.$refs.registroTamizaje.openData(data)
    },
    tamizajeGuardado(tamizaje) {
      console.log('tamizaje', tamizaje)
      this.$store.commit('reloadTable', 'tablaDemandaInducida')
    },
    resetOptions(item) {
      item.erp_id = null
      item.erp_required = null
      item.options = []
      if (this.permisos.crear && item.id) item.options.push({
        event: 'crearEncuesta',
        icon: 'fas fa-file-medical',
        tooltip: 'Crear Encuesta'
      })
      if (this.permisos.verDetalle && item.id) item.options.push({
        event: 'verEncuesta',
        icon: 'mdi-file-find',
        tooltip: 'Detalle Encuesta',
        color: 'success'
      })
      /* if (this.permisos.encuestasRCVEditar && item.id) item.options.push({
        event: 'editarEncuesta',
        icon: 'mdi-file-document-edit',
        tooltip: 'Editar Encuesta',
        color: 'orange'
      }) */
      return item
    }
  },
}
</script>

<style scoped>

</style>