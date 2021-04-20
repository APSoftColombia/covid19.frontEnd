<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>
        Detalle de la consulta
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <template v-for="(item, indexItem) in datos">
            <v-col cols="12" :md="item.colmd" :lg="item.collg" xl="3" :key="`col${indexItem}`">
              <v-list two-line class="notification-wrap">
                <v-list-item>
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{item.label}}</v-list-item-subtitle>
                    <v-list-item-title><h6 class="mb-0">{{item.body}}</h6></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DetalleConsultaAC",
  data: () => ({
    dialog: false,
    datos: []
  }),
  methods: {
    open(consulta){
      console.log(consulta)
      this.datos.push(
          {
            label: 'Tipo identificación del usuario',
            body: consulta.tipo_identificacion,
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Identificación del usuario en el sistema',
            body: consulta.identificacion,
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Codigo CUP',
            body: consulta.cup ? `${consulta.cup.codigo + " - " + consulta.cup.descrip}` : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Finalidad consulta',
            body: consulta.finalidad ? consulta.finalidad.opcion : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Causa externa',
            body: consulta.causa ? consulta.causa.opcion : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Otra causa externa',
            body: consulta.otra_causa ? consulta.otra_causa.opcion : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Codigo diagnostico principal',
            body: consulta.diagnostico_principalcie ? `${consulta.diagnostico_principalcie.codigo + " - " + consulta.diagnostico_principalcie.descrip}` : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Codigo diagnostico relacionado 1',
            body: consulta.diagnostico_relacionado1 ? `${consulta.diagnostico_relacionado1.codigo + " - " + consulta.diagnostico_relacionado1.descrip}` : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Codigo diagnostico relacionado 2',
            body: consulta.diagnostico_relacionado2 ? `${consulta.diagnostico_relacionado2.codigo + " - " + consulta.diagnostico_relacionado2.descrip}` : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Codigo diagnostico relacionado 3',
            body: consulta.diagnostico_relacionado3 ? `${consulta.diagnostico_relacionado3.codigo + " - " + consulta.diagnostico_relacionado3.descrip}` : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Tipo diagnostico principal',
            body: consulta.diagonstico_principal ? consulta.diagonstico_principal.opcion : '',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Valor de consulta',
            body: consulta.valor_consulta,
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Valor cuota moderada',
            body: consulta.valor_cuota_moderada,
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Valor a pagar',
            body: consulta.valor_a_pagar,
            colmd: '4',
            collg: '4'
          },
      )
      this.dialog = true
    },
    close(){
      this.dialog = false
      this.datos = []
    }
  }
}
</script>

<style scoped>

</style>
