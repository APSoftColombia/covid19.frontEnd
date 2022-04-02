<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="1080"
  >
    <v-card flat>
      <diligencia-encuesta
          v-if="dialog"
          :formulariouuid="uuid"
          :formulario-anidado-anexo="formularioAnidado"
          :anidado="true"
          @close="close"
          @guardar="item => $emit('guardaranidado', item)"
          @cargado="loading = false"
          :encuesta-padre="encuestaPadre"
      />
      <div
          v-if="loading"
          style="width: 100% !important; height: 60px !important;"
      >
        <app-section-loader :status="loading"/>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
const DiligenciaEncuesta = () => import('Views/encuestas/DiligenciaEncuesta')
export default {
  name: 'FormularioAnidado',
  props: {
    encuestaPadre: {
      type: Object,
      default: null
    }
  },
  components: {
    DiligenciaEncuesta
  },
  data: () => ({
    loading: true,
    dialog: false,
    uuid: null,
    formularioAnidado: null
  }),
  methods: {
    assign(formulariouuid, formularioAnidado) {
      this.loading = true
      this.dialog = true
      this.uuid = formulariouuid
      this.formularioAnidado = formularioAnidado
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.uuid = null
        this.formularioAnidado = null
      }, 300)
    }
  }
}
</script>
