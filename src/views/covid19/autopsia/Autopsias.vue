<template>
  <div>
    <data-table
        ref="tablaAutopsias"
        v-model="dataTable"
        @autopsia="item => verAutopsia(item)"
        @resetOption="item => resetOptions(item)"
        @editar="item => editarAutopsia(item)"
    >
      <template slot="top-actions-right" v-if="permisos.autopsiaCrear">
        <v-btn
            color="primary"
            @click.stop="crearAutopsia"
        >
          <v-icon left>mdi-plus</v-icon>
          Crear Autopsia
        </v-btn>
      </template>
    </data-table>
    <autopsia ref="autopsia"></autopsia>
    <registro-autopsia
        v-if="permisos.autopsiaCrear"
        ref="registroAutopsia"
        @guardado="val => autopsiaGuardada(val)"
    ></registro-autopsia>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla";

const RegistroAutopsia = () => import('Views/covid19/autopsia/RegistroAutopsia')
const Autopsia = () => import('Views/covid19/autopsia/Autopsia')
export default {
  name: 'Autopsias',
  components: {
    RegistroAutopsia,
    Autopsia
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposDocumentoIdentidad'
    ])
  },
  watch: {
    permisos: {
      handler(val) {
        if (val && val.autopsiaCrear) this.dataTable.buttonZone = true
      },
      immediate: true
    }
  },
  data: () => ({
    dataTable: {
      buttonZone: false,
      nameItemState: 'tablaAutopsias',
      route: 'autopsias',
      makeHeaders: [
        {
          text: 'Autopsia',
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
														<v-list-item-title class="body-2">Id: ${this.value.id}</v-list-item-title>
														<v-list-item-subtitle class="title caption">
                                                            ${this.value.created_at ? this.moment(this.value.created_at).format('DD/MM/YYYY') : ''}
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
          text: 'Fallecido',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value && context.props.value.fallecido
                  ? createElement(
                      PersonaItemTabla,
                      {
                        props: {
                          value: context.props.value.fallecido
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Informante',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value && context.props.value.encuestado
                  ? createElement(
                      PersonaItemTabla,
                      {
                        props: {
                          value: context.props.value.encuestado
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Clasificación',
          align: 'left',
          sortable: false,
          value: 'clasificacion'
        },
        {
          text: 'Usuario Registra',
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
  methods: {
    autopsiaGuardada() {
      this.$store.commit('reloadTable', 'tablaAutopsias')
    },
    verAutopsia(item) {
      this.$refs.autopsia.open(item.id)
    },
    crearAutopsia() {
      this.$refs.registroAutopsia.open()
    },
    editarAutopsia(autopsia) {
      this.$refs.registroAutopsia.open(autopsia.id)
    },
    resetOptions(item) {
      if (item.fallecido) {
        item.fallecido.nombre = item.nombre_fallecido
        item.fallecido.tipoIdentificacion = this.tiposDocumentoIdentidad && item.fallecido.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.fallecido.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.fallecido.tipo_identificacion).tipo : ''
      }
      if (item.encuestado) {
        item.encuestado.nombre = item.nombre_encuestado
        item.encuestado.tipoIdentificacion = this.tiposDocumentoIdentidad && item.encuestado.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.encuestado.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.encuestado.tipo_identificacion).tipo : ''
      }
      item.options = []
      item.options.push({event: 'autopsia', icon: 'mdi-file-find', tooltip: 'Detalle Autopsia', color: 'success'})
      if(this.permisos.autopsiaEditar) item.options.push({event: 'editar', icon: 'mdi-file-edit', tooltip: 'Editar Autopsia', color: 'warning'})
      return item
    }
  }
}
</script>

<style scoped>

</style>