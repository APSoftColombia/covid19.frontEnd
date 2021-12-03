<template>
  <div>
    <v-switch
        class="mt-0"
        :value="value"
        inset
        label="Aplicación externa o extemporánea"
        readonly
        @click="confirmChange"
        hide-details
    />
    <v-dialog
        v-model="dialog"
        persistent
        max-width="400"
    >
      <v-card>
        <v-card-text class="text-center h3 pt-4" v-html="title" />
        <v-card-text class="body-1 text-center">{{ subtitle }}</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              text
              @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="warning darken-1"
              @click="aceptar"
          >
            {{ titleBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CheckExterna',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    dialog: false,
    title: null,
    titleBtn: null,
    subtitle: null
  }),
  methods: {
    confirmChange () {
      this.titleBtn = `Sí, ${this.value ? 'des' : ''}marcar`
      if (!this.value) {
        this.title = '¿Está seguro de <strong>marcar</strong> este registro como aplicación externa y/o extemporánea?'
        this.subtitle = 'La aplicación externa o extemporánea, hace referencia a una aplicación que se hizo fuera de este lugar de vacunación y/o en una fecha anteriór y no descuenta del inventario de dosis aplicadas.'
      } else {
        this.title = '¿Está seguro de <strong>desmarcar</strong> la opción de aplicación externa y/o extemporánea?'
        this.subtitle = 'Si hace el desmarque de la opción, el registro descontará del inventario la dosis aplicada.'
      }
      this.dialog = true
    },
    aceptar () {
      this.$emit('input', this.value ? 0 : 1)
      this.dialog = false
    }
  }
}
</script>