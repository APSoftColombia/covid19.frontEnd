<template>
  <ValidationProvider
      :name="name"
      :rules="extraRules"
      v-slot="{ errors, valid }"
  >
    <v-text-field
        v-model="model"
        :label="label"
        outlined
        prepend-inner-icon="mdi-calculator-variant"
        :dense="dense"
        :error-messages="errors"
        :hint="hint"
        persistent-hint
        :suffix="suffix"
        :readonly="readonly"
    />
  </ValidationProvider>
</template>

<script>
export default {
  name: 'ElementoCalculado',
  props: {
    referencias: {
      type: Array,
      default: () => []
    },
    pregunta: {
      type: Object,
      default: null
    },
    encuesta: {
      type: Object,
      default: null
    },
    encuestaPadre: {
      type: Object,
      default: null
    },
    value: {
      type: [Number, String, Object, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    },
    errorMessages: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    model: null,
    hint: null,
    suffix: null,
    extraRules: null
  }),
  computed: {
    peso() {
      return this.referencias.find(x => x.referencia === 'peso') && this.referencias.find(x => x.referencia === 'peso').respuesta && this.referencias.find(x => x.referencia === 'peso').respuesta.respuesta_abierta
    },
    talla() {
      return this.referencias.find(x => x.referencia === 'talla') && this.referencias.find(x => x.referencia === 'talla').respuesta && this.referencias.find(x => x.referencia === 'talla').respuesta.respuesta_abierta
    },
    puntajeSisben() {
      return this.referencias.find(x => x.referencia === 'puntajeSisben') && this.referencias.find(x => x.referencia === 'puntajeSisben').respuesta && this.referencias.find(x => x.referencia === 'puntajeSisben').respuesta.respuesta_abierta
    },
    fechaUltimaRegla() {
      return this.referencias.find(x => x.referencia === 'fechaUltimaRegla') && this.referencias.find(x => x.referencia === 'fechaUltimaRegla').respuesta && this.referencias.find(x => x.referencia === 'fechaUltimaRegla').respuesta.respuesta_abierta
    },
    fechaNacimiento() {
      return this.referencias.find(x => x.referencia === 'fechaNacimiento') && this.referencias.find(x => x.referencia === 'fechaNacimiento').respuesta && this.referencias.find(x => x.referencia === 'fechaNacimiento').respuesta.respuesta_abierta
    },
    presionSistolica() {
      return this.referencias.find(x => x.referencia === 'presionSistolica') && this.referencias.find(x => x.referencia === 'presionSistolica').respuesta && this.referencias.find(x => x.referencia === 'presionSistolica').respuesta.respuesta_abierta
    },
    presionDiastolica() {
      return this.referencias.find(x => x.referencia === 'presionDiastolica') && this.referencias.find(x => x.referencia === 'presionDiastolica').respuesta && this.referencias.find(x => x.referencia === 'presionDiastolica').respuesta.respuesta_abierta
    },
    hemoglobinaGlicosilada() {
      return this.referencias.find(x => x.referencia === 'hemoglobinaGlicosilada') && this.referencias.find(x => x.referencia === 'hemoglobinaGlicosilada').respuesta && this.referencias.find(x => x.referencia === 'hemoglobinaGlicosilada').respuesta.respuesta_abierta
    },
    edad() {
      return this.referencias.find(x => x.referencia === 'edad') && this.referencias.find(x => x.referencia === 'edad').respuesta && this.referencias.find(x => x.referencia === 'edad').respuesta.respuesta_abierta
    },
    mujer() {
      return this.referencias.find(x => x.referencia === 'sexo') && this.referencias.find(x => x.referencia === 'sexo').respuesta && (this.referencias.find(x => x.referencia === 'sexo').respuesta.posibles_respuesta_uuid === 'ce402320-5c6a-11ea-9f12-7517f9ff1749')
    },
    padreUrbano() {
      return this.encuestaPadre && this.encuestaPadre.ubicacion && this.encuestaPadre.ubicacion.urbano
    },
    enEmbarazo() {
      return this.referencias.find(x => x.referencia === 'enEmbarazo') && this.referencias.find(x => x.referencia === 'enEmbarazo').respuesta && (this.referencias.find(x => x.referencia === 'enEmbarazo').respuesta.posibles_respuesta_uuid === '23d65630-6187-11ea-823b-1fc1a9df24fa')
    },
    nacimientosNatural() {
      return this.referencias.find(x => x.referencia === 'nacimientosNatural') && this.referencias.find(x => x.referencia === 'nacimientosNatural').respuesta && this.referencias.find(x => x.referencia === 'nacimientosNatural').respuesta.respuesta_abierta
    },
    nacimientosCesarea() {
      return this.referencias.find(x => x.referencia === 'nacimientosCesarea') && this.referencias.find(x => x.referencia === 'nacimientosCesarea').respuesta && this.referencias.find(x => x.referencia === 'nacimientosCesarea').respuesta.respuesta_abierta
    },
    nacimientosAborto() {
      return this.referencias.find(x => x.referencia === 'nacimientosAborto') && this.referencias.find(x => x.referencia === 'nacimientosAborto').respuesta && this.referencias.find(x => x.referencia === 'nacimientosAborto').respuesta.respuesta_abierta
    },
  },
  watch: {
    peso: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    talla: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    puntajeSisben: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    fechaUltimaRegla: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    fechaNacimiento: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    presionSistolica: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    presionDiastolica: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    hemoglobinaGlicosilada: {
      handler(val) {
        val && this.getCalculo()
      },
      immediate: true
    },
    edad: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    mujer: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    padreUrbano: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    enEmbarazo: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    nacimientosNatural: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    nacimientosCesarea: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    nacimientosAborto: {
      handler() {
        this.getCalculo()
      },
      immediate: true
    },
    model: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.model = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  created() {
    this.getCalculo()
  },
  methods: {
    getCalculo() {
      switch (this.pregunta.tipo_campo_calculado_id) {
        case 1: {
          if (Number(this.peso) && Number(this.talla)) {
            let resultado = Number((this.peso / Math.pow(this.talla, 2)).toFixed(2))
            if (resultado < 18.5) this.hint = 'Peso inferior al normal'
            if (resultado >= 18.5 && resultado < 25) this.hint = 'Normal'
            if (resultado >= 25 && resultado < 30) this.hint = 'Peso superior al normal'
            if (resultado >= 30 && resultado < 35) this.hint = 'Obesidad'
            if (resultado >= 35) this.hint = 'Obesidad Morbida'
            this.$emit('input', resultado)
          } else {
            this.$emit('input', null)
          }
          break
        }
        case 2: {
          if (Number(this.puntajeSisben)) {
            if (this.padreUrbano === 1) {
              if (this.puntajeSisben > 51.57) {
                this.$nextTick(() => {
                  this.$emit('input', 3)
                })
              } else if (this.puntajeSisben > 44.79) {
                this.$nextTick(() => {
                  this.$emit('input', 2)
                })
              } else {
                this.$nextTick(() => {
                  this.$emit('input', 1)
                })
              }
            } else {
              if (this.puntajeSisben > 37.8) {
                this.$nextTick(() => {
                  this.$emit('input', 3)
                })
              } else if (this.puntajeSisben > 32.98) {
                this.$nextTick(() => {
                  this.$emit('input', 2)
                })
              } else {
                this.$nextTick(() => {
                  this.$emit('input', 1)
                })
              }
            }
          } else {
            this.$nextTick(() => {
              this.$emit('input', null)
            })
          }
          break
        }
        case 3: {
          if (this.fechaUltimaRegla) {
            let fecha1 = this.moment(this.fechaUltimaRegla).add(10, 'days')
            let fecha2 = this.moment()
            let resultado = fecha2.diff(fecha1, 'weeks')
            // let resultado = Number((fecha2.diff(fecha1, 'days') / 7).toFixed(2))
            this.$emit('input', resultado)
            let stringRules = 'min:0'
            this.extraRules = this.rules ? (this.rules + '|' + stringRules) : stringRules
            this.extraRules = this.extraRules + (resultado > 45 ? '|max:45' : '')
          } else {
            this.$emit('input', null)
            this.extraRules = null
          }
          break
        }
        case 4: {
          if (Number(this.presionSistolica) && Number(this.presionDiastolica)) {
            if (this.presionSistolica >= 140 || this.presionDiastolica >= 90) {
              this.$emit('input', 1)
              this.suffix = 'Con hipertensión'
            } else {
              this.$emit('input', 0)
              this.suffix = 'Controlada'
            }
          } else {
            this.$emit('input', null)
            this.suffix = null
          }
          break
        }
        case 5: {
          if (Number(this.hemoglobinaGlicosilada)) {
            if (this.hemoglobinaGlicosilada < 7) {
              this.$emit('input', 0)
              this.suffix = 'Controlada'
            } else {
              this.$emit('input', 1)
              this.suffix = 'No controlada'
            }
          } else {
            this.$emit('input', null)
            this.suffix = null
          }
          break
        }
        case 6: {
          if ((this.edad !== null) && (typeof this.edad !== 'undefined') && this.edad > -1) {
            if (this.edad >= 0 && this.edad < 6) {
              this.$nextTick(() => {
                this.$emit('input', 0)
                this.suffix = 'Primera infancia'
              })
            } else if (this.edad >= 6 && this.edad < 12) {
              this.$emit('input', 1)
              this.suffix = 'Infancia'
            } else if (this.edad >= 12 && this.edad < 18) {
              this.$emit('input', 2)
              this.suffix = 'Adolescencia'
            } else if (this.edad >= 18 && this.edad < 29) {
              this.$emit('input', 3)
              this.suffix = 'Juventud'
            } else if (this.edad >= 29 && this.edad < 60) {
              this.$emit('input', 4)
              this.suffix = 'Adultez'
            } else if (this.edad >= 60) {
              this.$emit('input', 5)
              this.suffix = 'vejez'
            }
          } else {
            this.$emit('input', null)
            this.suffix = null
          }
          break
        }
        case 7: {
          if (this.fechaNacimiento) {
            let a = this.moment();
            let b = this.moment(this.fechaNacimiento);
            let years = a.diff(b, 'year');
            b.add(years, 'years');

            let months = a.diff(b, 'months');
            b.add(months, 'months');

            let days = a.diff(b, 'days');
            b.add(days, 'days');
            let stringDate = ``
            stringDate = stringDate + (years ? `${years} año${years === 1 ? '' : 's'}` : '')
            stringDate = stringDate + (months ? ` ${months} mes${months === 1 ? '' : 'es'}` : '')
            stringDate = stringDate + (years || months ? days ? ` ${days} d${days === 1 ? 'ía' : 'ias'}` : '' : `${days} d${days === 1 ? 'ía' : 'ias'}`)
            this.$emit('input', years)
            this.suffix = 'Años'
            this.hint = stringDate
          } else {
            this.$emit('input', null)
            this.suffix = null
            this.hint = null
          }
          break
        }
        case 8: {
          if ((this.edad !== null) && (typeof this.edad !== 'undefined') && this.edad > -1) {
            if (this.edad >= 10 && this.mujer) {
              this.$nextTick(() => {
                this.$emit('input', 1)
                this.suffix = 'Mujer'
              })
            } else if (this.edad >= 12 && !this.mujer) {
              this.$emit('input', 2)
              this.suffix = 'Hombre'
            } else {
              this.$emit('input', 0)
              this.suffix = 'No aplica'
            }
          } else {
            this.$emit('input', null)
            this.suffix = null
          }
          break
        }
        case 9: {
          if (this.fechaUltimaRegla) {
            // días que dura la gestación 7 días * 40 semanas + 10 días
            let diasGestacion = (7 * 40) + 10
            this.$emit('input', this.moment(this.fechaUltimaRegla).add(diasGestacion, 'days').format('YYYY[-]MM[-]DD'))
          } else {
            this.$emit('input', null)
          }
          break
        }
        case 10: {
          let cantidadEmbarazos = 0
          if (this.enEmbarazo) cantidadEmbarazos++
          if (this.nacimientosNatural) cantidadEmbarazos = cantidadEmbarazos + Number(this.nacimientosNatural)
          if (this.nacimientosCesarea) cantidadEmbarazos = cantidadEmbarazos + Number(this.nacimientosCesarea)
          if (this.nacimientosAborto) cantidadEmbarazos = cantidadEmbarazos + Number(this.nacimientosAborto)
          this.$emit('input', cantidadEmbarazos)
          break
        }
      }
    }
  }
}
</script>

<style scoped>
#signature {
  border: double 2px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
  radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>