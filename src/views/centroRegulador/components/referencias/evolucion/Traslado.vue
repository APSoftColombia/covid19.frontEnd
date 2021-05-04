<template>
  <div>
    <component
        v-for="(accion, indexAccion) in traslado.acciones"
        :is="accion.componente"
        :referencia="referencia"
        :accion="accion"
        :key="`accion${indexAccion}`"
        :id="traslado.id"
        @guardado="val => $emit('guardado', val)"
    />
  </div>
</template>

<script>
import RegistroAceptarPresentacion from 'Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion'
const SeleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarTransporte');
const DeseleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/DeseleccionarTransporte');

export default {
  name: 'Traslado',
  props: {
    referencia: {
      type: Object,
      default: null
    },
    accion: {
      type: Object,
      default: null
    },
    traslado: {
      type: Object,
      default: null
    }
  },
  components: {
    RegistroAceptarPresentacion,
    SeleccionarTransporte,
    DeseleccionarTransporte
  }
}
</script>

<style scoped>

</style>