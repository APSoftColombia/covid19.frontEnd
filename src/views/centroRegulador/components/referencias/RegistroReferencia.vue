<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
  >
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title>
            {{ item && item.id ? `Referencia No. ${item.id}` : 'Nueva Referencia' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row no-gutters>
            <v-col md="6" offset-md="3">
              <ValidationObserver
                  ref="formItem"
                  v-slot="{ invalid, validated, passes, validate }"
                  autocomplete="off"
              >
                <v-card-actions>
                  <v-btn
                      large
                      @click.stop="close"
                  >
                    <v-icon>mdi-close</v-icon>
                    Cancelar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                  <v-btn
                      large
                      color="primary"
                      @click.stop="guardarItem"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../models'
export default {
  name: 'RegistroReferencia',
  components: {
  },
  data: () => ({
    loading: false,
    dialog: false,
    item: null
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    }
  },
  watch: {
  },
  methods: {
    guardarItem() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          let request = itemCopia.id
              ? this.axios.put(`referencias/${itemCopia.id}`, itemCopia)
              : this.axios.post(`referencias`, itemCopia)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `La referencia se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la referencia.`, error: error})
              })
        }
      })
    },
    open(item = null) {
      this.dialog = true
      if (item) {
        this.getItem(item.id)
      } else {
        this.item = this.clone(models.referencia)
      }
    },
    close() {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      this.$emit('close')
      this.item = null
    },
    getItem(id) {
      this.loading = true
      this.axios.get(`referencias/${id}`)
          .then(response => {
            this.item = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar el registro de la referencia.`, error: error})
          })
    }
  }
}
</script>