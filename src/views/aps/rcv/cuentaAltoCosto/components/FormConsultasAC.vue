<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        {{ consulta && consulta.id ? " Editar" : "Nuevo" }} consulta
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <ValidationObserver ref="formConsultaAC" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-texto
                      label="Numero factura"
                      name="numero factura"
                      rules="required"
                      v-model="consulta.numero_factura"
                  ></c-texto>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-texto
                      label="Numero autorización"
                      name="numero autorización"
                      rules="required"
                      v-model="consulta.numero_autorizacion"
                  ></c-texto>
                </v-col>
                <v-col cols="12">
                  <buscador-ips
                      ref="buscadorips"
                      label="IPS"
                      name="IPS"
                      v-model="consulta.codigo_prestador"
                      rules="required"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-select-complete
                      v-model="consulta.tipo_identificacion"
                      label="Tipo identificacion"
                      rules="required"
                      name="Tipo identificacion"
                      :items="tiposDocumentoIdentidad"
                      item-value="tipo"
                      item-text="descripcion"
                  ></c-select-complete>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-texto
                      label="Identificacion"
                      name="Identificacion"
                      rules="required"
                      v-model="consulta.identificacion"
                  ></c-texto>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <c-date
                      v-model="consulta.fecha"
                      label="Fecha"
                      name="fecha"
                      rules="required"
                      :max="moment().format('YYYY-MM-DD')"
                  ></c-date>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12">
                  <buscador-cup
                      ref="buscadorcups"
                      label="Codigo de la consulta"
                      name="busqueda de codigo cup"
                      v-model="consulta.codigo_cup"
                      rules="required"
                  ></buscador-cup>
                </v-col>
                <v-col class="pb-0" cols="12">
                    <c-select-complete
                        v-model="consulta.finalidad_consulta"
                        label="Finalidad de la consulta"
                        name="Finalidad de la consulta"
                        :items="finalidades && finalidades.length ? finalidades: []"
                        item-text="opcion"
                        item-value="codigo"
                        rules="required"
                    >
                    </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-select-complete
                      v-model="consulta.causa_externa"
                      label="causa externa"
                      name="causa externa"
                      :items="causas && causas.length ? causas: []"
                      item-text="opcion"
                      item-value="codigo"
                      rules="required"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-select-complete
                      v-model="consulta.otra_causa_externa"
                      label="Otra causa externa"
                      name="Otra causa externa"
                      :items="causas && causas.length ? causas: []"
                      item-text="opcion"
                      item-value="codigo"
                      rules="required"
                  >
                  </c-select-complete>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <buscador-cie
                      label="Código del diagnóstico principal"
                      name="Código del diagnóstico principal"
                      v-model="consulta.codigo_diagnostico_principal"
                      rules="required"
                      @change="val => consulta.codigo_diagnostico_principal = val"
                  ></buscador-cie>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <buscador-cie
                      label="Código del diagnóstico relacionado No. 1"
                      name="Código del diagnóstico relacionado No. 1"
                      v-model="consulta.codigo_diagnostico_relacionado1"
                      @change="val => consulta.codigo_diagnostico_relacionado1 = val"
                      rules="required"
                  ></buscador-cie>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <buscador-cie
                      label="Código del diagnóstico relacionado No. 2"
                      name="Código del diagnóstico relacionado No. 2"
                      v-model="consulta.codigo_diagnostico_relacionado2"
                      @change="val => consulta.codigo_diagnostico_relacionado2 = val"
                      rules="required"
                  ></buscador-cie>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <buscador-cie
                      label="Código del diagnóstico relacionado No. 3"
                      name="Código del diagnóstico relacionado No. 3"
                      v-model="consulta.codigo_diagnostico_relacionado3"
                      @change="val => consulta.codigo_diagnostico_relacionado3 = val"
                      rules="required"
                  ></buscador-cie>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-select-complete
                      v-model="consulta.tipo_diagnostico_principal"
                      label="Tipo de diagnóstico principal"
                      name="Tipo de diagnóstico principal"
                      :items="tipos_diagnosticos && tipos_diagnosticos.length ? tipos_diagnosticos: []"
                      item-text="opcion"
                      item-value="codigo"
                      rules="required"
                  >
                  </c-select-complete>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="Valor de la consulta"
                      name="Valor de la consulta"
                      rules="required"
                      v-model="consulta.valor_consulta"
                  ></c-number>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="Valor de la cuota moderada"
                      name="Valor de la cuota moderada"
                      rules="required"
                      v-model="consulta.valor_cuota_moderada"
                  ></c-number>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                  <c-number
                      label="Valor a pagar"
                      name="Valor a pagar"
                      rules="required"
                      v-model="consulta.valor_a_pagar"
                  ></c-number>
                </v-col>
              </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="close" :loading="loadingB" :disabled="loadingB">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
          <v-spacer></v-spacer>
          <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
          <v-btn @click.stop="crearExamen" class="primary white--text" :loading="loadingB" :disabled="loadingB">
            <v-icon left>fas fa-save</v-icon>
            <span>Guardar</span>
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";
const BuscadorCup = () => import('Views/aps/rcv/encuestas/components/BuscadorCups.vue')
const BuscadorCie = () => import('./BuscadorCie.vue')
export default {
  name: "FormConsultasAC",
  components: {
    BuscadorCup,
    BuscadorCie
  },
  data: () => ({
    consulta: {},
    dialog: false,
    finalidades: [],
    causas: [],
    tipos_diagnosticos: [],
    loadingB: false,
    loading: false
  }),
  computed: {
    ...mapGetters([
        "tiposDocumentoIdentidad",
    ])
  },
  methods: {
    open(consulta = null, seguimiento_id = null, afiliado_id = null){
      if(consulta){this.consulta = this.clone(consulta)}
      this.consulta.seguimiento_id = seguimiento_id
      this.consulta.afiliado_id = afiliado_id
      this.dialog = true
      this.getComplementos()
    },
    getComplementos(){
      this.loading = true
      this.axios.get('complementos-alto-costo').then(response => {
        this.finalidades = response.data.seguimientos_opciones.filter(x => x.campo === 'finalidad_consulta')
        this.causas = response.data.seguimientos_opciones.filter(x => x.campo === 'causa_externa')
        this.tipos_diagnosticos = response.data.seguimientos_opciones.filter(x => x.campo === 'tipo_diagnostico_principal')
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: ' al conseguir complementos', error: error})
      })
    },
    close(){
      this.consulta = {}
      this.dialog = false
      this.opciones = []
    },
    crearExamen(){
      this.$refs.formConsultaAC.validate().then(result => {
        if(result){
          this.loading = true
          let consultaData = {
            numero_factura: this.consulta.numero_factura,
            codigo_prestador: this.consulta.codigo_prestador,
            tipo_identificacion: this.consulta.tipo_identificacion,
            identificacion: this.consulta.identificacion,
            fecha: this.consulta.fecha,
            codigo_cup: this.consulta.codigo_cup,
            finalidad_consulta: this.consulta.finalidad_consulta,
            causa_externa: this.consulta.causa_externa,
            otra_causa_externa: this.consulta.otra_causa_externa,
            codigo_diagnostico_principal: this.consulta.codigo_diagnostico_principal,
            codigo_diagnostico_relacionado1: this.consulta.codigo_diagnostico_relacionado1,
            codigo_diagnostico_relacionado2: this.consulta.codigo_diagnostico_relacionado2,
            codigo_diagnostico_relacionado3: this.consulta.codigo_diagnostico_relacionado3,
            tipo_diagnostico_principal: this.consulta.tipo_diagnostico_principal,
            valor_consulta: this.consulta.valor_consulta,
            valor_cuota_moderada: this.consulta.valor_cuota_moderada,
            valor_a_pagar: this.consulta.valor_a_pagar,
            seguimiento_id: this.consulta.seguimiento_id,
            afiliado_id: this.consulta.afiliado_id,
            numero_autorizacion: this.consulta.numero_autorizacion
          }
          let request = this.consulta && this.consulta.id ? this.axios.put(`consultaRCVS/${this.consulta.id}`, consultaData)
          : this.axios.post(`consultaRCVS`, consultaData)
          request.then(response => {
            this.$store.commit('snackbar', {color: 'success', message: `consulta rcv ${this.consulta && this.consulta.id ? 'editada' : 'creada'} con exito`})
            this.loading = false
            this.$emit('refresh', response.data.seguimiento_id)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: `al ${this.consulta && this.consulta.id ? 'editar' : 'crear'} consulta rcv`, error: error})
            this.loading = false
          })
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
