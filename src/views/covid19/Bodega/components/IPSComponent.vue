<template>
  <v-list-item class="pa-0">
    <v-list-item-content class="pa-0" v-if="prestadores && prestadores.length && this.codigo_ips">
      <v-list-item-title :class="`body-2 text-truncate`">
        {{ prestadores.find(x => x.codigohabilitacion === codigo_ips).nombre }}
      </v-list-item-title>
      <v-list-item-subtitle :class="`body-2 text-truncate`">
        {{ `Cod. Habilitación: ${this.codigo_ips}` }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content v-else>
      <v-list-item-title>
        {{ `No aplica` }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "IPSComponent",
  props: {
    codigo_ips: {
      type: String,
      required: false
    },
    prestadores: {
      type: Array,
      required: false
    }
  },
  data: () => ({
  }),
  computed: {
  },
  created() {
    // this.getIps();
  },
  methods: {
    getIps() {
      this.axios.get(`prestadores?filter[vacunador_covid]=1`)
          .then(response => {
              this.prestadores = response.data
          }).catch(e => {
          this.$store.commit('snackbar', {color: 'error', message: `al recuperar las IPS que vacunan covid.`, error: e})
      })
    },
  }
};
</script>

<style scoped>
</style>