<template>
  <div class="mr-1" v-if="tags">
    <c-chip-filters
        v-if="tags.departamento"
        :text="departamentName"
        subtitle="Departamento"
        @close="tags.departamento = null"
    />
    <c-chip-filters
        v-if="tags.especialidad"
        :text="especialidadName"
        subtitle="Especialidad"
        @close="tags.especialidad = null"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'RegistroPresentarFiltersTags',
  props: {
    tags: {
      type: Object,
      default: null
    }
  },
  computed: {
    especialidadName () {
      return (this.ref_especialidades?.length && this.ref_especialidades.find(x => x.serv_codigo === this.tags?.especialidad)?.serv_nombre) || ''
    },
    departamentName () {
      return (this.departamentos?.length && this.departamentos.find(x => x.codigo === this.tags?.departamento)?.nombre) || ''
    },
    ...mapGetters([
      'departamentos',
      'ref_especialidades'
    ])
  }
}
</script>