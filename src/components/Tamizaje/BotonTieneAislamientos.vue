<template>
  <div>
    <v-tooltip top v-if="aislamiento">
      <template v-slot:activator="{ on }">
        <v-btn
            v-on="on"
            class="white--text"
            color="teal"
            @click="openAislamientoDetail"
        >
          <v-icon>fas fa-house-user</v-icon>
        </v-btn>
      </template>
      <span>Aislamiento Activo</span>
    </v-tooltip>
    <detalle-aislamiento
        ref="detalleAislamiento"
        :aislamiento="aislamientoC"
    ></detalle-aislamiento>
  </div>
</template>

<script>
  const DetalleAislamiento = () => import('Views/covid19/tamizaje/aislamiento/DetalleAislamiento')
  export default {
    name: "BotonTieneAislamientos",
    props: {
      aislamiento: {
        type: Object,
        Default: null
      }
    },
    computed: {
      aislamientoC(){
        return this.aislamiento
      }
    },
    components: {
      DetalleAislamiento
    },
    data: () => ({

    }),
    methods: {
      openAislamientoDetail(){
        this.$refs.detalleAislamiento.open()
      },
    }
  }
</script>

<style scoped>

</style>