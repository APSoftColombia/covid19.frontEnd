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
const Aceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion');
const NoAceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion');
const SeleccionarIPS = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarIps');

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
    Aceptar,
    NoAceptar,
    SeleccionarIPS
  }
}
</script>

<style scoped>

</style>
