<template>
  <div>
    <data-table
        ref="tablaEncuestasRCV"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @crearEncuesta="item => crearEncuesta(item)"
        @verEncuesta="item => verEncuesta(item)"
        @editarEncuesta="item => editarEncuesta(item)"
        @apply-filters="$refs && $refs.filtrosReportesCovid && $refs.filtrosReportesCovid.aplicaFiltros()"
    >
      <template slot="top-actions-right">
        <v-btn
            color="success"
            class="white--text mr-2"
            v-if="returnDataTableTotal.total < 50000"
            @click.stop="descargarExcel"
            :disabled="loadingButton"
            :loading="loadingButton"
        >
          <v-icon left>far fa-file-excel</v-icon>
          Generar Excel
        </v-btn>
      </template>
      <filtros
          slot="filters"
          ref="filtrosReportesCovid"
          :ruta-base="rutaBase"
          @filtra="val => goDatos(val)"
      ></filtros>
    </data-table>
    <registro-encuesta
        v-if="permisos.encuestasRCVCrear"
        ref="registroEncuesta"
        @guardado="val => encuestaGuardada(val)"
    ></registro-encuesta>
    <detalle-encuesta
        ref="detalleEncuesta"
    ></detalle-encuesta>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PersonaItemTabla from '../../../../components/Tamizaje/PersonaItemTabla'

const RegistroEncuesta = () => import('Views/aps/rcv/encuestas/RegistroEncuesta')
const Filtros = () => import('Views/aps/rcv/encuestas/filtros/Filtros')
const DetalleEncuesta = () => import('Views/aps/rcv/encuestas/components/DetalleEncuesta')
import MenuItem from '../componentes/MenuItem'
import IconTooltip from '../componentes/IconTooltip'

export default {
  name: 'Encuestas',
  components: {
    RegistroEncuesta,
    Filtros,
    DetalleEncuesta,
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('aps')
    },
    ...mapGetters([
      'municipiosTotal',
      'tiposDocumentoIdentidad'
    ]),
    returnDataTableTotal() {
      return this.dataTable
    }
  },
  watch: {
    permisos: {
      handler(val) {
        if (val && val.encuestasRCVCrear) this.dataTable.buttonZone = true
      },
      immediate: true
    }
  },
  data: (vm) => ({
    rutaBase: 'rcvs',
    lengthData: null,
    loading: false,
    loadingButton: false,
    dataTable: {
      buttonZone: false,
      advanceFilters: true,
      nameItemState: 'tablaEncuestasRCV',
      route: 'rcvs',
      total: null,
      makeHeaders: [
        {
          text: 'Encuesta',
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
														<v-list-item-title class="body-2">${vm.municipiosTotal && this.value.centro_poblado_id && vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id) ? vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).nombre + ', ' + vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).departamento.nombre : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2">${this.value.direccion}</v-list-item-subtitle>
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
          text: 'Riesgo',
          align: 'left',
          sortable: true,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.riesgo_general
                  ? createElement(
                      MenuItem,
                      {
                        props: {
                          value: {
                            riesgo_general: context.props.value.riesgo_general,
                            items: [
                              {title: 'Riesgo OMS: ', value: context.props.value.riesgo_oms},
                              {title: 'Riesgo FINDRISC: ', value: context.props.value.riesgo_findrisc},
                              {title: 'Morisky Green: ', value: context.props.value.morisky_green},
                              {
                                title: 'Periodicidad de Seguimiento: ',
                                value: context.props.value.periodicidad_seguimiento + " Dias"
                              }
                            ]
                          }
                        }
                      }
                  )
                  : createElement('div', 'Pendiente')
            }
          }
        },
        {
          text: '',
          align: 'left',
          sortable: true,
          component: {
            functional: true,
            render: function (createElement, context) {
              return (!context.props.value.diastolica && !context.props.value.sistolica) && context.props.value.riesgo_general
                  ? createElement(
                      IconTooltip,
                      {
                        props: {
                          tooltip: 'No registra datos de Tensión Arterial'
                        }
                      }
                  )
                  : createElement('div', '')
            }
          }
        },
        {
          text: 'Usuario Registra',
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
														<v-list-item-title class="body-2">${this.value.nombre_usuario || ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.email_usuario || ''}</v-list-item-subtitle>
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
    encuestaGuardada(item) {
      this.$store.commit('reloadTable', 'tablaEncuestasRCV')
      this.$refs.detalleEncuesta.open(item, false, true)
    },
    crearEncuesta(item) {
      this.$refs.registroEncuesta.open(item)
    },
    editarEncuesta(item) {
      this.$refs.registroEncuesta.open(item)
    },
    verEncuesta(item) {
      this.$refs.detalleEncuesta.open(item, true, false)
    },
    descargarExcel(){
      this.loadingButton = true
      this.axios( {
        url: `${this.dataTable.route}&excel=${true}`, //your url
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        if(response.status === 204){
          this.$store.commit('snackbar', {color: 'info', message: `Los filtros aplicados no han generado registros para exportar`})
          this.loadingButton = false
        }else{
          //Create a Blob from the PDF Stream
          const file = new Blob(
              [response.data],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = fileURL
          a.download = 'Encuestas RCV.xlsx'
          a.click();
          this.loadingButton = false
        }
      }).catch(error => {
        this.loadingButton = false
        this.$store.commit('snackbar', {color: 'error', message: 'al descargar excel', error: error})
      })
    },
    resetOptions(item) {
      item.options = []
      item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_documento_identidad_id && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''
      item.celular = item.numero_celular
      item.identificacion = item.numero_documento_identidad
      if (this.permisos.encuestasRCVCrear && !item.id) item.options.push({
        event: 'crearEncuesta',
        icon: 'fas fa-file-medical',
        tooltip: 'Crear Encuesta'
      })
      if (item.id) item.options.push({
        event: 'verEncuesta',
        icon: 'mdi-file-find',
        tooltip: 'Detalle Encuesta',
        color: 'success'
      })
      // if (item.id) item.options.push({
      //   event: 'editarEncuesta',
      //   icon: 'mdi-file-document-edit',
      //   tooltip: 'Editar Encuesta',
      //   color: 'orange'
      // })
      return item
    }
  },
}
</script>

<style scoped>

</style>