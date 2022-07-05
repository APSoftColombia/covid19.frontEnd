<template>
  <v-dialog
      persistent
      v-model="dialog"
      max-width="720"
      eager
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>mdi-file-plus</v-icon>
        <v-toolbar-title>
          Nuevo registro de censo de camas
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
        >
          <v-row dense justify="end">
            <v-col cols="12" sm="6">
              <c-date-manual
                  v-model="item.fecha_reporte"
                  label="Fecha"
                  name="Fecha"
                  rules="required"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                  v-model="item.hora_reporte"
                  label="Hora"
                  name="Hora"
                  rules="required"
              />
            </v-col>
            <template v-if="!disabledPrestador">
              <v-col cols="12">
                <c-select-complete
                    v-model="item.departamento_prestador"
                    label="Departamento IPS"
                    name="Departamento IPS"
                    :items="departamentos"
                    item-text="nombre"
                    item-value="id"
                    @change="val => item.municipio_prestador = (val && departamentos.find(x => x.id === val).municipios.find(z => z.id === item.municipio_prestador)) ? item.municipio_prestador : null"
                />
              </v-col>
              <v-col cols="12">
                <c-select-complete
                    :disabled="!item.departamento_prestador"
                    v-model="item.municipio_prestador"
                    label="Municipio IPS"
                    name="Municipio IPS"
                    :items="municipios"
                    item-text="nombre"
                    item-value="id"
                />
              </v-col>
            </template>
            <v-col cols="12" v-if="dialog">
              <buscador-ips
                  label="IPS"
                  name="IPS"
                  v-model="item.codigo_habilitacion"
                  rules="required"
                  :disabled="disabledPrestador"
                  :municipio="municipio"
                  :departamento="departamento"
              />
            </v-col>
            <v-col cols="12" class="title">Adultos</v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_adu_uci_total"
                  label="UCI Total"
                  name="UCI Total"
                  vid="UCI Adultos Total"
                  :min="item.camas_adu_uci || 0"
                  step="1"
                  :rules="`required|min:${item.camas_adu_uci || 0}|integer`"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_adu_uci"
                  label="UCI Disponible"
                  name="UCI Disponible"
                  vid="UCI Adultos Disponible"
                  min="0"
                  :max="item.camas_adu_uci_total || ''"
                  step="1"
                  :rules="`required|min:0|max:${item.camas_adu_uci_total || ''}|integer`"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_adu_uci_covid_total"
                  label="UCI COVID Total"
                  name="UCI COVID Total"
                  vid="UCI COVID Adultos Total"
                  :min="item.camas_adu_uci_covid || 0"
                  :rules="`required|min:${item.camas_adu_uci_covid || 0}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_adu_uci_covid"
                  label="UCI COVID Disponible"
                  name="UCI COVID Disponible"
                  vid="UCI COVID Adultos Disponible"
                  min="0"
                  :max="item.camas_adu_uci_covid_total || ''"
                  :rules="`required|min:0|max:${item.camas_adu_uci_covid_total || ''}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" class="title">Neonatal</v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_neo_uci_total"
                  label="UCI Total"
                  name="UCI Total"
                  vid="UCI Neonatal Total"
                  :min="item.camas_neo_uci || 0"
                  :rules="`required|min:${item.camas_neo_uci || 0}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_neo_uci"
                  label="UCI Disponible"
                  name="UCI Disponible"
                  vid="UCI Neonatal Disponible"
                  min="0"
                  :max="item.camas_neo_uci_total || ''"
                  :rules="`required|min:0|max:${item.camas_neo_uci_total || ''}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_neo_uci_covid_total"
                  label="UCI COVID Total"
                  name="UCI COVID Total"
                  vid="UCI COVID Neonatal Total"
                  :min="item.camas_neo_uci_covid || 0"
                  :rules="`required|min:${item.camas_neo_uci_covid || 0}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_neo_uci_covid"
                  label="UCI COVID Disponible"
                  name="UCI COVID Disponible"
                  vid="UCI COVID Neonatal Disponible"
                  min="0"
                  :max="item.camas_neo_uci_covid_total || ''"
                  :rules="`required|min:0|max:${item.camas_neo_uci_covid_total || ''}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" class="title">Pediatría</v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_ped_uci_total"
                  label="UCI Total"
                  name="UCI Total"
                  vid="UCI Pediatría Total"
                  step="1"
                  :min="item.camas_ped_uci || 0"
                  :rules="`required|min:${item.camas_ped_uci || 0}|integer`"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_ped_uci"
                  label="UCI Disponible"
                  name="UCI Disponible"
                  vid="UCI Pediatría Disponible"
                  min="0"
                  :max="item.camas_ped_uci_total || ''"
                  :rules="`required|min:0|max:${item.camas_ped_uci_total || ''}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_ped_uci_covid_total"
                  label="UCI COVID Total"
                  name="UCI COVID Total"
                  vid="UCI COVID Pediatría Total"
                  :min="item.camas_ped_uci_covid || 0"
                  :rules="`required|min:${item.camas_ped_uci_covid || 0}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                  v-model="item.camas_ped_uci_covid"
                  label="UCI COVID Disponible"
                  name="UCI COVID Disponible"
                  vid="UCI COVID Pediatría Disponible"
                  min="0"
                  :max="item.camas_ped_uci_covid_total || ''"
                  :rules="`required|min:0|max:${item.camas_ped_uci_covid_total || ''}|integer`"
                  step="1"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" class="title">Urgencias</v-col>
            <v-col cols="12" sm="12">
              <c-number
                  v-model="item.camas_urgencias"
                  label="General"
                  name="General"
                  vid="General"
                  min="0"
                  step="1"
                  rules="required|min:0|integer"
                  :clearable="false"
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
            color="primary"
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
import {mapGetters} from 'vuex'
export default {
  name: 'RegistroCensoCamas',
  props: {
    codigo_habilitacion: {
      type: String,
      default: ''
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BuscadorIps
  },
  data: () => ({
    loading: false,
    item: null,
    makeItem: {
      id: null,
      codigo_habilitacion: null,
      fecha_reporte: null,
      hora_reporte: null,
      camas_adu_uci: null,
      camas_adu_uci_total: null,
      camas_adu_uci_covid: null,
      camas_adu_uci_covid_total: null,
      camas_neo_uci: null,
      camas_neo_uci_total: null,
      camas_neo_uci_covid: null,
      camas_neo_uci_covid_total: null,
      camas_ped_uci: null,
      camas_ped_uci_total: null,
      camas_ped_uci_covid: null,
      camas_ped_uci_covid_total: null,
      camas_urgencias: null,
      departamento_prestador: null,
      municipio_prestador: null,
    }
  }),
  watch: {
    dialog: {
      handler(val) {
        if(val) this.assign()
      },
      immediate: false
    },
    'item.departamento_prestador': {
      handler() {
        if (this.item) {
          this.item.municipio_prestador = null
          this.item.codigo_habilitacion = null
        }
      },
      immediate: false
    },
    'item.municipio_prestador': {
      handler() {
        if (this.item) {
          this.item.codigo_prestador = null
        }
      },
      immediate: false
    }
  },
  computed: {
    municipios() {
      return this.departamentos.length && this.item.departamento_prestador && this.departamentos.find(x => x.id === this.item.departamento_prestador) ? this.departamentos.find(x => x.id === this.item.departamento_prestador).municipios : []
    },
    municipio() {
      return this.municipios.find(x => x.id === this.item.municipio_prestador) || null
    },
    departamento() {
      return this.departamentos.find(x => x.id === this.item.departamento_prestador) || null
    },
    ...mapGetters([
      'getUser',
      'departamentos'
    ]),
    disabledPrestador() {
      return !!this.getUser?.cod_ips || !!this.codigo_habilitacion
    }
  },
  created() {
    this.assign()
  },
  methods: {
    assign() {
      this.item = this.clone(this.makeItem)
      this.item.codigo_habilitacion = (this.getUser?.cod_ips || this.codigo_habilitacion || null)
      this.item.fecha_reporte = this.moment().format('YYYY-MM-DD')
      this.item.hora_reporte = this.moment().format('HH:mm')
      // setTimeout(() => {
      //   this.item.departamento_prestador = 29
      // }, 500)
    },
    close() {
      this.$refs.formItem.reset()
      this.$emit('update:dialog', false)
      this.loading = false
      this.item = this.clone(this.makeItem)
    },
    save() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          itemCopia.fecha_reporte = `${itemCopia.fecha_reporte} ${itemCopia.hora_reporte}`
          this.axios.post('camas', itemCopia)
              .then(() => {
                this.$emit('saved')
                this.$store.commit('snackbar', {color: 'success', message: 'El registro de censo fue guardado correctamente.'})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: 'al guardar el registro del censo .', error: error})
              })
        }
      })
    }
  }
}
</script>
