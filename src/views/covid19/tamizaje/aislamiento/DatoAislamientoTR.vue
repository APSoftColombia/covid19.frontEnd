<template>
  <tr v-if="aislamiento">
    <td>
      <v-avatar color="primary" size="40" class="white--text">
        {{ numero }}
      </v-avatar>
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle>Tipo: {{ aislamiento.tipo }}</v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="primary--text">Individual:</a>
              </template>
              <span>Habitación Individual</span>
            </v-tooltip>
            {{ aislamiento.individual === null ? '' : aislamiento.individual ? 'SI' : 'NO' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      {{ aislamiento.ambito === 'Otro' ? aislamiento.otro_ambito : aislamiento.ambito }}
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle>
            {{ aislamiento.fecha_ingreso ? `Ingreso: ${moment(aislamiento.fecha_ingreso).format('DD/MM/YYYY')}` : '' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ aislamiento.fecha_egreso ? `Egreso: ${moment(aislamiento.fecha_egreso).format('DD/MM/YYYY')}` : '' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="primary--text">Venti:</a>
              </template>
              <span>Soporte Ventilatorio</span>
            </v-tooltip>
            {{ ultimoSeguimiento ? ultimoSeguimiento.soporte_ventilatorio : '' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <a v-on="on" class="primary--text">Hemodi:</a>
              </template>
              <span>Soporte Hemodinámico</span>
            </v-tooltip>
            {{ ultimoSeguimiento && ultimoSeguimiento.soporte_hemodinamico !== null ? ultimoSeguimiento.soporte_hemodinamico ? 'SI' : 'NO' : '' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle>
            {{ aislamiento.created_at ? `Creado: ${moment(aislamiento.created_at).format('DD/MM/YYYY')}` : '' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>{{
              ultimoSeguimiento && ultimoSeguimiento.updated_at ? `Actualizado: ${moment(ultimoSeguimiento.updated_at).format('DD/MM/YYYY')}` : ''
            }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0 text-center">
          <v-list-item-subtitle v-if="aislamiento.ordenado_por">{{ aislamiento.ordenado_por }}</v-list-item-subtitle>
          <v-list-item-subtitle v-if="aislamiento.prestador">{{ aislamiento.prestador.nombre }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0">
        <v-list-item-content class="pa-0" v-if="ultimoSeguimiento && ultimoSeguimiento.user">
          <v-list-item-title>{{ ultimoSeguimiento.user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ ultimoSeguimiento.user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="pa-0" v-else-if="aislamiento && aislamiento.user">
          <v-list-item-title>{{ aislamiento.user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ aislamiento.user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-btn icon color="info" v-on="on" @click="verDetalle(aislamiento)">
            <v-icon>mdi-file-find</v-icon>
          </v-btn>
        </template>
        <span>Ver Detalle</span>
      </v-tooltip>
      <v-tooltip
          v-if="permisos.aislamientoEditar"
          top
      >
        <template v-slot:activator="{on}">
          <v-btn icon color="info" v-on="on" @click="editar(aislamiento)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-btn icon color="info" v-on="on" @click.stop="generarPDF(aislamiento)">
            <v-icon>fas fa-file-pdf</v-icon>
          </v-btn>
        </template>
        <span>Descargar PDF</span>
      </v-tooltip>
    </td>
  </tr>
</template>

<script>
import axios from "axios";

export default {
  name: 'DatoAislamientoTR',
  props: {
    aislamiento: {
      type: Object,
      default: null
    },
    numero: {
      type: [String, Number],
      default: 0
    },
    nombre: {
      type: String,
      default: null
    }
  },
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    },
    ultimoSeguimiento() {
      return this && this.aislamiento && this.aislamiento.seguimientos && this.aislamiento.seguimientos.length ? this.aislamiento.seguimientos[0] : null
    }
  },
  methods: {
    verDetalle(item) {
      this.$emit('verdetalle', item)
    },
    editar(item) {
      this.$emit('editar', item)
    },
    generarPDF(aislamiento) {
      const apiAxios = axios.create()
      apiAxios.defaults.baseURL = `http://aps.backend.test/api`
      apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
      this.axios({
        url: `pdf-aislamiento/${aislamiento.id}?download=${true}`, //your url
        method: 'GET',
        responseType: 'blob', // important
      }).then(async response => {
        const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {type: 'application/pdf'}))
        await window.open(fileURL, '_blank')
      }).catch(error => {
        this.$store.commit('snackbar', {color: 'error', message: 'al descargar el PDF', error: error})
      })
    },
  }
}
</script>

<style scoped>

</style>