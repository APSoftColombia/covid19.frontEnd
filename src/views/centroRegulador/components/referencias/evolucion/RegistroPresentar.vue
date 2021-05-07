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
          Presentación de Paciente
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
                  v-model="item.fecha"
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
              <buscador-ips
                  label="IPS"
                  v-model="prestadorTemporal"
                  @inputObject="val => asignarIps(val)"
              />
              <div>
                <v-simple-table
                    fixed-header
                    height="400px"
                    v-if="item.prestadores && item.prestadores.length"
                >
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left">
                        Prestadores
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(prestador_origen, indexPrestador) in item.prestadores" :key="`tr${indexPrestador}`">
                      <td>
                        <v-list-item class="pa-0">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ prestador_origen.nombre }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="body-2">
                              {{ [prestador_origen.direccion, prestador_origen.nompio, prestador_origen.nomdepto].filter(x => x).join(', ') }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle class="body-2">
                              <template v-if="prestador_origen.telefono">
                                <v-icon small>mdi-phone</v-icon>
                                {{ prestador_origen.telefono }}
                              </template>

                              <template v-if="prestador_origen.email">
                                <v-icon small>mdi-email</v-icon>
                                {{ prestador_origen.email }}
                              </template>
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn
                                color="error"
                                depressed
                                fab
                                x-small
                                @click="item.prestadores.splice(indexPrestador,1)"
                            >
                              <v-icon class="white--text">mdi-close</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <template v-else>
                    <div class="text-center mt-2 mb-3">
                        <p>Sin prestadores seleccionados</p>
                    </div>
                </template>
              </div>
            </v-col>
            <v-col cols="12">
              <c-text-area
                  label="Observaciones"
                  v-model="item.observaciones"
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
            @click="save"
        >
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import BuscadorIps from 'Views/centroRegulador/components/referencias/BuscadorIps'
export default {
  name: 'RegistroPresentar',
  props: {
    referencia: {
      type: Object,
      default: null
    },
    accion: {
      type: Object,
      default: null
    }
  },
  components: {
    BuscadorIps
  },
  data: () => ({
    dialog: false,
    loading: false,
    item: null,
    prestadorTemporal: null,
    makeItem: {
      id: null,
      referencia_id: null,
      fecha: null,
      hora: null,
      accion: null,
      observaciones: null,
      user_id: null,
      presentacion_id: null,
      traslado_id: null,
      prestadores: []
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
    asignarIps(ips) {
      if(ips && !this.item.prestadores.find(x => x.codigohabilitacion === ips.codigohabilitacion)) {
        this.item.prestadores.splice(0,0,this.clone(ips))
        this.$nextTick(() => {
          this.prestadorTemporal = null
        })
      }
    },
    asignar() {
      if(this.referencia) {
        this.item = this.clone(this.makeItem)
        this.item.fecha = this.moment().format('YYYY-MM-DD')
        this.item.hora = this.moment().format('HH:mm')
        this.item.referencia_id = this.referencia.id
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
    async save() {
      const validacionForm = await this.$refs.formItem.validate()
      const validacionPrestadores = this.item.prestadores.length
      if(validacionForm) {
        if(validacionPrestadores) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          itemCopia.fecha = `${itemCopia.fecha} ${itemCopia.hora}`
          itemCopia.prestadores = itemCopia.prestadores.map(x => x.codigohabilitacion)
          this.axios.post(`presentacion-referencia/${itemCopia.referencia_id}`, itemCopia)
              .then(() => {
                this.$emit('guardado', itemCopia.referencia_id)
                this.$store.commit('snackbar', {color: 'success', message: `La presentación se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la presentación.`, error: error})
              })
        } else {
          this.$store.commit('snackbar', {color: 'warning', message: `No se han seleccionado prestadores para presentar al paciente.`})
        }
      }
    }
  }
}
</script>
