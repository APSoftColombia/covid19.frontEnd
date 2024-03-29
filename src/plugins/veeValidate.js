import Vue from 'vue'
import moment from 'moment'
Vue.prototype.moment = moment
import { required, email, required_if, numeric, is_not, confirmed, size, integer } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'

extend('required', {
    ...required,
    message: 'El campo {_field_} es requerido'
})

extend('integer', {
    ...integer,
    message: 'El campo {_field_} debe ser un número entero.'
})

extend('size', {
    ...size,
    message: (_,values) =>  `El campo ${values._field_} excede el peso permitido (${values.size}kb)`
})

extend('is_not', {
    ...is_not,
    message: 'El campo {_field_} debe ser diferente de la contraseña actual'
})

extend('confirmed', {
    ...confirmed,
    message: 'El campo {_field_} no coincide con el campo a confirmar'
})

extend('minlength', {
    params: ['length'],
    validate(value, { length }) {
        return String(value).length >= length
    },
    message: 'El campo {_field_} debe tener como mínimo {length} caracteres'
})

extend('numeric', {
    ...numeric,
    message: 'El campo {_field_} debe ser de tipo número únicamente'
})

extend('email', {
    ...email,
// /^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(campo.value)
    message: 'El correo no es válido'
})

extend('required_if', {
    ...required_if,
    message: 'El campo {_field_} es requerido'
})

extend('integridadSQL', {
    validate(value) {
        if ((value !== null) && (typeof value !== 'undefined') && (value !== '')) {
            const expression = /(DELETE |CREATE |ALTER |DROP |RENAME |TRUNCATE |CALL |IMPORT |INSERT |REPLACE |LOAD |UPDATE |GRANT)/i
            return !expression.test(value)
        }
    },
    message: 'La consulta no está permitida'
})

extend('min', {
    params: ['minimo'],
    validate(value, { minimo }) {
        return Number(value) >= minimo
    },
    message: 'El campo {_field_} debe ser mayor o igual a {minimo}'
})

extend('dateValid', {
    validate(value) {
        return !!(value && (value.length === 10) && moment(value, 'DD/MM/YYYY').isValid())
    },
    message: 'La fecha no es válida'
})

extend('phoneNumber', {
    validate(value) {
        return !!(value && Number(value) && Number(value) > 0)
    },
    message: 'El número de teléfono no es válido.'
})

extend('mindate', {
    params: ['minimo'],
    validate(value, { minimo }) {
        let newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
        let newMinimo = Vue.prototype.moment(minimo, 'YYYY-MM-DD')
        return Vue.prototype.moment(newValue).valueOf() >= Vue.prototype.moment(newMinimo).valueOf()
    },
    message: 'El campo {_field_} debe ser mayor o igual a {minimo}'
})

extend('maxdate', {
    params: ['maximo'],
    validate(value, { maximo }) {
        let newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
        let newMaximo = Vue.prototype.moment(maximo, 'YYYY-MM-DD')
        return Vue.prototype.moment(newValue).valueOf() <= Vue.prototype.moment(newMaximo).valueOf()
    },
    message: 'El campo {_field_} debe ser menor o igual a {maximo}'
})

extend('timeValid', {
    validate(value) {
        return !!(value && (value.length === 5) && moment(value, 'HH:mm').isValid())
    },
    message: 'La Hora no es válida'
})

extend('mintime', {
    params: ['minimo'],
    validate(value, { minimo }) {
        let newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
        let newMinimo = Vue.prototype.moment(minimo, 'YYYY-MM-DD')
        return Vue.prototype.moment(newValue).valueOf() >= Vue.prototype.moment(newMinimo).valueOf()
    },
    message: 'El campo {_field_} debe ser mayor o igual a {minimo}'
})

extend('maxtime', {
    params: ['maximo'],
    validate(value, { maximo }) {
        let newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
        let newMaximo = Vue.prototype.moment(maximo, 'YYYY-MM-DD')
        return Vue.prototype.moment(newValue).valueOf() <= Vue.prototype.moment(newMaximo).valueOf()
    },
    message: 'El campo {_field_} debe ser menor o igual a {maximo}'
})

extend('max', {
  params: ['maximo'],
  validate(value, { maximo }) {
    return Number(value) <= maximo
  },
  message: 'El campo {_field_} debe ser menor o igual a {maximo}'
})

extend('maxlength', {
  params: ['length'],
  validate(value, { length }) {
    return String(value).length <= length
  },
  message: 'El campo {_field_} debe tener como maximo {length} caracteres'
})

extend('direccion', {
    validate(value) {
        return (isNaN(value) && value.trim().length > 5) || value > 0
    },
    message: 'El campo {_field_} no es un dato válido'
})


/// Validaciones de preguntas
extend('requiredPregunta', {
    ...required,
    message: 'La pregunta {_field_} es requerida'
})

extend('minPregunta', {
    params: ['minimo'],
    validate(value, { minimo }) {
        return Number(value) >= minimo
    },
    message: 'La respuesta debe ser mayor o igual a {minimo}'
})

extend('maxPregunta', {
    params: ['maximo'],
    validate(value, { maximo }) {
        return Number(value) <= maximo
    },
    message: 'La respuesta debe ser menor o igual a {maximo}'
})

extend('regex', {
  params: ['password'],
  validate(value, { password }) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,})/;
    return regex.test(password)
  },
  message: "La contraseña debe ser alfanumerica, debe contener mayusculas y minusculas y un caracter especial"
})
