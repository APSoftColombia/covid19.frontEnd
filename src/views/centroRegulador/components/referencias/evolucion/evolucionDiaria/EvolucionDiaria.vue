<template>
  <div v-if="referencia">
    <template v-if="referencia.evoluciones && referencia.evoluciones.length">
      <registro-evolucion-diaria
          v-if="permisos.referenciaEvolucionDiariaGestionar"
          :referencia="referencia"
          @guardado="val => $emit('guardado', val)"
      />
      <v-list dense class="mt-3">
        <template
            v-for="(evolucion, indexEvoluciones) in referencia.evoluciones"
        >
          <v-list-item
              :key="`evolucion${indexEvoluciones}`"
              @click="click = false"
          >
            <v-list-item-content>
              <v-list-item-title class="subtitle-1">{{evolucion.evolucion_file ? evolucion.evolucion_file.name : ''}}</v-list-item-title>
              <v-list-item-subtitle class="subtitle-2">{{evolucion.fecha_evolucion}}</v-list-item-subtitle>
              <p class="ma-0 text-justify">{{evolucion.resumen_evolucion}}</p>
              <v-list-item-subtitle v-if="permisos.referenciaEvolucionDiariaGestionar">
                <v-btn
                    color="error"
                    depressed
                    x-small
                    @click="preEliminarItem(evolucion)"
                >
                  <v-icon left>mdi-close</v-icon>
                  Eliminar Evolución
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="permisos.referenciaEvolucionDiariaGestionar">
              <c-input-file
                  solo-button
                  v-model="evolucion.evolucion_file"
              />
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`dividerTras${indexEvoluciones}`" class="ma-0"/>
        </template>
      </v-list>
    </template>
    <v-row
        v-else
    >
      <v-col cols="12" class="text-center">
        <v-icon>mdi-information</v-icon>
        No hay registros de evoluciones diarias
      </v-col>
      <v-col cols="12" class="text-center">
        <registro-evolucion-diaria
            v-if="permisos.referenciaEvolucionDiariaGestionar"
            :referencia="referencia"
            @guardado="val => $emit('guardado', val)"
        />
      </v-col>
    </v-row>
    <c-dialog
        ref="cdialog"
        @save="eliminarItem"
    />
  </div>
</template>

<script>
import RegistroEvolucionDiaria from './RegistroEvolucionDiaria'
export default {
  name: 'EvolucionDiaria',
  components: {RegistroEvolucionDiaria},
  props: {
    referencia: {
      type: Object,
      default: null
    }
  },
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('centroRegulador')
    }
  },
  data: () => ({
    click: false,
    seleccionado: null
  }),
  methods: {
    preEliminarItem(item) {
      this.seleccionado = item
      this.$refs.cdialog.open(`¿Está seguro de eliminar la evolución ID: <strong>${this.seleccionado.id}</strong>?`)
    },
    eliminarItem() {
      this.axios.delete(`referencias/evoluciones/${this.seleccionado.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Evolución diaria eliminada correctamente.' })
            this.$emit('guardado', this.referencia.id)
            this.$refs.cdialog.close()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al eliminar el registro de la evolución diaria.', error: error })
            this.$refs.cdialog.loading = false
          })
    }
  }
}
</script>
