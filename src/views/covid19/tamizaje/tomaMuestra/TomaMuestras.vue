<template>
  <v-card flat>
    <v-toolbar dark color="indigo" dense>
      <v-icon left>fas fa-vial</v-icon>
      <v-toolbar-title>Tomas de Muestras</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="puedeCrearNueva">
        <v-tooltip top v-if="$vuetify.breakpoint.xsOnly">
          <template v-slot:activator="{on}">
            <v-btn dark @click="agregarTomaMuestra" icon color="indigo darken-3" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar Toma de Muestra</span>
        </v-tooltip>
        <v-btn v-else dark @click="agregarTomaMuestra" color="indigo darken-3" class="mr-2">
          <v-icon left>mdi-plus</v-icon>
          Tomar Muestra
        </v-btn>
      </template>
    </v-toolbar>
    <v-card-text class="text-center font-lg" v-if="tamizaje.asignacion_pruebas && !tamizaje.asignacion_pruebas.length">
      No registra asignaciones de toma de muestra
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" class="pt-0 ma-0">
        <datos-tomas-tabla
            @marcarFecha="item => marcarFecha(item)"
            :tomas="tomasVisibles"
            :puede-crear="puedeCrear"
        />
      </v-col>
    </v-row>
    <tomador-muestra
        :tamizaje="tamizaje"
        ref="tomadormuestra"
        @guardado="tomaRegistrada"
    />
  </v-card>
</template>

<script>
import DatosTomasTabla from 'Views/covid19/tamizaje/tomaMuestra/DatosTomasTabla'
import {mapGetters} from "vuex";
import TomadorMuestra from "./TomadorMuestra";

export default {
  name: 'TomaMuestra',
  components: {
    TomadorMuestra,
    DatosTomasTabla
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    tomasVisibles() {
      if (this && this.tamizaje && this.tamizaje.asignacion_pruebas && this.tamizaje.asignacion_pruebas.length && this.getUser) {
        if (this.getUser.cod_ips) {
          return this.tamizaje.asignacion_pruebas.filter(x => x.cod_habilitacion_ips === this.getUser.cod_ips)
        } else {
          return this.tamizaje.asignacion_pruebas
        }
      }
      return []
    },
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    puedeCrearNueva() {
      return this && (this.permisos && this.permisos.tomaMuestraCrear) && (this.getUser && this.getUser.cod_ips) && this.editable && (this.tamizaje && this.tamizaje.asignacion_pruebas && ((!this.tamizaje.asignacion_pruebas.length) || ((this.tamizaje.asignacion_pruebas.length) && this.tamizaje.asignacion_pruebas[0].fecha_toma_prueba)))
    },
    puedeCrear() {
      return this && this.permisos && this.permisos.tomaMuestraCrear && this.editable
    }
  },
  watch: {},
  methods: {
    marcarFecha(item) {
      this.$refs.tomadormuestra.open(item)
    },
    agregarTomaMuestra() {
      this.$refs.tomadormuestra.open()
    },
    tomaRegistrada() {
      this.$emit('change')
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 0 !important;
}
</style>