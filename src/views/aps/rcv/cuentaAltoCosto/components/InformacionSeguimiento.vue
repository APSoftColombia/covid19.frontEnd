<template>
  <v-expansion-panels v-if="seguimiento" v-model="panel" multiple style="z-index: 0 !important;">
      <v-expansion-panel>
          <v-expansion-panel-header class="py-1 pl-0">
              <v-list-item>
                  <v-list-item-content class="pa-0">
                      <v-list-item-title class="grey--text fs-12 fw-normal">
                          <h4 class="ma-0">Información del seguimiento</h4>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-divider class="ma-0"></v-divider>
              <v-row no-gutters>
                <template v-for="(item, indexItem) in datos">
                  <v-col cols="12" :md="item.colmd" :lg="item.collg" xl="3" :key="`col${indexItem}`">
                    <v-list two-line class="notification-wrap">
                      <v-list-item>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{item.label}}</v-list-item-subtitle>
                          <v-list-item-title><h6 class="mb-0">{{item.body}}</h6></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </template>
              </v-row>
          </v-expansion-panel-content>
      </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "InformacionSeguimiento",
  props: {
    abierto: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    seguimiento: {
      type: [Object, Array],
      default: null
    }
  },
  data: () => ({
    datos: [],
    panel: []
  }),
  watch: {
    abierto: {
      handler (val) {
        if (this) {
            this.panel = val ? [0] : []
        }
      },
      immediate: true
    },
    seguimiento: {
        handler (val) {
            val && this.assign()
        },
        deep: true,
        immediate: true
    }
  },
  methods: {
    assign(){
      this.datos.push(
          {
            label: 'IPS del seguimiento',
            body: this.seguimiento.ips_seguimiento ? this.seguimiento.ips_seguimiento.nombre : '',
            colmd: '4',
            collg: '4'
          }
      )
    },
    close(){
      this.datos = []
    }
  }
}
</script>

<style scoped>

</style>
