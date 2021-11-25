<template>
  <v-btn color="primary" large @click="goapi">
    API
  </v-btn>
</template>

<script>
import axios from 'axios'
export default {
  name: 'botonAPI',
  methods: {
    goapi() {
      const instance = axios.create({
        baseURL: 'https://apps.ins.gov.co/SisMuestrasApi/api'
      })
      instance.defaults.headers.common['Authorization'] = 'Basic Z2VzdGlvbi5jb3ZpZDE5QGNvbWZhc3VjcmUuY29tLmNvOkhNPTRKKkFOLThnMg=='
      // instance.defaults.headers.common['Authorization'] = 'gestion.covid19@comfasucre.com.co:HM=4J*AN-8g2'
      console.log('Entra al método del boton')
      instance.get(`resultados?pagina=1`)
          .then(response => {
            console.log('Entra al response', response)
          })
          .catch(error => {
            this.loading = false
            this.store.commit('snackbar', {color: 'error', message: 'al ir al api', error: error.response.data})
          })
    }
  }
}
</script>