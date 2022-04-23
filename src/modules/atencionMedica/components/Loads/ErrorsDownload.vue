<template>
  <v-btn
      dark
      absolute
      bottom
      right
      fab
      :color="color"
      class="mb-10 mr-2"
      :loading="loading"
      @click="download"
  >
    <v-icon>{{excelIcon}}</v-icon>
  </v-btn>
</template>

<script>
import {mdiDownload} from '@mdi/js'
export default {
  name: 'ErrorsDownload',
  props: {
    tabla: {
      type: String,
      default: 'tableID'
    },
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
      default: 'primary'
    }
  },
  data:() => ({
    loading: false,
    excelIcon: mdiDownload
  }),
  methods: {
    download() {
      if(this.id) {
        this.loading = true
        this.axios({
          url: `archivos-atencion-rcv-errors/${this.id}`,
          method: 'GET',
          responseType: 'blob'
        })
            .then((response) => {
              console.log('numero', response)
              if (response.status === 204) {
                this.$store.commit('snackbar', {
                  color: 'info',
                  message: `El archivo no contiene registros para exportar.`
                })
              } else {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))
                window.open(url, '_blank')
                this.loading = false
              }
            })
            .catch(error => this.$store.commit('snackbar', {color: 'error', message: `al descargar el archivo.`, error: error}))
            .finally(() => this.loading = false)
      } else {
        const dataType = 'application/vnd.ms-excel'
        const tableSelect = document.getElementById('tableID').children[0].children[0]
        const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20')
        const filename = 'excel_errors.xls'
        const downloadLink = document.createElement('a')

        document.body.appendChild(downloadLink)
        if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
          })

          navigator.msSaveOrOpenBlob( blob, filename)
        }else{
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML
          downloadLink.download = filename
          downloadLink.click()
        }
      }
    }
  }
}
</script>
