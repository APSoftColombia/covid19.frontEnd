<template>
  <v-row dense>
    <v-col cols="12" sm="6" md="6">
      <c-identificacion-referencia
          ref="cIdentificacion"
          v-model="value.identificacion"
          label="Identificación"
          rules="required|numeric"
          name="Identificación"
          @response="val => resultAfiliado(val)"
          @keyup="identificacionVerificada = 0"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-select-complete
          v-model="value.tipo_identificacion"
          label="Tipo identificación"
          rules="required"
          name="Tipo identificación"
          :items="tiposDocumentoIdentidad"
          item-text="descripcion"
          item-value="id"
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-texto
          v-model="value.nombre1"
          label="Primer nombre"
          rules="required"
          name="Primer nombre"
          upper-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-texto
          v-model="value.nombre2"
          label="Segundo nombre"
          upper-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-texto
          v-model="value.apellido1"
          label="Primer apellido"
          rules="required"
          name="Primer apellido"
          upper-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-texto
          v-model="value.apellido2"
          label="Segundo apellido"
          upper-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-date-manual
          v-model="value.fecha_nacimiento"
          label="Fecha nacimiento"
          rules="required"
          name="Fecha nacimiento"
          :hint="edad"
          :disabled="identificacionVerificada < 1"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <c-select-complete
          v-model="value.sexo"
          label="Sexo"
          rules="required"
          name="Sexo"
          :items="sexosCovid"
          item-text="text"
          item-value="value"
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-texto
          v-model="value.celular"
          label="Celular"
          rules="required|numeric|minlength:10|maxlength:10"
          name="Celular"
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
<!--    <v-col cols="12" sm="12" md="6">-->
<!--      <c-texto-->
<!--          v-model="value.celular2"-->
<!--          label="Celular Opcional"-->
<!--          rules="numeric|minlength:10|maxlength:10"-->
<!--          name="celular opcional"-->
<!--          :disabled="identificacionVerificada < 1"-->
<!--      >-->
<!--      </c-texto>-->
<!--    </v-col>-->
    <v-col cols="12" sm="12" md="6">
      <c-texto
          v-model="value.email"
          label="Email"
          rules="email"
          name="Email"
          lower-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
<!--    <v-col cols="12" sm="12" md="12">-->
<!--      <c-texto-->
<!--          v-model="value.acudiente"-->
<!--          label="Acudiente"-->
<!--          :rules="value.edad < 18 ? 'required' : ''"-->
<!--          name="acudiente"-->
<!--          upper-case-->
<!--          :disabled="identificacionVerificada < 1"-->
<!--      >-->
<!--      </c-texto>-->
<!--    </v-col>-->
    <v-col cols="12">
      <c-texto
          v-model="value.direccion"
          label="Dirección"
          rules="required|minlength:6|direccion"
          name="Dirección"
          upper-case
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-select-complete
          v-model="value.departamento_id"
          label="Departamento"
          name="Departamento"
          rules="required"
          :items="departamentos"
          item-text="nombre"
          item-value="id"
          :disabled="identificacionVerificada < 1"
          @change="val => value.municipio_id = departamentos.find(x => x.id === val).municipios.find(z => z.id === value.municipio_id) ? value.municipio_id : null"
      />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-select-complete
          :disabled="!value.departamento_id || identificacionVerificada < 1"
          v-model="value.municipio_id"
          label="Municipio"
          name="Municipio"
          rules="required"
          :items="departamentos.length && value.departamento_id && departamentos.find(x => x.id === value.departamento_id) ? departamentos.find(x => x.id === value.departamento_id).municipios : []"
          item-text="nombre"
          item-value="id"
      />
    </v-col>
<!--    <v-col cols="12" sm="12" md="6">-->
<!--      <c-select-complete-->
<!--          :disabled="!value.municipio_id || identificacionVerificada < 1"-->
<!--          v-model="value.barrio_id"-->
<!--          :loading="loadingBarrios"-->
<!--          label="Barrio"-->
<!--          :items="barrios"-->
<!--          item-text="nombre"-->
<!--          item-value="id"-->
<!--      />-->
<!--    </v-col>-->
    <v-col cols="12">
      <v-checkbox
          v-model="value.si_eps"
          class="shrink mr-2"
          label="¿Está afiliado a una EPS?"
          :false-value="0"
          :true-value="1"
          :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <template v-if="value.si_eps">
      <v-col cols="12" sm="12" md="12">
        <c-select-complete
            v-model="value.eps_id"
            label="¿A que EPS está afiliado?"
            rules="required"
            name="EPS de afiliación"
            :items="epss"
            item-value="id"
            item-text="nombre"
            :disabled="identificacionVerificada < 1"
        />
      </v-col>
      <template v-if="value.eps_id">
        <v-col cols="12" sm="12" md="6">
          <c-select-complete
              v-model="value.tipo_afiliacion"
              label="Régimen"
              rules="required"
              name="Régimen"
              :items="tiposAfiliacion"
              :disabled="identificacionVerificada < 1"
          />
        </v-col>
<!--        <v-col cols="12" sm="12" md="6" v-if="value.tipo_afiliacion === 'Régimen Especial'">-->
<!--          <c-select-complete-->
<!--              v-model="value.regimen_especial"-->
<!--              label="Régimen especial"-->
<!--              rules="required"-->
<!--              name="régimen especial"-->
<!--              :items="regimenesEspeciales"-->
<!--              :disabled="identificacionVerificada < 1"-->
<!--          >-->
<!--          </c-select-complete>-->
<!--        </v-col>-->
      </template>
    </template>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'
