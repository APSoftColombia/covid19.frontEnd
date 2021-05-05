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
        <v-card :key="`bitacora${indexBitacora}`" class="pb-2 pt-2">
            <v-list-item-subtitle class="body-2 font-weight-bold text--primary mx-4 pt-2">
                {{ bitacora.presentacion_id ? 'Presentación' : 'Traslado' }} - <span class="caption">{{ bitacora.accion }}</span>
            </v-list-item-subtitle>
            <v-list-item class="py-0">
              <v-list-item-content class="pa-0">
                <v-list-item-subtitle>
                  <v-icon small>mdi-calendar-month</v-icon>
                  {{ bitacora.fecha ? moment(bitacora.fecha).format('DD/MM/YYYY HH:mm') : '' }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="pa-0 caption">
                <v-list-item-subtitle class="grey--text">
                    <v-icon small>fas fa-user</v-icon>
                    {{ bitacora.usuario.name }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="grey--text pl-4">
                    {{ bitacora.usuario.tipo_documento_identidad_id  && tiposDocumentoIdentidad.length && tiposDocumentoIdentidad.find(x => x.id === bitacora.usuario.tipo_documento_identidad_id)
                        ? tiposDocumentoIdentidad.find(x => x.id === bitacora.usuario.tipo_documento_identidad_id).tipo : '' }}
                        {{ bitacora.usuario.numero_documento_identidad }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-0">
              <v-list-item-content class="pa-0">
                <v-list-item-title class="mt-2">
                    <v-icon small>mdi-clipboard-text-outline</v-icon>
                  Observaciones
                </v-list-item-title>
                <v-list-item-subtitle class="caption mt-1 ml-5">
                  {{ bitacora.observaciones }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          <template v-if="referencia.estado !== 'Proceso Terminado' || referencia.estado !== 'Cancelado'">
              <v-card-actions v-if="bitacora.presentacion || bitacora.traslado" class="mx-auto">
                <span class="caption">{{ bitacora.presentacion && bitacora.presentacion.ips_presentacion ? bitacora.presentacion.ips_presentacion.nombre : '' }}</span>
                <v-spacer></v-spacer>
                <template v-if="bitacora.presentacion">
                  <presentacion
                      :referencia="referencia"
                      :presentacion="bitacora.presentacion"
                      @guardado="val => $emit('guardado', val)"
                  /></template>
                <template v-if="bitacora.traslado">
                  <traslado
                      :referencia="referencia"
                      :traslado="bitacora.traslado"
                      @guardado="val => $emit('guardado', val)"
                  /></template>
              </v-card-actions>
          </template>
        </v-card>
      </template>
    </v-list>
  </v-card>
</template>

<script>

import {mapGetters} from 'vuex'
import RegistroBitacora from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroAnularProceso from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroPresentar from 'Views/centroRegulador/components/referencias/evolucion/RegistroPresentar'
import Presentacion from 'Views/centroRegulador/components/referencias/evolucion/Presentacion'
import Traslado from 'Views/centroRegulador/components/referencias/evolucion/Traslado'
import TerminarProceso from 'Views/centroRegulador/components/referencias/evolucion/TerminarProceso'
export default {
  name: 'Evolucion',
  props: {
    referencia: {
      type: Object,
      default: null
    }
  },
  computed: {
      ...mapGetters([
        'tiposDocumentoIdentidad'
      ]),
  },
  components: {
    Presentacion,
    Traslado,
    RegistroBitacora,
    RegistroAnularProceso,
    RegistroPresentar,
    TerminarProceso
  },
  data: () => ({
    loading: false
  }),
  methods: {
  }
}
</script>
