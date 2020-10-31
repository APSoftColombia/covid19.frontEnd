<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="720"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          <v-icon large color="white">mdi-badge-account-horizontal</v-icon>
          Información del paciente
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-3">
        <ValidationObserver ref="formPaciente">
          <form-paciente
              v-if="tamizaje"
              v-model="tamizaje"
          />
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn
            color="warning darken-1"
            text
            @click="close"
        >
          Omitir
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            color="warning darken-1"
            @click="guardar"
        >
          Verificar Datos
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import FormPaciente from 'Views/covid19/tamizaje/paciente/FormPaciente'
export default {
  name: 'ModalPersona',
  components: {
    FormPaciente
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    tamizaje: null
  }),
  methods: {
    guardar() {
      this.$refs.formPaciente.validate().then(async result => {
        if (result) {
          this.loading = true
          this.axios.put(`tamizajes/${this.tamizaje.id}`, this.tamizaje)
              .then(response => {
                this.$emit('actualizado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `La información del paciente se actualizó correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al actualizar la información del paciente.`, error: error})
              })
        }
      })
    },
    close() {
      this.loading = false
      this.dialog = false
      setTimeout(() => {
        this.tamizaje = null
      }, 400)
    },
    open(tamizaje) {
      let elTamizaje = this.clone(tamizaje)
      if (elTamizaje && elTamizaje.sintomas && elTamizaje.sintomas.length) {
        let copySintomas = this.clone(elTamizaje.sintomas)
        elTamizaje.sintomas = elTamizaje.sintomas.filter(a => a.aplica_covid && a.solicita_fecha).map(x => x.id)
        elTamizaje.signos_alarma = copySintomas.filter(b => b.aplica_covid && !b.solicita_fecha).map(x => x.id)
      }
      elTamizaje.si_eps = elTamizaje.eps_id ? 1 : 0
      this.tamizaje = elTamizaje
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>