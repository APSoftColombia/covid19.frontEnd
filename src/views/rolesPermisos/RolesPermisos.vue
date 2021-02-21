<template>
  <v-container fluid class="grid-list-md">
    <page-title-bar title="Roles y Permisos">
      <template slot="actions">
        <v-btn color="primary" @click="createRol">
          <v-icon left>mdi-plus</v-icon>
          Crear Rol
        </v-btn>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nombre</th>
                <th class="text-left">Opciones</th>
              </tr>
              </thead>
              <tbody v-if="rolesD && rolesD.roles.length">
              <tr v-for="rol in rolesD.roles" :key="rol.id">
                <td>{{ rol.id }}</td>
                <td>{{ rol.nombre }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn small icon v-on="on" color="warning" @click.stop="editRol(rol)">
                        <v-icon>fas fa-edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <form-rol
              ref="formRol"
              @refreshTable="getRoles"
          ></form-rol>
          <app-section-loader :status="loading"></app-section-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const FormRol = () => import('Views/rolesPermisos/components/FormRolPermissions')
export default {
  name: 'RolesPermisos',
  components: {
    FormRol,
  },
  data: () => ({
    rolesD: null,
    loading: false,
  }),
  methods: {
    getRoles() {
      this.loading = true
      this.axios.get('roles').then(response => {
        this.rolesD = response.data
        for (const [key, value] of Object.entries(this.rolesD.roles)) {
          for (const [index, permiso] of Object.entries(value.permisos)) {
            key + index
            delete permiso.pivot
          }
        }
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {color: 'error', message: ` al cargar roles`, error: error})
      })
    },
    editRol(rol) {
      this.$refs.formRol.open(rol)
    },
    createRol() {
      this.$refs.formRol.openCreate()
    }
  },
  created() {
    this.getRoles()
  }
}
</script>

<style scoped>

</style>