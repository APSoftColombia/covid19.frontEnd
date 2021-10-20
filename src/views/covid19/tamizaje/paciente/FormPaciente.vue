<template>
  <v-row>
    <v-col class="pb-0" cols="12" sm="6" md="6">
      <c-texto
          v-model="persona.identificacion"
          label="Identificación"
          rules="required|numeric"
          name="identificación"
      >
      </c-texto>
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
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-texto
          v-model="persona.telefono_sivigila"
          label="Telefono Sivigila"
          rules="numeric|minlength:10|maxlength:10"
          name="telefono sivigila"
          :disabled="identificacionVerificada < 1"
      >
      </c-texto>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="6">
      <c-texto
          v-model="persona.telefono_ma"
          label="Telefono MA"
          rules="numeric|minlength:10|maxlength:10"
          name="telefono ma"
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
      <c-select-complete
          v-model="persona.tipo_poblacion"
          label="Condición inical de aseguramiento"
          rules="required"
          name="condición inical de aseguramiento"
          :items="tipoPoblaciones"
          :disabled="identificacionVerificada < 1"
      />
<!--      <v-checkbox-->
<!--          v-model="persona.si_eps"-->
<!--          class="shrink mr-2"-->
<!--          label="¿Está afiliado a una EPS?"-->
<!--          :false-value="0"-->
<!--          :true-value="1"-->
<!--          :disabled="identificacionVerificada < 1"-->
<!--      ></v-checkbox>-->
    </v-col>
    <template v-if="persona.si_eps">
      <v-col class="pb-0" cols="12" sm="12" md="12">
        <c-select-complete
            v-model="persona.eps_id"
            label="¿A que EPS está afiliado?"
            :rules="persona.tipo_poblacion === 'Población Asegurada' && !persona.id ? 'required' : ''"
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
      'modelPersona',
       'tipoPoblaciones'
    ])
  },
  watch: {
    'persona.tipo_poblacion': {
      handler(value) {
        if (this.persona && !this.persona.id) {
          if (value == 'Población Asegurada') {
            this.persona.si_eps = 1
          } else {
            this.persona.si_eps = 0
          }
        }
      },
      immediate: false
    },
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
    }
  }
}
</script>

<style scoped>

</style>