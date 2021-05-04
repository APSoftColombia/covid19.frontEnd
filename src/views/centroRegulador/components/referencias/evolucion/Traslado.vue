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
const TerminarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/TerminarTraslado')
const IniciarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/IniciarTraslado')
const TrasladoFallido = () => import('Views/centroRegulador/components/referencias/evolucion/TrasladoFallido')
const CancelarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/CancelarTraslado')

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
    TerminarTraslado,
    IniciarTraslado,
    TrasladoFallido,
    CancelarTraslado
  }
}
</script>

<style scoped>

</style>
