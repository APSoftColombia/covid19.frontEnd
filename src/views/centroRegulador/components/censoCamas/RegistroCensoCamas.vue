<template>
  <v-dialog
      persistent
      v-model="dialog"
      max-width="620"
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
            <v-subheader class="title">Adultos</v-subheader>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_adu_uci"
                  label="UCI"
                  name="UCI"
                  vid="UCI Adultos"
                  min="0"
                  step="1"
                  rules="required|min:0|integer"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_adu_uci_covid"
                  label="UCI COVID"
                  name="UCI COVID"
                  vid="UCI COVID Adultos"
                  min="0"
                  rules="required|min:0|integer"
                  :clearable="false"
              />
            </v-col>
            <v-subheader class="title">Neonatal</v-subheader>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_neo_uci"
                  label="UCI"
                  name="UCI"
                  vid="UCI Neonatal"
                  min="0"
                  step="1"
                  rules="required|min:0|integer"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_neo_uci_covid"
                  label="UCI COVID"
                  name="UCI COVID"
                  vid="UCI COVID Neonatal"
                  min="0"
                  rules="required|min:0|integer"
                  :clearable="false"
              />
            </v-col>
            <v-subheader class="title">Pediatría</v-subheader>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_ped_uci"
                  label="UCI"
                  name="UCI"
                  vid="UCI Pediatría"
                  min="0"
                  step="1"
                  rules="required|min:0|integer"
                  :clearable="false"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <c-number
                  v-model="item.camas_ped_uci_covid"
                  label="UCI COVID"
                  name="UCI COVID"
                  vid="UCI COVID Pediatría"
                  min="0"
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
      camas_adu_uci_covid: null,
      camas_neo_uci: null,
      camas_neo_uci_covid: null,
      camas_ped_uci: null,
      camas_ped_uci_covid: null,
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
