<template>
  <v-dialog
      v-model="dialog"
      max-width="820"
      scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          small
          color="info"
          v-bind="attrs"
          v-on="on"
      >
        <v-icon left>mdi-comment-text</v-icon>
        Ver Bitácoras
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="info" elevation="0">
        <v-icon left>mdi-comment-text</v-icon>
        <v-toolbar-title>
          <v-list-item-content>
            <v-list-item-title>Bítacoras</v-list-item-title>
            <v-list-item-subtitle>{{ nombreIPS }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="height: 100%;">
        <v-list>
          <template
              v-for="(bitacora, indexBitacora) in item.bitacoras"
          >
            <v-card
                :key="`bitacora${indexBitacora}`"
                class="my-4"
                tile
                flat
            >
              <v-list-item-subtitle
                  class="body-2 text--primary"
              >
                <div class="font-weight-normal">
                  <strong>{{ bitacora.accion }}</strong>
                </div>
                <div>{{ bitacora.fecha ? moment(bitacora.fecha).format('DD/MM/YYYY [a las] HH:mm') : '' }}</div>
              </v-list-item-subtitle>
              <p class="ma-0">{{ bitacora.observaciones }}</p>
              <v-row
                  class="mx-2"
                  align="center"
                  justify="end"
              >
                <span class="caption grey--text">Realizo: {{ bitacora.usuario ? bitacora.usuario.name.toLowerCase() : '-' }}</span>
              </v-row>
            </v-card>
            <v-divider :key="`dividerBit${indexBitacora}`" />
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VerBitacoras',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    nombreIPS () {
      return this.item?.ips_presentacion?.nombre_sede || this.item?.ips_traslado?.nombre_sede || ''
    }
  },
  methods: {
    close() {
      this.dialog = false
    }
  }
}
</script>
