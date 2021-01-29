<template>
  <div>
    <v-simple-table dense class="tablaseguimientos" fixed-header>
      <template v-slot:default>
        <thead>
        <tr>
          <th>No.</th>
          <th>Realizado por</th>
          <th>Observaciones / Valoración</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(evolucion, indexEvolucionTable) in evoluciones" :key="`evolución${evolucion.id}`">
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn fab :color="evolucion.fallida ? 'error' : 'primary'" small dark v-on="on"
                       @click="dialogDetalle(evolucion)">
                  {{ evolucion.numero }}
                </v-btn>
              </template>
              <span>Ver Detalle</span>
            </v-tooltip>
          </td>
          <td>
            <v-list-item class="pa-0">
              <v-list-item-action class="mr-2">
                <v-tooltip top v-if="evolucion.lugar_evolucion">
                  <template v-slot:activator="{on}">
                    <v-avatar class="white--text" size="40" color="deep-purple" v-on="on">
                      <v-icon>
                        fas
                        fa-{{ evolucion.lugar_evolucion.id === 3 ? 'hospital' : evolucion.lugar_evolucion.id === 2 ? 'clinic-medical' : 'phone-alt' }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <span>{{ evolucion.lugar_evolucion.id === 3 ? 'Atención en ' : '' }}{{ evolucion.lugar_evolucion.orden }}</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content class="pa-0">
                <v-list-item-subtitle class="font-weight-black">
                  {{ evolucion.user ? evolucion.user.name : 'No registra médico' }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ evolucion.created_at ? moment(evolucion.created_at).format('DD/MM/YYYY HH:mm') : '' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </td>
          <td :style="'white-space: inherit !important;'">
            <p class="ma-0">{{ evolucion.observaciones }}</p>
          </td>
          <td class="text-center">
            <v-tooltip top v-if="indexEvolucionTable === 0 && permisos.seguimientoPsicologicoEditar">
              <template v-slot:activator="{ on }">
                <v-btn fab color="orange" small dark v-on="on"
                       @click="$emit('editarEvolucion', evolucion.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar Seguimiento</span>
            </v-tooltip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <dialog-detalle-evolucion ref="dialogDetalle" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import DialogDetalleEvolucion from 'Views/covid19/tamizaje/seguimientosPsicologicos/DialogDetalleEvolucion'
export default {
  name: 'DatosEvolucionTabla',
  props: {
    evoluciones: {
      type: Array,
      default: () => []
    }
  },
  components: {
    DialogDetalleEvolucion
  },
  data: () => ({}),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'ordenesMedicas'
    ])
  },
  methods: {
    dialogDetalle(evolucion) {
      this.$refs.dialogDetalle.open(evolucion)
    }
  }
}
</script>

<style scoped>
.tablaseguimientos .v-data-table table thead tr td, .v-data-table table thead tr th, .v-data-table table tbody tr td, .v-data-table table tbody tr th, .v-data-table table tfoot tr td, .v-data-table table tfoot tr t {
  height: 2rem !important;
  padding: 3px 5px !important;
}

.tablaseguimientos .v-data-table td, .v-data-table th {
  padding: 0 8px !important;
}
</style>