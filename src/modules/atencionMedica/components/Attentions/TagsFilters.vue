<template>
  <v-col cols="12" class="py-0">
    <c-chip-filters
        v-if="tags.estado_proceso"
        :text="tags.estado_proceso"
        key="Estado"
        subtitle="Estado"
        @close="closeTag('estado_proceso')"
    />
    <c-chip-filters
        v-if="tags.institucion_muestra"
        :text="labspIpss && labspIpss.length && labspIpss.find(x => x.id === tags.institucion_muestra) ? labspIpss.find(x => x.id === tags.institucion_muestra).nombre : ''"
        key="ipsOrigen"
        subtitle="IPS Origen Muestra"
        @close="closeTag('institucion_muestra')"
    />
    <c-chip-filters
        v-if="tags.eps_id"
        :text="labspEpss && labspEpss.length && labspEpss.find(x => x.id === tags.eps_id) ? labspEpss.find(x => x.id === tags.eps_id).nombre : ''"
        key="eps"
        subtitle="EPS Paciente"
        @close="closeTag('eps_id')"
    />
    <c-chip-filters
        v-if="tags.tipo_afiliacion"
        :text="tags.tipo_afiliacion"
        key="tipoAfiliacion"
        subtitle="Tipo Afiliación"
        @close="closeTag('tipo_afiliacion')"
    />
    <c-chip-filters
        v-if="tags.fechaEstudio && tags.fechaEstudio.length"
        :text="`Desde ${moment(tags.fechaEstudio[0]).format('DD/MM/YYYY')} hasta ${moment(tags.fechaEstudio[1]).format('DD/MM/YYYY')}`"
        key="fechaOrden"
        subtitle="Fecha de recepción"
        @close="closeTag('fechaEstudio')"
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
        'labspEpss',
        'labspIpss'
      ])
  },
  methods: {
    closeTag(type) {
      if(type === 'estado_proceso'){
          this.tags.estado_proceso = null
      }
      if(type === 'eps_id'){
        this.tags.eps_id = null
      }
      if(type === 'institucion_muestra'){
        this.tags.institucion_muestra = null
      }
      if(type === 'tipo_afiliacion'){
        this.tags.tipo_afiliacion = null
      }
      if (type === 'fechaEstudio') {
          this.tags.fechaEstudio = []
      }
      this.$emit('change')
    }
  }
}
</script>