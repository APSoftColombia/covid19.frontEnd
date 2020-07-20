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

// vee-validate
import './plugins/veeValidate'
import './plugins/onLine'
import './registerServiceWorker'

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

import {mapGetters} from 'vuex'
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
		esSuperAdmin () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 1)
		},
		esCovidAdmin () {
			return this && this.roles && this.roles.length && this.roles.find(z => z.id === 4)
		},
		...mapGetters([
			'roles'
		])
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
