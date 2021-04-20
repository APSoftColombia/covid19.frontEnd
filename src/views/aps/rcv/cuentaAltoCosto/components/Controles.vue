<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-btn class="warning white--text" @click="openForm(null)">
        <v-icon left>fas fa-plus</v-icon>
        Nuevo Control
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>TAS</th>
            <th>TAD</th>
            <th>Prestador</th>
            <th>Opciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(control, index) in controles" :key="index">
            <td>{{ control.id }}</td>
            <td>{{ control.fecha }}</td>
            <td>{{ control.TAS }}</td>
            <td>{{ control.TAD }}</td>
            <td style="width: 500px !important;" class="text-center">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2">{{ control.prestador ? control.prestador.nombre : '' }}</v-list-item-title>
                  <v-list-item-title class="body-2">{{ control.prestador ? control.prestador.codigohabilitacion : '' }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </td>
            <td>
              <v-btn icon small text @click="openForm(control)">
                <v-icon small color="warning">fas fa-pen</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <form-control-tension
        ref="formControlTension"
        @refresh="refresh"
    ></form-control-tension>
  </v-card>
</template>

<script>
const FormControlTension = () => import('./FormControlTension')
export default {
  name: "DetalleControles",
  props: {
    controles: {
      type: [Object, Array],
      default: null
    },
    seguimiento: {
      type: [Array, Object],
      default: null
    }
  },
  components: {
    FormControlTension
  },
  methods: {
    refresh(id){
      this.$emit('refresh', id)
    },
    openForm(control){
      this.$refs.formControlTension.open(control, this.seguimiento.seguimiento_id, this.seguimiento.afiliado_id)
    }
  }
}
</script>

<style scoped>

</style>
