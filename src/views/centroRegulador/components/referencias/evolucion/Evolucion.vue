<template>
  <v-card>
    <v-card-title>
      Evolución
      <template
        v-if="referencia && referencia.acciones && referencia.acciones.length"
      >
        <v-spacer />
        <component
          v-for="(accion, indexAccion) in referencia.acciones"
          :key="`accion${indexAccion}`"
          :is="accion.componente"
          :referencia="referencia"
          :accion="accion"
          @guardado="(val) => $emit('guardado', val)"
        />
      </template>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-tabs fixed-tabs>
          <v-tab> Bitacoras general </v-tab>
          <v-tab> Presentaciones </v-tab>
          <v-tab> Traslados </v-tab>
          <v-tab-item>
            <v-list>
              <template
                v-for="(bitacora, indexBitacora) in referencia.bitacoras"
              >
                <v-card
                  :key="`bitacora${indexBitacora}`"
                  class="my-2"
                  outlined
                >
                  <v-list-item-subtitle
                    class="body-2 text--primary mx-4 pt-2"
                  >
                    <div class="font-weight-normal">
                      <strong>{{ bitacora.accion }}</strong>
                    </div>
                    <div>{{ bitacora.fecha
                            ? moment(bitacora.fecha).format(
                                "DD/MM/YYYY"
                              )
                            : "" }} a las {{ bitacora.fecha
                            ? moment(bitacora.fecha).format(
                                "HH:mm"
                              )
                            : "" }}</div>
                  </v-list-item-subtitle>
                  <!-- <v-list-item class="py-0">
                    <v-list-item-content class="pa-0 caption">
                      <v-list-item-subtitle class="grey--text">
                        <v-icon small>fas fa-user</v-icon>
                        {{ bitacora.usuario.name }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="grey--text pl-4">
                        {{
                          bitacora.usuario.tipo_documento_identidad_id &&
                          tiposDocumentoIdentidad.length &&
                          tiposDocumentoIdentidad.find(
                            (x) =>
                              x.id ===
                              bitacora.usuario.tipo_documento_identidad_id
                          )
                            ? tiposDocumentoIdentidad.find(
                                (x) =>
                                  x.id ===
                                  bitacora.usuario
                                    .tipo_documento_identidad_id
                              ).tipo
                            : ""
                        }}
                        {{ bitacora.usuario.numero_documento_identidad }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item> -->
                  <v-list-item class="py-0">
                    <v-list-item-content class="pa-0">
                      {{ bitacora.observaciones }}
                    </v-list-item-content>
                  </v-list-item>
                  <template>
                    <v-card-actions
                      v-if="bitacora.presentacion || bitacora.traslado"
                      class="mx-3"
                    >
                      <v-row class="presentado">
                        <v-col cols="8">
                          <span>Presentado a:</span>
                          <h5>
                            {{
                              bitacora.presentacion
                                ? bitacora.presentacion.ips_presentacion
                                  ? bitacora.presentacion.ips_presentacion
                                      .nombre
                                  : "-"
                                : bitacora.traslado
                                ? bitacora.traslado.ips_destino
                                  ? bitacora.traslado.ips_destino.nombre
                                  : "-"
                                : "-"
                            }}
                          </h5>
                        </v-col>
                        <v-col cols="4" align-self="center">
                          <v-row align="center" justify="end" class="mx-2">
                            <template v-if="bitacora.presentacion">
                              <presentacion
                                :referencia="referencia"
                                :presentacion="bitacora.presentacion"
                                @guardado="(val) => $emit('guardado', val)"
                            /></template>
                            <template v-if="bitacora.traslado">
                              <traslado
                                :referencia="referencia"
                                :traslado="bitacora.traslado"
                                @guardado="(val) => $emit('guardado', val)"
                              />
                            </template>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </template>
                </v-card>
              </template>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-list>
              <template
                v-for="(
                  presentacion, indexpresentacion
                ) in referencia.presentaciones"
              >
                <v-card
                  :key="`presentacion${indexpresentacion}`"
                  class="my-2"
                  outlined
                >
                  <v-list-item-subtitle
                    class="body-2 font-weight-bold text--primary mx-4 pt-2"
                  >
                    Presentacion -
                    <span class="caption">{{ presentacion.estado }}</span>
                  </v-list-item-subtitle>
                  <v-list-item class="py-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle>
                        <v-icon small>mdi-calendar-month</v-icon>
                        Fecha Aceptacion:
                        {{
                          presentacion.fecha_aceptacion
                            ? moment(presentacion.fecha_aceptacion).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : "-"
                        }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <v-icon small>mdi-calendar-month</v-icon>
                        Fecha Seleccion:
                        {{
                          presentacion.fecha_seleccion
                            ? moment(presentacion.fecha_seleccion).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : "-"
                        }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <v-icon small>mdi-calendar-month</v-icon>
                        Fecha Presentacion:
                        {{
                          presentacion.fecha_presentacion
                            ? moment(
                                presentacion.fecha_presentacion
                              ).format("DD/MM/YYYY HH:mm")
                            : "-"
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <template>
                    <v-card-actions v-if="presentacion" class="mx-3">
                      <v-row class="presentado">
                        <v-col cols="8">
                          <span>Presentado a:</span>
                          <h5>
                            {{
                              presentacion.ips_presentacion
                                ? presentacion.ips_presentacion.nombre
                                : ""
                            }}
                          </h5>
                        </v-col>
                        <v-col cols="4" align-self="center">
                          <v-row align="center" justify="end" class="mx-2">
                            <presentacion
                              :referencia="referencia"
                              :presentacion="presentacion"
                              @guardado="(val) => $emit('guardado', val)"
                            />
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </template>
                </v-card>
              </template>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-list>
              <template
                v-for="(
                  traslado, indextraslado
                ) in referencia.traslados"
              >
                <v-card
                  :key="`traslado${indextraslado}`"
                  class="my-2"
                  outlined
                >
                  <v-list-item-subtitle
                    class="body-2 font-weight-bold text--primary mx-4 pt-2"
                  >
                    Traslado -
                    <span class="caption">{{ traslado.estado }}</span>
                  </v-list-item-subtitle>
                  <v-list-item class="py-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="my-2">
                        <v-icon small>mdi-hospital-building</v-icon>
                        IPS Origen:
                        {{
                          traslado.ips_origen ? traslado.ips_origen.nombre : '-'
                        }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="mb-2">
                        <v-icon small>mdi-hospital-building</v-icon>
                        IPS Traslado:
                        {{
                          traslado.ips_traslado ? traslado.ips_traslado.nombre : '-'
                        }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="mb-2">
                        <v-icon small>mdi-hospital-building</v-icon>
                        IPS Destino:
                        {{
                          traslado.ips_destino ? traslado.ips_destino.nombre : '-'
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="py-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="mb-2">
                        <v-icon small>mdi-car</v-icon>
                        <b>Tipo transporte:</b> 
                        {{ traslado.tipo_traslado }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <v-icon small>mdi-ambulance</v-icon>
                        <b>Tipo ambulancia:</b> 
                        {{ traslado.tipo_ambulancia }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <template>
                    <v-card-actions v-if="traslado" class="mx-3">
                      <v-row class="presentado">
                        <v-col cols="8">
                          <span>Presentado a:</span>
                          <h5>
                            {{
                              traslado.ips_traslado
                                ? traslado.ips_traslado.nombre
                                : ""
                            }}
                          </h5>
                        </v-col>
                        <v-col cols="4" align-self="center">
                          <v-row align="center" justify="end" class="mx-2">
                            <Traslado
                              :referencia="referencia"
                              :traslado="traslado"
                              @guardado="(val) => $emit('guardado', val)"
                            />
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </template>
                </v-card>
              </template>
            </v-list>
          </v-tab-item>
        </v-tabs>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import RegistroBitacora from "Views/centroRegulador/components/referencias/evolucion/RegistroBitacora";
import RegistroAnularProceso from "Views/centroRegulador/components/referencias/evolucion/RegistroBitacora";
import RegistroPresentar from "Views/centroRegulador/components/referencias/evolucion/RegistroPresentar";
import Presentacion from "Views/centroRegulador/components/referencias/evolucion/Presentacion";
import Traslado from "Views/centroRegulador/components/referencias/evolucion/Traslado";
import TerminarProceso from "Views/centroRegulador/components/referencias/evolucion/TerminarProceso";
export default {
  name: "Evolucion",
  props: {
    referencia: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["tiposDocumentoIdentidad"]),
  },
  components: {
    Presentacion,
    Traslado,
    RegistroBitacora,
    RegistroAnularProceso,
    RegistroPresentar,
    TerminarProceso,
  },
  data: () => ({
    loading: false,
  }),
  methods: {},
};
</script>
<style scoped>
.presentado {
  background: #d3d3d357;
  border-radius: 5px;
}
</style>