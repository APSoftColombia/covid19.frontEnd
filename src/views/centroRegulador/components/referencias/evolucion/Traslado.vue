<template>
  <div>
    <template v-for="(accion, indexAccion) in traslado.acciones">
      <component
          :is="accion.componente"
          :referencia="referencia"
          :accion="accion"
          :key="`accion${indexAccion}`"
          :id="traslado.id"
          :traslado="traslado"
          @guardado="val => $emit('guardado', val)"
          v-if="referencia.estado !== 'Cancelado' && referencia.estado !== 'Proceso Terminado'"
      />
    </template>
  </div>
</template>

<script>
const RegistroAceptarPresentacion = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion')
const TerminarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/TerminarTraslado')
const IniciarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/IniciarTraslado')
const TrasladoFallido = () => import('Views/centroRegulador/components/referencias/evolucion/TrasladoFallido')
const CancelarTraslado = () => import('Views/centroRegulador/components/referencias/evolucion/CancelarTraslado')
const RegistroBitacora = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroBitacora')

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
    CancelarTraslado,
    RegistroBitacora
  }
}
</script>

<style scoped>

</style>
