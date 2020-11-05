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
              :gestores="gestores"
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
    <detalle-encuesta
        ref="detalleEncuesta"
    ></detalle-encuesta>
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
const DetalleEncuesta = () => import('../components/DetalleEncuesta')
// import IconTooltip from '../../../components/Inputs/IconTooltip'

export default {
  name: 'Encuestas',
  components: {
    RegistroEncuesta,
    Filtros,
    Seguimiento,
    RegistroTamizaje,
    DetalleEncuesta
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
    gestores: [],
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
            render: (createElement, context) => {
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
														<v-list-item-title class="body-2" align="center">${this.value.diagnostico_febrero || '-'}</v-list-item-title>
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
														<v-list-item-title class="body-2" align="center">${this.value.cronico || '-'}</v-list-item-title>
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
														<v-list-item-title class="body-2" align="center">${this.value.maternoperinatal || '-'}</v-list-item-title>
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
														<v-list-item-title class="body-2" align="center">${this.value.alto_costo || '-'}</v-list-item-title>
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
          text: '# No efect',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          component: {
            functional: true,
            render: function (createElement, context) {
              return createElement('c-chip', {
                props: {
                  text: context.props.value.di_encuestas_no_efectivas.length || 0,
                  color: 'deep-purple',
                  tooltip: `# Encuestas no efectivas`,
                  textColor: 'white',
                  label: true
                }
              })
            }
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
  created(){
    this.getGestores()
  },
  methods: {
    goDatos(ruta) {
      this.dataTable.route = ruta
    },
    encuestaGuardada(item) {
      this.$store.commit('reloadTable', 'tablaDemandaInducida');
      // (item.sintomas_covid || item.paciente_estudio_covid || item.contacto_covid) && !item.erp_id ? this.crearTamizaje(item) : null
      !item.hasOwnProperty('razon_no_tel') ? this.$refs.detalleEncuesta.open(item, true): null
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
      console.log(item)
      this.$refs.detalleEncuesta.open(item, false)
    },
    verDetalleTamizaje(item) {
      this.$refs.detalleerp.open(item.erp_id)
    },
    crearTamizaje(item) {
      console.log('item', item)
      this.loading = true
      let data = this.clone(this.modelTamizaje)
      data.afiliado_id= null
      data.tipo_identificacion= item.tipo_identificacion_id
      data.identificacion= item.numero_identificacion
      data.nombre1= item.primer_nombre
      data.nombre2= item.segundo_nombre
      data.apellido1= item.primer_apellido
      data.apellido2= item.segundo_apellido
      data.fecha_nacimiento= item.fecha_nacimiento
      data.acudiente= null
      data.sexo= item.genero
      data.celular= item.tel_efectivo
      data.celular2= item.tel_alterno
      data.email= item.email
      data.eps_id= null
      data.tipo_afiliacion = item.regimen == 'SUBSIDIADO' ? 'Régimen Subsidiado' : item.regimen == 'CONTRIBUTIVO' ? 'Régimen Contributivo' : null
      data.direccion= null
      data.departamento_id= item.departamento_id
      data.municipio_id= item.municipio_id
      data.regimen_especial= null
      data.si_eps= 1
      data.barrio_id= null
      this.$refs.registroTamizaje.openData(data)
    },
    tamizajeGuardado(tamizaje) {
      console.log('tamizaje', tamizaje)
      this.$store.commit('reloadTable', 'tablaDemandaInducida')
    },
    resetOptions(item) {
      item.options = []
      if (
        this.permisos.crear && !item.encuesta_efectiva_id && item.di_encuestas_no_efectivas.length && item.di_encuestas_no_efectivas[item.di_encuestas_no_efectivas.length - 1].razon_no_tel != 5 || 
        !item.encuesta_efectiva_id && item.di_encuestas_no_efectivas.length && item.di_encuestas_no_efectivas[item.di_encuestas_no_efectivas.length - 1].razon_no_tel != 5 ||
        this.permisos.crear && !item.encuesta_efectiva_id && !item.di_encuestas_no_efectivas.length) {
        item.options.push({
          event: 'crearEncuesta',
          icon: 'fas fa-file-medical',
          tooltip: 'Crear Encuesta'
        })
      }
      if(item.di_encuestas_no_efectivas.length && item.di_encuestas_no_efectivas[item.di_encuestas_no_efectivas.length - 1].razon_no_tel == 5){
        item.options.push({
          event: '',
          icon: 'mdi-lock',
          tooltip: `Usuario fallecio`,
          color: "error",
          disabled: true
        })
      }
      if (this.permisos.verDetalle && item.encuesta_efectiva_id) item.options.push({
        event: 'verEncuesta',
        icon: 'mdi-file-find',
        tooltip: 'Detalle Encuesta Efectiva',
        color: 'success'
      })
      /* if (this.permisos.encuestasRCVEditar && item.id) item.options.push({
        event: 'editarEncuesta',
        icon: 'mdi-file-document-edit',
        tooltip: 'Editar Encuesta',
        color: 'orange'
      }) */
      return item
    },
    getGestores() {
      this.axios.get(`users-role?role=Gestor Demanda Inducida`).then(response => {
        this.gestores = response.data
      }).catch(error => {
        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los registros de los gestores.`, error: error})
      })
    }
  },
}
</script>

<style scoped>

</style>