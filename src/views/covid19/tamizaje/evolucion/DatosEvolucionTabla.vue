<template>
  <div>
    <v-simple-table dense class="tablaseguimientos" fixed-header>
      <template v-slot:default>
        <thead>
        <tr>
          <th>No.</th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text font-weight-bold">Clasif.</a>
              </template>
              <span>Clasificación</span>
            </v-tooltip>
          </th>
          <th>Realizado por</th>
          <th style="max-width: 200px !important;">Síntomas</th>
          <th style="max-width: 100px !important; white-space: inherit !important;"></th>
          <th style="max-width: 200px !important;">
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text font-weight-bold">Signos</a>
              </template>
              <span>Signos de alarma</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="red--text">
                  <v-icon v-on="on">fas fa-pills</v-icon>
                </a>
              </template>
              <span>¿Consume medicamentos antiinflamatorios o acetaminofén?</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="purple--text">
                  <v-icon v-on="on">fas fa-capsules</v-icon>
                </a>
              </template>
              <span>¿Consume o ha consumido Ibuprofeno?</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text">
                  <v-icon v-on="on">fas fa-procedures</v-icon>
                </a>
              </template>
              <span>¿Está actualmente hospitalizado por IRA IRAG o IRAGI?</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text font-weight-bold">Estado A.</a>
              </template>
              <span>Estado de afectación</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text font-weight-bold">Orden</a>
              </template>
              <span>Orden Médica</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="deep-purple--text">
                  <v-icon v-on="on">fas fa-vial</v-icon>
                </a>
              </template>
              <span>Solicita Toma de Muestra</span>
            </v-tooltip>
          </th>
          <th>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="brown--text font-weight-bold">RC</a>
              </template>
              <span>Resumen Clínico</span>
            </v-tooltip>
          </th>
