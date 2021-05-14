<template>
  <div>
    <v-row>
      <v-col class="pb-0" cols="12">
        <c-date
            v-model="aislamiento.fecha_ingreso"
            rules="required"
            label="Fecha Ingreso"
            name="fecha de ingreso"
            :max="moment().format('YYYY-MM-DD')"
            :min="fechaMinimaAislamiento ? moment(fechaMinimaAislamiento).format('YYYY-MM-DD') : null"
        >
        </c-date>
      </v-col>
      <v-col class="pb-0" cols="12">
        <c-select-complete
            v-model="aislamiento.ordenado_por"
            label="Ordenado Por"
            :items="tiposOrdenador"
            rules="required"
            name="ordenado por"
        >
        </c-select-complete>
      </v-col>
      <v-col cols="12" class="pb-0" v-if="aislamiento.ordenado_por === 'IPS'">
        <buscador-ipsx
            ref="buscadorips"
            label="IPS que ordena aislamiento"
            v-model="aislamiento.codigo_habilitacion"
            rules="required"
            name="IPS que ordena aislamiento"
        />
      </v-col>
      <v-col class="pb-0" cols="12">
        <c-select-complete
            v-model="aislamiento.tipo"
            label="Tipo de Aislamiento"
            :items="tiposAislamiento"
            rules="required"
            name="tipo de aislamiento"
            :clearable="false"
            @change="aislamiento.ambito = null"
        >
        </c-select-complete>
      </v-col>
      <v-col cols="12">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
                v-model="aislamiento.individual"
                label="Aislada en habitación individual"
                rules="required"
                name="aislada en habitación individual"
                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                item-text="text"
                item-value="value"
            >
            </c-radio>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
                v-model="aislamiento.CompromisoPersonaAislada"
                label="¿La persona aislada y el grupo familiar se comprometió a cumplir con el aislamiento?"
                rules="required"
                name="compromiso de aislamiento"
                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                item-text="text"
                item-value="value"
            >
            </c-radio>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
                v-model="aislamiento.ReportaContactos"
                label="¿Va a reportar contactos?"
                rules="required"
                name="reporta contactos"
                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                item-text="text"
                item-value="value"
            >
            </c-radio>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="pb-0" cols="12" v-if="aislamiento.ReportaContactos === 0">
        <c-select-complete
            v-model="aislamiento.IDCausalNoReporteContactos"
            label="Causal por la cual no reporta contactos"
            :items="causalesNoReportaContactos"
            item-value="value"
            item-text="text"
            rules="required"
            name="Causal por la cual no reporta contactos"
        >
        </c-select-complete>
      </v-col>
      <v-col class="pb-0" cols="12">
        <c-select-complete
            :disabled="!aislamiento.tipo"
            v-model="aislamiento.ambito"
            label="Ambito de atención médica"
            :items="ambitosFiltrados"
            rules="required"
            name="ambito de atención médica"
        >
        </c-select-complete>
      </v-col>
      <v-col class="pb-0" cols="12" v-if="aislamiento.ambito === 'Otro'">
        <c-text-area
            v-model="aislamiento.otro_ambito"
            label="Descripción del ambito"
            rules="required"
            name="descripción del ambito"
            rows="1"
        >
        </c-text-area>
      </v-col>
    </v-row>
    <form-seguimiento-aislamiento
        v-if="!aislamiento.id"
        :aislamiento="aislamiento"
        :seguimiento_aislamiento="seguimiento_aislamiento"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FormSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/FormSeguimientoAislamiento'

export default {
  name: 'FormAislamiento',
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    aislamiento: {
      type: Object,
      default: null
    },
    seguimiento_aislamiento: {
      type: Object,
      default: null
    }
  },
  data: () => ({}),
  components: {
    FormSeguimientoAislamiento
  },
  computed: {
    ...mapGetters([
      'tiposAislamiento',
      'ambitosAtencion',
      'tiposOrdenador',
      'causalesNoReportaContactos'
    ]),
    fechaMinimaAislamiento() {
      return this && this.tamizaje && this.tamizaje.aislamientos && this.tamizaje.aislamientos.length ? this.tamizaje.aislamientos[0].fecha_egreso ? this.tamizaje.aislamientos[0].fecha_egreso : this.tamizaje.aislamientos[0].fecha_ingreso : null
    },
    ambitosFiltrados () {
      return this.ambitosAtencion
          ? this.aislamiento && this.aislamiento.tipo
              ? this.aislamiento.tipo === 'Institución de Salud'
                  ? this.ambitosAtencion.filter(x => x !== 'Domiciliaria' && x !== 'Otro')
                  : this.ambitosAtencion.filter(x => x === 'Domiciliaria' || x === 'Otro' || x === 'No Aplica')
              : []
          : []
    }
  },
  watch: {
    'aislamiento.ordenado_por': {
      handler(val) {
        if (val !== 'IPS') {
          this.aislamiento.codigo_habilitacion = null
        }
      },
      immediate: false
    },
    'aislamiento.ReportaContactos': {
      handler(val) {
        if (val !== 0) {
          this.aislamiento.IDCausalNoReporteContactos = null
        }
      },
      immediate: false
    },
    'aislamiento.ambito': {
      handler(val) {
        if (val !== 'Otro') {
          this.aislamiento.otro_ambito = null
        }
      },
      immediate: false
    },
    'seguimiento_aislamiento.fecha_egreso': {
      handler(val) {
        this.aislamiento.fecha_egreso = val
      },
      immediate: false
    }
  }
}
</script>

<style scoped>

</style>