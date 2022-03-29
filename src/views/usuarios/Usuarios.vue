<template>
  <v-container
      fluid
      class="grid-list-md"
  >
    <page-title-bar title="Usuarios">
      <template slot="actions">
        <v-btn
            color="primary"
            @click="crearUsuario"
        >
          <v-icon left>mdi-plus</v-icon>
          Crear Usuario
        </v-btn>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <usuarios-table />
      </v-col>
    </v-row>
    <registro-usuario
        ref="dialogRegistroUsuario"
        @save="getUsuarios"
    />
    <app-section-loader :status="loading" />
  </v-container>
</template>

<script>
const RegistroUsuario = () => import('Views/usuarios/components/RegistroUsuario')
const UsuariosTable = () => import('Views/usuarios/components/UsuariosTable')
export default {
  name: 'Usuarios',
  data: () => ({
    loading: false,
    usuarios: [],
    users: [],
  }),
  components: {
    RegistroUsuario,
    UsuariosTable
  },
  methods: {
    crearUsuario() {
      this.$refs.dialogRegistroUsuario.open()
    },
    getUsuarios() {
      this.$store.commit('reloadTable', 'tablaUsers')
    }
  }
}
</script>
