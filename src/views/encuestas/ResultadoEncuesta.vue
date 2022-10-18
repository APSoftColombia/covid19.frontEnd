<template>
  <v-container
      fluid
      class="grid-list-md"
  >
    <v-card>
      <page-title-bar
          v-if="uuid"
          :title="`Resultados de la Encuesta`"
          :subtitle="encuesta && encuesta.ubicacion ? encuesta.ubicacion.direccion : ''"
      >
        <template slot="actions">
          <v-btn
              icon
              @click="closeEncuesta()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </page-title-bar>
      <app-section-loader :status="!resultados || !encuesta"/>
    </v-card>
    <v-row>
      <v-col
          cols="12"
          sm="12"
          md="6"
          lg="4"
          v-for="(integrante, indexIntegrante) in integrantes"
          :key="`integrante${indexIntegrante}`"
      >
        <v-card class="mx-auto">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle class="font-weight-bold">
                Código:{{ moment(encuesta.created_at).format('YYYYMMDD') }}{{ integrante.integrante.numero_documento_identidad }}
              </v-list-item-subtitle>
              <v-list-item-title class="headline">
                {{ [integrante.integrante.nombre1, integrante.integrante.nombre2, integrante.integrante.apellido1, integrante.integrante.apellido2].filter(x => x).join(' ') }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ tiposDocumentoIdentidad && tiposDocumentoIdentidad.find(x => x.id === integrante.integrante.tipo_documento_identidad_id) && tiposDocumentoIdentidad.find(x => x.id === integrante.integrante.tipo_documento_identidad_id).tipo }}
                {{ integrante.integrante.numero_documento_identidad }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-chip
                    v-if="integrante.integrante.es_cabeza"
                    text-color="white"
                    color="primary"
                    label
                >
                  <v-icon left>mdi-account-circle</v-icon>
                  Cabeza de hogar
                </v-chip>
                <v-chip
                    v-else
                    label
                    text-color="white"
                    color="indigo"
                >
                  <v-icon left>mdi-account-group</v-icon>
                  {{ integrante.parentezco && integrante.parentezco.nombre }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text v-if="integrante.riesgo">
            <riesgo-chart
                style="height: 100% !important;"
                :riesgo="integrante.riesgo"
            />
          </v-card-text>
          <template v-if="!integrante.direccionamientos.length">
            <v-row
                justify="center"
                align="center"
            >
              <h3 class="grey--text text--lighten-1 my-4">No aplica ningun direccionamiento</h3>
            </v-row>
          </template>
          <template
              v-else
              v-for="(direccionamiento, indexDir) in integrante.direccionamientos"
          >
            <v-list-item
                :key="`item${indexDir}`"
                @click="click = false"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon
                      color="teal"
                      left
                  >
                    mdi-arrow-right-circle
                  </v-icon>
                  {{ direccionamiento }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider
                class="ma-0 pa-0"
                :key="`divider${indexDir}`"
            />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import RiesgoChart from 'Views/encuestas/components/RiesgoChart'

export default {
  name: 'ResultadoEncuesta',
  props: {
    uuid: {
      type: [Number, String],
      default: null
    }
  },
  components: {
    RiesgoChart
  },
  data: () => ({
    click: false,
    loading: false,
    encuesta: null,
    integrantes: [],
    demandaInducidas: [],
    resultados: []
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'direccionamientos',
      'onLine'
    ])
  },
  created() {
    this.getResultados()
    this.obtenereEncuesta()
  },
  methods: {
    async obtenereEncuesta() {
      this.encuesta = await this.$store.dispatch('obtenerEncuesta', this.uuid)
      this.calcular()
    },
    getResultados() {
      if (this.onLine) {
        this.axios.get(`/encuestas/resultados/${this.uuid}`).then(response => {
          this.resultados = response.data.riesgos
          this.demandaInducidas = response.data.demanda_inducida
        }).catch(e => {
          this.$store.commit('snackbar', {
            color: 'error',
            message: `Error al cargar los resultados, ${e.response.data.message}.`
          })
        })
      }
    },
    closeEncuesta() {
      this.$router.push({name: 'ListadoEncuestas', params: {formulariouuid: this.encuesta.formulario_uuid}})
      this.$store.commit('assignEncuestaEnCurso', false)
    },
    async calcular() {
      this.loading = true
      let integrantes = this.encuesta.individuales
      if (integrantes.length) {
        await integrantes.forEach(i => {
          let preguntasTotales = []
          let parentezco = null
          // Todas las preguntas de la encuesta de un integrante
          i.formulario.secciones.map(x => x.preguntas).forEach(z => preguntasTotales = preguntasTotales.concat(z))
          // Parentezco cuando no es cabeza
          if (!i.encuestado.es_cabeza) {
            let pregunta = preguntasTotales.find(x => x.id === 1211)
            parentezco = pregunta.posibles_respuestas.find(x => x.uuid === pregunta?.respuesta?.posibles_respuesta_uuid)
          }
          this.integrantes.push({
            integrante: i.encuestado,
            parentezco: parentezco,
            riesgo: this.calculaRiesgo(preguntasTotales),
            direccionamientos: this.calculaDireccionamiento(preguntasTotales)
          })
        })
      }
      this.loading = false
    },
    calculaRiesgo(preguntas) {
      // Preguntas respondidas con opción
      let preguntasEvaluarOpcion = preguntas.filter(x => x.respuesta && x?.respuesta?.posibles_respuesta_uuid)
      // Preguntas respondidas con valor
      // let preguntasEvaluarValor = preguntas.filter(x => x.respuesta && x.respuesta.respuesta_abierta)
      let maximo = 0
      let minimo = 0
      let acumulado = 0
      preguntasEvaluarOpcion.forEach(x => {
        let posiblesValores = x.posibles_respuestas.map(z => z.valor)
        maximo = maximo + Math.max(...posiblesValores)
        minimo = minimo + Math.min(...posiblesValores)
        let opcionRespuesta = x.posibles_respuestas.find(p => p?.uuid === x.respuesta?.posibles_respuesta_uuid)
        acumulado = acumulado + (opcionRespuesta ? opcionRespuesta.valor : 0)
      })
      let corteMinimo = 0.33
      let corteMedio = 0.5
      let rango = maximo - minimo
      let breakPointMinimo = minimo + (rango * corteMinimo)
      let breakPointMedio = minimo + (rango * corteMedio)
      return {
        maximo: maximo,
        minimo: minimo,
        acumulado: acumulado,
        rango: rango,
        breakPointMinimo: breakPointMinimo,
        breakPointMedio: breakPointMedio,
        breakPointMinimoP: breakPointMinimo ? breakPointMinimo / rango : 0,
        breakPointMedioP: breakPointMedio ? breakPointMedio / rango : 0,
        acumuladoP: acumulado ? acumulado / rango : 0,
        riesgo: acumulado <= breakPointMinimo ? 'Bajo' : acumulado <= breakPointMedio ? 'Medio' : 'Alto'
      }
    },
    calculaDireccionamiento(preguntas) {
      let preguntasIntegrante = preguntas.filter(n => this.direccionamientos.find(j => j.idPregunta === n.id))
      let direccionamientosIntegrante = []
      preguntasIntegrante.forEach(x => {
        let direccionamientoUnit = this.direccionamientos.find(z => z.idPregunta === x.id && (x?.respuesta?.posibles_respuesta_uuid && x.respuesta?.posibles_respuesta_uuid === z.uuid_resp)) || null
        if (direccionamientoUnit) direccionamientosIntegrante.push(direccionamientoUnit)
      })
      return direccionamientosIntegrante.length ? Array.from(new Set(direccionamientosIntegrante.map(x => x.direccionamiento))) : []
    }
  }
}
</script>
