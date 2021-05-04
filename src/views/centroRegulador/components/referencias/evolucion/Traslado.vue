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
<<<<<<< HEAD
import TerminarProceso from 'Views/centroRegulador/components/referencias/evolucion/TerminarProceso'
import TerminarTraslado from 'Views/centroRegulador/components/referencias/evolucion/TerminarTraslado'
import IniciarTraslado from 'Views/centroRegulador/components/referencias/evolucion/IniciarTraslado'
import TrasladoFallido from 'Views/centroRegulador/components/referencias/evolucion/TrasladoFallido'
=======
const SeleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarTransporte');
const DeseleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/DeseleccionarTransporte');
>>>>>>> ab87a1384fcaa59bbec237c9f4dc857bde80b6e4

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
<<<<<<< HEAD
    TerminarProceso,
    TerminarTraslado,
    IniciarTraslado,
    TrasladoFallido
=======
    SeleccionarTransporte,
    DeseleccionarTransporte
>>>>>>> ab87a1384fcaa59bbec237c9f4dc857bde80b6e4
  }
}
</script>

<style scoped>

</style>
