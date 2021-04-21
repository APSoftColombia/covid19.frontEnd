<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        {{ seguimiento && seguimiento.id ? " Editar" : "Nuevo" }} seguimiento
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <ValidationObserver ref="formSeguimiento" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="12">
                <v-card outlined tile>
                  <v-card-text>
                    <buscador-ips
                      label="IPS del seguimiento"
                      name="IPS del seguimiento"
                      rules="required"
                      v-model="seguimiento.codigo_prestador"
                    ></buscador-ips>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <v-card outlined tile>
                  <v-card-text>
                    <buscador-ips
                      label="IPS del seguimiento"
                      name="IPS del seguimiento"
                      rules="required"
                      v-model="seguimiento.codigo_prestador"
                    ></buscador-ips>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="close" :loading="loadingB" :disabled="loadingB">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
          <v-spacer></v-spacer>
          <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
          <v-btn @click.stop="crearExamen" class="primary white--text" :loading="loadingB" :disabled="loadingB">
            <v-icon left>fas fa-save</v-icon>
            <span>Guardar</span>
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormSeguimientos",
  data: () => ({
    seguimiento: {},
    dialog: false,
    loadingB: false,
    loading: false
  }),
  methods: {
    open(seguimiento = null, afiliado_id = null){
      if(seguimiento){this.seguimiento = this.clone(seguimiento)}
      this.seguimiento.afiliado_id = afiliado_id
      this.dialog = true
      this.getComplementos()
    },
    getComplementos(){
      this.loading = true
      this.axios.get('complementos-alto-costo').then(response => {
        this.examenes = response.data.examenes
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: ' al conseguir complementos', error: error})
      })
    },
    close(){
      this.seguimiento = {}
      this.dialog = false
    },
    crearExamen(){
      this.$refs.formSeguimiento.validate().then(result => {
        if(result){
          this.loading = true
          let request = this.seguimiento && this.seguimiento.id ? this.axios.put(`seguimientos/${this.seguimiento.id}`, this.seguimiento)
          : this.axios.post(`seguimientos`, this.seguimiento)
          request.then(response => {
            this.$store.commit('snackbar', {color: 'success', message: `seguimiento ${this.seguimiento && this.seguimiento.id ? 'editado' : 'creado'} con exito`})
            this.loading = false
            this.$emit('refresh', response.data.afiliado_id)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: `al ${this.seguimiento && this.seguimiento.id ? 'editar' : 'crear'} seguimiento`, error: error})
            this.loading = false
          })
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
