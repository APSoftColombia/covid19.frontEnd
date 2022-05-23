<template>
  <v-col cols="12" class="py-0">
    <c-chip-filters
        v-if="tags.prestador"
        :text="nombrePrestador"
        key="prestador"
        subtitle="Prestador"
        @close="closeTag('prestador')"
    />
    <c-chip-filters
        v-if="tags.departamento"
        :text="nombreDepartamento"
        key="departamento"
        subtitle="Departamento prestador"
        @close="closeTag('departamento')"
    />
    <c-chip-filters
        v-if="tags.mes"
        :text="tags.mes"
        key="mes"
        subtitle="Mes de cargue"
        @close="closeTag('mes')"
    />
    <c-chip-filters
        v-if="tags.estado"
        :text="tags.estado"
        key="estado"
        subtitle="Estado"
        @close="closeTag('estado')"
    />
    <c-chip-filters
        v-if="tags.usuario"
        :text="nombreUsuario"
        key="usuario"
        subtitle="Usuario"
        @close="closeTag('usuario')"
    />
  </v-col>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
export default {
  name: 'TagsFilters',
  props: {
    tags: {
      type: [Object, Array]
    }
  },
  computed: {
    ...mapGetters([
      'departamentos'
    ]),
    ...mapState('atencionMedicaRCVModule', ['complementosLoads']),
    nombrePrestador() {
      return (this.complementosLoads?.prestadores?.length && this.complementosLoads.prestadores.find(x => x.codigohabilitacion === this.tags.prestador)?.nombre) || ''
    },
    nombreUsuario() {
      return (this.complementosLoads?.usuarios?.length && this.complementosLoads.usuarios.find(x => x.id === this.tags.usuario)?.name) || ''
    },
    nombreDepartamento() {
      return (this.departamentos?.length && this.departamentos.find(x => x.codigo === this.tags.departamento)?.nombre) || ''
    }
  },
  methods: {
    closeTag(type) {
      if(type === 'prestador'){
          this.tags.prestador = null
      }
      if(type === 'usuario'){
        this.tags.usuario = null
      }
      if(type === 'mes'){
        this.tags.mes = null
      }
      if(type === 'estado'){
        this.tags.estado = null
      }
      if(type === 'departamento'){
        this.tags.departamento = null
      }
      this.$emit('change')
    }
  }
}
</script>