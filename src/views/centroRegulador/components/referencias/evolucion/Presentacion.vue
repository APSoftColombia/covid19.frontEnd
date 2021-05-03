<template>
  <div>
    <component
        v-for="(accion, indexAccion) in presentacion.acciones"
        :is="accion.componente"
        :referencia="referencia"
        :accion="accion"
        :key="`accion${indexAccion}`"
        :id="presentacion.id"
        @guardado="val => $emit('guardado', val)"
    />
  </div>
</template>

<script>
import RegistroAceptarPresentacion from 'Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion'
const Aceptar = () => import('Views/centroRegulador/components/referencias/evolucion/AceptarPresentacion');
const NoAceptar = () => import('Views/centroRegulador/components/referencias/evolucion/NoAceptarPresentacion');

export default {
  name: 'Presentacion',
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
    }
  },
  components: {
    RegistroAceptarPresentacion,
    Aceptar,
    NoAceptar
  }
}
</script>

<style scoped>

</style>