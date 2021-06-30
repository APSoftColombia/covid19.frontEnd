<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="720"
  >
    <template v-slot:activator="{ on, attrs }" v-if="btnVisible">
      <v-btn
          color="warning"
          dark
          :fab="$vuetify.breakpoint.smAndDown"
          small
          v-bind="attrs"
          v-on="on"
          @click.stop="assign(tamizajeOrigen)"
      >
        <v-icon>mdi-account-edit</v-icon>
        {{ $vuetify.breakpoint.smAndDown ? '' : 'Editar' }}
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          <v-icon large color="white">mdi-badge-account-horizontal</v-icon>
          Información Persona
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
            icon
            @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
            color="primary darken-1"
            text
            @click="close"
        >
          Cerrar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            color="primary darken-1"
            @click="guardar"
        >
          Guardar
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
    },
    tamizajeOrigen: {
      type: Object,
      default: null
    },
    btnVisible: {
      type: Boolean,
      default: false
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
          this.tamizaje.no_erp = 1
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
    assign(tamizaje) {
      let elTamizaje = this.clone(tamizaje)
      if (elTamizaje && elTamizaje.sintomas && elTamizaje.sintomas.length) {
        let copySintomas = this.clone(elTamizaje.sintomas)
        elTamizaje.sintomas = elTamizaje.sintomas.filter(a => a.aplica_covid && a.solicita_fecha).map(x => x.id)
        elTamizaje.signos_alarma = copySintomas.filter(b => b.aplica_covid && !b.solicita_fecha).map(x => x.id)
      }
      if (elTamizaje && elTamizaje.comorbilidades && elTamizaje.comorbilidades.length) {
        elTamizaje.comorbilidades = elTamizaje.comorbilidades.map(x => x.codigo)
      }
      elTamizaje.si_eps = elTamizaje.eps_id ? 1 : 0
      this.tamizaje = elTamizaje
      setTimeout(() => {
        this.$refs.formPaciente.validate()
      }, 600)
    },
    open(tamizaje) {
      this.tamizaje = null
      this.assign(tamizaje)
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>