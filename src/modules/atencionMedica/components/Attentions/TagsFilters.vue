<template>
  <v-col cols="12" class="py-0">
    <c-chip-filters
        v-if="tags.departamento"
        :text="nombreDepartamento"
        key="departamento"
        subtitle="Departamento"
        @close="closeTag('departamento')"
    />
    <c-chip-filters
        v-if="tags.municipio"
        :text="nombreMunicipio"
        key="municipio"
        subtitle="Municipio"
        @close="closeTag('municipio')"
    />
    <c-chip-filters
        v-if="tags.fechaRegistro && tags.fechaRegistro.length"
        :text="`Desde ${moment(tags.fechaRegistro[0]).format('DD/MM/YYYY')} hasta ${moment(tags.fechaRegistro[1]).format('DD/MM/YYYY')}`"
        key="fechaRegistro"
        subtitle="Fecha"
        @close="closeTag('fechaRegistro')"
    />
    <c-chip-filters
        v-if="tags.estado"
        :text="tags.estado"
        key="Estado"
        subtitle="Estado"
        @close="closeTag('estado')"
    />
    <c-chip-filters
        v-if="tags.pertenenciaEtnica"
        :text="nombrePertenenciaEtnica"
        key="pertenenciaEtnica"
        subtitle="Pertenencia Étnica"
        @close="closeTag('pertenenciaEtnica')"
    />
    <c-chip-filters
        v-if="tags.grupoPoblacional"
        :text="nombreGrupoPoblaciona"
        key="grupoPoblacional"
        subtitle="Grupo Poblacional"
        @close="closeTag('grupoPoblacional')"
    />
    <c-chip-filters
        v-if="tags.prestador"
        :text="nombrePrestador"
        key="prestador"
        subtitle="Prestador"
        @close="closeTag('prestador')"
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
    ...mapState('atencionMedicaRCVModule', ['complementos']),
    nombrePrestador() {
      return (this.complementos?.prestadores?.length && this.complementos.prestadores.find(x => x.codigohabilitacion === this.tags.prestador)?.nombre) || ''
    },
    nombreUsuario() {
      return (this.complementos?.usuarios?.length && this.complementos.usuarios.find(x => x.id === this.tags.usuario)?.name) || ''
    },
    nombreGrupoPoblaciona() {
      return (this.complementos?.gruposPoblacionales?.length && this.complementos.gruposPoblacionales.find(x => x.value === this.tags.grupoPoblacional)?.text) || ''
    },
    nombrePertenenciaEtnica() {
      return (this.complementos?.pertenenciasEtnicas?.length && this.complementos.pertenenciasEtnicas.find(x => x.value === this.tags.pertenenciaEtnica)?.text) || ''
    },
    nombreDepartamento() {
      return (this.departamentos?.length && this.departamentos.find(x => x.codigo === this.tags.departamento)?.nombre) || ''
    },
    nombreMunicipio() {
      return (this.departamentos?.length && this.tags.departamento && this.departamentos.find(x => x.codigo === this.tags.departamento)?.municipio?.nombre) || ''
    }
  },
  methods: {
    closeTag(type) {
      if(type === 'departamento'){
        this.tags.departamento = null
      }
      if(type === 'municipio'){
        this.tags.municipio = null
      }
      if (type === 'fechaRegistro') {
        this.tags.fechaRegistro = []
      }
      if(type === 'estado'){
        this.tags.estado = null
      }
      if(type === 'pertenenciaEtnica'){
        this.tags.pertenenciaEtnica = null
      }
      if(type === 'grupoPoblacional'){
        this.tags.grupoPoblacional = null
      }
      if(type === 'prestador'){
        this.tags.prestador = null
      }
      if(type === 'usuario'){
        this.tags.usuario = null
      }
      this.$emit('change')
    }
  }
}
</script>