<template>
  <c-tooltip
      top
      :tooltip="[moment(tamizaje.ultimo_seguimiento || tamizaje.created_at).format('DD/MM/YYYY HH:mm'), diferencia > 24 ? `(${calculaEdad(tamizaje.ultimo_seguimiento || tamizaje.created_at, true).stringDate})` : null].filter(x => x).join(' ')"
  >
    <v-chip
        class="elevation-2"
        label
        :color="['Ninguno', 'Fallecido', 'Recuperado'].find(x => x === tamizaje.estado_afectacion) ? 'primary' : diferencia > 24 ? 'error' : 'success darken-1'"
    >
      {{ moment.duration(-diferencia, "hours").humanize(true) }}
    </v-chip>
  </c-tooltip>
</template>

<script>
    export default {
        name: 'DatoUltimaAtencion',
        props: {
            tamizaje: {
                type: Object,
                Default: null
            }
        },
      computed: {
          diferencia() {
            return this.moment().diff(this.moment(this.tamizaje.ultimo_seguimiento || this.tamizaje.created_at), 'hours')
          }
      }
    }
</script>

<style scoped>

</style>