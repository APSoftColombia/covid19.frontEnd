<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        {{ control && control.id ? " Editar" : "Nuevo" }} control de tension
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <ValidationObserver ref="formControlTension" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <buscador-ips
                      ref="buscadorips"
                      label="IPS"
                      v-model="control.codigo_prestador"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="TAS"
                      name="tas"
                      v-model="control.TAS"
                  ></c-number>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="TAD"
                      name="tad"
                      v-model="control.TAD"
                  ></c-number>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <c-date
                      v-model="control.fecha"
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
          <v-btn @click.stop="crearExamen" class="warning white--text" :loading="loadingB" :disabled="loadingB">
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
  name: "FormControlTension",
  data: () => ({
    control: {},
    dialog: false,
    loadingB: false,
    loading: false
  }),
  methods: {
    open(control = null, seguimiento_id = null, afiliado_id = null){
      if(control){this.control = this.clone(control)}
      this.control.seguimiento_id = seguimiento_id
      this.control.afiliado_id = afiliado_id
      this.dialog = true
    },
    close(){
      this.control = {}
      this.dialog = false
    },
    crearExamen(){
      this.$refs.formControlTension.validate().then(result => {
        if(result){
          return 0
        }
      })
    }
  },
}
</script>

<style scoped>

</style>