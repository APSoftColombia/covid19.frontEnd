<template>
  <v-row>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-identificacion
          ref="cIdentificacion"
          v-model="persona.identificacion"
          label="Identificación"
          rules="required|numeric"
          name="identificación"
          @responsepersona="val => resultAfiliado(val)"
          @keyup="identificacionVerificada = 0"
      >
      </c-identificacion>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-select-complete
          v-model="persona.tipo_identificacion"
          label="Tipo identificación"
          rules="required"
          name="tipo identificación"
          :items="tiposDocumentoIdentidad"
          item-text="descripcion"
          item-value="id"
          :disabled="identificacionVerificada < 1"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-texto
          v-model="persona.nombre1"
          label="Primer nombre"
          rules="required"
          name="primer nombre"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-texto
          v-model="persona.nombre2"
          label="Segundo nombre"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-texto
          v-model="persona.apellido1"
          label="Primer apellido"
          rules="required"
          name="primer apellido"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-texto
          v-model="persona.apellido2"
          label="Segundo apellido"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-date
          v-model="persona.fecha_nacimiento"
          label="Fecha nacimiento"
          rules="required"
          name="fecha nacimiento"
          :hint="edad"
          :disabled="identificacionVerificada < 1"
          :max="moment().format('YYYY-MM-DD')"
      >
      </c-date>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-select-complete
          v-model="persona.sexo"
          label="Sexo"
          rules="required"
          name="sexo"
          :items="sexosCovid"
          item-text="text"
          item-value="value"
          :disabled="identificacionVerificada < 1"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-texto
          v-model="persona.celular"
          label="Celular Principal"
          rules="required|numeric|minlength:10|maxlength:10"
          name="celular principal"
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-texto
          v-model="persona.celular2"
          label="Celular Opcional"
          rules="numeric|minlength:10|maxlength:10"
          name="celular opcional"
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="12">
      <c-texto
          v-model="persona.email"
          label="Email"
          rules="email"
          name="email"
          lower-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="12">
      <c-texto
          v-model="persona.acudiente"
          label="Acudiente"
          :rules="persona.edad < 18 ? 'required' : ''"
          name="acudiente"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12">
      <c-texto
          v-model="persona.direccion"
          label="Dirección"
          rules="required|minlength:6|direccion"
          name="dirección"
          upper-case
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-select-complete
          v-model="persona.departamento_id"
          label="Departamento"
          name="departamento"
          rules="required"
          :items="departamentos"
          item-text="nombre"
          item-value="id"
          :disabled="identificacionVerificada < 1"
          @change="val => persona.municipio_id = departamentos.find(x => x.id === val).municipios.find(z => z.id === persona.municipio_id) ? persona.municipio_id : null"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-select-complete
          :disabled="!persona.departamento_id || identificacionVerificada < 1"
          v-model="persona.municipio_id"
          label="Municipio"
          name="municipio"
          rules="required"
          :items="departamentos.length && persona.departamento_id && departamentos.find(x => x.id === persona.departamento_id) ? departamentos.find(x => x.id === persona.departamento_id).municipios : []"
          item-text="nombre"
          item-value="id"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-select-complete
          :disabled="!persona.municipio_id || identificacionVerificada < 1"
          v-model="persona.barrio_id"
          :loading="loadingBarrios"
          label="Barrio"
          :items="barrios"
          item-text="nombre"
          item-value="id"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12">
      <v-checkbox
          v-model="persona.si_eps"
          class="shrink mr-2"
          label="¿Está afiliado a una EPS?"
          :false-value="0"
          :true-value="1"
          :disabled="identificacionVerificada < 1"
      ></v-checkbox>
    </v-col>
    <template v-if="persona.si_eps">
      <v-col class="pb-0" cols="12" sm="12" md="12">
        <c-select-complete
            v-model="persona.eps_id"
            label="¿A que EPS está afiliado?"
            rules="required"
            name="EPS de afiliación"
            :items="epss"
            item-value="id"
            item-text="nombre"
            :disabled="identificacionVerificada < 1"
        >
        </c-select-complete>
      </v-col>
      <template v-if="persona.eps_id">
        <v-col class="pb-0" cols="12" sm="12" md="6">
          <c-select-complete
              v-model="persona.tipo_afiliacion"
              label="Régimen"
              rules="required"
              name="régimen"
              :items="tiposAfiliacion"
              :disabled="identificacionVerificada < 1"
          >
          </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6" v-if="persona.tipo_afiliacion === 'Régimen Especial'">
          <c-select-complete
              v-model="persona.regimen_especial"
              label="Régimen especial"
              rules="required"
              name="régimen especial"
              :items="regimenesEspeciales"
              :disabled="identificacionVerificada < 1"
          >
          </c-select-complete>
        </v-col>
      </template>
    </template>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'FormPersona',
  props: {
    value: {
      type: Object,
      default: null
    },
    tipo: {
      type: String,
      default: 'tamizaje'
    },
    verificarAfiliado: {
      type: Boolean,
      default: false
    },
    remplazarAfiliadoNull: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    identificacionVerificada: 0,
    loadingidentidad: false,
    edad: null,
    persona: null,
    barrios: [],
    loadingBarrios: false
  }),
  computed: {
    esTamizaje() {
      return this.tipo === 'tamizaje'
    },
    esFallecido() {
      return this.tipo === 'fallecido'
    },
    ...mapGetters([
      'sexosCovid',
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'tiposAfiliacion',
      'epss',
      'regimenesEspeciales',
      'modelPersona'
    ])
  },
  watch: {
    'value': {
      handler(val) {
        if (val && val.identificacion) {
          this.identificacionVerificada = 1
          this.$emit('verificado', 1)
        }
        this.assignPerson()
      },
      immediate: true
    },
    'persona.municipio_id': {
      handler(val) {
        this.persona.barrio_id = null
        this.barrios = []
        if (val) {
          this.getBarrios(val)
        }
      },
      immediate: false
    },
    'persona.identificacion': {
      handler(val) {
        if (!val) {
          this.identificacionVerificada = 0
          this.$emit('verificado', 0)
        }
      },
      immediate: false
    },
    'persona.fecha_nacimiento': {
      handler(val) {
        if (this && this.persona) {
          let laEdad = this.calculaEdad(val)
          this.persona.edad = laEdad.years
          this.edad = laEdad.stringDate
        }
      },
      immediate: true
    },
    'persona.si_eps': {
      handler(val) {
        if(!val) {
          this.persona.eps_id = null
          this.persona.tipo_afiliacion = null
        }
      },
      immediate: false
    },
    'persona.eps_id': {
      handler(val) {
        !val && (this.persona.tipo_afiliacion = null)
      },
      immediate: false
    },
    'persona.tipo_afiliacion': {
      handler(val) {
        if (!val || val !== 'Régimen Especial') {
          this.persona.regimen_especial = null
        }
      },
      immediate: false
    }
  },
  created() {
    this.assignPerson()
    if (this.verificarAfiliado) {
      setTimeout(() => {
        if (this.$refs.cIdentificacion) this.$refs.cIdentificacion.enter()
      }, 500)
    }
  },
  methods: {
    assignPerson() {
      if (this.value) {
        this.value.departamento_id = (this.departamentos && this.value.departamento_id && this.departamentos.find(x => x.id === this.value.departamento_id)) ? this.value.departamento_id : null
        this.value.municipio_id = (this.municipiosTotal && this.value.municipio_id && this.municipiosTotal.find(x => x.id === this.value.municipio_id)) ? this.value.municipio_id : null
        this.persona = this.value
      } else {
        this.persona = this.clone(this.modelPersona)
      }
      if (this.persona && this.persona.municipio_id) this.getBarrios(this.persona.municipio_id)
    },
    getBarrios(municipio_id) {
      this.loadingBarrios = true
      this.axios.get(`barrios?municipio_id=${municipio_id}`)
          .then(response => {
            console.log('response get evolucion', response)
            this.barrios = response.data
            this.loadingBarrios = false
          })
          .catch(error => {
            this.loadingBarrios = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los barrios.`, error: error})
          })
    },
    resultAfiliado(response) {
      this.$emit('responsetamizaje', null)
      this.identificacionVerificada = 1
      this.$emit('verificado', this.identificacionVerificada)
      if ((this.remplazarAfiliadoNull && response.afiliado === null) || response.afiliado !== null) {
        this.persona.tipo_identificacion = null
        this.persona.nombre1 = null
        this.persona.nombre2 = null
        this.persona.apellido1 = null
        this.persona.apellido2 = null
        this.persona.fecha_nacimiento = null
        this.persona.sexo = null
        this.persona.celular = null
        this.persona.email = null
        this.persona.direccion = null
        this.persona.departamento_id = null
        this.persona.municipio_id = null
        this.persona.barrio_id = null
        this.persona.si_eps = 1
        this.persona.eps_id = null
        this.persona.tipo_afiliacion = null
      }
      if (response && response.tamizaje && response.tamizaje.length) {
        this.identificacionVerificada = 0
        this.$emit('verificado', this.identificacionVerificada)
        let tm0 = response.tamizaje[0]
        let mensaje = null
        if ((!tm0.medico_id && !tm0.total_riesgo) || tm0.clasificacion === '6') {
          this.identificacionVerificada = 1
          mensaje = {id: 1, mensaje: 'Se puede continuar con la creación de la ERP.'}
        } else if (tm0.total_riesgo && !tm0.medico_id) {
          this.identificacionVerificada = -1
          mensaje = {
            id: 2,
            mensaje: `El documento ${tm0.identificacion} ya tiene ERP activa y está pendiente por Asignación de Caso de Estudio.`
          }
        } else if (tm0.medico_id && (tm0.estado_afectacion !== 'Recuperado' && tm0.estado_afectacion !== 'Fallecido')) {
          this.identificacionVerificada = -1
          mensaje = {
            id: 3,
            mensaje: `El documento ${tm0.identificacion} ya tiene un Caso de Estudio Asignado y no se puede continuar con la creación de la ERP.`
          }
        } else {
          this.identificacionVerificada = 1
          mensaje = {id: 1, mensaje: 'Se puede continuar con la creación de la ERP.'}
        }
        this.$emit('responsetamizaje', {tamizajes: response.tamizaje, mensaje: mensaje})
      }
      this.$emit('verificado', this.identificacionVerificada)
      if (this.identificacionVerificada === 1 && response.afiliado) {
        this.persona.afiliado_id = response.afiliado.id
        this.persona.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
        this.persona.identificacion = response.afiliado.numero_documento_identidad
        this.persona.nombre1 = response.afiliado.nombre1
        this.persona.nombre2 = response.afiliado.nombre2
        this.persona.apellido1 = response.afiliado.apellido1
        this.persona.apellido2 = response.afiliado.apellido2
        this.persona.fecha_nacimiento = response.afiliado.fecha_nacimiento
        this.persona.sexo = response.afiliado.sexo
        this.persona.celular = response.afiliado.numero_celular
        this.persona.email = response.afiliado.email
        this.persona.direccion = response.afiliado.direccion
        this.persona.departamento_id = response.afiliado.departamento_id
        this.persona.municipio_id = response.afiliado.centro_poblado_id
        this.persona.barrio_id = response.afiliado.barrio_id || null
        this.persona.eps_id = response.afiliado.eps_id
        this.persona.tipo_afiliacion = response.afiliado.regimen
      }
    }
  }
}
</script>

<style scoped>

</style>