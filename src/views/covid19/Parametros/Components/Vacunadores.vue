<template>
  <v-card>
    <v-card-title>
      <span>Vacunadores</span>
      <v-spacer></v-spacer>
      <form-vacunador @reloadTable="getVacunadores"></form-vacunador>
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Vacunador</th>
            <th class="text-left">Opciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="vacunador in vacunadores" :key="vacunador.id">
            <td>{{ vacunador.id }}</td>
            <td>
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title :class="`body-2 text-truncate`">
                    {{ `${vacunador.nombre1} ${vacunador.nombre2} ${vacunador.apellido1} ${vacunador.apellido2}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle :class="`body-2 text-truncate`">
                    {{ vacunador.tipo_identificacion }}
                    {{ vacunador.identificacion }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <form-vacunador @reloadTable="getVacunadores" :vacunador="vacunador"></form-vacunador>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <eliminar-vacunador @reloadTable="getVacunadores" :vacunador="vacunador"></eliminar-vacunador>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <app-section-loader :status="loading"></app-section-loader>
  </v-card>
</template>

<script>
import EliminarVacunador from "./EliminarVacunador";
import FormVacunador from "./FormVacunador";

export default {
  name: "Vacunadores",
  data: () => ({
    vacunadores: null,
    loading: false,
  }),
  components: {
    FormVacunador,
    EliminarVacunador
  },
  methods: {
    getVacunadores(){
      this.loading = true
      this.axios.get('vacunadores').then(response => {
        this.vacunadores = response.data
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {color: "error", message: ` al cargar vacunadores`, error: error})
      })
    }
  },
  created() {
    this.getVacunadores()
  }
}
</script>

<style scoped>

</style>