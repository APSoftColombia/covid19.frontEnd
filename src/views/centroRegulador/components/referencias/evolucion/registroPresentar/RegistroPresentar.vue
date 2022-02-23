<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
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
            <v-col cols="12" md="4">
              <v-card height="100%">
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <c-date-manual
                          v-model="item.fecha"
                          label="Fecha"
                          name="Fecha"
                          rules="required"
                          :max="moment().format('YYYY-MM-DD')"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <c-time
                          v-model="item.hora"
                          label="Hora"
                          name="Hora"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" class="mb-4">
                      <div>
                        <v-simple-table
                            id="table-ipss"
                            fixed-header
                            v-if="item.prestadores && item.prestadores.length"
                        >
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th class="text-left">
                                Prestadores seleccionados
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(prestador_origen, indexPrestador) in item.prestadores" :key="`tr${indexPrestador}`">
                              <td class="pa-0">
                                <v-list-item class="px-1">
                                  <v-list-item-content>
                                    <v-list-item-subtitle class="body-2">
                                      {{ prestador_origen.sede_nombre }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle class="caption">
                                      {{ [prestador_origen.direccion, prestador_origen.muni_nombre, prestador_origen.depa_nombre].filter(x => x).join(', ') }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle class="caption">
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
                          rules="required"
                          name="observaciones"
                          :auto-grow="false"
                          no-resize
                          :clearable="false"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions style="justify-content: space-evenly !important;">
                  <v-btn
                      text
                      @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                      :color="accion.color"
                      class="white--text"
                      @click="save"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="12" md="8">
              <v-card height="100%">
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12">
                      <div id="table-refprestadores">
                        <c-rows
                            v-if="item"
                            name="rowsRefPrestadores"
                            route="prestadores-especialidad"
                            :make-headers="itemsHeaders"
                            :initial-run="true"
                            :footer-pagination="false"
                            single-select
                            :view-perpage-control="false"
                            :view-columns-control="false"
                            advance-filters
                            filters-title="Filtros de prestadores"
                            filters-max-width="600"
                        >
                          <registro-presentar-filters slot="filters"/>
                          <template v-slot:filterstags="{ tags }">
                            <registro-presentar-filters-tags :tags="tags"/>
                          </template>
                          <template v-slot:rows="{ items, loading, headers }">
                            <v-data-table
                                :headers="headers"
                                :items="items"
                                :loading="loading"
                                loading-text="Cargando... por favor espere"
                                class="elevation-1"
                                hide-default-footer
                                disable-pagination
                                show-select
                                item-key="cogigo_sede"
                                v-model="item.prestadores"
                                dense
                            >
                              <template v-slot:item.name="{ item }">
                                <v-list-item-content>
                                  <v-list-item-subtitle class="caption">{{ item.sede_nombre }}</v-list-item-subtitle>
                                  <v-list-item-subtitle class="caption">{{ item.cogigo_sede }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                              <template v-slot:item.location="{ item }">
                                <v-list-item-content>
                                  <v-list-item-subtitle class="caption">{{ item.direccion }}</v-list-item-subtitle>
                                  <v-list-item-subtitle class="caption">{{ item.muni_nombre }}, {{ item.depa_nombre }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                            </v-data-table>
                          </template>
                        </c-rows>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
        <app-section-loader :status="loading"/>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiBloodBag } from '@mdi/js'
import RegistroPresentarFilters from "./RegistroPresentarFilters";
import RegistroPresentarFiltersTags from "./RegistroPresentarFiltersTags";
export default {
  name: 'RegistroPresentar',
  components: {RegistroPresentarFiltersTags, RegistroPresentarFilters},
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
  data: () => ({
    iconBlood: mdiBloodBag,
    dialog: false,
    loading: false,
    selecteds: [],
    itemsHeaders: [
      {
        text: 'Prestador',
        value: 'name',
        columnSelectable: false
      },
      {
        text: 'Ubicación',
        sortable: true,
        value: 'location'
      }
    ],
    item: null,
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
  created() {
    this.axios.get('hemocomponentes')
  },
  methods: {
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
          itemCopia.prestadores = itemCopia.prestadores.map(x => x.cogigo_sede)
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

<style>
#table-ipss .v-data-table__wrapper {
  height: calc(100vh - 416px) !important;
}

#table-refprestadores {
  /*height: calc(100vh - 220px) !important;*/
  /*overflow-y: auto !important;*/
}
</style>