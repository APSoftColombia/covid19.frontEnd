// src/main.js

import 'babel-polyfill'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { Vue2Dragula } from 'vue2-dragula'
import VueQuillEditor from 'vue-quill-editor'
import wysiwyg from 'vue-wysiwyg'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'
import AmAngularGauge from 'amcharts3/amcharts/gauge'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import VueTour from 'vue-tour'
import fullscreen from 'vue-fullscreen'
import InstantSearch from 'vue-instantsearch'
import VueVideoPlayer from 'vue-video-player'
import Croppa from 'vue-croppa'
import moment from 'moment'
import VueSignaturePad from 'vue-signature-pad'
import UUID from 'vue-uuid'
import lodash from 'lodash'
window.lodash = lodash

// global components
import GlobalComponents from './globalComponents'
// router
import router from './router'

// store
import { store } from './store/store'

// include all css files
import './lib/VuelyCss'

// messages
import messages from './lang'

//ServiceWorker
import './registerServiceWorker'

// vee-validate
import './plugins/veeValidate'
import './plugins/onLine'


Vue.config.productionTip = false

// navigation guards before each
router.beforeEach((to, from, next) => {
	Nprogress.start()
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (localStorage.getItem('user') === null) {
			next({
				name: 'Login'
			})
		} else if (to.meta.requiresPermission) {
			if (store.getters.getPermission(to.meta.requiresPermission)) {
				next()
			} else {
				setTimeout(() => {
					store.commit('snackbar', {color: 'error', message: `No tiene permisos para ingresar al módulo ${to.meta.title}.`})
				}, 200)
				next({
					name: 'Home'
				})
			}
			if (to.meta.requiresOnLine) {
				console.log('store.getters.onLine()', store.getters.onLine)
				if (store.getters.onLine) {
					next()
				} else {
					setTimeout(() => {
						store.commit('snackbar', {color: 'warning', message: `No es posible acceder al módulo ${to.meta.title} en modo offLine.`})
					}, 200)
					next({
						name: 'Home'
					})
				}
			}
		} else {
			next()
		}
	} else {
		next() // make sure to always call next()!
	}
})

// navigation guard after each
router.afterEach(() => {
	Nprogress.done()
	setTimeout(() => {
		const contentWrapper = document.querySelector('.v-content__wrap')
		if(contentWrapper !== null){
			contentWrapper.scrollTop = 0
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content')
		if(boxedLayout !==  null){
			boxedLayout.scrollTop = 0
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content')
		if(miniLayout !== null){
			miniLayout.scrollTop = 0
		}
	}, 200)
})

Vue.use(InstantSearch)
Vue.use(VueI18n)
Vue.use(AmCharts)
Vue.use(AmSerial)
Vue.use(VueTour)
Vue.use(AmAngularGauge)
Vue.use(Vue2Dragula)
Vue.use(VueQuillEditor)
Vue.use(wysiwyg, {})
Vue.use(VueBreadcrumbs)
Vue.use(Notifications, { velocity })
Vue.use(fullscreen)
Vue.use(GlobalComponents)
Vue.use(VueVideoPlayer)
Vue.use(Croppa)

Vue.use(VueAxios, axios)
Vue.use(VueSignaturePad)
Vue.use(UUID)
moment.locale('es')
Vue.prototype.moment = moment
store.commit('assignTokenAxios')
const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})

