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
          @click.stop="assign(personaOrigen)"
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
              v-if="persona"
              v-model="persona"
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
import FormPaciente from 'Views/covid19/autopsia/paciente/FormPaciente'
export default {
  name: 'ModalPaciente',
  components: {
    FormPaciente
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    autopsia: {
      type: Object,
      default: null
    },
    personaOrigen: {
      type: Object,
      default: null
    },
    btnVisible: {
      type: Boolean,
      default: false
    },
    tipo: {
      type: String,
      default: 'fallecido'
    },
  },
  data: () => ({
    loading: false,
    dialog: false,
    persona: null
  }),
  methods: {
    guardar() {
      this.$refs.formPaciente.validate().then(async result => {
        if (result) {
          this.loading = true
          let inAutopsia = this.clone(this.autopsia)
          if (inAutopsia && inAutopsia.sintomas && inAutopsia.sintomas.length) {
            inAutopsia.sintomas = inAutopsia.sintomas.filter(a => a.aplica_covid && a.solicita_fecha).map(x => x.id)
          }
          if (inAutopsia && inAutopsia.comorbilidades && inAutopsia.comorbilidades.length) {
            inAutopsia.comorbilidades = inAutopsia.comorbilidades.map(x => x.id)
          }
          inAutopsia[this.tipo] = this.persona
          this.axios.put(`autopsias/${inAutopsia.id}`, inAutopsia)
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
        this.persona = null
      }, 400)
    },
    assign(persona) {
      let elpersona = this.clone(persona)
      elpersona.si_eps = elpersona.eps_id ? 1 : 0
      this.persona = elpersona
      setTimeout(() => {
        this.$refs.formPaciente.validate()
      }, 600)
    },
    open(persona) {
      this.persona = null
      this.assign(persona)
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>