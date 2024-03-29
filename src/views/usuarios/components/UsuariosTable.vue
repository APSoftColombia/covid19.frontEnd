<template>
  <v-card>
    <data-table
        ref="tablaNexos"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @rest_contra="item => resetPassword(item)"
        @editar="item => editarUsuario(item)"
        @cambiar_estado="item => cambiaEstado(item)"
        @apply-filters="$refs"
    >
    </data-table>
    <registro-usuario
        ref="dialogRegistroUsuario"
        @save="reloadTable"
    />
    <dialog-password
        ref="confirmation"
        :heading="dialog.heading"
        :name="dialog.name"
        :loading="dialog.loading"
        @confirm="confirmResetPassword"
    />
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
const DialogPassword = () => import('Views/usuarios/components/ConfirmChangePassword')
const RegistroUsuario = () => import('Views/usuarios/components/RegistroUsuario')
export default {
  name: 'UsuariosTable',
  data: (vm) => ({
    loading: false,
    rutaBase: 'user',
    dataTable: {
      advanceFilters: false,
      buttonZone: false,
      nameItemState: 'tablaUsers',
      route: null,
      makeHeaders: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Nombre',
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
														<v-list-item-title class="body-3">${this.value.name}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
														    ${this.value.tipo + ': ' + this.value.numero_documento_identidad}
                                    ${'Cel: ' + this.value.telefono}
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
          text: 'Email',
          align: 'left',
          sortable: false,
          value: 'email'
        },
        {
          text: 'Dirección',
          align: 'left',
          sortable: false,
          value: 'direccion'
        },
        {
          text: 'EPS',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`, {
                    domProps: {
                      innerHTML: `
                                <p style="max-width: 300px; white-space: normal">
                                    ${vm.epss && vm.epss.length && vm.epss.find(x => x.id === this.value.eps_id) ? vm.epss.find(x => x.id === this.value.eps_id).nombre : ''}
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
          text: 'Opciones',
          align: 'center',
          sortable: false,
          actions: true,
          singlesActions: true
        }
      ]
    },
    dialog: {
      heading: '',
      name: '',
      loading: false,
      registro: null
    },
  }),
  components: {
    RegistroUsuario,
    DialogPassword
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('usuario')
    },
    ...mapGetters([
      'epss'
    ]),
  },
  methods: {
    resetOptions(item) {
      item.options = []
      if (this.permisos.editar) item.options.push({
        event: 'rest_contra',
        icon: 'mdi-account-key',
        tooltip: 'Cambiar Contraseña',
        color: 'primary'
      })
      if (this.permisos.editar) item.options.push({
        event: 'editar',
        icon: 'mdi-pencil',
        tooltip: 'Editar Usuario',
        color: 'primary'
      })
      if (this.permisos.editar) item.options.push({
        event: 'cambiar_estado',
        icon: item.habilitado ? 'far fa-window-close' : 'far fa-check-circle',
        tooltip: item.habilitado ? 'Deshabilitar usuario' : 'Habilitar usuario',
        color: 'primary'
      })
    },
    epsNombre(usuario) {
      return this && this.epss && this.epss.length && this.epss.find(x => x.id === usuario.eps_id) ? this.epss.find(x => x.id === usuario.eps_id).nombre : null
    },
    cambiaEstado(usuario) {
      usuario.loading = true
      this.axios.put(`user/cambiar-estado-habilitado/${usuario.id}`, {id: usuario.id})
          .then(() => {
            usuario.loading = false
            usuario.habilitado = usuario.habilitado ? 0 : 1
            this.reloadTable()
          })
          .catch(error => {
            usuario.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al cambiar el estado del usuarios.`,
              error: error
            })
          })
    },
    resetPassword(usuario) {
      this.dialog.heading = 'Cambiar Contraseña'
      this.dialog.name = usuario.name
      this.dialog.registro = usuario
      this.$refs.confirmation.open(true)
    },
    editarUsuario(usuario) {
      this.$refs.dialogRegistroUsuario.open(usuario.id)
    },
    confirmResetPassword(password) {
      this.dialog.loading = true
      this.axios.put(`user/restablecer-contrasena/${this.dialog.registro.id}`, {
        id: this.dialog.registro.id,
        password: password
      })
          .then(() => {
            this.$store.commit('snackbar', {color: 'success', message: `La contraseña se actualizo correctamente.`})
            this.dialog.loading = false
            this.$refs.confirmation.close()
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `Error al actualizar la contraseña, ${error.response.data.message}.`
            })
            this.dialog.loading = false
          })
    },
    reloadTable() {
      this.$store.commit('reloadTable', 'tablaUsers')
    }
  },
  created() {
    this.dataTable.route = this.rutaBase
  }
}
</script>