<!--          <th>Reportes</th>-->
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(evolucion, indexEvolucionTable) in evoluciones" :key="`evolución${evolucion.id}`">
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn fab :color="evolucion.fallida ? 'error' : 'primary'" small dark v-on="on"
                       @click="dialogDetalle(evolucion)">
                  {{ evolucion.numero }}
                </v-btn>
              </template>
              <span>Ver Detalle</span>
            </v-tooltip>
          </td>
          <td>
            <boton-clasificacion
                :clasificacion="evolucion.clasificacion"
                :version="evolucion.version_lineamientos"
                :confirmado="evolucion.positivo_covid"
                color="orange"
                textColor="white"
                @click="val => verAyuda(val)"
            >
            </boton-clasificacion>
          </td>
          <td>
            <v-list-item class="pa-0">
              <v-list-item-content class="pa-0">
                <v-list-item-subtitle class="font-weight-black">
                  {{ evolucion.medico ? evolucion.medico.name : 'No registra médico' }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ evolucion.created_at ? moment(evolucion.created_at).format('DD/MM/YYYY HH:mm') : '' }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip top v-if="evolucion.lugar_evolucion">
                  <template v-slot:activator="{on}">
                    <v-avatar class="white--text" size="40" color="deep-purple" v-on="on">
                      <v-icon>
                        fas
                        fa-{{ evolucion.lugar_evolucion.id === 3 ? 'hospital' : evolucion.lugar_evolucion.id === 2 ? 'clinic-medical' : 'phone-alt' }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <span>{{ evolucion.lugar_evolucion.id === 3 ? 'Atención en ' : '' }}{{ evolucion.lugar_evolucion.orden }}</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </td>
          <td :style="evolucion.fallida ? 'white-space: inherit !important;' : 'max-width: 200px !important;'"
              :colspan="evolucion.fallida ? 10 : 1">
            <p class="ma-0" v-if="evolucion.fallida">{{ evolucion.observaciones }}</p>
            <template v-else>
              <v-chip-group
                  v-if="evolucion.sintomas && evolucion.sintomas.filter(x => x.solicita_fecha)"
                  column
                  multiple
              >
                <template v-for="(chip, indexChip) in evolucion.sintomas.filter(x => x.solicita_fecha)">
                  <v-tooltip top :key="`chip${indexChip}`">
                    <template v-slot:activator="{on}">
                      <v-chip v-on="on" x-small label class="white--text" color="indigo">
                        <span class="text-truncate">{{ chip.descripcion }}</span>
                      </v-chip>
                    </template>
                    <span>{{ [chip.descripcion, chip.pivot && chip.pivot.fecha_inicio ? moment(chip.pivot.fecha_inicio).format('DD/MM/YYYY') : null].filter(x => x).join(' desde el ') }}</span>
                  </v-tooltip>
                </template>
                <v-chip x-small label class="white--text" color="orange" v-if="evolucion.fecha_sintomas">
                  <v-icon small left>mdi-calendar-month</v-icon>
                  {{ evolucion.fecha_sintomas ? moment(evolucion.fecha_sintomas).format('DD/MM/YYYY') : '' }}
                </v-chip>
              </v-chip-group>
            </template>
          </td>
          <template v-if="!evolucion.fallida">
            <td style="max-width: 100px !important; white-space: inherit !important;">
              <v-tooltip right v-if="evolucion.temperatura">
                <template v-slot:activator="{on}">
                  <v-chip
                      v-on="on"
                      class="mr-1"
                      color="deep-orange"
                      label
                      dark
                      small
                  >
                    <v-icon left small>fas fa-thermometer-half</v-icon>
                    {{ evolucion.temperatura }}
                    <v-icon small>mdi-temperature-celsius</v-icon>
                  </v-chip>
                </template>
                <span>Temperatura</span>
              </v-tooltip>
              <v-tooltip right v-if="evolucion.saturacion_oxigeno">
                <template v-slot:activator="{on}">
                  <v-chip
                      v-on="on"
                      class="mr-1"
                      color="purple"
                      label
                      dark
                      small
                  >
                    <v-icon left small>fas fa-tachometer-alt</v-icon>
                    {{ evolucion.saturacion_oxigeno }}
                  </v-chip>
                </template>
                <span>Saturación de Oxígeno</span>
              </v-tooltip>
              <v-tooltip right v-if="evolucion.frecuencia_pulso">
                <template v-slot:activator="{on}">
                  <v-chip
                      v-on="on"
                      class="mr-1"
                      color="red"
                      label
                      dark
                      small
                  >
                    <v-icon left small>mdi-heart-pulse</v-icon>
                    {{ evolucion.frecuencia_pulso }}
                  </v-chip>
                </template>
                <span>Frecuencia de Pulso</span>
              </v-tooltip>
            </td>
            <td style="max-width: 200px !important;">
              <v-chip-group
                  column
                  multiple
              >
                <template v-for="(chip, indexChip) in evolucion.sintomas.filter(x => !x.solicita_fecha)">
                  <v-chip x-small label class="white--text" color="cyan darken-4" :key="`chip${indexChip}`">
                    <span class="text-truncate">{{ chip.descripcion }}</span>
                  </v-chip>
                </template>
              </v-chip-group>
            </td>
            <td>
                        <span>
                            {{ evolucion.antinflamatorios === null ? '' : evolucion.antinflamatorios ? 'SI' : 'NO' }}
                        </span>
            </td>
            <td>
                        <span>
                            {{ evolucion.ibuprofeno === null ? '' : evolucion.ibuprofeno ? 'SI' : 'NO' }}
                        </span>
            </td>
            <td style="max-width: 200px !important;">
              <span v-if="!evolucion.hospitalizado">NO</span>
              <span v-else>Por {{ evolucion.causa_hospitalizacion }}</span>
            </td>
            <td>
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title v-if="evolucion.estado_afectacion">{{ evolucion.estado_afectacion }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="evolucion.estado_afectacion">{{ evolucion.evolucion }}
                  </v-list-item-subtitle>
                  <v-list-item-title v-else>{{ evolucion.evolucion }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </td>
            <td>
              <v-tooltip top v-if="evolucion.orden_medica">
                <template v-slot:activator="{on}">
                  <v-avatar class="white--text" size="40" color="teal" v-on="on">
                    <v-icon>
                      fas
                      fa-{{ evolucion.orden_medica.id === 3 ? 'hospital' : evolucion.orden_medica.id === 2 ? 'clinic-medical' : 'phone-alt' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <span>{{ evolucion.orden_medica.id === 3 ? 'Atención en ' : '' }}{{ evolucion.orden_medica.orden }}</span>
              </v-tooltip>
            </td>
            <td>
              {{ evolucion.solicitud_prueba ? 'SI' : 'NO' }}
            </td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{on}">
                  <v-chip label class="white--text elevation-2" color="info" v-on="on" @click="verRHC(evolucion)">
                    <v-icon>fas fa-notes-medical</v-icon>
                  </v-chip>
                </template>
                <span>Ver resumen clínico</span>
              </v-tooltip>
            </td>
          </template>
          <td class="text-center">
            <v-tooltip top v-if="indexEvolucionTable === 0 && permisos.seguimientoEditar">
              <template v-slot:activator="{ on }">
                <v-btn fab color="orange" small dark v-on="on"
                       @click="$emit('editarEvolucion', evolucion.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar Seguimiento</span>
            </v-tooltip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <help-modal ref="helpModal"></help-modal>
    <r-h-c-modal ref="rhcModal"></r-h-c-modal>
    <dialog-detalle-evolucion ref="dialogDetalle" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import DialogDetalleEvolucion from 'Views/covid19/tamizaje/evolucion/DialogDetalleEvolucion'
import BotonClasificacion from '../../../../components/Tamizaje/BotonClasificacion'

const HelpModal = () => import('../../../../components/HelpModal/HelpModal')
const RHCModal = () => import('../../../../components/HelpModal/RHCModal')
export default {
  name: 'DatosEvolucionTabla',
  props: {
    evoluciones: {
      type: Array,
      default: () => []
    }
  },
  components: {
    HelpModal,
    RHCModal,
    BotonClasificacion,
    DialogDetalleEvolucion
  },
  data: () => ({}),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'ordenesMedicas',
      'clasificacionesCovid'
    ])
  },
  methods: {
    dialogDetalle(evolucion) {
      this.$refs.dialogDetalle.open(evolucion)
    },
    verAyuda(item) {
      this.$refs.helpModal.open(item)
    },
    verRHC(item) {
      this.$refs.rhcModal.open(item)
    }
  }
}
</script>

<style scoped>
.tablaseguimientos .v-data-table table thead tr td, .v-data-table table thead tr th, .v-data-table table tbody tr td, .v-data-table table tbody tr th, .v-data-table table tfoot tr td, .v-data-table table tfoot tr t {
  height: 2rem !important;
  padding: 3px 5px !important;
}

.tablaseguimientos .v-data-table td, .v-data-table th {
  padding: 0 8px !important;
}
</style>