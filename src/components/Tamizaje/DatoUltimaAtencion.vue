<template>
  <c-tooltip
      top
      :tooltip="moment(tamizaje.ultimo_seguimiento || tamizaje.created_at).format('DD/MM/YYYY HH:mm')"
  >
    <v-chip
        class="elevation-2"
        label
        :color="['Ninguno', 'Fallecido', 'Recuperado'].find(x => x === tamizaje.estado_afectacion) ? 'primary' : moment().diff(moment(tamizaje.ultimo_seguimiento || tamizaje.created_at), 'hours') > 24 ? 'error' : 'success darken-1'"
    >
      {{ moment.duration(-moment().diff(moment(tamizaje.ultimo_seguimiento || tamizaje.created_at), 'hours', true), "hours").humanize(true) }}
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
        }
    }
</script>

<style scoped>

</style>