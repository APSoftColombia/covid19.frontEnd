<template>
  <v-expansion-panels
      v-model="panel"
      multiple
      style="z-index: 0 !important;"
  >
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon
                color="teal"
                large
            >
              fas fa-history
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <h6 class="mb-0"/>
            </v-list-item-title>
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                Historial de Cambios
              </h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Fecha</th>
              <th class="text-left">Valores Anteriores</th>
              <th class="text-left">Nuevos Valores</th>
              <th class="text-left">Responsable</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(item, indice) in audits">
              <tr
                  :key="item.id"
                  class="tr-tables"
              >
                <td style="height: 40px !important;">
                  <v-list-item>
                    <v-list-item-content style="display: grid !important;">
                      <v-list-item-title class="body-2">Fecha: {{
                          moment(item.created_at).format('DD/MM/YYYY HH:mm')
                        }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-truncate">Tipo:
                        {{ item.event == 'updated' ? 'Actualización' : item.event == 'created' ? 'Creacion' : '' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td style="height: 40px !important;">
                  <v-expansion-panel :class="`${(indice % 2) === 0 ? 'white' : 'grey lighten-5'}`" focus>
                    <v-expansion-panel-header></v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <template v-for="(value, key, index) in item.old_values">
                        <p :key="index">{{ key }}: {{ value ? value : '' }}{{
                            putComa(index, item.old_values.length)
                          }}</p>
                      </template>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </td>
                <td style="height: 40px !important;">
                  <v-expansion-panel :class="`${(indice % 2) === 0 ? 'white' : 'grey lighten-5'}`" focus>
                    <v-expansion-panel-header></v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <template v-for="(value, key, index) in item.new_values">
                        <p :key="index">{{ key }}: {{ value ? value : '' }}{{
                            putComa(index, item.old_values.length)
                          }}</p>
                      </template>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </td>
                <td style="height: 40px !important;">{{ item.tags.split(',').join(' ') }}</td>
              </tr>
            </template>
            </tbody>
          </template>
        </v-simple-table>
        <template v-if="audits && !audits.length">
          <v-row>
            <div class="grey--text mx-auto mt-2">
              No hay registros para mostrar
            </div>
          </v-row>
        </template>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'HistorialDeCambios',
  props: {
    abierto: {
      type: Boolean,
      default: false
    },
    audits: {
      type: [Object, Array],
      default: null
    }
  },
  watch: {
    abierto: {
      handler(val) {
        if (this) {
          this.panel = val ? [0] : []
        }
      },
      immediate: true
    },
  },
  data: () => ({
    panel: [],
    responsable: []
  }),
  methods: {
    putComa(index, length) {
      if (index < length) {
        return ', '
      }
      return ''
    }
  }
}
</script>

<style scoped>
.tr-tables:hover {
  background: none !important;
}
</style>