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
            <v-list-item-subtitle class="body-2 font-weight-bold text--primary mx-4 pt-2">{{ bitacora.presentacion_id ? 'Presentación' : 'Traslado' }}</v-list-item-subtitle>
            <v-list-item class="py-0">
              <v-list-item-content class="pa-0">
                <v-list-item-subtitle class="caption">
                  {{ bitacora.accion }}
                </v-list-item-subtitle>
                <v-list-item-title>
                  <v-icon small>mdi-calendar-month</v-icon>
                  {{ item.fecha_solicitud ? moment(item.fecha).format('DD/MM/YYYY HH:mm') : '' }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-list-item-subtitle class="caption">
                  Orden
                </v-list-item-subtitle>
                <v-list-item-title>
                  <v-icon small>mdi-calendar-month</v-icon>
                  {{ item.fecha_orden ? moment(item.fecha).format('DD/MM/YYYY HH:mm') : '' }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-card-actions v-if="bitacora.presentacion || bitacora.traslado">
            <template v-if="bitacora.presentacion">
              <presentacion
                  :referencia="referencia"
                  :presentacion="bitacora.presentacion"
                  @guardado="val => $emit('guardado', val)"
              />
            </template>
            <template v-if="bitacora.traslado">
              <traslado
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
import Traslado from 'Views/centroRegulador/components/referencias/evolucion/Traslado'
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
    Traslado,
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
