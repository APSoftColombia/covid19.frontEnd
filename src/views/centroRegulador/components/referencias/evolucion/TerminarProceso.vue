<template>
    <v-dialog
      v-model="dialog"
      max-width="620"
  >
    <template v-slot:activator="{ on, attrs }">
      <c-tooltip
          top
          :tooltip="accion.tooltip"
      >
        <v-btn
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            :color="accion.color"
            depressed
            fab
            small
        >
          <v-icon class="white--text">{{ accion.icon }}</v-icon>
        </v-btn>
      </c-tooltip>
    </template>
    <v-card>
      <v-toolbar dark :color="accion.color">
        <v-icon left>{{ accion.icon }}</v-icon>
        <v-toolbar-title>
          {{ accion.accion }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pb-0">
        <ValidationObserver
            ref="formItem"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <c-date-manual
                  v-model="item.fecha_egreso"
                  label="Fecha"
                  name="Fecha"
                  rules="required"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                  v-model="item.hora"
                  label="Hora"
                  name="Hora"
                  rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-select-complete
                  label="Estado egreso"
                  name="Estado egreso"
                  rules="required"
                  :items="['Vivo', 'Muerto']"
                  v-model="item.estado_egreso"
              ></c-select-complete>
            </v-col>
            <v-col cols="12">
              <buscador-cies
                  label="Codigo Cie de egreso"
                  name="Codigo Cie de egreso"
                  v-model="item.codigo_cie10_egreso"
                  rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Observaciones"
                  v-model="item.observaciones"
                  rules="required"
                  name="observaciones"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn
            text
            @click="close"
        >
          Cancelar
        </v-btn>
        <v-spacer/>
        <v-btn
            :color="accion.color"
            class="white--text"
            @click="save()"
        >
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import BuscadorCies from 'Views/centroRegulador/components/referencias/BuscadorCies'
export default {
    name: 'TerminarProceso',
    components: {
        BuscadorCies
    },
    props: {
        referencia: {
            type: Object,
            default: null
        },
        accion: {
            type: Object,
            default: null
        },
        id: {
            type: [String, Number],
            default: null
        }
    },
    data: () => ({
        dialog: false,
        loading: false,
        item: null,
        complementos: null,
        makeItem: {
          id: null,
          codigo_cie10_egreso: null,
          referencia_id: null,
          estado: null,
          codigo_prestador_origen: null,
          tipo_traslado: null,
          tipo_ambulancia: null,
          fecha_solicitud: null,
          codigo_prestador_traslado: null,
          fecha_traslado: null,
          fecha_llegada: null,
          fecha_fallido: null,
          contacto: null,
          codigo_prestador_destino: null
        }
    }),
    watch: {
      dialog: {
        handler(val) {
          if(val) this.asignar()
        },
        immediate: false
      }
    },
    methods: {
        asignar() {
          if(this.referencia) {
            this.item = this.clone(this.makeItem)
            this.item.referencia_id = this.referencia.id
            this.item.codigo_cie10_egreso = this.referencia.codigo_cie10_ingreso
            this.item.fecha_egreso = this.moment().format('YYYY-MM-DD')
            this.item.hora = this.moment().format('HH:mm')
          } else {
            this.$store.commit('snackbar', {color: 'error', message: `No hay una referencia seleccionada.`})
            this.close()
          }
        },
        close() {
          this.$refs.formItem.reset()
          this.dialog = false
          this.loading = false
          this.item = this.clone(this.makeItem)
        },
        save() {
          this.$refs.formItem.validate().then(async result => {
            if (result) {
              this.loading = true
              let itemCopia = await this.clone(this.item)
              itemCopia.fecha_egreso = `${itemCopia.fecha_egreso} ${itemCopia.hora}`
              this.axios.post(`terminar-proceso/${itemCopia.referencia_id}`, itemCopia).then(() => {
                this.$emit('guardado', itemCopia.referencia_id)
                this.$store.commit('snackbar', {color: 'success', message: `El registro se guardo correctamente.`})
                this.close()
              }).catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar registro.`, error: error})
              })
            }
          })
        }
    }
}
</script>

<style>

</style>
