<template>
  <div>
      <template v-for="(accion, indexAccion) in presentacion.acciones">
          <component
              v-if="(!presentacion.otra_seleccionada && accion.accion !== 'Aceptar' && referencia.estado !== 'Cancelado' && referencia.estado !== 'Proceso Terminado') || (accion.accion !== 'Seleccionar IPS' && referencia.estado !== 'Cancelado' && referencia.estado !== 'Proceso Terminado')"
              :is="accion.componente"
              :referencia="referencia"
              :accion="accion"
              :key="`accion${indexAccion}`"
              :id="presentacion.id"
              :presentacion="presentacion"
              @guardado="val => $emit('guardado', val)"
          />
      </template>
  </div>
</template>

<script>
const Aceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion')
const NoAceptar = () => import('Views/centroRegulador/components/referencias/evolucion/RegistroAceptarPresentacion')
const SeleccionarIPS = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarIps')
const DeseleccionarIPS = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarIps')
const SeleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/SeleccionarTransporte')
const DeseleccionarTransporte = () => import('Views/centroRegulador/components/referencias/evolucion/DeseleccionarTransporte')
import RegistroBitacora from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
export default {
  name: 'Presentacion',
  props: {
    referencia: {
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
    DeseleccionarTransporte,
    RegistroBitacora
  }
}
</script>
