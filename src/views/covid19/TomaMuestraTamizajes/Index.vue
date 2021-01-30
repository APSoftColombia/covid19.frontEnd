<template>
  <v-container fluid>
    <page-title-bar title="Toma de Muestras"></page-title-bar>
    <data-table
        ref="tablaMuestras"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @tomarmuestra="item => tomarmuestra(item)"
    />
    <tomar-muestra
        ref="tomadormuestra"
        @guardado="tomaRegistrada"
    />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import PersonaItemTabla from '../../../components/Tamizaje/PersonaItemTabla'
import TomarMuestra from "./TomarMuestra";
export default {
  name: 'TomaMuestrasTamizajes',
  components: {TomarMuestra},
  data: (vm) => ({
    dataTable: {
      advanceFilters: false,
      buttonZone: false,
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
                            celular: context.props.value.celular
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
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
														<v-list-item-title class="body-1">${this.value.fecha_toma_prueba ? 'Tomada: ' + this.moment(this.value.fecha_toma_prueba).format('DD/MM/YYYY HH:mm') : 'Pendiente'}</v-list-item-title>
														<v-list-item-title class="body-2">${this.value.fecha_toma_prueba && this.value.usuario_prueba ? this.value.usuario_prueba.name : ''}</v-list-item-title>
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
      'municipiosTotal'
    ]),
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    }
  },
  methods: {
    resetOptions(item) {
      item.options = []
      if(!item.fecha_toma_prueba && this.permisos.tomaMuestraCrear) item.options.push({event: 'tomarmuestra', icon: 'mdi-calendar-plus', tooltip: 'Marcar Fecha Toma', color:'red'})
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