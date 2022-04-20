<template>
  <v-dialog
      v-model="dialog"
      max-width="600px"
      transition="dialog-bottom-transition"
      persistent
  >
    <ValidationObserver
        ref="formTipificacion"
        v-slot="{ invalid, validated, passes, validate }"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEdit ? 'Editar tipificacion' : 'Nueva tipificacion' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <c-select-complete
                    v-model="tipificacion.reftipificacion_id"
                    placeholder="Tipo"
                    name="tipo tipificacion"
                    :items="listTipificaciones ? listTipificaciones: []"
                    item-text="descripcion"
                    item-value="id"
                    rules="required"
                />
              </v-col>
              <v-col cols="6">
                <c-date
                    v-model="tipificacion.fecha_solicitud"
                    placeholder="Fecha de Solicitud"
                    :max="moment().format('YYYY-MM-DD')"
                    name="fecha solicitud"
                    rules="required"
                />
              </v-col>
              <v-col cols="6">
                <c-date
                    v-model="tipificacion.fecha_prestacion"
                    placeholder="Fecha de Prestacion"
                    :max="moment().format('YYYY-MM-DD')"
                    name="fecha prestacion"
                />
              </v-col>
              <v-col cols="12">
                <c-text-area
                    label="Observaciones"
                    v-model="tipificacion.resultado"
                    name="observaciones"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
          <v-btn
              large
              @click="close"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="primary"
              large
              @click.stop="isEdit ? update() : save()"
          >
            {{ isEdit ? 'Editar' : 'Agregar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </v-dialog>

</template>

<script>
export default {
  name: 'CrearTipificacion',
  props: {
    listTipificaciones: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    isEdit: false,
    dialog: false,
    tipificacion: {},
    tipificacionModel: {
      reftipificacion_id: null,
      codigo_servicio: null,
      fecha_solicitud: null,
      fecha_programada: null,
      fecha_prestacion: null,
      resultado: null,
      fecha_anulacion: null,
      motivo_anulacion: null,
      bitacora_id_origen: null,
      bitacora_id: null
    },
    tipificacionIndex: null
  }),
  watch: {
    'tipificacion.reftipificacion_id': {
      handler(value) {
        if (value) this.listTipificaciones.find(x => x.id == value).pedir_codigo != 'Si' ? this.tipificacion.codigo_servicio = null : value
      },
      inmediate: false
    }
  },
  methods: {
    open(item = null) {
      if (item) {
        this.isEdit = true
        this.tipificacionIndex = item.index
        this.tipificacion = item
      } else {
        this.tipificacion = this.clone(this.tipificacionModel)
      }
      this.dialog = true
    },
    close() {
      this.tipificacion = this.clone(this.tipificacionModel)
      this.$refs.formTipificacion.reset()
      this.dialog = false
      this.isEdit = false
    },
    save() {
      this.$refs.formTipificacion.validate().then(result => {
        if (result) {
          this.$emit('add-tipificacion', this.tipificacion)
          this.$store.commit('snackbar', {color: 'success', message: 'Tipificacion agregada exitosamente'})
          this.tipificacion = this.clone(this.tipificacionModel)
          this.$refs.formTipificacion.reset()
        }
      })
    },
    update() {
      this.$refs.formTipificacion.validate().then(result => {
        if (result) {
          this.$emit('update-tipificacion', {tipificacion: this.tipificacion, index: this.tipificacionIndex})
          this.$store.commit('snackbar', {color: 'success', message: 'Tipificacion modificada exitosamente'})
          this.close()
        }
      })
    }
  }
}
</script>
