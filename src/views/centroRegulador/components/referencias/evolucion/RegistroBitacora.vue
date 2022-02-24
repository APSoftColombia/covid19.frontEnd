<template>
  <v-dialog
      v-model="dialog"
      max-width="620"
  >
    <template v-slot:activator="{ on, attrs }">
      <c-tooltip
          top
          :tooltip="accion.tooltip"
      >
        <v-btn
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            :color="accion.color"
            depressed
            fab
            :small="!presentacion && !traslado"
            :x-small="!!presentacion || !!traslado"
        >
          <v-icon class="white--text">{{ accion.icon }}</v-icon>
        </v-btn>
      </c-tooltip>
    </template>
    <v-card>
      <v-toolbar dark :color="accion.color">
        <v-icon left>{{ accion.icon }}</v-icon>
        <v-toolbar-title>
          {{accion.accion == 'Cancelar' ? 'Bitacora Anular Proceso' : 'Bitácora'}}
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
                  v-model="item.fecha"
                  label="Fecha"
                  name="Fecha"
                  rules="required"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                  v-model="item.hora"
                  label="Hora"
                  name="Hora"
                  rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Observaciones"
                  v-model="item.observaciones"
                  rules="required"
                  name="observaciones"
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
            :color="accion.color"
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
  name: 'RegistroBitacora',
  props: {
    referencia: {
      type: Object,
      default: null
    },
    accion: {
      type: Object,
      default: null
    },
    presentacion: {
      type: Object,
      default: null
    },
    traslado: {
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
      fecha: null,
      hora: null,
      accion: null,
      observaciones: null,
      user_id: null,
      presentacion_id: null,
      traslado_id: null
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
        this.item.fecha = this.moment().format('YYYY-MM-DD')
        this.item.hora = this.moment().format('HH:mm')
        this.item.referencia_id = this.referencia.id
        if(this.presentacion) this.item.presentacion_id = this.presentacion.id
        if(this.traslado) this.item.traslado_id = this.traslado.id
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
          itemCopia.fecha = `${itemCopia.fecha} ${itemCopia.hora}`
          let url = this.accion.accion === 'Cancelar' ? 'anular-proceso' : 'bitacoras';
          this.axios.post(`${url}/${itemCopia.referencia_id}`, itemCopia)
              .then(() => {
                this.$emit('guardado', itemCopia.referencia_id)
                this.$store.commit('snackbar', {color: 'success', message: `La bitácora se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la bitácora.`, error: error})
              })
        }
      })
    }
  }
}
</script>
