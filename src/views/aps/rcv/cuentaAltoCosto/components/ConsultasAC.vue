<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-btn class="error white--text">
        <v-icon left>fas fa-plus</v-icon>
        Nueva consulta
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Prestador</th>
              <th>Numero Autorizacion</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(consulta, index) in consultas" :key="index">
              <td>{{ consulta.numero_factura }}</td>
              <td>{{ consulta.fecha }}</td>
              <td class="text-center">
                <v-list-item class="pa-0">
                  <v-list-item-content class="pa-0">
                    <v-list-item-title class="body-2">{{ consulta.prestador ? consulta.prestador.nombre : '' }}</v-list-item-title>
                    <v-list-item-title class="body-2">{{ consulta.prestador ? consulta.prestador.codigohabilitacion : '' }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>{{ consulta.numero_autorizacion }}</td>
              <td>
                <v-btn icon small text><v-icon small color="error">fas fa-pen</v-icon></v-btn>
                <v-btn icon small text><v-icon small color="error" @click="openDetalle(consulta)">fas fa-info-circle</v-icon></v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <detalle-consulta-a-c
        ref="detalleConsultaAC"
    ></detalle-consulta-a-c>
  </v-card>
</template>

<script>
const DetalleConsultaAC = () => import('./DetalleConsultaAC')
export default {
  name: "DetalleConsultasAC",
  props: {
    consultas: {
      type: [Object, Array],
      default: null
    }
  },
  components: {
    DetalleConsultaAC
  },
  methods: {
    openDetalle(consulta){
      this.$refs.detalleConsultaAC.open(consulta)
    }
  }
}
</script>

<style scoped>

</style>