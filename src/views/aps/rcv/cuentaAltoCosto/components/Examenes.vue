<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-btn class="primary white--text" @click="openForm(null)">
        <v-icon left>fas fa-plus</v-icon>
        Nuevo examen
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Examen</th>
            <th>Resultado</th>
            <th>Opciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(examen, index) in examenes" :key="index">
            <td>{{ examen.id }}</td>
            <td>{{ examen.fecha }}</td>
            <td style="width: 500px !important;" class="text-center">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-1">{{ examen.examen && examen.examen.prueba ? examen.examen.prueba + " (" + examen.examen.unidad + ")" : '' }}</v-list-item-title>
                  <v-list-item-title class="body-2">{{ examen.prestador ? examen.prestador.nombre : '' }}</v-list-item-title>
                  <v-list-item-title class="body-2">{{ examen.prestador ? examen.prestador.codigohabilitacion : '' }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </td>
            <td>{{ examen.resultado }}</td>
            <td>
              <v-btn icon small text @click="openForm(examen)">
                <v-icon small color="primary">fas fa-pen</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <form-examenes
        ref="formExamenes"
        @refresh="refresh"
    ></form-examenes>
  </v-card>
</template>

<script>
const FormExamenes = () => import('./FormExamenes')
export default {
  name: "DetalleExamenes",
  props: {
    examenes: {
      type: [Object, Array],
      default: null
    },
    seguimiento: {
      type: [Array, Object],
      default: null
    }
  },
  components: {
    FormExamenes
  },
  methods: {
    openForm(examen){
      this.$refs.formExamenes.open(examen, this.seguimiento.seguimiento_id, this.seguimiento.afiliado_id)
    },
    refresh(id){
      this.$emit('refresh', id)
    }
  }
}
</script>

<style scoped>

</style>
