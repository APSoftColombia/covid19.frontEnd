<template>
  <v-btn
      :color="color"
      small
      class="white--text"
      :loading="loading"
      @click="download"
  >
    <v-icon>{{excelIcon}}</v-icon>
    {{estado}}
  </v-btn>
</template>

<script>
import {mdiFileExcel} from '@mdi/js'
export default {
  name: 'FileDownload',
  props: {
    id: {
      type: Number,
      default: null
    },
    estado: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'green'
    }
  },
  data:() => ({
    loading: false,
    excelIcon: mdiFileExcel
  }),
  methods: {
    download() {
      this.loading = true
      this.axios({
        url: `archivos-atencion-rcv/${this.id}`,
        method: 'GET',
        responseType: 'blob'
      })
          .then((response) => {
            if (response.status === 204) {
              this.$store.commit('snackbar', {
                color: 'info',
                message: `El archivo no contiene registros para exportar.`
              })
            } else {
              const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))
              window.open(url, '_blank')
            }
          })
          .catch(error => this.$store.commit('snackbar', {color: 'error', message: `al descargar el archivo.`, error: error}))
          .finally(() => this.loading = false)
    }
  }
}
</script>
