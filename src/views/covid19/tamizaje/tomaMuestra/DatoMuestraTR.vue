<template>
  <tr v-if="toma">
    <td>
      <v-avatar color="primary" size="40" class="white--text">
        {{ numero }}
      </v-avatar>
    </td>
    <td>
      <v-list-item class="pa-0" v-if="toma && toma.user">
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{ toma.user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ toma.user.email }}</v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ toma.created_at ? `Asignada: ${moment(toma.created_at).format('DD/MM/YYYY HH:mm')}` : '' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0" v-if="toma && toma.prestador">
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{ toma.prestador.nombre }}</v-list-item-title>
          <v-list-item-subtitle>{{ [toma.prestador.codigohabilitacion ? `CH:${toma.prestador.codigohabilitacion}` : null, toma.prestador.telefono ? `Tel:${toma.prestador.telefono}` : null].filter(x => x).join(', ') }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ [toma.prestador.direccion, toma.prestador.nompio, toma.prestador.nomdepto].filter(x => x).join(', ') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0" v-if="toma && toma.laboratorio_destino">
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{ toma.laboratorio_destino.laboratorio }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0" v-if="toma && toma.user_prueba">
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{ toma.usuario_prueba.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ toma.usuario_prueba.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-list-item class="pa-0" v-if="toma && toma.user_prueba">
        <v-list-item-content class="pa-0">
          <v-list-item-title class="body-1">{{toma.toma_prueba ? 'Tomada: ' + this.moment(toma.fecha_toma_prueba).format('DD/MM/YYYY HH:mm') : !toma.toma_prueba && toma.toma_prueba !== null ? 'No Tomada: ' + this.moment(toma.updated_at).format('DD/MM/YYYY HH:mm') : ''}}</v-list-item-title>
          <v-list-item-subtitle class="body-2">{{!toma.toma_prueba && toma.toma_prueba !== null ? toma.razon_no_toma : ''}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </td>
    <td>
      <v-tooltip top v-if="puedeCrear && autorizado && !toma.fecha_toma_prueba">
        <template v-slot:activator="{on}">
          <v-btn icon color="red" v-on="on" @click.stop="marcarFecha(toma)">
            <v-icon>mdi-calendar-plus</v-icon>
          </v-btn>
        </template>
        <span>Marcar Fecha Toma</span>
      </v-tooltip>
    </td>
  </tr>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'DatoMuestraTR',
  props: {
    toma: {
      type: Object,
      default: null
    },
    numero: {
      type: [String, Number],
      default: 0
    },
    puedeCrear: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    autorizado () {
      return this && this.getUser && this.toma && (this.toma.cod_habilitacion_ips === this.getUser.cod_ips)
    }
  },
  methods: {
    marcarFecha(item) {
      this.$emit('marcarFecha', item)
    }
  }
}
</script>

<style scoped>

</style>