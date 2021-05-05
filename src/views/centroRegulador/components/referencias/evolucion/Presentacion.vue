<template>
  <div>
      <template v-for="(accion, indexAccion) in presentacion.acciones">
          <component
              :is="accion.componente"
              :referencia="referencia"
              :accion="accion"
              :key="`accion${indexAccion}`"
              :id="presentacion.id"
              @guardado="val => $emit('guardado', val)"
              v-if="(!presentacion.otra_seleccionada && accion.accion !== 'Aceptar') || accion.accion !== 'Seleccionar IPS'"
          />
      </template>
  </div>
</template>

<script>
const Aceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion');
const NoAceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion');
const SeleccionarIPS = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarIps');
const DeseleccionarIPS = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarIps');
const SeleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarTransporte');
const DeseleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/DeseleccionarTransporte');
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
    SeleccionarIPS,
    DeseleccionarIPS,
    SeleccionarTransporte,
    DeseleccionarTransporte
  }
}
</script>

<style scoped>

</style>