import {mapGetters, mapState} from 'vuex'
Vue.mixin({
	data: () => ({
		esMovil: false
	}),
	computed: {
		esMedico () {
			return this && this.roles && this.roles.length && [3].find(x => this.roles.find(z => z.id === x))
		},
		isCaller () {
			return this && this.roles && this.roles.length && [5,6].find(x => this.roles.find(z => z.id === x))
		},
		esPsicologo () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 8)
		},
		esTrabajadorSocial () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 9)
		},
		verDiagnosticados () {
			return this && this.roles && this.roles.length && [1, 3, 4].find(x => this.roles.find(z => z.id === x))
		},
		verAltoCosto () {
			return this && this.roles && this.roles.length && [1, 3, 4].find(x => this.roles.find(z => z.id === x))
		},
		esSuperAdmin () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 1)
		},
		esCovidAdmin () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 4)
		},
		esDiCoordinador(){
			return this && this.roles && this.roles.length && this.roles.find(z => z.nombre === 'Coordinador Demanda Inducida')
		},
		...mapGetters([
			'roles'
		]),
		...mapState({
			token_type: state => state.auth.token_type,
			access_token: state => state.auth.access_token
		})
	},
	watch: {
		'$vuetify.breakpoint.name': {
			handler (val) {
				val && (this.esMovil = !!(navigator.userAgent.match(/Android/i) ||
					navigator.userAgent.match(/webOS/i) ||
					navigator.userAgent.match(/iPhone/i) ||
					navigator.userAgent.match(/iPod/i) ||
					navigator.userAgent.match(/iPad/i) ||
					navigator.userAgent.match(/BlackBerry/i)))
			},
			immediate: true
		}
	},
	methods: {
		calculaEdad (fechaNacimiento) {
			if (fechaNacimiento && this.moment(fechaNacimiento).isValid()) {
				let a = this.moment()
				let b = this.moment(fechaNacimiento)
				let years = a.diff(b, 'year')
				b.add(years, 'years')

				let months = a.diff(b, 'months')
				b.add(months, 'months')

				let days = a.diff(b, 'days')
				b.add(days, 'days')
				let stringDate = ``
				stringDate = stringDate + (years ? `${years} año${years === 1 ? '' : 's'}` : '')
				stringDate = stringDate + (months ? ` ${months} mes${months === 1 ? ''  : 'es'}` : '')
				stringDate = stringDate + (years || months ? days ? ` ${days} d${days === 1 ? 'ía' : 'ias'}` : '' : `${days} d${days === 1 ? 'ía' : 'ias'}`)
				return {
					stringDate: stringDate,
					years: years,
					months: months,
					days: days
				}
			} else {
				return {
					stringDate: '',
					years: null,
					months: null,
					days: null
				}
			}
		},
		getPDFIndicadores () {
			store.commit('setLoadingIndicadores', true)
			this.axios({
				url: `indicadores-covid/pdf`,
				method: 'GET',
				responseType: 'blob'
			})
				.then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
					store.commit('setLoadingIndicadores', false)
					let win = window.open(url,'_blank')
					win.focus()
				})
				.catch((error) => {
					this.loading = false
					store.commit('setLoadingIndicadores', false)
					store.commit('snackbar', {color: 'error', message: `al descargar los indicadores.`, error: error})
				})
		},
		clone (object) {
			return JSON.parse(JSON.stringify(object))
		},
		latLng () {
			let datosEmpresa = store.getters.datosEmpresa
			let objLatLng = {lat: 5.300, lng: -72.400}
			if (datosEmpresa && datosEmpresa.center_latlng) {
				let ll = datosEmpresa.center_latlng.replace(/ /g, '').split(',')
				objLatLng = {lat: Number(ll[0]), lng: Number(ll[1])}
			}
			return objLatLng
		},
		cleanTamizajeDesautorizado (tamizaje) {
			if (tamizaje) {
				if (tamizaje.localiza_persona) tamizaje.no_efectividad = null
				if (!tamizaje.localiza_persona || !tamizaje.contesta_encuesta) {
					tamizaje.riesgo_procedencia = null
					tamizaje.riesgo_ocupacional = null
					tamizaje.riesgo_contacto = null
					tamizaje.diagnosticado_covid = null
					tamizaje.positivo_covid = null
					tamizaje.fecha_diagnostico = null
					tamizaje.coordenadas = null
					tamizaje.fecha_ultima_evolucion = null
					tamizaje.orden_medica_id = null
					tamizaje.reasignar = null
					tamizaje.evoluciones = []
					tamizaje.sintomas = []
					tamizaje.fecha_sintomas = null
					tamizaje.nexos = []
					tamizaje.muestras = []
					tamizaje.tamizador = null
					tamizaje.evolucion = null
					tamizaje.prueba_rapida = null
					tamizaje.resultado_prueba_rapida = null
					tamizaje.estado_prueba = null
					// tamizaje.entidad_reporta_sivigila = null
					tamizaje.hospitalizado = null
					tamizaje.grupo_atencion_especial_id = null
					tamizaje.grupo_atencion_especial = null
					tamizaje.solicitud_prueba = null
					tamizaje.clasificacion = null
					tamizaje.signos_alarma = []
					///
					if (!tamizaje.localiza_persona) tamizaje.contesta_encuesta = null
					tamizaje.frecuencia_pulso = null
					tamizaje.saturacion_oxigeno = null
					tamizaje.temperatura = null
					if (tamizaje.infoviajero) {
						tamizaje.infoviajero.pais_procedencia = null
						tamizaje.infoviajero.municipio_procedencia = null
						tamizaje.infoviajero.transporte_llegada = null
						tamizaje.infoviajero.placa = null
						tamizaje.infoviajero.empresa = null
						tamizaje.infoviajero.numero_vuelo = null
						tamizaje.infoviajero.municipio_destino = null
						tamizaje.infoviajero.transporte_destino = null
						tamizaje.infoviajero.direccion_permanencia = null
						tamizaje.infoviajero.aislamiento = null
						tamizaje.infoviajero.temperatura = null
						tamizaje.infoviajero.departamento_procedencia = null
						tamizaje.infoviajero.departamento_destino = null
					}
				}
				return tamizaje
			}
		}
	}
})

new Vue({
	store,
	i18n,
	router,
	vuetify,
	render: h => h(App),
	components: { App }
}).$mount('#app')
