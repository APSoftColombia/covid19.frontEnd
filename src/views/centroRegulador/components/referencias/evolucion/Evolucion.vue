<template>
  <v-card>
    <v-card-title>
      Evolución
      <v-spacer/>
      <template v-if="referencia && referencia.acciones && referencia.acciones.length">
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
        </v-card>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import RegistroBitacora from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroAnularProceso from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroPresentar from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
export default {
  name: 'Evolucion',
  props: {
    referencia: {
      type: Object,
      default: null
    }
  },
  components: {
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