<template>
  <v-col cols="12" class="py-0">
    <c-chip-filters
        v-for="(tag, keytag) in tags.estados"
        :key="`tag${keytag}`"
        :text="tag"
        subtitle="Estado"
        @close="closeTag(keytag, 'estados')"
    />
    <c-chip-filters
        v-for="(tag, keytag) in tags.tiposOrigen"
        :key="`tagTo${keytag}`"
        :text="tag"
        subtitle="Tipo Origen"
        @close="closeTag(keytag, 'tiposOrigen')"
    />
    <c-chip-filters
        v-if="tags.codigo_prestador_origen"
        :text="ref_ipss && ref_ipss.length && ref_ipss.find(x => x.id === tags.codigo_prestador_origen) ? ref_ipss.find(x => x.id === tags.codigo_prestador_origen).nombre : ''"
        key="ipsOrigen"
        subtitle="IPS Origen"
        @close="closeTag('ipsOrigen', 'ipsOrigen')"
    />
    <c-chip-filters
        v-if="tags.eps_id"
        :text="ref_epss && ref_epss.length && ref_epss.find(x => x.id === tags.eps_id) ? ref_epss.find(x => x.id === tags.eps_id).nombre : ''"
        key="eps"
        subtitle="EPS"
        @close="closeTag('eps', 'eps')"
    />
    <c-chip-filters
        v-for="(tag, keytag) in tags.modServicios"
        :key="`tagMs${keytag}`"
        :text="ref_modalidadesServicio && ref_modalidadesServicio.length && ref_modalidadesServicio.find(x => x.id === tag) ? ref_modalidadesServicio.find(x => x.id === tag).tipo : ''"
        :subtitle="`Modalidad Servicio ${ref_modalidadesServicio.find(x => x.id === tag).modalidad}`"
        @close="closeTag(keytag, 'modServicios')"
    />
    <c-chip-filters
        v-if="tags.regimen"
        :text="tags.regimen"
        key="tipoAfiliacion"
        subtitle="Tipo Afiliación"
        @close="closeTag('tipoAfiliacion', 'regimen')"
    />
    <c-chip-filters
        v-if="tags.fecha_orden && tags.fecha_orden.length"
        :text="`Desde ${moment(tags.fecha_orden[0]).format('DD/MM/YYYY')} hasta ${moment(tags.fecha_orden[1]).format('DD/MM/YYYY')}`"
        key="fechaOrden"
        subtitle="Fecha de Orden"
        @close="closeTag('fechaOrden', 'orden')"
    />
    <c-chip-filters
        v-if="tags.fecha_solicitud && tags.fecha_solicitud.length"
        :text="`Desde ${moment(tags.fecha_solicitud[0]).format('DD/MM/YYYY')} hasta ${moment(tags.fecha_solicitud[1]).format('DD/MM/YYYY')}`"
        key="fechaSolicitud"
        subtitle="Fecha de Solicitud"
        @close="closeTag('fechaSolicitud', 'solicitud')"
    />
    <c-chip-filters
        v-if="tags.fecha_ultima_gestion && tags.fecha_ultima_gestion.length"
        :text="`Desde ${moment(tags.fecha_ultima_gestion[0]).format('DD/MM/YYYY')} hasta ${moment(tags.fecha_ultima_gestion[1]).format('DD/MM/YYYY')}`"
        key="fechaGestion"
        subtitle="Fecha de Ultima Gestión"
        @close="closeTag('fechaGestion', 'gestion')"
    />
  </v-col>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'TagsFilters',
  props: {
    tags: {
      type: [Object, Array]
    }
  },
  computed: {
      ...mapGetters([
        'ref_epss',
        'ref_ipss',
        'ref_modalidadesServicio'
      ])
  },
  methods: {
    closeTag(keytag, type) {
      if(type === 'estados'){
          this.tags.estados.splice(keytag, 1)
      }
      if(type === 'regimen'){
          this.tags.regimen = null
      }
      if(type === 'modServicios'){
          this.tags.modServicios.splice(keytag, 1)
      }
      if(type === 'eps'){
          this.tags.eps_id = null
      }
      if(type === 'ipsOrigen'){
          this.tags.codigo_prestador_origen = null
      }
      if (type === 'tiposOrigen') {
          this.tags.tiposOrigen.splice(keytag, 1)
      }
      if (type === 'orden') {
          this.tags.fecha_orden = []
      }
      if (type === 'solicitud') {
          this.tags.fecha_solicitud = []
      }
      if (type === 'gestion') {
          this.tags.fecha_ultima_gestion = []
      }

      this.$emit('change')
    }
  }
}
</script>

<style scoped>

</style>
