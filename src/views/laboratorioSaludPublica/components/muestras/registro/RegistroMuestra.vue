<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="620"
  >
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-vial</v-icon>
        <v-toolbar-title>
          {{ muestra && muestra.id ? `Muestra No. ${muestra.id}` : 'Nueva Muestra' }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <ValidationObserver ref="formMuestra">
          <v-row dense v-if="muestra">
            <v-col class="pb-0" cols="12">
              <c-select-complete
                  v-model="muestra.tipo_muestra_id"
                  label="Tipo de Muestra"
                  rules="required"
                  name="tipo de muestra"
                  item-value="id"
                  item-text="descripcion"
                  :items="labspTiposMuestras"
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-number
                  placeholder="Temperatura"
                  v-model="muestra.temperatura"
                  name="temperatura"
                  suffix="°C"
                  rules="required|min:0"
                  min="0"
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-select-complete
                  v-model="muestra.estado_ingreso"
                  label="Estado de Ingreso"
                  rules="required"
                  name="Estado de ingreso"
                  :items="labspEstadosIngresoMuestra"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Observaciones"
                  v-model="muestra.observaciones"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn
            large
            @click.stop="close"
        >
          <v-icon>mdi-close</v-icon>
          Cerrar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            large
            color="primary"
            @click.stop="guardarMuestra"
        >
          <v-icon left>fas fa-save</v-icon>
          Guardar Muestra
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../../models'
import {mapGetters} from 'vuex'

export default {
  name: 'RegistroMuestra',
  data: () => ({
    loading: false,
    dialog: false,
    muestra: null
  }),
  computed: {
    ...mapGetters([
      'labspTiposMuestras',
      'labspEstadosIngresoMuestra'
    ])
  },
  methods: {
    open(item = null) {
      this.dialog = true
      this.loading = true
      if (item) {
        this.muestra = this.clone(item)
        this.loading = false
      } else {
        this.muestra = this.clone(models.muestra)
        this.loading = false
      }
    },
    close() {
      this.dialog = false
      this.$refs.formMuestra.reset()
      this.muestra = null
    },
    guardarMuestra () {
      this.$refs.formMuestra.validate().then(async result => {
        if (result) {
          this.loading = true
          let muestraCopia = await this.clone(this.muestra)
          setTimeout(() => {
            this.$emit('guardado', muestraCopia)
            this.loading = false
            this.close()
          }, 500)
          // let request = muestraCopia.id
          //     ? this.axios.put(`lab-muestras/${muestraCopia.id}`, muestraCopia)
          //     : this.axios.post(`lab-muestras`, muestraCopia)
          //
          // request
          //     .then(response => {
          //       this.$emit('guardado', response.data)
          //       this.$store.commit('snackbar', {color: 'success', message: `La muestra se guardo correctamente.`})
          //       this.close()
          //     })
          //     .catch(error => {
          //       this.loading = false
          //       this.$store.commit('snackbar', {color: 'error', message: `al guardar la muestra.`, error: error})
          //     })
        }
      })
    }
  }
}
</script>