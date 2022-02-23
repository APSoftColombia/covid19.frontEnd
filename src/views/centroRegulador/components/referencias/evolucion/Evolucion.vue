<template>
  <v-card>
    <v-toolbar
        color="blue-grey lighten-4"
        flat
    >
      <v-chip
          label
          class="font-weight-bold"
          :color="ref_estados && ref_estados.find(x => x.key === referencia.estado) && ref_estados.find(x => x.key === referencia.estado).color"
          dark
      >
        {{ referencia.estado }}
      </v-chip>
      <v-spacer />
      <template
          v-if="referencia && referencia.acciones && referencia.acciones.length"
      >
        <component
            v-for="(accion, indexAccion) in referencia.acciones"
            :key="`accion${indexAccion}`"
            :is="accion.componente"
            :referencia="referencia"
            :accion="accion"
            @guardado="(val) => $emit('guardado', val)"
        />
      </template>
      <template v-slot:extension>
        <v-tabs
            v-model="tab"
            color="primary"
            align-with-title
        >
          <v-tabs-slider />
          <v-tab href="#tab-1"> Gestión por IPS </v-tab>
          <v-tab href="#tab-2"> Traslado </v-tab>
          <v-tab href="#tab-3"> Bitacoras - General </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-card-text>
      <v-tabs-items
          v-model="tab"
          class="mt-2"
          touchless
      >
        <!-- Busqueda de IPS -->
        <v-tab-item value="tab-1">
          <v-list>
            <template
                v-for="(
                  presentacion, indexpresentacion
                ) in referencia.presentaciones"
            >
              <v-card
                  :key="`presentacion${indexpresentacion}`"
                  class="my-2"
                  tile
                  flat
              >
                <v-card-text class="pb-0">
                  <v-row class="presentado">
                    <v-col cols="8">
                      <span class="caption "><b>{{ presentacion.estado }}</b></span>
                      <h5>
                        {{
                          presentacion.ips_presentacion
                              ? presentacion.ips_presentacion.nombre
                              : ""
                        }}
                      </h5>
                    </v-col>
                    <v-col cols="4" align-self="center"  v-if="presentacion && !referencia.tiene_transporte">
                      <v-row align="center" justify="end" class="mx-2">
                        <presentacion
                            :referencia="referencia"
                            :presentacion="presentacion"
                            @guardado="(val) => $emit('guardado', val)"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <template>
                  <v-card-actions class="mx-3 pt-0">
                    <v-row>
                      <v-col class="pb-0" cols="12">
                        <v-row align="center" justify="start">
                          <div>
                            <div class="font-weight-normal">
                              <span class="caption"><b>Presentacion</b></span>
                            </div>
                            <div>
                              {{
                                presentacion.fecha_presentacion
                                    ? moment(
                                        presentacion.fecha_presentacion
                                    ).format("DD/MM/YYYY")
                                    : "-"
                              }} a las {{
                                presentacion.fecha_presentacion
                                    ? moment(
                                        presentacion.fecha_presentacion
                                    ).format("HH:mm")
                                    : "-"
                              }}
                            </div>
                          </div>
                        </v-row>
                      </v-col>
                      <v-col class="pb-0" cols="12" v-if="presentacion.fecha_aceptacion">
                        <v-row align="center" justify="start">
                          <div>
                            <div class="font-weight-normal">
                              <span class="caption"><b>IPS Acepta</b></span>
                            </div>
                            <div>
                              {{
                                presentacion.fecha_aceptacion
                                    ? moment(
                                        presentacion.fecha_aceptacion
                                    ).format("DD/MM/YYYY")
                                    : "-"
                              }} a las {{
                                presentacion.fecha_aceptacion
                                    ? moment(
                                        presentacion.fecha_aceptacion
                                    ).format("HH:mm")
                                    : "-"
                              }}
                            </div>
                          </div>
                        </v-row>
                      </v-col>
                      <v-col class="pb-0" cols="12" v-if="presentacion.fecha_seleccion">
                        <v-row align="center" justify="start">
                          <div>
                            <div class="font-weight-normal">
                              <span class="caption"><b>Se selecciona IPS</b></span>
                            </div>
                            <div>
                              {{
                                presentacion.fecha_seleccion
                                    ? moment(
                                        presentacion.fecha_seleccion
                                    ).format("DD/MM/YYYY")
                                    : "-"
                              }} a las {{
                                presentacion.fecha_seleccion
                                    ? moment(
                                        presentacion.fecha_seleccion
                                    ).format("HH:mm")
                                    : "-"
                              }}
                            </div>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </template>
                <v-divider :key="`dividerPres${indexpresentacion}`" />
              </v-card>
            </template>
          </v-list>
        </v-tab-item>
        <!-- Traslado -->
        <v-tab-item value="tab-2">
          <v-list v-if="referencia.traslados && referencia.traslados.length">
            <template
                v-for="(
                  traslado, indextraslado
                ) in referencia.traslados"
            >
              <v-card
                  :key="`traslado${indextraslado}`"
                  class="my-2"
                  tile
                  flat
              >
                <v-card-text class="pb-0">
                  <v-row class="presentado">
                    <v-col cols="8">
                      <span>Transportadora:</span>
                      <h5 class="mb-0">
                        {{
                          traslado.ips_traslado
                              ? traslado.ips_traslado.nombre
                              : ""
                        }}
                      </h5>
                      <span class="caption">
                            {{
                          traslado.tipo_ambulancia == 'Otro' ? 'Otro tipo de ambulancia' : traslado.tipo_ambulancia
                        }} via {{
                          traslado.tipo_traslado
                        }} <br>
                            Contacto: {{ traslado.contacto ? traslado.contacto : '-' }}
                          </span>
                    </v-col>
                    <v-col cols="4" align-self="center" v-if="traslado">
                      <v-row align="center" justify="end" class="mx-2">
                        <Traslado
                            :referencia="referencia"
                            :traslado="traslado"
                            @guardado="(val) => $emit('guardado', val)"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <template>
                  <v-card-actions class="mx-3">
                    <v-row>
                      <v-col class="pb-0" cols="12">
                        <v-row align="center" justify="start">
                          <div>
                            <div class="font-weight-normal">
                              <span class="caption"><b>IPS Origen</b></span>
                            </div>
                            <div>
                              {{
                                traslado.ips_origen ? traslado.ips_origen.nombre : '-'
                              }}
                            </div>
                          </div>
                        </v-row>
                      </v-col>
                      <v-col class="pb-0" cols="12">
                        <v-row align="center" justify="start">
                          <div>
                            <div class="font-weight-normal">
                              <span class="caption"><b>IPS Destino</b></span>
                            </div>
                            <div>
                              {{
                                traslado.ips_destino ? traslado.ips_destino.nombre : '-'
                              }}
                            </div>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </template>
                <v-divider :key="`dividerTras${indextraslado}`" />
              </v-card>
            </template>
          </v-list>
          <div
              v-else
              class="pa-5 mt-5 text-center font-weight-medium"
          >
            <v-icon>mdi-information</v-icon>
            No hay registros de traslado
          </div>
        </v-tab-item>
        <!-- Bitacora -->
        <v-tab-item value="tab-3">
          <v-list>
            <template
                v-for="(bitacora, indexBitacora) in referencia.bitacoras"
            >
              <v-card
                  :key="`bitacora${indexBitacora}`"
                  class="my-4"
                  tile
                  flat
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
                        <span>{{ bitacora.presentacion ? 'Presentado a:' : 'Transportadora: ' }}</span>
                        <h5>
                          {{
                            bitacora.presentacion
                                ? bitacora.presentacion.ips_presentacion
                                    ? bitacora.presentacion.ips_presentacion
                                        .nombre
                                    : "-"
                                : bitacora.traslado
                                    ? bitacora.traslado.ips_traslado
                                        ? bitacora.traslado.ips_traslado.nombre
                                        : "-"
                                    : "-"
                          }}
                        </h5>
                      </v-col>
                      <v-col cols="4" align-self="center">
                        <v-row align="center" justify="end" class="mx-2">
                          <template v-if="bitacora.presentacion && !referencia.tiene_transporte">
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
                  <v-row class="mx-2" align="center" justify="end">
                    <span class="caption grey--text">Realizo: {{ bitacora.usuario ? bitacora.usuario.name.toLowerCase() : '-' }}</span>
                  </v-row>
                </template>
              </v-card>
              <v-divider :key="`dividerBit${indexBitacora}`" />
            </template>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import RegistroBitacora from 'Views/centroRegulador/components/referencias/evolucion/RegistroBitacora'
import RegistroAnularProceso from 'Views/centroRegulador/components/referencias/evolucion/RegistroAnularProceso'
import RegistroPresentar from 'Views/centroRegulador/components/referencias/evolucion/registroPresentar/RegistroPresentar'
import Presentacion from 'Views/centroRegulador/components/referencias/evolucion/Presentacion'
import Traslado from 'Views/centroRegulador/components/referencias/evolucion/Traslado'
import TerminarProceso from 'Views/centroRegulador/components/referencias/evolucion/TerminarProceso'
export default {
  name: 'Evolucion',
  props: {
    referencia: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters(['tiposDocumentoIdentidad', 'ref_estados']),
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
    tab: null,
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
