<template>
  <v-card>
    <v-card-title>
      Evolución
      <template v-if="referencia && referencia.acciones && referencia.acciones.length">
        <v-spacer/>
        <component
            v-for="(accion, indexAccion) in referencia.acciones"
            :key="`accion${indexAccion}`"
            :is="accion.componente"
            :referencia="referencia"
            :accion="accion"
            @guardado="val => $emit('guardado', val)"
        />
      </template>
    </v-card-title>
    <v-list>
      <template v-for="(bitacora, indexBitacora) in referencia.bitacoras">
        <v-card :key="`bitacora${indexBitacora}`">
          <v-card-title>
            {{ bitacora.accion }}
          </v-card-title>
          <v-card-text>
            {{ bitacora.observaciones }}
          </v-card-text>
          <v-card-actions v-if="bitacora.presentacion || bitacora.traslado">
            <template v-if="bitacora.presentacion">
              <presentacion
                  :referencia="referencia"
                  :presentacion="bitacora.presentacion"
                  @guardado="val => $emit('guardado', val)"
              />
            </template>
            <template v-if="bitacora.traslado">
              <presentacion
                  :referencia="referencia"
                  :traslado="bitacora.traslado"
                  @guardado="val => $emit('guardado', val)"
              />
            </template>
          </v-card-actions>
        </v-card>
      </template>
    </v-list>
  </v-card>
</template>

<script>

import RegistroBitacora from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroAnularProceso from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroPresentar from 'Views/centroRegulador/components/referencias/evolucion/RegistroPresentar'
import Presentacion from 'Views/centroRegulador/components/referencias/evolucion/Presentacion'
export default {
  name: 'Evolucion',
  props: {
    referencia: {
      type: Object,
      default: null
    }
  },
  components: {
    Presentacion,
    RegistroBitacora,
    RegistroAnularProceso,
    RegistroPresentar
  },
  data: () => ({
    loading: false
  }),
  methods: {
  }
}
</script>