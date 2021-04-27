<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        {{ examen && examen.id ? " Editar" : "Nuevo" }} examen
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <ValidationObserver ref="formExamen" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <buscador-ips
                      ref="buscadorips"
                      label="IPS"
                      v-model="examen.codigo_prestador"
                  />
                </v-col>
                <v-col cols="12">
                  <ValidationProvider name="examen" rules="required" v-slot="{ errors, valid }">
                    <v-autocomplete
                        label="Examen"
                        name="examen"
                        v-model="examen.examen_id"
                        :items="examenes"
                        outlined
                        dense
                        item-text="prueba"
                        item-value="id"
                        clearable
                        :error-messages="errors"
                    >
                      <template v-slot:selection="{ item, index }">
                        <div class="pa-0 text-truncate" style="width: 100% !important;">
                          {{ item.prueba + ' - ' + item.unidad }}
                        </div>
                      </template>
                      <template v-slot:item="{ item, index }">
                        <template>
                          <v-list-item-content class="pa-0">
                            <v-list-item-title>{{ item.prueba }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.unidad }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="Resultado"
                      name="resultado"
                      rules="required"
                      v-model="examen.resultado"
                  ></c-number>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-date
                      v-model="examen.fecha"
                      label="Fecha"
                      name="fecha"
                      rules="required"
                      :max="moment().format('YYYY-MM-DD')"
                  ></c-date>
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
  name: "FormExamenes",
  data: () => ({
    examen: {},
    dialog: false,
    examenes: [],
    loadingB: false,
    loading: false
  }),
  methods: {
    open(examen = null, seguimiento_id = null, afiliado_id = null){
      if(examen){this.examen = this.clone(examen)}
      this.examen.seguimiento_id = seguimiento_id
      this.examen.afiliado_id = afiliado_id
      this.dialog = true
      setTimeout(() => {
        if (this.examen.with_prestador_object) this.$refs.buscadorips.assign(this.examen.with_prestador_object)
      }, 600)
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
      this.examen = {}
      this.dialog = false
      this.examenes = []
    },
    crearExamen(){
      this.$refs.formExamen.validate().then(result => {
        if(result){
          this.loading = true
          let request = this.examen && this.examen.id ? this.axios.put(`resultadoExamens/${this.examen.id}`, this.examen)
          : this.axios.post(`resultadoExamens`, this.examen)
          request.then(response => {
            this.$store.commit('snackbar', {color: 'success', message: `examen ${this.examen && this.examen.id ? 'editado' : 'creado'} con exito`})
            this.loading = false
            this.$emit('refresh', response.data.seguimiento_id)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: `al ${this.examen && this.examen.id ? 'editar' : 'crear'} examen`, error: error})
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