import CIdentificacionReferencia from './CIdentificacionReferencia'

export default {
  name: 'FormPersona',
  components: {CIdentificacionReferencia},
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    identificacionVerificada: 0,
    loadingidentidad: false,
    edad: null,
    barrios: [],
    loadingBarrios: false
  }),
  computed: {
    ...mapGetters([
      'sexosCovid',
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'tiposAfiliacion',
      'epss',
      'regimenesEspeciales'
    ])
  },
  watch: {
    'value': {
      handler(val) {
        if (val && val.identificacion) {
          this.identificacionVerificada = 1
          this.$emit('verificado', 1)
        }
        this.assignPaciente()
      },
      immediate: true
    },
    'value.municipio_id': {
      handler(val) {
        this.value.barrio_id = null
        this.barrios = []
        if (val) {
          this.getBarrios(val)
        }
      },
      immediate: false
    },
    'value.identificacion': {
      handler(val) {
        if (!val) {
          this.identificacionVerificada = 0
          this.$emit('verificado', 0)
        }
      },
      immediate: false
    },
    'value.fecha_nacimiento': {
      handler(val) {
        if (this && this.value) {
          let laEdad = this.calculaEdad(val)
          this.value.edad = laEdad.years
          this.edad = laEdad.stringDate
        }
      },
      immediate: true
    },
    'value.si_eps': {
      handler(val) {
        if(!val) {
          this.value.eps_id = null
          this.value.tipo_afiliacion = null
        }
      },
      immediate: false
    },
    'value.eps_id': {
      handler(val) {
        !val && (this.value.tipo_afiliacion = null)
      },
      immediate: false
    },
    'value.tipo_afiliacion': {
      handler(val) {
        if (!val || val !== 'Régimen Especial') {
          this.value.regimen_especial = null
        }
      },
      immediate: false
    }
  },
  created() {
    this.assignPaciente()
  },
  methods: {
    assignPaciente() {
      if (this.value) {
        this.value.departamento_id = (this.departamentos && this.value.departamento_id && this.departamentos.find(x => x.id === this.value.departamento_id)) ? this.value.departamento_id : null
        this.value.municipio_id = (this.municipiosTotal && this.value.municipio_id && this.municipiosTotal.find(x => x.id === this.value.municipio_id)) ? this.value.municipio_id : null
      } else {
        this.$store.commit('snackbar', {color: 'error', message: `Erro al construir la estructura del paciente.`})
      }
      if (this.value && this.value.municipio_id) this.getBarrios(this.value.municipio_id)
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
      console.log('response', response)
      this.$emit('responseReferencia', null)
      if(!response.fallecido){
          this.identificacionVerificada = 1
      }
      this.$emit('verificado', this.identificacionVerificada)
      if (response.afiliado !== null) {
        this.value.tipo_identificacion = null
        this.value.nombre1 = null
        this.value.nombre2 = null
        this.value.apellido1 = null
        this.value.apellido2 = null
        this.value.fecha_nacimiento = null
        this.value.sexo = null
        this.value.celular = null
        this.value.email = null
        this.value.direccion = null
        this.value.departamento_id = null
        this.value.municipio_id = null
        this.value.barrio_id = null
        this.value.si_eps = 1
        this.value.eps_id = null
        this.value.tipo_afiliacion = null
      }
      if(response && response.fallecido && response.afiliado){
          this.identificacionVerificada = -2
          this.$emit('responseFallecido', {afiliado: response.afiliado, mensaje: { id: 3, mensaje: 'El paciente buscado se encuentra en esta Fallecidó' }})
      }
      if (response && response.referencias && response.referencias.length && (response.referencias[0].estado !== 'Proceso terminado' && response.referencias[0].estado !== 'Proceso cancelado')) {
        this.identificacionVerificada = -1
        this.$emit('responseReferencia', {referencias: response.referencias, mensaje: { id: 2, mensaje: 'El paciente ya cuenta con una referencia Activa' }})
      }
      this.$emit('verificado', this.identificacionVerificada)
      if (this.identificacionVerificada === 1 && response.afiliado) {
        this.value.afiliado_id = response.afiliado.id
        this.value.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
        this.value.identificacion = response.afiliado.numero_documento_identidad
        this.value.nombre1 = response.afiliado.nombre1
        this.value.nombre2 = response.afiliado.nombre2
        this.value.apellido1 = response.afiliado.apellido1
        this.value.apellido2 = response.afiliado.apellido2
        this.value.fecha_nacimiento = response.afiliado.fecha_nacimiento
        this.value.sexo = response.afiliado.sexo
        this.value.celular = response.afiliado.numero_celular
        this.value.email = response.afiliado.email
        this.value.direccion = response.afiliado.direccion
        this.value.departamento_id = response.afiliado.departamento_id
        this.value.municipio_id = response.afiliado.centro_poblado_id
        this.value.barrio_id = response.afiliado.barrio_id || null
        this.value.eps_id = response.afiliado.eps_id
        this.value.tipo_afiliacion = response.afiliado.regimen
      }
    }
  }
}
</script>

<style scoped>

</style>
