import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import es from 'vuetify/es5/locale/es'
// store
import { store } from '../store/store'

Vue.use(Vuetify);

export default new Vuetify({	
	theme:{
		themes: {
			light: store.getters.selectedTheme.theme,
			dark: store.getters.selectedTheme.theme
		},
	},
	icons: ['mdi', 'fa'],
	iconfont: 'mdiSvg',
	lang: {
		locales: { es },
		current: 'es'
	}
})