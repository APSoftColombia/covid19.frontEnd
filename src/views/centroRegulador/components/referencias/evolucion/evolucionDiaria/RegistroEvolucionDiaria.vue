<template>
  <v-dialog
      v-model="dialog"
      max-width="620"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
        <span>Crear Evolución Diaria</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>mdi-file-account</v-icon>
        <v-toolbar-title>
          Registro de evolución diaria
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pb-0">
        <ValidationObserver
            ref="formItem"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <c-date-manual
                  v-model="item.fecha_evolucion"
                  label="Fecha"
                  name="Fecha"
                  rules="required"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                  v-model="item.hora_evolucion"
                  label="Hora"
                  name="Hora"
                  rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-input-file
                  label="Archivo"
                  name="Archivo"
                  directory="evolucionesDiarias"
                  rules="required"
                  v-model="item.evolucion_file"
                  @uuid="val => item.evolucion_file_uuid = val"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Resumen"
                  v-model="item.resumen_evolucion"
                  rules="required"
                  name="resumen"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn
            text
            @click="close"
        >
          Cancelar
        </v-btn>
        <v-spacer/>
        <v-btn
            color="primary"
            class="white--text"
            @click="save"
        >
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RegistroEvolucionDiaria',
  props: {
    referencia: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    item: null,
    makeItem: {
      id: null,
      referencia_id: null,
      fecha_evolucion: null,
      hora_evolucion: null,
      resumen_evolucion: null,
      evolucion_file: null,
      evolucion_file_uuid: null
    }
  }),
  watch: {
    dialog: {
      handler(val) {
        if(val) this.asignar()
      },
      immediate: false
    }
  },
  methods: {
    asignar() {
      if(this.referencia) {
        this.item = this.clone(this.makeItem)
        this.item.fecha_evolucion = this.moment().format('YYYY-MM-DD')
        this.item.hora_evolucion = this.moment().format('HH:mm')
        this.item.referencia_id = this.referencia.id
      } else {
        this.$store.commit('snackbar', {color: 'error', message: `No hay una referencia seleccionada.`})
        this.close()
      }
    },
    close() {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      this.item = this.clone(this.makeItem)
    },
    save() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          itemCopia.fecha_evolucion = `${itemCopia.fecha_evolucion} ${itemCopia.hora_evolucion}`
          this.axios.post(`referencias/${itemCopia.referencia_id}/evolucions`, itemCopia)
              .then(() => {
                this.$emit('guardado', itemCopia.referencia_id)
                this.$store.commit('snackbar', {color: 'success', message: `La evolución diaria se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la evolución diaria.`, error: error})
              })
        }
      })
    }
  }
}
</script>
